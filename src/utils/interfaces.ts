import { Types } from "mongoose";
import { User } from "../models/user.model";
import { Request } from "express";

export interface IUserToken extends Omit<User, 'password' | 'activationCode' | 'isActive' | 'phone_number' | 'fullName' | 'profilePicture' | 'birth_date'> { id?: Types.ObjectId }

export interface IReqUser extends Request {
    user?: IUserToken
}

export interface IPaginationQuery {
    page: number,
    limit: number,
    search?: string,
    main_competency?: string,
    kajian?: string
    fullName?: string,
    competency?: string,
    subCompetency?: string
    sopIk?: string
}