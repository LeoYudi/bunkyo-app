import { redirect } from 'next/navigation';

import { validateSession } from '../lib/server/session';
import { InvoiceComponent } from '../components/Invoice';

export default async function InvoicePage() {

  const session = await validateSession()
  if (!session) {
    redirect('/');
  }

  return <InvoiceComponent />
}