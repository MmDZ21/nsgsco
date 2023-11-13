import { NextResponse, NextRequest } from "next/server";
import path from "path";
import { writeFile } from "fs/promises";

import fs from "fs";
import decompress from "decompress";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/authOptions";
import slugify from "slugify";

// ...

export const POST = async (req: NextRequest) => {
  //check user's role
  const session = await getServerSession(authOptions);
  if (!session) {
    return new NextResponse("شما مجاز به این عملیات نیستید", { status: 403 });
  }
  const isAdmin = session?.user?.role === "ADMIN" ? true : false;
  console.log("is Admin:" + isAdmin);
  if (!isAdmin) {
    return new NextResponse("شما مجاز به این عملیات نیستید", { status: 403 });
  }

  try {
    const formData = await req.formData();

    const file = formData.get("file");
    const month = formData.get("month") as string;
    const year = formData.get("year") as string;
    // const monthSlug = slugify(month, { lower: true });
    // const yearSlug = slugify(year, { lower: true });
    if (!file) {
      return NextResponse.json(
        { error: "فایل به درستی آپلود نشده" },
        { status: 400 }
      );
    }

    const fileBlob = file as File;
    const fileName = path.parse(fileBlob.name).name;
    const fileBuffer = Buffer.from(await fileBlob.arrayBuffer());
    console.log("file name: " + fileName);
    const uploadDir = path.join(process.cwd(), "payslips");
    console.log("upload dir: ", uploadDir);

    const uploadPath = path.join(uploadDir, year, month);
    console.log("upload path: ", uploadPath);

    try {
      await fs.promises.access(uploadPath);
      console.log("Upload directory already exists");
    } catch (error) {
      // If the directory doesn't exist, create it
      try {
        await fs.promises.mkdir(uploadPath, { recursive: true });
        console.log("Upload directory created successfully");
      } catch (error) {
        console.error("Error creating upload directory:", error);
        return NextResponse.json({ Message: "ناموفق", status: 500 });
      }
    }
    await writeFile(uploadPath + fileName, fileBuffer);
    const extractionDir = uploadPath;

    console.log("extraction dir:" + extractionDir);

    await decompress(fileBuffer, extractionDir);
    console.log("extracted successfully");

    // Iterate through the extracted files and associate each payslip with the user
    const extractedFiles = fs.readdirSync(extractionDir);
    console.log(extractedFiles);

    for (const file of extractedFiles) {
      const username = path.parse(file).name;
      console.log("Processing file:", file);
      console.log("Username:", typeof username);

      try {
        const user = await prisma.user.findUnique({
          where: { username: username },
        });

        if (!user) {
          console.log(`User ${username} not found`);
          continue; // Skip creating payslip if user not found
        }
        console.log("user has been found");
        //check if file already exists
        const existingFile = await prisma.payslip.findFirst({
          where: {
            AND: {
              month,
              year,
              filename: file,
            },
          },
        });
        let newFile: any = "existed";
        if (!existingFile) {
          newFile = await prisma.payslip.create({
            data: {
              filename: file,
              userId: user.id,
              month,
              year,
            },
          });
        } else {
          newFile = await prisma.payslip.update({
            where: {
              id: existingFile.id,
            },
            data: {
              filename: file,
            },
          });
        }
        console.log("file:" + newFile);
      } catch (error) {
        console.log(error);
      }
    }

    await fs.promises.unlink(uploadPath + fileName);
    console.log("archive file removed sucessfully");

    return NextResponse.json({
      Message: "فایل با موفقیت بارگزاری و استخراج شد",
      status: 201,
    });
  } catch (error) {
    console.error("Error occurred: ", error);
    return NextResponse.json({ Message: "ناموفق", status: 500 });
  }
};
