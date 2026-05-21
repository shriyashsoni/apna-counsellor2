import { ImageResponse } from '@vercel/og';

export const runtime = 'edge';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    // Dynamic params for the banner
    const title = searchParams.get('title') || 'Premium Career Guidance';
    const subtitle = searchParams.get('subtitle') || 'AI-Powered Admission Strategy for Top Institutes';
    const highlight = searchParams.get('highlight') || 'Join 50k+ Students';
    
    // Modern sleek dark gradient background
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
            backgroundColor: '#030014', // Deep space dark
            backgroundImage: 'radial-gradient(circle at 25px 25px, rgba(255, 255, 255, 0.1) 2%, transparent 0%), radial-gradient(circle at 75px 75px, rgba(255,255,255,0.05) 2%, transparent 0%)',
            backgroundSize: '100px 100px',
            fontFamily: 'system-ui, "Inter", sans-serif',
            padding: '40px',
          }}
        >
          {/* Subtle glowing orb in background */}
          <div
            style={{
              position: 'absolute',
              top: '-20%',
              right: '-10%',
              width: '600px',
              height: '600px',
              background: 'radial-gradient(circle, rgba(139, 92, 246, 0.3) 0%, rgba(0,0,0,0) 70%)',
              filter: 'blur(40px)',
              borderRadius: '50%',
            }}
          />
          <div
            style={{
              position: 'absolute',
              bottom: '-20%',
              left: '-10%',
              width: '600px',
              height: '600px',
              background: 'radial-gradient(circle, rgba(59, 130, 246, 0.25) 0%, rgba(0,0,0,0) 70%)',
              filter: 'blur(40px)',
              borderRadius: '50%',
            }}
          />

          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: 'rgba(15, 23, 42, 0.6)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '24px',
              padding: '60px 80px',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
              zIndex: 10,
              maxWidth: '900px',
              textAlign: 'center',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '10px 24px',
                background: 'linear-gradient(90deg, rgba(139,92,246,0.15) 0%, rgba(59,130,246,0.15) 100%)',
                border: '1px solid rgba(139, 92, 246, 0.3)',
                borderRadius: '9999px',
                marginBottom: '32px',
                color: '#c4b5fd',
                fontSize: '24px',
                fontWeight: 600,
                letterSpacing: '1px',
                textTransform: 'uppercase',
              }}
            >
              {highlight}
            </div>
            
            <h1
              style={{
                fontSize: '72px',
                fontWeight: 800,
                color: '#ffffff',
                marginBottom: '24px',
                lineHeight: 1.1,
                textAlign: 'center',
                background: 'linear-gradient(to right, #ffffff, #a5b4fc)',
                backgroundClip: 'text',
                color: 'transparent',
              }}
            >
              {title}
            </h1>
            
            <p
              style={{
                fontSize: '32px',
                color: '#94a3b8',
                maxWidth: '700px',
                textAlign: 'center',
                lineHeight: 1.4,
                fontWeight: 500,
                marginBottom: 0,
              }}
            >
              {subtitle}
            </p>

            <div
              style={{
                display: 'flex',
                marginTop: '48px',
                gap: '16px',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  background: 'rgba(255,255,255,0.05)',
                  padding: '12px 24px',
                  borderRadius: '12px',
                  border: '1px solid rgba(255,255,255,0.1)',
                }}
              >
                <span style={{ fontSize: '24px', color: '#818cf8', marginRight: '12px' }}>✓</span>
                <span style={{ fontSize: '20px', color: '#e2e8f0' }}>AI Powered</span>
              </div>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  background: 'rgba(255,255,255,0.05)',
                  padding: '12px 24px',
                  borderRadius: '12px',
                  border: '1px solid rgba(255,255,255,0.1)',
                }}
              >
                <span style={{ fontSize: '24px', color: '#818cf8', marginRight: '12px' }}>✓</span>
                <span style={{ fontSize: '20px', color: '#e2e8f0' }}>Expert Mentors</span>
              </div>
            </div>
          </div>
          
          <div
            style={{
              position: 'absolute',
              bottom: '40px',
              display: 'flex',
              alignItems: 'center',
              color: '#64748b',
              fontSize: '28px',
              fontWeight: 600,
            }}
          >
            Apna Counsellor
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  } catch (e: any) {
    return new Response(`Failed to generate image`, {
      status: 500,
    });
  }
}
