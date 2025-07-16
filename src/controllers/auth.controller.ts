import { Request, Response } from 'express';
import * as Yup from 'yup';

import UserModel from '../models/user.model';
import { encrypt } from '../utils/encryption';
import { generateToken } from '../utils/jwt';
import { IPaginationQuery, IReqUser } from '../utils/interfaces';
import response from '../utils/response';
import { readUsersFromExcelBuffer } from '../utils/excel';

export type TRegister = {
    fullName: string;
    email: string;
    access: string;
    department: string;
    image?: string;
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
    department: Yup.string().required(),
    image: Yup.string(),
    password: Yup.string().required(),
    confirmPassword: Yup.string().required().oneOf([Yup.ref('password'), ""], 'Passwords must match'),
})

const updatePasswordValidationSchema = Yup.object({
    currentPassword: Yup.string().required('Current password is required'),
    newPassword: Yup.string().required('New password is required').min(6, 'New password must be at least 6 characters'),
    confirmPassword: Yup.string().required('Confirm password is required')
        .oneOf([Yup.ref('newPassword'), ""], 'Passwords must match'),
});

const adminUpdatePasswordValidationSchema = Yup.object({
    newPassword: Yup.string().required('New password is required').min(6, 'New password must be at least 6 characters'),
});

export default {
    async register(req: Request, res: Response) {
        const {fullName, email, access, department,  password, confirmPassword} = req.body as unknown as TRegister;
        try {
            await registerValidationSchema.validate({
                fullName,
                email,
                access,
                department,
                password,
                confirmPassword
            });
    
            const existingUser = await UserModel.findOne({ email });
            if (existingUser) {
                return res.status(400).json({ message: 'Email sudah digunakan', data: null });
            }
    
            const result = await UserModel.create({
                fullName,
                access,
                department,
                email,
                password
            });
    
            res.status(201).json({ message: 'Sukses mendaftar pengguna', data: result });
    
        } catch (error) {
            const err = error as unknown as Error;
            res.status(400).json({ message: err.message, data: null });
        }
    },
    async updatePassword(req: IReqUser, res: Response) {
        const { currentPassword, newPassword, confirmPassword } = req.body;

        try {
            await updatePasswordValidationSchema.validate({
                currentPassword,
                newPassword,
                confirmPassword,
            });

            const userId = req.user?.id; 

            if (!userId) {
                return res.status(403).json({ message: 'User not authenticated', data: null });
            }

            const user = await UserModel.findById(userId);

            if (!user) {
                return res.status(404).json({ message: 'User not found', data: null });
            }
            const isPasswordCorrect = encrypt(currentPassword) === user.password;

            if (!isPasswordCorrect) {
                return res.status(403).json({ message: 'Current password is incorrect', data: null });
            }
            const encryptedPassword = newPassword;

            user.password = encryptedPassword;
            await user.save();

            res.status(200).json({
                message: 'Password updated successfully',
                data: null,
            });

        } catch (error) {
            const err = error as Error;
            res.status(400).json({ message: err.message, data: null });
        }
    },
    async adminUpdatePassword(req: Request, res: Response) {
        const { newPassword } = req.body;

        try {
            await adminUpdatePasswordValidationSchema.validate({
                newPassword,
            });

            const userId = req.params.id;

            if (!userId) {
                return res.status(400).json({ message: 'User ID is required', data: null });
            }

            const user = await UserModel.findById(userId);

            if (!user) {
                return res.status(404).json({ message: 'User not found', data: null });
            }

            user.password = newPassword;
            await user.save();

            res.status(200).json({
                message: 'Password updated successfully',
                data: null,
            });

        } catch (error) {
            const err = error as Error;
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
                department: userByIdentifier.department,
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
    async findAll(req: IReqUser, res: Response) {
        const { page = 1, limit = 10, search } = req.query as unknown as IPaginationQuery
        try {
            const query = {}
            
            if(search) {
                Object.assign(query, {
                    $or: [
                        {
                            fullName: { $regex: search, $options: 'i' },
                        },
                        {
                            email: { $regex: search, $options: 'i' },
                        },
                        {
                            access: { $regex: search, $options: 'i' },
                        },
                        {
                            department: { $regex: search, $options: 'i' },
                        }
                    ],
                })
            }

            const result = await UserModel.find(query).limit(limit).skip((page - 1) * limit).sort({createdAt: -1}).exec()
            const count =  await UserModel.countDocuments(query)

            response.pagination(res, result, {
                total: count,
                totalPages: Math.ceil(count / limit),
                current: page,
            }, "Success find all User")
        } catch (error) {
            response.error(res, error, "Failed find all User")
        }
    },
    async findById(req: IReqUser, res: Response) {
        const { id } = req.params

        try {
            const result = await UserModel.findById(id)
            if (!result) {
                return res.status(404).json({ message: 'User not found', data: null });
            }
            response.success(res, result, "Success find User by id")
        } catch (error) {
            response.error(res, error, "Failed find User by id")
        }
    },
    async updateUser(req: IReqUser, res: Response) {
        const { id } = req.params;
        const { fullName, email, access, department } = req.body as unknown as TRegister;
        try {
            const user = await UserModel.findById(id);
            if (!user) {
                return res.status(404).json({ message: 'User not found', data: null });
            }
            user.fullName = fullName;
            user.email = email;
            user.access = access;
            user.department = department;
            await user.save();
            response.success(res, user, "Success update User")
        } catch (error) {
            response.error(res, error, "Failed update User")
        }
    },
    async updateRole(req: IReqUser, res: Response) {
        const { id } = req.params;
        const { role } = req.body;

        const allowedRoles = ['admin', 'user',];
        if (!role) {
            return res.status(400).json({ message: 'Role is required', data: null });
        }
        if (!allowedRoles.includes(role)) {
            return res.status(400).json({ message: 'Invalid role', data: null });
        }

        try {
            const user = await UserModel.findByIdAndUpdate(
                id,
                { role },
                { new: true, runValidators: true }
            );

            if (!user) {
                return res.status(404).json({ message: 'User not found', data: null });
            }

            response.success(res, user, "Success update User");
        } catch (error) {
            console.error('Update role error:', error);
            response.error(res, error, "Failed update User");
        }
    },
    async updateImage(req: IReqUser, res: Response) {
        const userId = req.user?.id;
        const { image } = req.body;

        try {
            const user = await UserModel.findByIdAndUpdate(
                userId,
                { image },
                { new: true, runValidators: true }
            );

            if (!user) {
                return res.status(404).json({ message: 'User not found', data: null });
            }

            response.success(res, user, "Success update Image");
        } catch (error) {
            response.error(res, error, "Failed update Image");
        }
    },
    async deleteUser(req: IReqUser, res: Response) {
        const { id } = req.params;

        try {
            const user = await UserModel.findByIdAndDelete(id);
            if (!user) {
                return res.status(404).json({ message: 'User not found', data: null });
            }
            response.success(res, user, "Success delete User")
        } catch (error) {
            response.error(res, error, "Failed delete User")
        }
    },
    async bulkRegister(req: IReqUser, res: Response) {
        if (!req.file || !req.file.buffer) {
            return res.status(400).json({ message: 'No file uploaded', data: null });
        }

        try {
            const users = await readUsersFromExcelBuffer(req.file.buffer);
            const errors: string[] = [];
            const createdUsers: any[] = [];

            for (const user of users) {
                try {
                    await registerValidationSchema.validate(user);
                    const exists = await UserModel.findOne({ email: user.email });
                    if (exists) {
                        errors.push(`Email already used: ${user.email}`);
                        continue;
                    }

                    const newUser = await UserModel.create({
                        fullName: user.fullName,
                        email: user.email,
                        access: user.access,
                        department: user.department,
                        password: user.password,
                    });

                    createdUsers.push(newUser);
                } catch (err) {
                    errors.push(`Error for ${user.email || user.fullName}: ${(err as Error).message}`);
                }
            }

            res.status(201).json({
                message: `Imported ${createdUsers.length} users`,
                data: createdUsers,
                errors,
            });
        } catch (err) {
            res.status(500).json({ message: (err as Error).message, data: null });
        }
    },
}

