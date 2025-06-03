import { Response } from "express";
import { IPaginationQuery, IReqUser } from "../utils/interfaces";
import response from "../utils/response";
import { isValidObjectId } from "mongoose";
import SubCompetencyModel, { subCompetencyDAO } from "../models/subCompetency.model";

export default {
    async create(req: IReqUser, res: Response) {
        try {
            await subCompetencyDAO.validate(req.body)
            const result = await SubCompetencyModel.create(req.body)
            response.success(res, result, "Success create SubCompetency")
        } catch (error) {
            response.error(res, error, "Failed create SubCompetency")
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

            const result = await SubCompetencyModel.find(query).limit(limit).skip((page - 1) * limit).sort({createdAt: -1}).exec()
            const count =  await SubCompetencyModel.countDocuments(query)

            response.pagination(res, result, {
                total: count,
                totalPages: Math.ceil(count / limit),
                current: page,
            }, "Success find all SubCompetency")
        } catch (error) {
            response.error(res, error, "Failed find all SubCompetency")
        }
    },
    async findOne(req: IReqUser, res: Response) {
        try {
            const { id } = req.params
            
            if (!isValidObjectId(id)) {
                return response.notFound(res, "failed find one a SubCompetency");
            }
            
            const result = await SubCompetencyModel.findById(id)
            response.success(res, result, "Success find a SubCompetency")
        } catch (error) {
            response.error(res, error, "Failed find a SubCompetency")
        }
    },
    async update(req: IReqUser, res: Response) {
        try {
            try {
                const { id } = req.params
                
                if (!isValidObjectId(id)) {
                    return response.notFound(res, "failed find one a SubCompetency");
                }
                
                const result = await SubCompetencyModel.findByIdAndUpdate(id, req.body, {
                    new: true
                })
                response.success(res, result, "Success update SubCompetency")
            } catch (error) {
                response.error(res, error, "Failed update SubCompetency")
            }
        } catch (error) {
            response.error(res, error, "Failed update SubCompetency")
        }
    },
    async remove(req: IReqUser, res: Response) {
        try {
            const { id } = req.params
            
            if (!isValidObjectId(id)) {
                return response.notFound(res, "Failed find one a SubCompetency");
            }
            
                const result = await SubCompetencyModel.findByIdAndDelete(id, {new: true})
                response.success(res, result, "Success remove SubCompetency")
        } catch (error) {
            response.error(res, error, "Failed remove SubCompetency")
        }
    },

    async findOneBySlug(req: IReqUser, res: Response) {
        try {
          const { slug } = req.params;
          const result = await SubCompetencyModel.findOne({
            slug,
          });
    
          if (!result) return response.notFound(res, "SubCompetency not found");
    
          response.success(res, result, "Success find one by slug an SubCompetency");
        } catch (error) {
          response.error(res, error, "Failed find one by slug an SubCompetency");
        }
      },

      async findAllByCompetency(req: IReqUser, res: Response) {
        try {
            const { competencyId } = req.params

            if (!isValidObjectId(competencyId)) {
                return response.error(res, null, "competency not found");
            }

            const result = await SubCompetencyModel.find({ competency: competencyId }).exec();
            response.success(res, result, "Success find all subCompetency by competency");
        } catch (error) {
            response.error(res, error, "Failed to find all subCompetency by competency")
        }
    },
}