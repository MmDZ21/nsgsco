// pages/api/tickets/reply.ts
import { getSession } from "next-auth/react"; // Import your authentication library
import { prisma } from "@/lib/prisma"; // Import your Prisma client
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/authOptions";
import path from "path";
import { writeFile } from "fs/promises";
import fs from "fs";

export const POST = async (req: NextRequest) => {
  try {
    // Authenticate the admin user (ensure they have the necessary role)
    const session = await getServerSession(authOptions);
    if (!session) {
      return new NextResponse("شما مجاز به این عملیات نیستید", { status: 403 });
    }
    const userRole = session?.user?.role;
    console.log("user role:" + userRole);
    // Extract data from the request body
    const formData = await req.formData();
    const reply = formData.get("reply") as string;
    const ticketId = formData.get("ticketId") as string;
    const file = formData.get("file");
    // Create a new message associated with the ticket and admin
    console.log(formData);

    // Connect the created file to the message
    const newReply = await prisma.message.create({
      data: {
        body: reply,
        userId: session.user.id,
        ticketId: ticketId,
      },
    });

    if (file) {
      const fileBlob = file as File;
      const fileName = path.parse(fileBlob.name).name;
      const fileExt = path.parse(fileBlob.name).ext;
      const fileBuffer = Buffer.from(await fileBlob.arrayBuffer());
      console.log("file name: " + fileName);

      // Create the ticket file and get its ID

      const uploadDir = path.join(
        process.cwd(),
        "tickets",
        userRole.toLowerCase(),
        ticketId,
        newReply.id
      );
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }
      const uploadPath = path.join(uploadDir, fileBlob.name);
      const createdFile = await prisma.file.create({
        data: {
          path:
            "tickets/" +
            userRole.toLowerCase() +
            "/" +
            ticketId +
            "/" +
            newReply.id,
          name: fileName,
          ext: fileExt,
          Message: {
            connect: { id: newReply.id },
          },
        },
      });

      await writeFile(uploadPath, fileBuffer);
    }
    // Update the ticket to reflect the new message
    await prisma.ticket.update({
      where: { id: ticketId },
      data: {
        status: userRole === "ADMIN" ? "REPLIED" : "NOREPLY", // You can update the status as needed
        // Optionally, you can store the latest message ID in the ticket for easy retrieval
        latestMessageId: newReply.id,
        unreadByAdmin: userRole === "ADMIN" ? false : true,
        unreadByUser: userRole === "BASIC" ? false : true,
      },
    });

    return new NextResponse("Reply sent successfully", { status: 201 });
  } catch (error) {
    console.error("Error sending reply:", error);
    return new NextResponse("Server error", { status: 500 });
  }
};
