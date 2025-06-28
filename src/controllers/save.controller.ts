import { Response } from "express";
import { IPaginationQuery, IReqUser } from "../utils/interfaces";

import response from "../utils/response";
import { isValidObjectId } from "mongoose";
import SaveModel, { saveDAO, TSave } from "../models/save.model";

export default {
    async create(req: IReqUser, res: Response) {
        try {
            const userId = req.user?.id;
            console.log(userId)
            const payload = {...req.body, createdBy: userId} as TSave
            await saveDAO.validate(payload)
            const result = await SaveModel.create(payload)
            response.success(res, result, "Success create save")
        } catch (error) {
            response.error(res, error, "Failed create save")
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

            const result = await SaveModel.find(query).limit(limit).skip((page - 1) * limit).sort({createdAt: -1}).exec()
            const count =  await SaveModel.countDocuments(query)

            response.pagination(res, result, {
                total: count,
                totalPages: Math.ceil(count / limit),
                current: page,
            }, "Success find all save")
        } catch (error) {
            response.error(res, error, "Failed find all save")
        }
    },
    async findOne(req: IReqUser, res: Response) {
        try {
            const { id } = req.params
            
            if (!isValidObjectId(id)) {
                return response.notFound(res, "failed find one a save");
            }
            
            const result = await SaveModel.findById(id)
            response.success(res, result, "Success find a save")
        } catch (error) {
            response.error(res, error, "Failed find a save")
        }
    },
    async update(req: IReqUser, res: Response) {
        try {
            try {
                const { id } = req.params
                
                if (!isValidObjectId(id)) {
                    return response.notFound(res, "failed find one a save");
                }
                
                const result = await SaveModel.findByIdAndUpdate(id, req.body, {
                    new: true
                })
                response.success(res, result, "Success update save")
            } catch (error) {
                response.error(res, error, "Failed update save")
            }
        } catch (error) {
            response.error(res, error, "Failed update save")
        }
    },
    async remove(req: IReqUser, res: Response) {
        try {
            const { id } = req.params
            
            if (!isValidObjectId(id)) {
                return response.notFound(res, "Failed find one a KuisCompetancy");
            }
            
                const result = await SaveModel.findByIdAndDelete(id, {new: true})
                response.success(res, result, "Success remove save")
        } catch (error) {
            response.error(res, error, "Failed remove save")
        }
    },

    async findAllByCompetency(req: IReqUser, res: Response) {
        try {
            const { competency } = req.params
            const userId = req.user?.id;

            if (!isValidObjectId(competency)) {
                return response.error(res, null, "save not found");
            }

            const result = await SaveModel.find({ competency, createdBy: userId }).exec();
            response.success(res, result, "Success find save");
        } catch (error) {
            response.error(res, error, "Failed to find save")
        }
    },
    async findAllByUser(req: IReqUser, res: Response) {
        try {
            const userId = req.user?.id;

            const result = await SaveModel.find({ createdBy: userId }).exec();
            response.success(res, result, "Success find save");

        } catch (error) {
            response.error(res, error, "Failed to find save")
        }
    },

}