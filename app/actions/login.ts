import z from 'zod';

import { redirect } from 'next/navigation';

import { LocalAPI } from '../lib/client/api';
import { FormState, LoginFormSchema } from '../lib/client/definitions';

export async function login(
  state: FormState,
  formData: FormData,
): Promise<FormState> {
  const validateFields = LoginFormSchema.safeParse({
    username: formData.get('username'),
    password: formData.get('password'),
  });

  if (!validateFields.success) {
    return { errors: z.flattenError(validateFields.error) };
  }

  const response = await LocalAPI.post({
    path: '/api/login',
    body: JSON.stringify({
      username: validateFields.data.username,
      password: validateFields.data.password,
    }),
  });

  if (response.error) {
    return { errors: { fieldErrors: {}, formErrors: [response.message] } };
  }

  return redirect('/invoice');
}
