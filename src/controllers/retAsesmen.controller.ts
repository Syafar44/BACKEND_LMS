import { Response } from "express";
import { IPaginationQuery, IReqUser } from "../utils/interfaces";
import response from "../utils/response";
import { isValidObjectId } from "mongoose";
import RetAsesmenModel, { retAsesmenDAO } from "../models/retAsesmen.model";

export default {
    async create(req: IReqUser, res: Response) {
        try {
            await retAsesmenDAO.validate(req.body)
            const result = await RetAsesmenModel.create(req.body)
            response.success(res, result, "Success create Ret Asesmen")
        } catch (error) {
            response.error(res, error, "Failed create Ret Asesmen")
        }
    },
    async findAll(req: IReqUser, res: Response) {
        const { page = 1, limit = 9999, search } = req.query as unknown as IPaginationQuery
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

            const result = await RetAsesmenModel.find(query).limit(limit).skip((page - 1) * limit).sort({createdAt: -1}).exec()
            const count =  await RetAsesmenModel.countDocuments(query)

            response.pagination(res, result, {
                total: count,
                totalPages: Math.ceil(count / limit),
                current: page,
            }, "Success find all Ret Asesmen")
        } catch (error) {
            response.error(res, error, "Failed find all Ret Asesmen")
        }
    },
    async findOne(req: IReqUser, res: Response) {
        try {
            const { id } = req.params
            
            if (!isValidObjectId(id)) {
                return response.notFound(res, "failed find one a Ret Asesmen");
            }
            
            const result = await RetAsesmenModel.findById(id)
            response.success(res, result, "Success find a Ret Asesmen")
        } catch (error) {
            response.error(res, error, "Failed find a Ret Asesmen")
        }
    },
    async update(req: IReqUser, res: Response) {
        try {
            try {
                const { id } = req.params
                
                if (!isValidObjectId(id)) {
                    return response.notFound(res, "failed find one a Ret Asesmen");
                }
                
                const result = await RetAsesmenModel.findByIdAndUpdate(id, req.body, {
                    new: true
                })
                response.success(res, result, "Success update Ret Asesmen")
            } catch (error) {
                response.error(res, error, "Failed update Ret Asesmen")
            }
        } catch (error) {
            response.error(res, error, "Failed update Ret Asesmen")
        }
    },
    async remove(req: IReqUser, res: Response) {
        try {
            const { id } = req.params
            
            if (!isValidObjectId(id)) {
                return response.notFound(res, "Failed find one a Ret Asesmen");
            }
            
                const result = await RetAsesmenModel.findByIdAndDelete(id, {new: true})
                response.success(res, result, "Success remove Ret Asesmen")
        } catch (error) {
            response.error(res, error, "Failed remove Ret Asesmen")
        }
    },
    async findAllByUserId(req: IReqUser, res: Response) {
        try {
            const { createdBy } = req.params
            const result = await RetAsesmenModel.find({ createdBy: createdBy }).exec();
            response.success(res, result, "Success find Ret Asesmen");
        } catch (error) {
            response.error(res, error, "Failed to find Ret Asesmen")
        }
    },
}