import { NextResponse } from 'next/server';
import { db } from '@/db';
import { usersTable } from '@/db/schemas/users';
import bcrypt from 'bcrypt';
import { eq } from 'drizzle-orm';

export async function POST(req: Request) {
  try {
    const { username, email, password } = await req.json();

    if (!username) {
      return NextResponse.json({ error: 'Username is missing!' }, { status: 400 });
    }
    if (!email) {
      return NextResponse.json({ error: 'Email is missing!' }, { status: 400 });
    }
    if (!password) {
      return NextResponse.json({ error: 'Password is missing!' }, { status: 400 });
    }

    const existing_user_with_username = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.username, username))

    const existing_user_with_email = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.email, email))

    if (existing_user_with_username.length > 0 && existing_user_with_email.length > 0) {
      return NextResponse.json({ message: 'This username and email are already taken!' }, { status: 409 });
    }

    if (existing_user_with_username.length > 0) {
      return NextResponse.json({ message: 'This username is already taken!' }, { status: 409 });
    }

    if (existing_user_with_email.length > 0) {
      return NextResponse.json({ message: 'This email is already taken!' }, { status: 409 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await db.insert(usersTable).values({
      username,
      email,
      password: hashedPassword,
    });

    return NextResponse.json({ message: 'User created successfully, please log in.' }, { status: 201 });
  } catch (error) {
    console.log("ERROR CREATING USER: ", error)
    return NextResponse.json({ message: 'Error creating user' }, { status: 500 });
  }
}