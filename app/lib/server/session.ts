import 'server-only';

import { cookies } from 'next/headers';
import { SignJWT, jwtVerify } from 'jose';

import { SessionPayload } from '@/app/lib/client/definitions';

function getEncodedKey() {
  const secretKey = process.env.secretKey;
  if (!secretKey) {
    throw new Error('Missing secretKey environment variable');
  }
  return new TextEncoder().encode(secretKey);
}

export async function encrypt(payload: SessionPayload) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(getEncodedKey());
}

export async function decrypt(session: string | undefined = '') {
  try {
    const { payload } = await jwtVerify(session, getEncodedKey(), {
      algorithms: ['HS256'],
    });
    return payload;
  } catch (error) {
    console.log('Failed to verify session: ', error);
  }
}

export async function createSession(username: string) {
  const expiresAt = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000);
  const session = await encrypt({ username, expiresAt });
  const cookieStore = await cookies();

  cookieStore.set('session', session, {
    httpOnly: true,
    secure: true,
    expires: expiresAt,
    sameSite: 'lax',
    path: '/',
  });
}

export async function validateSession() {
  const session = (await cookies()).get('session')?.value

  try {
    const payload = (await decrypt(session)) as SessionPayload

    if (!session || !payload) {
      return false
    }

    const now = new Date()
    const expiresAt = new Date(payload.expiresAt)
    if (expiresAt < now) {
      return false
    }

    return true

  } catch (error) {
    console.log('Failed to validate session: ', error);
    return false
  }
}