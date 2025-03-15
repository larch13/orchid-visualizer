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

const getBaseNoteName = (midiNote: number): string => {
  const noteIndex = midiNote % 12;
  return BASE_NOTES[noteIndex] ?? 'C';
};

interface ChordInfo {
  chordName: string;
  inversion: string;
  bassNote: string;
}

const getChordName = (notes: number[]): ChordInfo | null => {
  if (notes.length < 2) return null;
  
  // Sort notes and get their base note names (without octave)
  const baseNotes = notes.map(note => getBaseNoteName(note));
  const uniqueNotes = [...new Set(baseNotes)];
  
  // Get intervals between notes
  const intervals = uniqueNotes.map(note => {
    const index = BASE_NOTES.indexOf(note);
    return index >= 0 ? index : 0;
  }).sort((a, b) => a - b);
  
  if (intervals.length === 0) return null;
  
  // Common chord patterns (including inversions)
  const patterns = {
    'Major': [[0, 4, 7], [4, 7, 12], [7, 12, 16]], // Root, 1st, 2nd inversion
    'Minor': [[0, 3, 7], [3, 7, 12], [7, 12, 15]], // Root, 1st, 2nd inversion
    'Diminished': [[0, 3, 6], [3, 6, 9]], // Root, 1st inversion
    'Augmented': [[0, 4, 8], [4, 8, 12]], // Root, 1st inversion
    'Major 7th': [[0, 4, 7, 11], [4, 7, 11, 12], [7, 11, 12, 16], [11, 12, 16, 19]],
    'Minor 7th': [[0, 3, 7, 10], [3, 7, 10, 12], [7, 10, 12, 15], [10, 12, 15, 19]],
    'Dominant 7th': [[0, 4, 7, 10], [4, 7, 10, 12], [7, 10, 12, 16], [10, 12, 16, 19]],
    'Sus4': [[0, 5, 7], [5, 7, 12]], // Root, 1st inversion
    'Sus2': [[0, 2, 7], [2, 7, 12]], // Root, 1st inversion
    '6th': [[0, 4, 7, 9], [4, 7, 9, 12], [7, 9, 12, 16]],
    '9th': [[0, 4, 7, 10, 14], [4, 7, 10, 14, 16], [7, 10, 14, 16, 19]]
  };
  
  // Find the lowest note and its base note name
  const lowestNote = Math.min(...notes);
  const lowestBaseNote = getBaseNoteName(lowestNote);
  const lowestBaseIndex = BASE_NOTES.indexOf(lowestBaseNote);
  
  // Try each note as the root
  for (let i = 0; i < intervals.length; i++) {
    // Rotate intervals to try each note as root
    const rotatedIntervals = [
      ...intervals.slice(i),
      ...intervals.slice(0, i).map(n => n + 12)
    ];
    
    // Normalize intervals to start from 0
    const normalizedIntervals = rotatedIntervals.map(n => (n - rotatedIntervals[0] + 12) % 12);
    
    // Check against patterns
    for (const [chordType, inversions] of Object.entries(patterns)) {
      for (let inversionIndex = 0; inversionIndex < inversions.length; inversionIndex++) {
        const pattern = inversions[inversionIndex];
        if (!pattern) continue;
        
        if (normalizedIntervals.length === pattern.length && 
            normalizedIntervals.every((interval, j) => interval === pattern[j])) {
          // The root note is the one we rotated to
          const rootIndex = intervals[i];
          if (typeof rootIndex === 'number' && rootIndex >= 0 && rootIndex < BASE_NOTES.length) {
            const rootNote = BASE_NOTES[rootIndex];
            if (!rootNote) continue;
            
            const lowestNoteName = getMIDINoteName(lowestNote);
            
            // Determine the actual inversion based on the lowest note
            let actualInversionIndex = 0;
            const rootBaseIndex = BASE_NOTES.indexOf(rootNote);
            if (rootBaseIndex !== lowestBaseIndex) {
              // Find which note in the pattern is the lowest note
              const lowestNoteInPattern = pattern[0];
              const lowestNoteInterval = (lowestBaseIndex - rootBaseIndex + 12) % 12;
              actualInversionIndex = pattern.findIndex(interval => interval === lowestNoteInterval);
              if (actualInversionIndex === -1) actualInversionIndex = 0;
            }
            
            // Determine inversion text
            let inversionText = 'Root';
            if (actualInversionIndex === 1) {
              inversionText = '1st';
            } else if (actualInversionIndex === 2) {
              inversionText = '2nd';
            } else if (actualInversionIndex === 3) {
              inversionText = '3rd';
            }
            
            return {
              chordName: `${rootNote} ${chordType}`,
              inversion: inversionText,
              bassNote: lowestNoteName
            };
          }
        }
      }
    }
  }
  
  // If no pattern matches, return null
  return null;
}

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
          fill="#111"
          stroke="#000"
          strokeWidth="1"
          rx="6"
          className="cursor-pointer hover:fill-neutral-900"
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
        fill="#111"
        stroke="#000"
        strokeWidth="1"
        className="cursor-pointer hover:fill-neutral-900"
      />
      <circle
        cx={centerX}
        cy={centerY + size + 50}
        r={size * 0.45}
        fill="#111"
        stroke="#000"
        strokeWidth="1"
        className="cursor-pointer hover:fill-neutral-900"
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
  const [chordInfo, setChordInfo] = useState<ChordInfo | null>(null);

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
    
    setActiveNotes(prev => {
      const updatedNotes = new Set(prev);
      
      if (isNoteOn) {
        console.log(`Note On: ${getMIDINoteName(note)} (${note}) velocity: ${velocity}`);
        updatedNotes.add(note);
        
        const fullNoteName = getMIDINoteName(note);
        const baseNoteName = fullNoteName.slice(0, -1);
        const noteColor = getColorBrightness(note);
        
        // Update all related state in a single render cycle
        setLastPlayedNote(note);
        setNoteDisplayText(prev => ({ ...prev, [baseNoteName]: fullNoteName }));
        setKeyColors(prev => ({ ...prev, [baseNoteName]: noteColor }));
        
        // Update chord info after adding the note
        const notesArray = Array.from(updatedNotes);
        setChordInfo(getChordName(notesArray));
      } 
      else if (isNoteOff) {
        console.log(`Note Off: ${getMIDINoteName(note)} (${note})`);
        updatedNotes.delete(note);
        
        // Only update other state if there are no remaining notes
        if (updatedNotes.size === 0) {
          setKeyColors({});
          setLastPlayedNote(null);
          setNoteDisplayText({});
          setChordInfo(null);
        } else {
          // Update to show all remaining notes
          const remainingNotes = Array.from(updatedNotes);
          const lowestNote = Math.min(...remainingNotes);
          
          // Update display text for all remaining notes
          const newDisplayText: Record<string, string> = {};
          remainingNotes.forEach(noteNum => {
            const fullNoteName = getMIDINoteName(noteNum);
            const baseNoteName = fullNoteName.slice(0, -1);
            newDisplayText[baseNoteName] = fullNoteName;
          });
          setNoteDisplayText(newDisplayText);
          
          setLastPlayedNote(lowestNote);
          
          // Update colors for all remaining notes
          const colors: Record<string, string> = {};
          remainingNotes.forEach(noteNum => {
            const noteName = getMIDINoteName(noteNum).slice(0, -1);
            colors[noteName] = getColorBrightness(noteNum);
          });
          setKeyColors(colors);
          
          // Update chord info with remaining notes
          setChordInfo(getChordName(remainingNotes));
        }
      }
      
      return updatedNotes;
    });
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
      <div className="text-2xl font-semibold text-white mb-2 font-old-standard italic">{midiDevice}</div>
      <div className="relative">
        <svg width="850" height="330" viewBox="-520 0 1040 300">
          <Dial />
          <g>
            {/* Table header - always shown */}
            <text x="0" y="-40" textAnchor="start" fill="#666" fontSize="12">Chord</text>
            <text x="125" y="-40" textAnchor="start" fill="#666" fontSize="12">Inversion</text>
            <text x="250" y="-40" textAnchor="start" fill="#666" fontSize="12">Bass</text>
            
            {/* Table content - only shown when chordInfo exists */}
            {chordInfo && (
              <>
                <text x="0" y="-20" textAnchor="start" fill="white" fontSize="14" className="font-medium">
                  {chordInfo.chordName}
                </text>
                <text x="125" y="-20" textAnchor="start" fill="white" fontSize="14" className="font-medium">
                  {chordInfo.inversion}
                </text>
                <text x="250" y="-20" textAnchor="start" fill="white" fontSize="14" className="font-medium">
                  {chordInfo.bassNote}
                </text>
              </>
            )}
          </g>
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