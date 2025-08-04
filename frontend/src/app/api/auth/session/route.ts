import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

interface SessionData {
  username: string;  
  registryUrl: string;
  authToken: string;
  authType: 'basic' | 'bearer';
  loginTime: number;
}

const SESSION_DURATION = 24 * 60 * 60 * 1000; // 24 hours

export async function GET() {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('registry_session');

    if (!sessionCookie?.value) {
      return NextResponse.json({ authenticated: false }, { status: 401 });
    }

    const sessionData: SessionData = JSON.parse(sessionCookie.value);
    
    // Check if session is expired
    if (Date.now() - sessionData.loginTime > SESSION_DURATION) {
      // Clear expired cookie
      const response = NextResponse.json({ authenticated: false }, { status: 401 });
      response.cookies.set('registry_session', '', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 0,
        path: '/'
      });
      return response;
    }

    return NextResponse.json({
      authenticated: true,
      user: {
        username: sessionData.username,
        registryUrl: sessionData.registryUrl
      }
    });

  } catch (error) {
    console.error('Session check error:', error);
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }
}
