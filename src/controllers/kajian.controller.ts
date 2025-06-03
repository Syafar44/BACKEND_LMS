import { Response } from "express";
import { IPaginationQuery, IReqUser } from "../utils/interfaces";
import KajianModel ,{ kajianDAO } from "../models/kajian.model"
import response from "../utils/response";
import { isValidObjectId } from "mongoose";

export default {
    async create(req: IReqUser, res: Response) {
        try {
            await kajianDAO.validate(req.body)
            const result = await KajianModel.create(req.body)
            response.success(res, result, "Success create Kajian")
        } catch (error) {
            response.error(res, error, "Failed create Kajian")
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

            const result = await KajianModel.find(query).limit(limit).skip((page - 1) * limit).sort({createdAt: -1}).exec()
            const count =  await KajianModel.countDocuments(query)

            response.pagination(res, result, {
                total: count,
                totalPages: Math.ceil(count / limit),
                current: page,
            }, "Success find all Kajian")
        } catch (error) {
            response.error(res, error, "Failed find all Kajian")
        }
    },
    async findOne(req: IReqUser, res: Response) {
        try {
            const { id } = req.params
            
            if (!isValidObjectId(id)) {
                return response.notFound(res, "failed find one a Kajian");
            }
            
            const result = await KajianModel.findById(id)
            response.success(res, result, "Success find a Kajian")
        } catch (error) {
            response.error(res, error, "Failed find a Kajian")
        }
    },
    async update(req: IReqUser, res: Response) {
        try {
            try {
                const { id } = req.params
                
                if (!isValidObjectId(id)) {
                    return response.notFound(res, "failed find one a Kajian");
                }
                
                const result = await KajianModel.findByIdAndUpdate(id, req.body, {
                    new: true
                })
                response.success(res, result, "Success update Kajian")
            } catch (error) {
                response.error(res, error, "Failed update Kajian")
            }
        } catch (error) {
            response.error(res, error, "Failed update Kajian")
        }
    },
    async remove(req: IReqUser, res: Response) {
        try {
            const { id } = req.params
            
            if (!isValidObjectId(id)) {
                return response.notFound(res, "Failed find one a Kajian");
            }
            
                const result = await KajianModel.findByIdAndDelete(id, {new: true})
                response.success(res, result, "Success remove Kajian")
        } catch (error) {
            response.error(res, error, "Failed remove Kajian")
        }
    },

    async findOneBySlug(req: IReqUser, res: Response) {
        try {
          const { slug } = req.params;
          const result = await KajianModel.findOne({
            slug,
          });
    
          if (!result) return response.notFound(res, "Kajian not found");
    
          response.success(res, result, "Success find one by slug an Kajian");
        } catch (error) {
          response.error(res, error, "Failed find one by slug an Kajian");
        }
      },
}