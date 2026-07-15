import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  const sessions = await prisma.session.findMany({
    include: {
      _count: {
        select: { messages: true }
      }
    },
    orderBy: { updatedAt: 'desc' }
  });

  return NextResponse.json(sessions);
}

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => ({}));
  const title = typeof body.title === 'string' && body.title.trim() ? body.title.trim() : 'New workspace session';

  const session = await prisma.session.create({
    data: { title }
  });

  return NextResponse.json(session, { status: 201 });
}
