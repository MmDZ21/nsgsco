import path from "path";
import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import { prisma } from "@/lib/prisma";

export const GET = async (
  req: NextRequest,
  { params }: { params: { id: string } }
) => {
  const userId = params.id;

  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });
  const image = user?.image;

  const imagePath = path.join(process.cwd(), "profiles", image as string);
  console.log(imagePath);

  try {
    // Create a read stream to efficiently stream the file
    const fileStream = fs.createReadStream(imagePath);

    // Set the response headers
    const headers = {
      "Content-Type": "application/octet-stream", // Adjust the content type as needed
      "Content-Disposition": `attachment; filename="${image}"`,
    };

    // Read the file stream into a buffer
    const fileBuffer = await new Promise<Buffer>((resolve, reject) => {
      const chunks: Uint8Array[] = [];
      fileStream.on("data", (chunk: Uint8Array) => chunks.push(chunk));
      fileStream.on("end", () => resolve(Buffer.concat(chunks)));
      fileStream.on("error", reject);
    });

    // Return the file buffer as the response body
    return new NextResponse(fileBuffer, { headers });
  } catch (error) {
    // Handle errors, e.g., file not found
    return new NextResponse(`File not found: ${image}`, { status: 404 });
  }
};
