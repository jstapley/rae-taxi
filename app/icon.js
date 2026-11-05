import { ImageResponse } from 'next/og';

export const size = { width: 192, height: 192 };
export const contentType = 'image/png';

export default function Icon() {
  return new ImageResponse(
    <div
      style={{
        background: '#1B3A5C',
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 40,
      }}
    >
      <span style={{ color: '#F59E0B', fontSize: 120, fontWeight: 900, lineHeight: 1, fontFamily: 'Arial' }}>
        R
      </span>
    </div>,
    { ...size }
  );
}
