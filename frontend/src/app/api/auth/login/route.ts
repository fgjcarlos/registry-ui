import { NextRequest, NextResponse } from 'next/server';
import { RegistryService } from '../../../../services/registryService';

interface LoginRequest {
  username: string;
  password: string;
  registryUrl: string;
}

interface SessionData {
  username: string;
  registryUrl: string;
  authToken: string;
  authType: 'basic' | 'bearer';
  loginTime: number;
}

export async function POST(request: NextRequest) {
  try {
    const { username, password, registryUrl }: LoginRequest = await request.json();

    // Validate input
    if (!username || !password || !registryUrl) {
      return NextResponse.json(
        { error: 'Username, password, and registry URL are required' },
        { status: 400 }
      );
    }

    // Authenticate with Docker registry
    const authResult = await RegistryService.authenticate(username, password, registryUrl);

    if (!authResult.success) {
      return NextResponse.json(
        { error: authResult.error },
        { status: 401 }
      );
    }

    // Create session data
    const sessionData: SessionData = {
      username,
      registryUrl,
      authToken: authResult.token!,
      authType: authResult.authType!,
      loginTime: Date.now()
    };

    // Set HttpOnly cookie
    const response = NextResponse.json({ 
      success: true,
      user: {
        username,
        registryUrl
      }
    });

    response.cookies.set('registry_session', JSON.stringify(sessionData), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 24 * 60 * 60, // 24 hours
      path: '/'
    });

    return response;

  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
