import jwt from "jsonwebtoken";
import { SECRET } from "./env";
import { IUserToken } from "./interfaces";

export const generateToken = (user: IUserToken): string => {
  const token = jwt.sign(user, SECRET, {
    expiresIn: "1y",
  });
  return token;
};
export const getUserData = (token: string): IUserToken => {
  const user = jwt.verify(token, SECRET) as IUserToken;
  return user;
};
