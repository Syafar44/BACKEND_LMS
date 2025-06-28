import { Response } from "express";
import { IPaginationQuery, IReqUser } from "../utils/interfaces";
import response from "../utils/response";
import { isValidObjectId } from "mongoose";
import ResumeModel, { resumeDAO, TResume } from "../models/resume.model";

export default {
    async create(req: IReqUser, res: Response) {
        try {
            const userId = req.user?.id;
            console.log(userId)
            const payload = {...req.body, createdBy: userId} as TResume
            await resumeDAO.validate(payload)
            const result = await ResumeModel.create(payload)
            response.success(res, result, "Success create Kuis Competancy")
        } catch (error) {
            response.error(res, error, "Failed create Kuis Competancy")
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

            const result = await ResumeModel.find(query).limit(limit).skip((page - 1) * limit).sort({createdAt: -1}).exec()
            const count =  await ResumeModel.countDocuments(query)

            response.pagination(res, result, {
                total: count,
                totalPages: Math.ceil(count / limit),
                current: page,
            }, "Success find all Kuis Competancy")
        } catch (error) {
            response.error(res, error, "Failed find all Kuis Competancy")
        }
    },
    async findOne(req: IReqUser, res: Response) {
        try {
            const { id } = req.params
            
            if (!isValidObjectId(id)) {
                return response.notFound(res, "failed find one a Kuis Competancy");
            }
            
            const result = await ResumeModel.findById(id)

            response.success(res, result, "Success find a Kuis Competancy")
        } catch (error) {
            response.error(res, error, "Failed find a Kuis Competancy")
        }
    },
    async update(req: IReqUser, res: Response) {
        try {
            try {
                const { id } = req.params
                
                if (!isValidObjectId(id)) {
                    return response.notFound(res, "failed find one a Kuis Competancy");
                }
                
                const result = await ResumeModel.findByIdAndUpdate(id, req.body, {

                    new: true
                })
                response.success(res, result, "Success update Kuis Competancy")
            } catch (error) {
                response.error(res, error, "Failed update Kuis Competancy")
            }
        } catch (error) {
            response.error(res, error, "Failed update Kuis Competancy")
        }
    },
    async remove(req: IReqUser, res: Response) {
        try {
            const { id } = req.params
            
            if (!isValidObjectId(id)) {
                return response.notFound(res, "Failed find one a KuisCompetancy");
            }
            
                const result = await ResumeModel.findByIdAndDelete(id, {new: true})
                response.success(res, result, "Success remove Kuis Competancy")
        } catch (error) {
            response.error(res, error, "Failed remove Kuis Competancy")
        }
    },

    async findAllByKajian(req: IReqUser, res: Response) {
        try {
            const { kajian } = req.params
            const userId = req.user?.id;

            if (!isValidObjectId(kajian)) {
                return response.error(res, null, "Category not found");
            }

            const result = await ResumeModel.findOne({ kajian: kajian, createdBy: userId }).exec();
            response.success(res, result, "Success find all product by an category");
        } catch (error) {
            response.error(res, error, "Failed to find all product by an category")
        }
    },
    async findAllByUser(req: IReqUser, res: Response) {
        try {
            const userId = req.user?.id;
            const result = await ResumeModel.findOne({ createdBy: userId }).exec();
            response.success(res, result, "Success find all product by an category");
        } catch (error) {
            response.error(res, error, "Failed to find all product by an category")
        }
    },
}