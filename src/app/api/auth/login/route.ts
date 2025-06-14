import { NextResponse } from 'next/server';
import { db } from '@/db';
import { usersTable } from '@/db/schemas/users';
import bcrypt from 'bcrypt';
import { sessionTable } from '@/db/schemas/sessions';
import { eq } from 'drizzle-orm';
import { v4 as uuidv4 } from 'uuid'

export async function POST(req: Request) {
  try {
    const { username, password } = await req.json();

    if (!username) {
      return NextResponse.json({ message: 'Usernameis missing!' }, { status: 400 });
    }

    if (!password) {
      return NextResponse.json({ message: 'Password is missing!' }, { status: 400 });
    }

    // Find the user by username
    const user = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.username, username))

    if (user.length === 0) {
      return NextResponse.json({ message: 'User with this username does not exist' }, { status: 404 });
    }

    // Compare the hashed password
    const passwordMatch = await bcrypt.compare(password, user[0].password);
    if (!passwordMatch) {
      return NextResponse.json({ message: 'Invalid password.' }, { status: 401 });
    }

    // Create a session
    const sessionId = uuidv4();
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + 30);

    // Save the session in the database
    await db.insert(sessionTable).values({
      sessionId,
      userId: user[0].id,
      expiresAt,
      createdAt: new Date(),
    });

    // Set the session ID in a cookie
    const headers = new Headers();
    headers.append('Set-Cookie', `session_id=${sessionId}; Path=/; HttpOnly; SameSite=Strict; Max-Age=1800`);

    return NextResponse.json({ message: 'Login successful' }, { status: 200, headers });
  } catch (error) {
    console.log('ERROR DURING LOGIN:', error);
    return NextResponse.json({ message: 'Error during login.' }, { status: 500 });
  }
}