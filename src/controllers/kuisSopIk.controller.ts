import { Response } from "express";
import { IPaginationQuery, IReqUser } from "../utils/interfaces";

import response from "../utils/response";
import { isValidObjectId } from "mongoose";
import KuisSopIkModel, { kuisSopIkDAO } from "../models/kuisSopik.model";

export default {
    async create(req: IReqUser, res: Response) {
        try {
            await kuisSopIkDAO.validate(req.body)
            const result = await KuisSopIkModel.create(req.body)
            response.success(res, result, "Success create Kuis SOP & IK")
        } catch (error) {
            response.error(res, error, "Failed create Kuis SOP & IK")
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
                            title: { $regex: search, $options: 'i' },
                        },
                        {
                            description: { $regex: search, $options: 'i' },
                        }
                    ],
                })
            }

            const result = await KuisSopIkModel.find(query).limit(limit).skip((page - 1) * limit).sort({createdAt: -1}).exec()
            const count =  await KuisSopIkModel.countDocuments(query)

            response.pagination(res, result, {
                total: count,
                totalPages: Math.ceil(count / limit),
                current: page,
            }, "Success find all Kuis SOP & IK")
        } catch (error) {
            response.error(res, error, "Failed find all Kuis SOP & IK")
        }
    },
    async findOne(req: IReqUser, res: Response) {
        try {
            const { id } = req.params
            
            if (!isValidObjectId(id)) {
                return response.notFound(res, "failed find one a Kuis SOP & IK");
            }
            
            const result = await KuisSopIkModel.findById(id)
            response.success(res, result, "Success find a Kuis SOP & IK")
        } catch (error) {
            response.error(res, error, "Failed find a Kuis SOP & IK")
        }
    },
    async update(req: IReqUser, res: Response) {
        try {
            try {
                const { id } = req.params
                
                if (!isValidObjectId(id)) {
                    return response.notFound(res, "failed find one a Kuis SOP & IK");
                }
                
                const result = await KuisSopIkModel.findByIdAndUpdate(id, req.body, {
                    new: true
                })
                response.success(res, result, "Success update Kuis SOP & IK")
            } catch (error) {
                response.error(res, error, "Failed update Kuis SOP & IK")
            }
        } catch (error) {
            response.error(res, error, "Failed update Kuis SOP & IK")
        }
    },
    async remove(req: IReqUser, res: Response) {
        try {
            const { id } = req.params
            
            if (!isValidObjectId(id)) {
                return response.notFound(res, "Failed find one a Kuis SOP & IK");
            }
            
                const result = await KuisSopIkModel.findByIdAndDelete(id, {new: true})
                response.success(res, result, "Success remove Kuis SOP & IK")
        } catch (error) {
            response.error(res, error, "Failed remove Kuis SOP & IK")
        }
    },
    async findAllBySopIk(req: IReqUser, res: Response) {
        try {
            const { sopIkId } = req.params;
            const { search, limit = "10", page = "1" } = req.query;

            // Validasi ID
            if (!isValidObjectId(sopIkId)) {
                return response.error(res, null, "SOP & IK ID is invalid or not found");
            }

            // Filter dasar
            const filter: any = { bySopIk: sopIkId };

            // Filter berdasarkan pencarian jika ada
            if (search) {
                filter.$or = [
                    { question: { $regex: search, $options: "i" } }
                ];
            }

            // Konversi pagination
            const limitNumber = parseInt(limit as string, 10);
            const pageNumber = parseInt(page as string, 10);
            const skip = (pageNumber - 1) * limitNumber;

            // Ambil data dan total
            const result = await KuisSopIkModel.find(filter)
                .skip(skip)
                .limit(limitNumber);

            const total = await KuisSopIkModel.countDocuments(filter);

            // Gunakan response.pagination agar konsisten dengan method lainnya
            response.pagination(res, result, {
                total,
                totalPages: Math.ceil(total / limitNumber),
                current: pageNumber,
            }, "Success find all Kuis SOP & IK by SOP & IK");

        } catch (error) {
            response.error(res, error, "Failed to find all Kuis SOP & IK by SOP & IK");
        }
    }

}