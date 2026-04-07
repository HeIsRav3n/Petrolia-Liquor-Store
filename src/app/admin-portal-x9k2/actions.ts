'use server';

import { cookies } from 'next/headers';
import { encrypt } from '@/lib/session';

export async function loginAction(password: string) {
  const adminPassword = process.env.ADMIN_PASSWORD || 'petrolia2024';

  if (password === adminPassword) {
    const session = await encrypt({ authenticated: true });
    
    (await cookies()).set('petrolia_admin_session', session, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 24 * 60 * 60, // 1 day
    });

    return { success: true };
  }

  return { success: false, error: 'Incorrect password' };
}

export async function logoutAction() {
  (await cookies()).delete('petrolia_admin_session');
  return { success: true };
}
