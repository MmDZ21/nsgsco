"use client";
import { useDashboardContext } from "@/context/Provider";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { signOut, useSession } from "next-auth/react";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "axios";

export function TopBar() {
  const { data: session, update, status } = useSession();
  const user = session?.user;
  const { openSidebar } = useDashboardContext();
  const router = useRouter();
  const isAdmin = user?.role === "ADMIN" ? true : false;
  const [picture, setPicture] = useState<string>(
    session?.user.image ? "/assets/svg/spinner.svg" : "/assets/img/avatar.png"
  );
  useEffect(() => {
    if (session?.user.image) {
      const fetchImage = async () => {
        try {
          // Fetch the updated image from the API using the image path in session.user.image
          const response = await axios.get(`/api/images/${session.user.id}`, {
            responseType: "arraybuffer", // Set the responseType to 'arraybuffer'
            headers: {
              "Cache-Control": "no-store",
            },
          });

          // Convert the received image data to a base64 string
          const imageSrc = `data:image/png;base64,${Buffer.from(
            response.data,
            "binary"
          ).toString("base64")}`;

          // Set the source directly to the Image component
          setPicture(imageSrc);
        } catch (error) {
          console.error("Error fetching updated image:", error);
        }
      };

      fetchImage();
    }
  }, [session?.user.image]);
  return (
    <header className="relative z-10 h-20 items-center bg-gray-900/90 ">
      <div className="relative z-10 mx-auto flex h-full flex-col justify-center px-3 text-white">
        <div className="relative flex w-full items-center pl-1 sm:ml-0 sm:pr-2">
          <div className="relative ml-1 w-2/12 flex items-center justify-start p-1 sm:right-auto sm:mr-0">
            <Image
              src={"/assets/img/flag.png"}
              alt="iran"
              width={100}
              height={100}
              className="mr-2"
            />
            <DropdownMenu>
              <DropdownMenuTrigger>
                <a href="#" className="relative block">
                  <Image
                    alt={
                      user?.name && user.name !== undefined
                        ? user?.name
                        : "user"
                    }
                    src={picture}
                    width={40}
                    height={40}
                    className="mr-5 rounded-full h-10 w-10 object-cover"
                    unoptimized
                  />
                </a>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-gray-900">
                <DropdownMenuLabel>{user?.name}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() =>
                    isAdmin
                      ? router.push("/dashboard/admin/settings")
                      : router.push("/dashboard/user/settings")
                  }
                >
                  تنظیمات
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => signOut({ callbackUrl: "/" })}>
                  خروج
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <a href="#" className="relative block pr-5">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                />
              </svg>
            </a>
          </div>
          <div className="container relative flex items-center w-8/12 justify-center">
            <h6 className="hidden font-IranNastaliqWeb text-xl md:block text-right">
              مجری پروژه های صنعتی و ساختمانی , نصب تجهیزات و دستگاهها،تعمیر
              ونگهداری، , راه اندازی وبهره برداری، صنایع نفت و گاز , صنایع سنگین
              و نیروگاهها
            </h6>
          </div>
          <div className="group relative flex h-full w-2/12 items-center justify-end">
            <button
              type="button"
              aria-expanded="false"
              aria-label="Toggle sidenav"
              onClick={openSidebar}
              className="text-4xl text-white focus:outline-none"
            >
              &#8801;
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
