import { Response } from "express";
import { IPaginationQuery, IReqUser } from "../utils/interfaces";
import response from "../utils/response";
import { isValidObjectId } from "mongoose";
import IkModel, { ikDAO } from "../models/ik.model";

export default {
    async create(req: IReqUser, res: Response) {
        try {
            await ikDAO.validate(req.body)
            const result = await IkModel.create(req.body)
            response.success(res, result, "Success create IK")
        } catch (error) {
            response.error(res, error, "Failed create IK")
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

            const result = await IkModel.find(query).limit(limit).skip((page - 1) * limit).sort({createdAt: -1}).exec()
            const count =  await IkModel.countDocuments(query)

            response.pagination(res, result, {
                total: count,
                totalPages: Math.ceil(count / limit),
                current: page,
            }, "Success find all IK")
        } catch (error) {
            response.error(res, error, "Failed find all IK")
        }
    },
    async findOne(req: IReqUser, res: Response) {
        try {
            const { id } = req.params
            
            if (!isValidObjectId(id)) {
                return response.notFound(res, "failed find one a IK");
            }
            
            const result = await IkModel.findById(id)
            response.success(res, result, "Success find a IK")
        } catch (error) {
            response.error(res, error, "Failed find a IK")
        }
    },
    async update(req: IReqUser, res: Response) {
        try {
            try {
                const { id } = req.params
                
                if (!isValidObjectId(id)) {
                    return response.notFound(res, "failed find one a IK");
                }
                
                const result = await IkModel.findByIdAndUpdate(id, req.body, {
                    new: true
                })
                response.success(res, result, "Success update IK")
            } catch (error) {
                response.error(res, error, "Failed update IK")
            }
        } catch (error) {
            response.error(res, error, "Failed update IK")
        }
    },
    async remove(req: IReqUser, res: Response) {
        try {
            const { id } = req.params
            
            if (!isValidObjectId(id)) {
                return response.notFound(res, "Failed find one a IK");
            }
            
                const result = await IkModel.findByIdAndDelete(id, {new: true})
                response.success(res, result, "Success remove IK")
        } catch (error) {
            response.error(res, error, "Failed remove IK")
        }
    },
    async findOneBySlug(req: IReqUser, res: Response) {
        try {
            const { slug } = req.params;
            const result = await IkModel.findOne({
                slug,
            });
    
            if (!result) return response.notFound(res, "IK not found");
    
            response.success(res, result, "Success find one by slug an IK");
        } catch (error) {
            response.error(res, error, "Failed find one by slug an IK");
        }
    },
}