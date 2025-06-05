import { Response } from "express";
import { IPaginationQuery, IReqUser } from "../utils/interfaces";

import response from "../utils/response";
import { isValidObjectId } from "mongoose";
import KuisCompetencyModel, { kuisCompetencyDAO } from "../models/kuisCompetency.model";

export default {
    async create(req: IReqUser, res: Response) {
        try {
            await kuisCompetencyDAO.validate(req.body)
            const result = await KuisCompetencyModel.create(req.body)
            response.success(res, result, "Success create Kuis Competancy")
        } catch (error) {
            response.error(res, error, "Failed create Kuis Competancy")
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

            const result = await KuisCompetencyModel.find(query).limit(limit).skip((page - 1) * limit).sort({createdAt: -1}).exec()
            const count =  await KuisCompetencyModel.countDocuments(query)

            response.pagination(res, result, {
                total: count,
                totalPages: Math.ceil(count / limit),
                current: page,
            }, "Success find all Kuis Competancy")
        } catch (error) {
            response.error(res, error, "Failed find all Kuis Competancy")
        }
    },
    async findOne(req: IReqUser, res: Response) {
        try {
            const { id } = req.params
            
            if (!isValidObjectId(id)) {
                return response.notFound(res, "failed find one a Kuis Competancy");
            }
            
            const result = await KuisCompetencyModel.findById(id)
            response.success(res, result, "Success find a Kuis Competancy")
        } catch (error) {
            response.error(res, error, "Failed find a Kuis Competancy")
        }
    },
    async update(req: IReqUser, res: Response) {
        try {
            try {
                const { id } = req.params
                
                if (!isValidObjectId(id)) {
                    return response.notFound(res, "failed find one a Kuis Competancy");
                }
                
                const result = await KuisCompetencyModel.findByIdAndUpdate(id, req.body, {
                    new: true
                })
                response.success(res, result, "Success update Kuis Competancy")
            } catch (error) {
                response.error(res, error, "Failed update Kuis Competancy")
            }
        } catch (error) {
            response.error(res, error, "Failed update Kuis Competancy")
        }
    },
    async remove(req: IReqUser, res: Response) {
        try {
            const { id } = req.params
            
            if (!isValidObjectId(id)) {
                return response.notFound(res, "Failed find one a KuisCompetancy");
            }
            
                const result = await KuisCompetencyModel.findByIdAndDelete(id, {new: true})
                response.success(res, result, "Success remove Kuis Competancy")
        } catch (error) {
            response.error(res, error, "Failed remove Kuis Competancy")
        }
    },

    async findAllBySubCompetency(req: IReqUser, res: Response) {
        try {
            const { subCompetencyId } = req.params;
            const { search, limit = "10", page = "1" } = req.query;

            // Validasi ID
            if (!isValidObjectId(subCompetencyId)) {
                return response.error(res, null, "SubCompetency ID is invalid or not found");
            }

            // Filter dasar
            const filter: any = { bySubCompetency: subCompetencyId };

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
            const result = await KuisCompetencyModel.find(filter)
                .skip(skip)
                .limit(limitNumber);

            const total = await KuisCompetencyModel.countDocuments(filter);

            // Gunakan response.pagination agar konsisten dengan method lainnya
            response.pagination(res, result, {
                total,
                totalPages: Math.ceil(total / limitNumber),
                current: pageNumber,
            }, "Success find all KuisCompetency by SubCompetency");

        } catch (error) {
            response.error(res, error, "Failed to find all KuisCompetency by SubCompetency");
        }
    }

}