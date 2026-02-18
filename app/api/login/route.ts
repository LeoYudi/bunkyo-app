import { NextRequest } from "next/server";

import { createSession } from "@/app/lib/server/session";

export async function POST(request: NextRequest) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json(
      { error: true, message: "Body inválido" },
      { status: 400 },
    );
  }

  const { username, password } = (body ?? {}) as {
    username?: string;
    password?: string;
  };

  if (!username || !password) {
    return Response.json({
      error: true,
      message: "Usuário ou senha inválidos",
    });
  }

  console.log(process.env);
  if (
    username !== process.env.adminUsername ||
    password !== process.env.adminPassword
  ) {
    return Response.json({
      error: true,
      message: "Usuário ou senha inválidos",
    });
  }

  try {
    await createSession(username);
  } catch (error) {
    console.error("Failed to create session", error);
    return Response.json(
      { error: true, message: "Falha ao criar sessão" },
      { status: 500 },
    );
  }

  return Response.json({ message: "ok" });
}
