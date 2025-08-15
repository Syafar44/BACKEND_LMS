import { Response } from "express";
import { IPaginationQuery, IReqUser } from "../utils/interfaces";
import response from "../utils/response";
import { isValidObjectId } from "mongoose";
import ResumeModel, { resumeDAO, TResume } from "../models/resume.model";
import UserModel from "../models/user.model";

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
        const { page = 1, limit = 9999999, search, fullName } = req.query as unknown as IPaginationQuery;
        try {
            const query: any = {};

            const result = await ResumeModel.find(query)
            .populate({
                path: "createdBy",
                select: "fullName",
            })
            .populate({
                path: "kajian",
                select: "title",
            })
            .limit(Number(limit))
            .skip((Number(page) - 1) * Number(limit))
            .sort({ createdAt: -1 })
            .exec();

            const filteredResult = result.filter(item => {
            let matchUser = true;
            let matchKajian = true;

            if (fullName) {
                matchUser =
                    typeof item.createdBy === "object" &&
                    item.createdBy &&
                    "fullName" in item.createdBy &&
                    !!(item.createdBy as { fullName?: string }).fullName?.match(new RegExp(fullName, "i"));
            }

            if (search) {
                matchKajian =
                    typeof item.kajian === "object" &&
                    item.kajian &&
                    "title" in item.kajian &&
                    !!(item.kajian as { title?: string }).title?.match(new RegExp(search, "i"));
            }

            return matchUser && matchKajian;
            });

            const count = filteredResult.length;

            response.pagination(
                res,
                filteredResult,
                {
                    total: count,
                    totalPages: Math.ceil(count / Number(limit)),
                    current: Number(page),
                },
                "Success find all Kuis Competancy"
            );
        } catch (error) {
            response.error(res, error, "Failed find all Kuis Competancy");
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

    async findResumeByKajian(req: IReqUser, res: Response) {
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
            const result = await ResumeModel.find({ createdBy: userId }).exec();
            response.success(res, result, "Success find all product by an category");
        } catch (error) {
            response.error(res, error, "Failed to find all product by an category")
        }
    },
    async exportResume(req: IReqUser, res: Response) {
        try {
            const { search } = req.query;

            const result = await UserModel.aggregate([
                {
                    $lookup: {
                        from: "resumes",
                        let: { userId: "$_id" },
                        pipeline: [
                            {
                                $match: {
                                    $expr: { $eq: ["$createdBy", "$$userId"] }
                                }
                            },
                            {
                                $lookup: {
                                    from: "kajians",
                                    let: { kajianId: "$kajian" },
                                    pipeline: [
                                        {
                                            $match: {
                                                $expr: { $eq: ["$_id", "$$kajianId"] },
                                                ...(search
                                                    ? { title: { $regex: search, $options: "i" } }
                                                    : {})
                                            }
                                        },
                                        { $project: { title: 1 } }
                                    ],
                                    as: "kajianData"
                                }
                            },
                            { $unwind: { path: "$kajianData", preserveNullAndEmptyArrays: true } }
                        ],
                        as: "resumeData"
                    }
                },
                { $unwind: { path: "$resumeData", preserveNullAndEmptyArrays: true } },
                {
                    $addFields: {
                        isFollowed: {
                            $cond: [
                                { $and: [
                                    { $ne: ["$resumeData", null] },
                                    { $ne: ["$resumeData.kajianData", null] }
                                ] },
                                true,
                                false
                            ]
                        }
                    }
                },
                {
                    $project: {
                        fullName: 1,
                        department: 1,
                        kajianTitle: "$resumeData.kajianData.title",
                        resume: "$resumeData.resume",
                        publishDate: "$resumeData.createdAt",
                    }
                },
                { $sort: { fullName: 1 } }
            ]);

            response.success(res, result, "Success export resume data");
        } catch (error) {
            response.error(res, error, "Failed to export resume data");
        }
    },
}