import { ImageResponse } from 'next/og'

export const runtime = 'edge'

export const alt = 'Liquida Capital Training Academy'
export const size = {
  width: 1200,
  height: 630,
}
export const contentType = 'image/png'

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
          background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #164e63 100%)',
          fontFamily: 'system-ui, sans-serif',
        }}
      >
        {/* Logo/Icon */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 120,
            height: 120,
            borderRadius: 24,
            background: 'linear-gradient(135deg, #8b5cf6 0%, #06b6d4 100%)',
            marginBottom: 40,
          }}
        >
          <div
            style={{
              color: 'white',
              fontSize: 72,
              fontWeight: 'bold',
            }}
          >
            L
          </div>
        </div>

        {/* Title */}
        <div
          style={{
            display: 'flex',
            fontSize: 64,
            fontWeight: 'bold',
            background: 'linear-gradient(90deg, #a78bfa 0%, #22d3ee 100%)',
            backgroundClip: 'text',
            color: 'transparent',
            marginBottom: 16,
          }}
        >
          Liquida Capital
        </div>

        {/* Subtitle */}
        <div
          style={{
            fontSize: 36,
            color: '#94a3b8',
            marginBottom: 40,
          }}
        >
          Training Academy
        </div>

        {/* Description */}
        <div
          style={{
            fontSize: 24,
            color: '#64748b',
            textAlign: 'center',
            maxWidth: 800,
          }}
        >
          Professional Training & Certification Platform
        </div>
      </div>
    ),
    {
      ...size,
    }
  )
}
