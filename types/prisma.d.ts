import { Prisma } from "@prisma/client";

type UserModel = Prisma.UserGetPayload<{
  select: {
    id;
    name;
    image;
    role;
    Message;
    firstLogin;
    username;
    tickets;
    payslips;
    department: {
      select: {
        name;
        id;
      };
    };
  };
  include: {
    Message: true;
    payslips: {
      include: {
        user: {
          select: {
            department: {
              select: { id; name };
            };
          };
        };
      };
    };
    tickets: {
      include: {
        messages: {
          include: {
            user;
            file;
          };
        };
      };
    };
  };
}>;
type TicketModel = Prisma.TicketGetPayload<{
  include: {
    user: {
      select: {
        id;
        name;
        Message;
        image;
        role;
        username;
        tickets;
        department;
      };
    };
    messages: {
      include: {
        user: {
          select: {
            id;
            image;
            name;
            role;
            Message;
          };
        };
        file: {
          select: {
            name;
            messageId;
            id;
            path;
            ext;
            Message;
          };
        };
      };
    };
  };
}>;
type SuggestionModel = Prisma.SuggestionGetPayload<{
  include: {
    user: {
      select: {
        id;
        name;
        Message;
        image;
        role;
        username;
        Suggestion;
        department;
      };
    };
  };
}>;
type PayslipModel = Prisma.PayslipGetPayload<{
  include: {
    user: {
      include: {
        department;
      };
    };
  };
}>;

type DepartmentModel = Prisma.DepartmentGetPayload<{
  select: {
    active;
    createdAt;
    name;
    id;
    updatedAt;
    users;
  };
  include: {
    users: {
      select: {
        id;
        name;
        image;
        username;
        phone;
      };
    };
  };
}>;
