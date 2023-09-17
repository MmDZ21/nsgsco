import { DefaultSession, DefaultUser } from "next-auth";
import { JWT, DefaultJWT } from "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: string;
      username: string;
      name: string;
      image: string | undefined | null;
    } & DefaultSession;
  }

  interface User extends DefaultUser {
    role: string;
    username: string;
    name: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    role: string;
    id: string;
    username: string;
    name: string;
  }
}
