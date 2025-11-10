import { Response } from "express";
import { IPaginationQuery, IReqUser } from "../utils/interfaces";

import response from "../utils/response";
import { isValidObjectId } from "mongoose";
import KuisKajianModel, { kuisKajianDAO } from "../models/kuisKajian.model";

export default {
    async create(req: IReqUser, res: Response) {
        try {
            await kuisKajianDAO.validate(req.body)
            const result = await KuisKajianModel.create(req.body)
            response.success(res, result, "Success create Kuis Kajian")
        } catch (error) {
            response.error(res, error, "Failed create Kuis Kajian")
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

            const result = await KuisKajianModel.find(query).limit(limit).skip((page - 1) * limit).sort({createdAt: -1}).exec()
            const count =  await KuisKajianModel.countDocuments(query)

            response.pagination(res, result, {
                total: count,
                totalPages: Math.ceil(count / limit),
                current: page,
            }, "Success find all Kuis Kajian")
        } catch (error) {
            response.error(res, error, "Failed find all Kuis Kajian")
        }
    },
    async findOne(req: IReqUser, res: Response) {
        try {
            const { id } = req.params
            
            if (!isValidObjectId(id)) {
                return response.notFound(res, "failed find one a Kuis Kajian");
            }
            
            const result = await KuisKajianModel.findById(id)
            response.success(res, result, "Success find a Kuis Kajian")
        } catch (error) {
            response.error(res, error, "Failed find a Kuis Kajian")
        }
    },
    async update(req: IReqUser, res: Response) {
        try {
            try {
                const { id } = req.params
                
                if (!isValidObjectId(id)) {
                    return response.notFound(res, "failed find one a Kuis Kajian");
                }
                
                const result = await KuisKajianModel.findByIdAndUpdate(id, req.body, {
                    new: true
                })
                response.success(res, result, "Success update Kuis Kajian")
            } catch (error) {
                response.error(res, error, "Failed update Kuis Kajian")
            }
        } catch (error) {
            response.error(res, error, "Failed update Kuis Kajian")
        }
    },
    async remove(req: IReqUser, res: Response) {
        try {
            const { id } = req.params
            
            if (!isValidObjectId(id)) {
                return response.notFound(res, "Failed find one a Kuis Kajian");
            }
            
                const result = await KuisKajianModel.findByIdAndDelete(id, {new: true})
                response.success(res, result, "Success remove Kuis Kajian")
        } catch (error) {
            response.error(res, error, "Failed remove Kuis Kajian")
        }
    },
    async findAllByKajian(req: IReqUser, res: Response) {
        try {
            const { kajian } = req.params;
            const { search, limit = "10", page = "1" } = req.query;

            // Validasi ID
            if (!isValidObjectId(kajian)) {
                return response.error(res, null, "Kajian ID is invalid or not found");
            }

            // Filter dasar
            const filter: any = { byKajian: kajian };

            // Filter berdasarkan pencarian jKajiana ada
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
            const result = await KuisKajianModel.find(filter)
                .skip(skip)
                .limit(limitNumber);

            const total = await KuisKajianModel.countDocuments(filter);

            // Gunakan response.pagination agar konsisten dengan method lainnya
            response.pagination(res, result, {
                total,
                totalPages: Math.ceil(total / limitNumber),
                current: pageNumber,
            }, "Success find all Kuis Kajian by Kajian");

        } catch (error) {
            response.error(res, error, "Failed to find all Kuis Kajian by Kajian");
        }
    }

}