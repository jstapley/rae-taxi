import { ImageResponse } from 'next/og';

export const size = { width: 180, height: 180 };
export const contentType = 'image/png';

export default function AppleIcon() {
  return new ImageResponse(
    <div
      style={{
        background: '#1B3A5C',
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <span style={{ color: '#F59E0B', fontSize: 110, fontWeight: 900, lineHeight: 1, fontFamily: 'Arial' }}>
        R
      </span>
    </div>,
    { ...size }
  );
}
