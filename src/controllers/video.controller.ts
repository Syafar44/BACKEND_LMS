import { Response } from "express";
import { IPaginationQuery, IReqUser } from "../utils/interfaces";

import response from "../utils/response";
import { isValidObjectId } from "mongoose";
import VideoModel, { videoDAO, TVideo } from "../models/video.model";

export default {
    async create(req: IReqUser, res: Response) {
        try {
            const userId = req.user?.id;
            console.log(userId)
            const payload = {...req.body, createdBy: userId} as TVideo
            await videoDAO.validate(payload)
            const result = await VideoModel.create(payload)
            response.success(res, result, "Success create histori video")
        } catch (error) {
            response.error(res, error, "Failed create histori video")
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

            const result = await VideoModel.find(query).limit(limit).skip((page - 1) * limit).sort({createdAt: -1}).exec()
            const count =  await VideoModel.countDocuments(query)

            response.pagination(res, result, {
                total: count,
                totalPages: Math.ceil(count / limit),
                current: page,
            }, "Success find all histori video")
        } catch (error) {
            response.error(res, error, "Failed find all histori video")
        }
    },
    async findOne(req: IReqUser, res: Response) {
        try {
            const { id } = req.params
            
            if (!isValidObjectId(id)) {
                return response.notFound(res, "failed find one a histori video");
            }
            
            const result = await VideoModel.findById(id)
            response.success(res, result, "Success find a histori video")
        } catch (error) {
            response.error(res, error, "Failed find a histori video")
        }
    },
    async update(req: IReqUser, res: Response) {
        try {
            try {
                const { id } = req.params
                
                if (!isValidObjectId(id)) {
                    return response.notFound(res, "failed find one a histori video");
                }
                
                const result = await VideoModel.findByIdAndUpdate(id, req.body, {
                    new: true
                })
                response.success(res, result, "Success update histori video")
            } catch (error) {
                response.error(res, error, "Failed update histori video")
            }
        } catch (error) {
            response.error(res, error, "Failed update histori video")
        }
    },
    async remove(req: IReqUser, res: Response) {
        try {
            const { id } = req.params
            
            if (!isValidObjectId(id)) {
                return response.notFound(res, "Failed find one a KuisCompetancy");
            }
            
                const result = await VideoModel.findByIdAndDelete(id, {new: true})
                response.success(res, result, "Success remove histori video")
        } catch (error) {
            response.error(res, error, "Failed remove histori video")
        }
    },

    async findAllBySubCompetency(req: IReqUser, res: Response) {
        try {
            const { subCompetency } = req.params
            const userId = req.user?.id;

            if (!isValidObjectId(subCompetency)) {
                return response.error(res, null, "Category not found");
            }

            const result = await VideoModel.findOne({ bySubCompetency: subCompetency, createdBy: userId }).exec();
            response.success(res, result, "Success find all product by an category");
        } catch (error) {
            response.error(res, error, "Failed to find all product by an category")
        }
    },
}