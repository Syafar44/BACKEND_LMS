import { customAlphabet } from "nanoid";

export const getId = (number: number): string => {
  const nanoid = customAlphabet("0123456789abcdefghijklmnopqrstuvwxyz", 10);
  return nanoid(number);
};

export const getNumId = (number: number): string => {
  const nanoid = customAlphabet("0123456789", 10);
  return nanoid(number);
};