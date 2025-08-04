import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { RegistryApiService } from '../../../../services/registryApiService';

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
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const sessionData: SessionData = JSON.parse(sessionCookie.value);
    
    // Check if session is expired
    if (Date.now() - sessionData.loginTime > SESSION_DURATION) {
      return NextResponse.json({ error: 'Session expired' }, { status: 401 });
    }

    // Fetch registry images using stored session data
    const registryInfo = await RegistryApiService.getAllImages(
      sessionData.registryUrl,
      sessionData.authToken,
      sessionData.authType
    );

    return NextResponse.json(registryInfo);

  } catch (error) {
    console.error('Registry API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch registry data' },
      { status: 500 }
    );
  }
}
