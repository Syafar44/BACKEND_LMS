import { Response } from "express";
import { IPaginationQuery, IReqUser } from "../utils/interfaces";

import response from "../utils/response";
import { isValidObjectId } from "mongoose";
import KuisAsesmenModel, { kuisAsesmenDAO } from "../models/kuisAsesmen.model";

export default {
    async create(req: IReqUser, res: Response) {
        try {
            await kuisAsesmenDAO.validate(req.body)
            const result = await KuisAsesmenModel.create(req.body)
            response.success(res, result, "Success create Kuis Asesmen")
        } catch (error) {
            response.error(res, error, "Failed create Kuis Asesmen")
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

            const result = await KuisAsesmenModel.find(query).limit(limit).skip((page - 1) * limit).sort({createdAt: -1}).exec()
            const count =  await KuisAsesmenModel.countDocuments(query)

            response.pagination(res, result, {
                total: count,
                totalPages: Math.ceil(count / limit),
                current: page,
            }, "Success find all Kuis Asesmen")
        } catch (error) {
            response.error(res, error, "Failed find all Kuis Asesmen")
        }
    },
    async findOne(req: IReqUser, res: Response) {
        try {
            const { id } = req.params
            
            if (!isValidObjectId(id)) {
                return response.notFound(res, "failed find one a Kuis Asesmen");
            }
            
            const result = await KuisAsesmenModel.findById(id)
            response.success(res, result, "Success find a Kuis Asesmen")
        } catch (error) {
            response.error(res, error, "Failed find a Kuis Asesmen")
        }
    },
    async update(req: IReqUser, res: Response) {
        try {
            try {
                const { id } = req.params
                
                if (!isValidObjectId(id)) {
                    return response.notFound(res, "failed find one a Kuis Asesmen");
                }
                
                const result = await KuisAsesmenModel.findByIdAndUpdate(id, req.body, {
                    new: true
                })
                response.success(res, result, "Success update Kuis Asesmen")
            } catch (error) {
                response.error(res, error, "Failed update Kuis Asesmen")
            }
        } catch (error) {
            response.error(res, error, "Failed update Kuis Asesmen")
        }
    },
    async remove(req: IReqUser, res: Response) {
        try {
            const { id } = req.params
            
            if (!isValidObjectId(id)) {
                return response.notFound(res, "Failed find one a Kuis Asesmen");
            }
            
                const result = await KuisAsesmenModel.findByIdAndDelete(id, {new: true})
                response.success(res, result, "Success remove Kuis Asesmen")
        } catch (error) {
            response.error(res, error, "Failed remove Kuis Asesmen")
        }
    },
    async findAllByAsesmen(req: IReqUser, res: Response) {
        try {
            const { asesmen } = req.params;
            const { search, limit = "10", page = "1" } = req.query;

            if (!isValidObjectId(asesmen)) {
                return response.error(res, null, "Asesmen ID is invalid or not found");
            }

            const filter: any = { byAsesmen: asesmen };

            if (search) {
                filter.$or = [
                    { question: { $regex: search, $options: "i" } }
                ];
            }

            const limitNumber = parseInt(limit as string, 10);
            const pageNumber = parseInt(page as string, 10);
            const skip = (pageNumber - 1) * limitNumber;

            const result = await KuisAsesmenModel.find(filter)
                .skip(skip)
                .limit(limitNumber);

            const total = await KuisAsesmenModel.countDocuments(filter);

            response.pagination(res, result, {
                total,
                totalPages: Math.ceil(total / limitNumber),
                current: pageNumber,
            }, "Success find all Kuis Asesmen by Asesmen");

        } catch (error) {
            response.error(res, error, "Failed to find all Kuis Asesmen by Asesmen");
        }
    }

}