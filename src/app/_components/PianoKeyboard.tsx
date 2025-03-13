"use client";

import { useState, useEffect } from "react";

// Simplified WebMidi types
interface MIDIPort {
  name: string | null;
  state: string;
  onmidimessage: ((event: { data: Uint8Array }) => void) | null;
}

interface MIDIAccess {
  inputs: Map<string, MIDIPort>;
  onstatechange: ((event: { port: MIDIPort }) => void) | null;
}

// Constants
const BASE_NOTES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
const BASE_CHORD_COLOR = "#8B4513"; // Darker saddle brown color

// Utility functions
const getMIDINoteName = (midiNote: number): string => {
  const octave = Math.floor(midiNote / 12) - 2;
  const noteIndex = midiNote % 12;
  return `${BASE_NOTES[noteIndex] ?? 'C'}${octave}`;
};

const getColorBrightness = (midiNote: number): string => {
  const octave = Math.floor(midiNote / 12) - 2;
  const baseColor = parseInt(BASE_CHORD_COLOR.slice(1), 16);
  const r = ((baseColor >> 16) & 255);
  const g = ((baseColor >> 8) & 255);
  const b = (baseColor & 255);
  
  // Increase brightness based on octave (0-7 range typically for MIDI)
  const brightnessMultiplier = 1 + (octave * 0.3); // 30% brighter per octave
  
  const newR = Math.min(255, Math.round(r * brightnessMultiplier));
  const newG = Math.min(255, Math.round(g * brightnessMultiplier));
  const newB = Math.min(255, Math.round(b * brightnessMultiplier));
  
  return `#${newR.toString(16).padStart(2, '0')}${newG.toString(16).padStart(2, '0')}${newB.toString(16).padStart(2, '0')}`;
};

// Component types
interface KeyProps {
  note: string;
  x: number;
  isBlack?: boolean;
  color?: string;
  displayText?: string;
}

// Components
const Key: React.FC<KeyProps> = ({ note, x, isBlack = false, color, displayText }) => {
  const width = isBlack ? 39 : 65; // 39 is 60% of 65
  const height = isBlack ? 150 : 256;
  const adjustedX = isBlack ? x - (width / 2) : x;
  const fill = color ?? (isBlack ? "#111" : "#1a1a1a");

  return (
    <g>
      <rect
        x={adjustedX}
        y={0}
        width={width}
        height={height}
        fill={fill}
        stroke="#000"
        strokeWidth="1"
        rx={isBlack ? 4 : 6}
        className={`cursor-pointer ${color ? "" : isBlack ? "hover:fill-neutral-900" : "hover:fill-neutral-800"}`}
      />
      {displayText && (
        <text
          x={adjustedX + width/2}
          y={height + 20}
          textAnchor="middle"
          fill={color ?? "#666"}
          fontSize="16"
          fontWeight="bold"
        >
          {displayText}
        </text>
      )}
    </g>
  );
};

const Dial: React.FC = () => {
  const size = 60;
  const centerX = -80;
  const centerY = 88;
  const buttonSize = 75;
  const buttonGap = 4;
  const buttonSpacingY = buttonSize + 4;
  const buttonStartX = centerX - size - (buttonSize * 4 + buttonGap * 3) - 30;
  const buttonY = centerY + 35;
  const labelY = buttonY - buttonSize/2 + 28;

  const renderButtons = (labels: string[], yOffset: number) => (
    labels.map((label, index) => (
      <g key={label}>
        <rect
          x={buttonStartX + (buttonSize + buttonGap) * index}
          y={buttonY - buttonSize/2 + yOffset}
          width={buttonSize}
          height={buttonSize}
          fill="#1a1a1a"
          stroke="#000"
          strokeWidth="1"
          rx="6"
          className="cursor-pointer hover:fill-neutral-800"
        />
        <text
          x={buttonStartX + (buttonSize + buttonGap) * index + 8}
          y={labelY + yOffset}
          textAnchor="start"
          fill="#666"
          fontSize="14"
        >
          {label}
        </text>
      </g>
    ))
  );

  return (
    <g>
      {renderButtons(['Dim', 'Min', 'Maj', 'Sus'], -buttonSpacingY/2)}
      {renderButtons(['6', 'm7', 'M7', '9'], buttonSpacingY/2)}
      <circle
        cx={centerX}
        cy={centerY}
        r={size}
        fill="#1a1a1a"
        stroke="#000"
        strokeWidth="1"
        className="cursor-pointer hover:fill-neutral-800"
      />
      <circle
        cx={centerX}
        cy={centerY + size + 50}
        r={size * 0.45}
        fill="#1a1a1a"
        stroke="#000"
        strokeWidth="1"
        className="cursor-pointer hover:fill-neutral-800"
      />
    </g>
  );
};

export const PianoKeyboard: React.FC = () => {
  const [keyColors, setKeyColors] = useState<Record<string, string>>({});
  const [activeNotes, setActiveNotes] = useState<Set<number>>(new Set());
  const [midiDevice, setMidiDevice] = useState<string>("No MIDI device connected");
  const [lastPlayedNote, setLastPlayedNote] = useState<number | null>(null);
  const [noteDisplayText, setNoteDisplayText] = useState<Record<string, string>>({});

  const notes = [
    { note: "C", x: 0, isBlack: false },
    { note: "C#", x: 65, isBlack: true },
    { note: "D", x: 70, isBlack: false },
    { note: "D#", x: 135, isBlack: true },
    { note: "E", x: 140, isBlack: false },
    { note: "F", x: 210, isBlack: false },
    { note: "F#", x: 275, isBlack: true },
    { note: "G", x: 280, isBlack: false },
    { note: "G#", x: 345, isBlack: true },
    { note: "A", x: 350, isBlack: false },
    { note: "A#", x: 415, isBlack: true },
    { note: "B", x: 420, isBlack: false },
  ];

  const handleMIDINote = (command: number, note: number, velocity: number) => {
    const isNoteOn = command === 144 && velocity > 0;
    const isNoteOff = command === 128 || (command === 144 && velocity === 0);
    
    if (isNoteOn) {
      const fullNoteName = getMIDINoteName(note);
      const baseNoteName = fullNoteName.slice(0, -1);
      const noteColor = getColorBrightness(note);
      
      setActiveNotes(prev => new Set(prev).add(note));
      setLastPlayedNote(note);
      setNoteDisplayText(prev => ({ ...prev, [baseNoteName]: fullNoteName }));
      
      // Highlight just the pressed note with brightness based on octave
      setKeyColors(prev => ({ ...prev, [baseNoteName]: noteColor }));
    } 
    else if (isNoteOff) {
      setActiveNotes(prev => {
        const updated = new Set(prev);
        updated.delete(note);
        
        if (updated.size === 0) {
          setKeyColors({});
          setLastPlayedNote(null);
          setNoteDisplayText({});
        } 
        else if (lastPlayedNote === note) {
          // When releasing a note, keep other pressed notes highlighted
          const remainingNotes = Array.from(updated);
          const colors: Record<string, string> = {};
          remainingNotes.forEach(noteNum => {
            const noteName = getMIDINoteName(noteNum).slice(0, -1);
            colors[noteName] = getColorBrightness(noteNum);
          });
          setKeyColors(colors);
          
          const lowestNote = Math.min(...remainingNotes);
          const fullNoteName = getMIDINoteName(lowestNote);
          setLastPlayedNote(lowestNote);
          setNoteDisplayText({ [fullNoteName.slice(0, -1)]: fullNoteName });
        }
        
        return updated;
      });
    }
  };

  useEffect(() => {
    if (!('requestMIDIAccess' in navigator)) {
      setMidiDevice("MIDI not supported in this browser");
      return;
    }

    (navigator as Navigator & { requestMIDIAccess(): Promise<MIDIAccess> })
      .requestMIDIAccess()
      .then(access => {
        const inputs = Array.from(access.inputs.values());
        if (inputs.length > 0 && inputs[0]?.name) {
          setMidiDevice(inputs[0].name);
        } else {
          setMidiDevice("No MIDI device connected");
        }
        
        access.onstatechange = (event) => {
          if (event.port && 'type' in event.port && event.port.type === 'input') {
            const inputs = Array.from(access.inputs.values());
            if (inputs.length > 0 && inputs[0]?.name) {
              setMidiDevice(inputs[0].name);
            } else {
              setMidiDevice("No MIDI device connected");
            }
          }
        };

        Array.from(access.inputs.values()).forEach(input => {
          input.onmidimessage = (event) => {
            const data = event.data;
            if (data && data.length >= 3) {
              const command = Number(data[0]);
              const note = Number(data[1]);
              const velocity = Number(data[2]);
              handleMIDINote(command, note, velocity);
            }
          };
        });
      })
      .catch(err => setMidiDevice("No MIDI access"));
  }, []);

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="text-lg font-semibold text-white mb-2">{midiDevice}</div>
      <div className="relative">
        <svg width="850" height="300" viewBox="-520 0 1040 300">
          <Dial />
          {notes
            .filter(note => !note.isBlack)
            .map(note => (
              <Key
                key={note.note}
                {...note}
                color={keyColors[note.note]}
                displayText={noteDisplayText[note.note]}
              />
            ))}
          {notes
            .filter(note => note.isBlack)
            .map(note => (
              <Key
                key={note.note}
                {...note}
                color={keyColors[note.note]}
                displayText={noteDisplayText[note.note]}
              />
            ))}
        </svg>
      </div>
    </div>
  );
}; 