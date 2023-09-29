import { prisma } from "@/lib/prisma";
import { NextResponse, NextRequest } from "next/server";
import path from "path";
import fs from "fs";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";

export const GET = async (
  req: NextRequest,
  { params }: { params: { fileId: string } }
) => {
  // Check if the user is authenticated
  const session = await getServerSession(authOptions);
  if (!session) {
    return new NextResponse("شما مجاز به این عملیات نیستید", { status: 403 });
  }

  // Set the file ID
  const fileId = params.fileId;

  try {
    // Find the payslip by ID
    const file = await prisma.file.findUnique({
      where: {
        id: fileId,
      },
      include: {
        Message: {
          include: {
            ticket: {
              select: {
                userId: true,
              },
            },
            user: {
              select: {
                role: true,
                id: true,
                username: true,
              },
            },
          },
        },
      },
    });

    if (!file || !file.messageId) {
      return new NextResponse("فایل یافت نشد", { status: 404 });
    }

    if (!file.Message) {
      return new NextResponse("فایل یافت نشد", { status: 404 });
    }
    // Get the file path
    const filePath = path.join(process.cwd(), file.path, file.name + file.ext);
    console.log("file path: " + filePath);

    // Check if the file exists
    if (!fs.existsSync(filePath)) {
      return new NextResponse("فایل یافت نشد", { status: 404 });
    }

    // Read the file into a Uint8Array

    const fileStream = fs.createReadStream(filePath);
    // Read the file stream into a buffer
    const fileBuffer = await new Promise<Buffer>((resolve, reject) => {
      const chunks: Uint8Array[] = [];
      fileStream.on("data", (chunk: Uint8Array) => chunks.push(chunk));
      fileStream.on("end", () => resolve(Buffer.concat(chunks)));
      fileStream.on("error", reject);
    });
    return new NextResponse(fileBuffer, {
      headers: {
        "content-disposition": `attachment; filename="${file.name + file.ext}"`,
        "Content-Type": "application/octet-stream",
      },
    });
  } catch (error: any) {
    return new NextResponse(error.message, { status: 500 });
  }

  // return a new response but use 'content-disposition' to suggest saving the file to the user's computer
};
