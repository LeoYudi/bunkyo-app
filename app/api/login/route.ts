import { NextRequest } from 'next/server';

export async function POST(request: NextRequest) {
  const { username, password } = await request.json();

  if (!username || !password) {
    return Response.json({
      error: true,
      message: 'Usuário ou senha inválidos',
    });
  }

  if (username !== process.env.username || password !== process.env.password) {
    return Response.json({
      error: true,
      message: 'Usuário ou senha inválidos',
    });
  }

  return Response.json({ message: 'ok' });
}
