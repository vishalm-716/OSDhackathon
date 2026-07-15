import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const sessionId = request.nextUrl.searchParams.get('sessionId');

  if (!sessionId) {
    return NextResponse.json({ error: 'sessionId is required' }, { status: 400 });
  }

  const messages = await prisma.message.findMany({
    where: { sessionId },
    orderBy: { createdAt: 'asc' }
  });

  return NextResponse.json(messages);
}

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => ({}));
  const { sessionId, role, content } = body;

  if (!sessionId || !role || !content) {
    return NextResponse.json({ error: 'sessionId, role and content are required' }, { status: 400 });
  }

  const message = await prisma.message.create({
    data: {
      sessionId,
      role,
      content
    }
  });

  await prisma.session.update({
    where: { id: sessionId },
    data: {
      updatedAt: new Date(),
      title: role === 'user' ? content.slice(0, 48) || 'New workspace session' : undefined
    }
  });

  return NextResponse.json(message, { status: 201 });
}
