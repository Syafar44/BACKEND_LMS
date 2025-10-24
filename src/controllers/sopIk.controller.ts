import { Response } from "express";
import { IPaginationQuery, IReqUser } from "../utils/interfaces";
import response from "../utils/response";
import { isValidObjectId } from "mongoose";
import SopIkModel, { sopIkDAO } from "../models/sopIk.model";

export default {
    async create(req: IReqUser, res: Response) {
        try {
            await sopIkDAO.validate(req.body)
            const result = await SopIkModel.create(req.body)
            response.success(res, result, "Success create SOP & IK")
        } catch (error) {
            response.error(res, error, "Failed create SOP & IK")
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

            const result = await SopIkModel.find(query).limit(limit).skip((page - 1) * limit).sort({createdAt: -1}).exec()
            const count =  await SopIkModel.countDocuments(query)

            response.pagination(res, result, {
                total: count,
                totalPages: Math.ceil(count / limit),
                current: page,
            }, "Success find all SOP & IK")
        } catch (error) {
            response.error(res, error, "Failed find all SOP & IK")
        }
    },
    async findOne(req: IReqUser, res: Response) {
        try {
            const { id } = req.params
            
            if (!isValidObjectId(id)) {
                return response.notFound(res, "failed find one a SOP & IK");
            }
            
            const result = await SopIkModel.findById(id)
            response.success(res, result, "Success find a SOP & IK")
        } catch (error) {
            response.error(res, error, "Failed find a SOP & IK")
        }
    },
    async update(req: IReqUser, res: Response) {
        try {
            try {
                const { id } = req.params
                
                if (!isValidObjectId(id)) {
                    return response.notFound(res, "failed find one a SOP & IK");
                }
                
                const result = await SopIkModel.findByIdAndUpdate(id, req.body, {
                    new: true
                })
                response.success(res, result, "Success update SOP & IK")
            } catch (error) {
                response.error(res, error, "Failed update SOP & IK")
            }
        } catch (error) {
            response.error(res, error, "Failed update SOP & IK")
        }
    },
    async remove(req: IReqUser, res: Response) {
        try {
            const { id } = req.params
            
            if (!isValidObjectId(id)) {
                return response.notFound(res, "Failed find one a SOP & IK");
            }
            
                const result = await SopIkModel.findByIdAndDelete(id, {new: true})
                response.success(res, result, "Success remove SOP & IK")
        } catch (error) {
            response.error(res, error, "Failed remove SOP & IK")
        }
    },
    async findOneBySlug(req: IReqUser, res: Response) {
        try {
            const { slug } = req.params;
            const result = await SopIkModel.findOne({
                slug,
            });
    
            if (!result) return response.notFound(res, "SOP & IK not found");
    
            response.success(res, result, "Success find one by slug an SOP & IK");
        } catch (error) {
            response.error(res, error, "Failed find one by slug an SOP & IK");
        }
    },
}