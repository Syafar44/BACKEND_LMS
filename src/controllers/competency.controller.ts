import { Response } from "express";
import { IPaginationQuery, IReqUser } from "../utils/interfaces";
import CompetancyModel ,{ competencyDAO } from "../models/competency.model"
import response from "../utils/response";
import { isValidObjectId } from "mongoose";

export default {
    async create(req: IReqUser, res: Response) {
        try {
            await competencyDAO.validate(req.body)
            const result = await CompetancyModel.create(req.body)
            response.success(res, result, "Success create Competancy")
        } catch (error) {
            response.error(res, error, "Failed create Competancy")
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

            const result = await CompetancyModel.find(query).limit(limit).skip((page - 1) * limit).sort({createdAt: -1}).exec()
            const count =  await CompetancyModel.countDocuments(query)

            response.pagination(res, result, {
                total: count,
                totalPages: Math.ceil(count / limit),
                current: page,
            }, "Success find all Competancy")
        } catch (error) {
            response.error(res, error, "Failed find all Competancy")
        }
    },
    async findOne(req: IReqUser, res: Response) {
        try {
            const { id } = req.params
            
            if (!isValidObjectId(id)) {
                return response.notFound(res, "failed find one a Competancy");
            }
            
            const result = await CompetancyModel.findById(id)
            response.success(res, result, "Success find a Competancy")
        } catch (error) {
            response.error(res, error, "Failed find a Competancy")
        }
    },
    async update(req: IReqUser, res: Response) {
        try {
            try {
                const { id } = req.params
                
                if (!isValidObjectId(id)) {
                    return response.notFound(res, "failed find one a Competancy");
                }
                
                const result = await CompetancyModel.findByIdAndUpdate(id, req.body, {
                    new: true
                })
                response.success(res, result, "Success update Competancy")
            } catch (error) {
                response.error(res, error, "Failed update Competancy")
            }
        } catch (error) {
            response.error(res, error, "Failed update Competancy")
        }
    },
    async remove(req: IReqUser, res: Response) {
        try {
            const { id } = req.params
            
            if (!isValidObjectId(id)) {
                return response.notFound(res, "Failed find one a Competancy");
            }
            
                const result = await CompetancyModel.findByIdAndDelete(id, {new: true})
                response.success(res, result, "Success remove Competancy")
        } catch (error) {
            response.error(res, error, "Failed remove Competancy")
        }
    },

    async findOneBySlug(req: IReqUser, res: Response) {
        try {
          const { slug } = req.params;
          const result = await CompetancyModel.findOne({
            slug,
          });
    
          if (!result) return response.notFound(res, "Competancy not found");
    
          response.success(res, result, "Success find one by slug an Competancy");
        } catch (error) {
          response.error(res, error, "Failed find one by slug an Competancy");
        }
      },
}