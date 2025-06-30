import { Response } from "express";
import { IPaginationQuery, IReqUser } from "../utils/interfaces";

import response from "../utils/response";
import { isValidObjectId } from "mongoose";
import PendingModel, { pendingDAO, TPending } from "../models/pending.model";

export default {
    async create(req: IReqUser, res: Response) {
        try {
            const userId = req.user?.id;
            const payload = {...req.body, createdBy: userId} as TPending
            await pendingDAO.validate(payload)
            const result = await PendingModel.create(payload)
            response.success(res, result, "Success create pending")
        } catch (error) {
            response.error(res, error, "Failed create pending")
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

            const result = await PendingModel.find(query).limit(limit).skip((page - 1) * limit).sort({createdAt: -1}).exec()
            const count =  await PendingModel.countDocuments(query)

            response.pagination(res, result, {
                total: count,
                totalPages: Math.ceil(count / limit),
                current: page,
            }, "Success find all pending")
        } catch (error) {
            response.error(res, error, "Failed find all pending")
        }
    },
    async remove(req: IReqUser, res: Response) {
        try {
            const { id } = req.params
            
            if (!isValidObjectId(id)) {
                return response.notFound(res, "Failed find one a KuisCompetancy");
            }
            
                const result = await PendingModel.findByIdAndDelete(id, {new: true})
                response.success(res, result, "Success remove pending")
        } catch (error) {
            response.error(res, error, "Failed remove pending")
        }
    },
    async findByUser(req: IReqUser, res: Response) {
        try {
            const userId = req.user?.id;
            const result = await PendingModel.findOne({ createdBy: userId }).exec();
            response.success(res, result, "Success find pending");
        } catch (error) {
            response.error(res, error, "Failed to find pending")
        }
    },

}