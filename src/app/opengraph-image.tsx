import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'Orchid Voicing Viewer - Interactive MIDI Piano Keyboard';
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: '#1a1a1a',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '40px',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '20px',
          }}
        >
          <h1
            style={{
              fontSize: 60,
              fontWeight: 'bold',
              color: '#ffffff',
              textAlign: 'center',
              marginBottom: '20px',
            }}
          >
            Orchid Voicing Viewer
          </h1>
          <div
            style={{
              display: 'flex',
              gap: '4px',
              marginBottom: '40px',
            }}
          >
            {['C', 'D', 'E', 'F', 'G', 'A', 'B'].map((note, _i) => (
              <div
                key={note}
                style={{
                  width: '65px',
                  height: '256px',
                  background: '#1a1a1a',
                  border: '2px solid #000',
                  borderRadius: '6px',
                  position: 'relative',
                }}
              />
            ))}
          </div>
          <p
            style={{
              fontSize: 30,
              color: '#666666',
              textAlign: 'center',
              maxWidth: '800px',
            }}
          >
            Interactive MIDI Piano Keyboard for Exploring Chord Voicings
          </p>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
} 