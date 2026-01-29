import { redirect } from 'next/navigation';
import { validateSession } from './lib/server/session';

import { LoginComponent } from './components/Login';

export default async function LoginPage() {
  const session = await validateSession();
  if (session) {
    redirect('/invoice');
  }

  return <LoginComponent />
}