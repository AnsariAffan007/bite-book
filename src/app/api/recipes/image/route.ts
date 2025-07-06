import { NextResponse } from "next/server"
import { cookies } from "next/headers";
import { authenticateSession } from "@/utils/sessions";
import cloudinary from "@/utils/cloudinary";

export async function POST(req: Request) {
  try {

    const sessionId = cookies().get('session_id')?.value;
    const { authenticated, expired, message, userData } = await authenticateSession(sessionId)

    if (authenticated && expired) {
      return NextResponse.json({ message: message }, { status: 401 })
    }

    const username = userData?.username

    const data = await req.formData()
    const file = data.get('file') as File | null

    if (!file) {
      return NextResponse.json({ message: 'File is missing!' }, { status: 406 })
    }

    const bytes = await file?.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const base64 = `data:image/jpeg;base64,${buffer.toString('base64')}`;

    const result = await cloudinary.uploader.upload(base64, {
      folder: `/bitebook/${username}/recipes`
    })

    return NextResponse.json(
      {
        message: "Image uploaded successfully",
        data: { public_id: result.public_id, url: result.secure_url }
      },
      { status: 200 }
    )
  }
  catch (e) {
    console.log("Error Uploading file: ", e)
    return NextResponse.json({ message: 'Could not upload file. Please try again or contact admin' }, { status: 500 })
  }
}

export async function DELETE(req: Request) {
  try {
    const sessionId = cookies().get('session_id')?.value;
    const { authenticated, expired, message } = await authenticateSession(sessionId)

    if (authenticated && expired) {
      return NextResponse.json({ message: message }, { status: 401 })
    }

    const { searchParams } = new URL(req.url);
    const publicId = searchParams.get('public_id') || '';

    await cloudinary.uploader.destroy(publicId, { invalidate: true })

    return new Response(null, { status: 204 })
  }
  catch (e) {
    console.log("Error Deleting file: ", e)
    return NextResponse.json({ message: 'Could not delete image. Please try again or contact admin' }, { status: 500 })
  }
}