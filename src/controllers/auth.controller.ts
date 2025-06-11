import { Request, Response } from 'express';
import * as Yup from 'yup';

import UserModel from '../models/user.model';
import { encrypt } from '../utils/encryption';
import { generateToken } from '../utils/jwt';
import { IReqUser } from '../utils/interfaces';


type TRegister = {
    fullName: string;
    email: string;
    access: string;
    password: string;
    confirmPassword: string;
}

type TLogin = {
    email: string;
    password: string;
}

const registerValidationSchema = Yup.object({
    fullName: Yup.string().required(),
    email: Yup.string().required(),
    access: Yup.string().required(),
    password: Yup.string().required(),
    confirmPassword: Yup.string().required().oneOf([Yup.ref('password'), ""], 'Passwords must match'),
})

export default {
    async register(req: Request, res: Response) {
        
        const {fullName, email, access,  password, confirmPassword} = req.body as unknown as TRegister;
    
        try {
            await registerValidationSchema.validate({
                fullName,
                email,
                access,
                password,
                confirmPassword
            });
    
            const existingUser = await UserModel.findOne({ email });
            if (existingUser) {
                return res.status(400).json({ message: 'Nomor telepon sudah digunakan', data: null });
            }
    
            const result = await UserModel.create({
                fullName,
                access,
                email,
                password
            });
    
            res.status(201).json({ message: 'Sukses mendaftar pengguna', data: result });
    
        } catch (error) {
            const err = error as unknown as Error;
            res.status(400).json({ message: err.message, data: null });
        }
    },    

    async login(req: Request, res: Response) {

        const {email, password} = req.body as unknown as TLogin;
        try {
            const userByIdentifier = await UserModel.findOne({
                email,
            })

            if (!userByIdentifier) {
                return res.status(403).json({message: 'User not found', data: null})
            }

            const validatePassword: boolean = encrypt(password) === userByIdentifier.password;

            if (!validatePassword) {
                return res.status(403).json({message: 'Password is incorrect', data: null})
            }

            const token = generateToken({
                id: userByIdentifier._id,
                role: userByIdentifier.role,
                email: userByIdentifier.email,
                access: userByIdentifier.access,
            })

            res.status(200).json(
                {
                    message: 'User logged in successfully',
                    data : token
                }
            )

        } catch (error) {
            const err = error as unknown as Error;
            res.status(400).json({message: err.message , data: null})
        }
        
    },

    async me(req: IReqUser, res: Response) {
        
        try {
            const user = req.user
            const result = await UserModel.findById(user?.id)

            res.status(200).json({
                message: "Success get user profile",
                data: result
            })
        } catch (error) {
            const err = error as unknown as Error;
            res.status(400).json({message: err.message , data: null})
        }
    },

    async activation(req: Request, res: Response) {
        
        try {
            const { code } = req.body as { code: string }
    
            const user = await UserModel.findOneAndUpdate(
                { activationCode: code },
                { isActive: true },
                { new: true }
            )
    
            if (!user) {
                return res.status(404).json({
                    message: 'Activation code not found',
                    data: null
                })
            }
    
            res.status(200).json({
                message: 'User activated successfully',
                data: user
            })
        } catch (error) {
            const err = error as unknown as Error
            res.status(400).json({
                message: err.message,
                data: null
            })
        }
    }    
}

