import { Response } from "express";
import { IPaginationQuery, IReqUser } from "../utils/interfaces";
import response from "../utils/response";
import { isValidObjectId } from "mongoose";
import SopModel, { sopDAO } from "../models/sop.model";

export default {
    async create(req: IReqUser, res: Response) {
        try {
            await sopDAO.validate(req.body)
            const result = await SopModel.create(req.body)
            response.success(res, result, "Success create SOP")
        } catch (error) {
            response.error(res, error, "Failed create SOP")
        }
    },
    async findAll(req: IReqUser, res: Response) {
        const { page = 1, limit = 999, search } = req.query as unknown as IPaginationQuery
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

            const result = await SopModel.find(query).limit(limit).skip((page - 1) * limit).sort({createdAt: -1}).exec()
            const count =  await SopModel.countDocuments(query)

            response.pagination(res, result, {
                total: count,
                totalPages: Math.ceil(count / limit),
                current: page,
            }, "Success find all SOP")
        } catch (error) {
            response.error(res, error, "Failed find all SOP")
        }
    },
    async findOne(req: IReqUser, res: Response) {
        try {
            const { id } = req.params
            
            if (!isValidObjectId(id)) {
                return response.notFound(res, "failed find one a SOP");
            }
            
            const result = await SopModel.findById(id)
            response.success(res, result, "Success find a SOP")
        } catch (error) {
            response.error(res, error, "Failed find a SOP")
        }
    },
    async update(req: IReqUser, res: Response) {
        try {
            try {
                const { id } = req.params
                
                if (!isValidObjectId(id)) {
                    return response.notFound(res, "failed find one a SOP");
                }
                
                const result = await SopModel.findByIdAndUpdate(id, req.body, {
                    new: true
                })
                response.success(res, result, "Success update SOP")
            } catch (error) {
                response.error(res, error, "Failed update SOP")
            }
        } catch (error) {
            response.error(res, error, "Failed update SOP")
        }
    },
    async remove(req: IReqUser, res: Response) {
        try {
            const { id } = req.params
            
            if (!isValidObjectId(id)) {
                return response.notFound(res, "Failed find one a SOP");
            }
            
                const result = await SopModel.findByIdAndDelete(id, {new: true})
                response.success(res, result, "Success remove SOP")
        } catch (error) {
            response.error(res, error, "Failed remove SOP")
        }
    },
    async findOneBySlug(req: IReqUser, res: Response) {
        try {
            const { slug } = req.params;
            const result = await SopModel.findOne({
                slug,
            });
    
            if (!result) return response.notFound(res, "SOP not found");
    
            response.success(res, result, "Success find one by slug an SOP");
        } catch (error) {
            response.error(res, error, "Failed find one by slug an SOP");
        }
    },
}