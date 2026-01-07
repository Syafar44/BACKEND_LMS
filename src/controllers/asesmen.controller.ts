import { Response } from "express";
import { IPaginationQuery, IReqUser } from "../utils/interfaces";
import response from "../utils/response";
import { isValidObjectId } from "mongoose";
import AsesmenModel, { asesmenDAO } from "../models/asesmen.model";

export default {
    async create(req: IReqUser, res: Response) {
        try {
            await asesmenDAO.validate(req.body)
            const result = await AsesmenModel.create(req.body)
            response.success(res, result, "Success create Asesmen")
        } catch (error) {
            response.error(res, error, "Failed create Asesmen")
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

            const result = await AsesmenModel.find(query).limit(limit).skip((page - 1) * limit).sort({createdAt: -1}).exec()
            const count =  await AsesmenModel.countDocuments(query)

            response.pagination(res, result, {
                total: count,
                totalPages: Math.ceil(count / limit),
                current: page,
            }, "Success find all Asesmen")
        } catch (error) {
            response.error(res, error, "Failed find all Asesmen")
        }
    },
    async findOne(req: IReqUser, res: Response) {
        try {
            const { id } = req.params
            
            if (!isValidObjectId(id)) {
                return response.notFound(res, "failed find one a Asesmen");
            }
            
            const result = await AsesmenModel.findById(id)
            response.success(res, result, "Success find a Asesmen")
        } catch (error) {
            response.error(res, error, "Failed find a Asesmen")
        }
    },
    async update(req: IReqUser, res: Response) {
        try {
            try {
                const { id } = req.params
                
                if (!isValidObjectId(id)) {
                    return response.notFound(res, "failed find one a Asesmen");
                }
                
                const result = await AsesmenModel.findByIdAndUpdate(id, req.body, {
                    new: true
                })
                response.success(res, result, "Success update Asesmen")
            } catch (error) {
                response.error(res, error, "Failed update Asesmen")
            }
        } catch (error) {
            response.error(res, error, "Failed update Asesmen")
        }
    },
    async remove(req: IReqUser, res: Response) {
        try {
            const { id } = req.params
            
            if (!isValidObjectId(id)) {
                return response.notFound(res, "Failed find one a Asesmen");
            }
            
                const result = await AsesmenModel.findByIdAndDelete(id, {new: true})
                response.success(res, result, "Success remove Asesmen")
        } catch (error) {
            response.error(res, error, "Failed remove Asesmen")
        }
    },
    async findOneBySlug(req: IReqUser, res: Response) {
        try {
          const { slug } = req.params;
          const result = await AsesmenModel.findOne({
            slug,
          });
    
          if (!result) return response.notFound(res, "Asesmen not found");
    
          response.success(res, result, "Success find one by slug an Asesmen");
        } catch (error) {
          response.error(res, error, "Failed find one by slug an Asesmen");
        }
    },
}