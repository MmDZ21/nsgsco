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
  };
  include: {
    Message: true;
    payslips: true;
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
      };
    };
  };
}>;
// type MessageModel = Prisma.MessageGetPayload<{
//   include: {
//     file: {
//       select: {
//         name;
//         messageId;
//         id;
//         path;
//         ext;
//         Message;
//       };
//     };
//     user: {
//       select: {
//         username;
//         name;
//         id;
//         image;
//         role;
//         Message;
//         tickets;
//       };
//     };
//   };
// }>;
// type FileModel = Prisma.FileGetPayload<{
//   include: {
//     Message: {
//       include: {
//         user: {
//           select: {
//             role;
//             id;
//             username;
//           };
//         };
//         ticket: {
//           select: {
//             userId;
//           };
//         };
//       };
//     };
//   };
//   select: {
//     messageId;
//     name;
//     id;
//     path;
//     ext;
//     Message;
//   };
// }>;
type PayslipModel = Prisma.PayslipGetPayload<{
  include: { user: true };
}>;
