import { Box } from '@mui/material';
import { redirect } from 'next/navigation';

import { validateSession } from '../lib/server/session';

export default async function InvoicePage() {

  const session = await validateSession()

  if (!session) {
    redirect('/');
  }

  return (
    <Box>uau</Box>
  )
}