"use client";

import { useState } from "react";

interface KeyProps {
  note: string;
  x: number;
  isBlack?: boolean;
  color?: string;
  onClick: () => void;
}

const Dial: React.FC = () => {
  const size = 60; // Increased by 50% from 40px
  const centerX = -80; // Moved left 10px from -70
  const centerY = 88; // Moved up 40px from 128

  // Small dial properties
  const smallSize = size * 0.45; // Increased by another 25% (from 0.3125 to 0.39)
  const smallCenterY = centerY + size + 50; // Increased spacing from 20px to 50px

  const buttonSize = 75; // Increased by 25% from 60px
  const buttonGap = 4; // Reduced from 15px to 4px
  const totalButtonsWidth = (buttonSize * 4) + (buttonGap * 3);
  const buttonStartX = centerX - size - totalButtonsWidth - 30; // Moved 10px right (changed from -40 to -30)
  const buttonY = centerY + 35; // Moved down 60px
  const labelY = buttonY - buttonSize/2 + 28; // Adjusted for larger button size

  const topButtons = ['Dim', 'Min', 'Maj', 'Sus'];
  const bottomButtons = ['6', 'm7', 'M7', '9'];
  const buttonSpacingY = buttonSize + 4; // Reduced vertical gap between button rows from 15px to 4px

  return (
    <g>
      {/* Top row buttons */}
      {topButtons.map((label, index) => (
        <g key={label}>
          <rect
            x={buttonStartX + (buttonSize + buttonGap) * index}
            y={buttonY - buttonSize/2 - buttonSpacingY/2}
            width={buttonSize}
            height={buttonSize}
            fill="#1a1a1a"
            stroke="#000"
            strokeWidth="1"
            rx="6"
            ry="6"
            className="cursor-pointer hover:fill-neutral-800"
          />
          <text
            x={buttonStartX + (buttonSize + buttonGap) * index + 8}
            y={labelY - buttonSpacingY/2}
            textAnchor="start"
            fill="#666"
            fontSize="14"
          >
            {label}
          </text>
        </g>
      ))}
      {/* Bottom row buttons */}
      {bottomButtons.map((label, index) => (
        <g key={label}>
          <rect
            x={buttonStartX + (buttonSize + buttonGap) * index}
            y={buttonY - buttonSize/2 + buttonSpacingY/2}
            width={buttonSize}
            height={buttonSize}
            fill="#1a1a1a"
            stroke="#000"
            strokeWidth="1"
            rx="6"
            ry="6"
            className="cursor-pointer hover:fill-neutral-800"
          />
          <text
            x={buttonStartX + (buttonSize + buttonGap) * index + 8}
            y={labelY + buttonSpacingY/2}
            textAnchor="start"
            fill="#666"
            fontSize="14"
          >
            {label}
          </text>
        </g>
      ))}
      {/* Main dial */}
      <circle
        cx={centerX}
        cy={centerY}
        r={size}
        fill="#1a1a1a"
        stroke="#000"
        strokeWidth="1"
        className="cursor-pointer hover:fill-neutral-800"
      />
      {/* Small dial */}
      <circle
        cx={centerX}
        cy={smallCenterY}
        r={smallSize}
        fill="#1a1a1a"
        stroke="#000"
        strokeWidth="1"
        className="cursor-pointer hover:fill-neutral-800"
      />
    </g>
  );
};

const Key: React.FC<KeyProps> = ({ note, x, isBlack = false, color, onClick }) => {
  // Standard piano key proportions with spacing
  const whiteKeyWidth = 65;
  // Black keys should span about 60% of two white keys combined (reduced from 75%)
  const width = isBlack ? whiteKeyWidth * 0.6 : whiteKeyWidth;
  const whiteKeyHeight = 256;
  const blackKeyHeight = 150;
  const height = isBlack ? blackKeyHeight : whiteKeyHeight;
  const fill = color || (isBlack ? "#111" : "#1a1a1a");  // Darker theme
  const y = isBlack ? 0 : 0;
  // Rounded corners - smaller radius for black keys
  const radius = isBlack ? 4 : 6;

  // For black keys, center them between the two white keys they span
  const adjustedX = isBlack ? x - (width / 2) : x;

  return (
    <g onClick={onClick}>
      <rect
        x={adjustedX}
        y={y}
        width={width}
        height={height}
        fill={fill}
        stroke="#000"
        strokeWidth="1"
        rx={radius}
        ry={radius}
        className={`cursor-pointer ${color ? "" : isBlack ? "hover:fill-neutral-900" : "hover:fill-neutral-800"}`}
      />
    </g>
  );
};

export const PianoKeyboard: React.FC = () => {
  const [keyColors, setKeyColors] = useState<Record<string, string>>({});
  
  // Adjusted x positions to place black keys between white keys
  const notes = [
    { note: "C", x: 0, isBlack: false },
    { note: "C#", x: 65, isBlack: true },    // Centered between C and D
    { note: "D", x: 70, isBlack: false },
    { note: "D#", x: 135, isBlack: true },   // Centered between D and E
    { note: "E", x: 140, isBlack: false },
    { note: "F", x: 210, isBlack: false },
    { note: "F#", x: 275, isBlack: true },   // Centered between F and G
    { note: "G", x: 280, isBlack: false },
    { note: "G#", x: 345, isBlack: true },   // Centered between G and A
    { note: "A", x: 350, isBlack: false },
    { note: "A#", x: 415, isBlack: true },   // Centered between A and B
    { note: "B", x: 420, isBlack: false },
  ];

  const CHORD_COLOR = "#E67E22"; // Brighter, more vibrant orange

  const getMajorChordNotes = (rootNote: string): string[] => {
    const noteIndex = notes.findIndex(n => n.note === rootNote);
    if (noteIndex === -1) return [];

    // Get the root, major third (4 semitones up), and perfect fifth (7 semitones up)
    const chordIndices = [
      noteIndex,
      (noteIndex + 4) % 12,
      (noteIndex + 7) % 12
    ];

    return chordIndices
      .map(index => notes[index]?.note)
      .filter((note): note is string => note !== undefined);
  };

  const handleKeyClick = (note: string) => {
    const chordNotes = getMajorChordNotes(note);
    const newColors: Record<string, string> = {};
    
    // Reset all colors
    notes.forEach(n => {
      newColors[n.note] = "";
    });

    // Set the chord notes to the drab orange color
    chordNotes.forEach(chordNote => {
      newColors[chordNote] = CHORD_COLOR;
    });

    setKeyColors(newColors);
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative">
        <svg width="850" height="256" viewBox="-520 0 1040 256">
          <Dial />
          {/* Render white keys first so black keys appear on top */}
          {notes.filter(note => !note.isBlack).map((note) => (
            <Key
              key={note.note}
              note={note.note}
              x={note.x}
              isBlack={note.isBlack}
              color={keyColors[note.note]}
              onClick={() => handleKeyClick(note.note)}
            />
          ))}
          {/* Render black keys second so they appear on top */}
          {notes.filter(note => note.isBlack).map((note) => (
            <Key
              key={note.note}
              note={note.note}
              x={note.x}
              isBlack={note.isBlack}
              color={keyColors[note.note]}
              onClick={() => handleKeyClick(note.note)}
            />
          ))}
        </svg>
      </div>
    </div>
  );
}; 