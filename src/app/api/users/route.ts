import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession, hashPassword } from "@/lib/auth";
import { createLog } from "@/lib/log";

export async function GET() {
  const session = await getSession();
  if (!session || session.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const users = await prisma.user.findMany({
    include: { role: { select: { id: true, name: true } } },
    orderBy: { createdAt: "desc" },
  });

  const roles = await prisma.role.findMany({ orderBy: { name: "asc" } });

  return NextResponse.json({ users, roles });
}

export async function POST(request: NextRequest) {
  const session = await getSession();
  if (!session || session.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { name, email, password, roleId, isActive } = body;

  if (!name || !email || !password || !roleId) {
    return NextResponse.json(
      { error: "Name, email, password, and role are required" },
      { status: 400 }
    );
  }

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return NextResponse.json(
      { error: "A user with this email already exists" },
      { status: 400 }
    );
  }

  const passwordHash = await hashPassword(password);

  const user = await prisma.user.create({
    data: {
      name,
      email,
      passwordHash,
      roleId,
      isActive: isActive !== false,
    },
    include: { role: { select: { id: true, name: true } } },
  });

  await createLog("CREATED", "User", user.id, session.id, `Created user: ${name} (${email})`);

  return NextResponse.json(user, { status: 201 });
}
