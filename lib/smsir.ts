import { Smsir } from "sms-typescript/lib";

const API_KEY =
  "8JlD2YmCnjhCJfNr3Rrba60Iqi2s73aZklpsESSJ07cW1hSoVgl92SYytL8EIXK2";
const Line_NUMBER = 30007732905517;
export const initializeSmsService = () => {
  const smsWebService = new Smsir(API_KEY, Line_NUMBER);

  return smsWebService;
};
