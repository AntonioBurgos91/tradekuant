import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export const alt = 'TradeKuant - La K de Kuantificable';
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
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#0a0a0a',
          backgroundImage: 'radial-gradient(circle at 25% 25%, #1a1a2e 0%, transparent 50%), radial-gradient(circle at 75% 75%, #0d2818 0%, transparent 50%)',
        }}
      >
        {/* Grid pattern overlay */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage: 'linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)',
            backgroundSize: '50px 50px',
          }}
        />

        {/* Top accent line */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '4px',
            background: 'linear-gradient(90deg, transparent, #10B981, transparent)',
          }}
        />

        {/* Logo container */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '24px',
          }}
        >
          {/* Logo icon */}
          <div
            style={{
              width: '80px',
              height: '80px',
              borderRadius: '20px',
              background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.2) 0%, rgba(16, 185, 129, 0.1) 100%)',
              border: '2px solid rgba(16, 185, 129, 0.3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginRight: '24px',
            }}
          >
            <svg
              width="40"
              height="40"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#10B981"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
              <polyline points="17 6 23 6 23 12" />
            </svg>
          </div>

          {/* Logo text */}
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span
              style={{
                fontSize: '72px',
                fontWeight: 'bold',
                color: '#FFFFFF',
                letterSpacing: '-2px',
              }}
            >
              Trade<span style={{ color: '#10B981' }}>K</span>uant
            </span>
          </div>
        </div>

        {/* Tagline */}
        <div
          style={{
            fontSize: '28px',
            color: '#94A3B8',
            letterSpacing: '8px',
            textTransform: 'uppercase',
            marginBottom: '48px',
          }}
        >
          La K de Kuantificable
        </div>

        {/* Stats bar */}
        <div
          style={{
            display: 'flex',
            gap: '48px',
            padding: '24px 48px',
            background: 'rgba(15, 23, 42, 0.8)',
            borderRadius: '16px',
            border: '1px solid rgba(255, 255, 255, 0.1)',
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <span style={{ fontSize: '32px', fontWeight: 'bold', color: '#10B981' }}>3</span>
            <span style={{ fontSize: '14px', color: '#64748B', textTransform: 'uppercase', letterSpacing: '2px' }}>Plataformas</span>
          </div>
          <div style={{ width: '1px', background: 'rgba(255,255,255,0.1)' }} />
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <span style={{ fontSize: '32px', fontWeight: 'bold', color: '#FFFFFF' }}>100%</span>
            <span style={{ fontSize: '14px', color: '#64748B', textTransform: 'uppercase', letterSpacing: '2px' }}>Transparente</span>
          </div>
          <div style={{ width: '1px', background: 'rgba(255,255,255,0.1)' }} />
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <span style={{ fontSize: '32px', fontWeight: 'bold', color: '#FFFFFF' }}>API</span>
            <span style={{ fontSize: '14px', color: '#64748B', textTransform: 'uppercase', letterSpacing: '2px' }}>Verificable</span>
          </div>
        </div>

        {/* Bottom URL */}
        <div
          style={{
            position: 'absolute',
            bottom: '32px',
            fontSize: '18px',
            color: '#475569',
          }}
        >
          tradekuant.io
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
