import { Response } from "express";
import { IPaginationQuery, IReqUser } from "../utils/interfaces";

import response from "../utils/response";
import mongoose, { isValidObjectId } from "mongoose";
import ScoreModel, { scoreDAO, TScore } from "../models/score.model";
import UserModel from "../models/user.model";

export default {
    async create(req: IReqUser, res: Response) {
        try {
            const userId = req.user?.id;
            console.log(userId)
            const payload = {...req.body, createdBy: userId} as TScore
            await scoreDAO.validate(payload)
            const result = await ScoreModel.create(payload)
            response.success(res, result, "Success create Kuis Competancy")
        } catch (error) {
            response.error(res, error, "Failed create Kuis Competancy")
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

            const result = await ScoreModel.find(query)
            .populate('createdBy', 'fullName email department')
            .populate({
                path: 'bySubCompetency',
                select: 'title ',
                populate: {
                    path: 'byCompetency',
                    model: 'Competency',
                    select: 'main_competency title '
                }
            })
            .limit(limit)
            .skip((page - 1) * limit)
            .sort({createdAt: -1}).exec()

            const count =  await ScoreModel.countDocuments(query)

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
            
            const result = await ScoreModel.findById(id)
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
            
                const result = await ScoreModel.findByIdAndDelete(id, {new: true})
                response.success(res, result, "Success remove Kuis Competancy")
        } catch (error) {
            response.error(res, error, "Failed remove Kuis Competancy")
        }
    },
    async findAllBySubCompetency(req: IReqUser, res: Response) {
        try {
            const { subCompetency } = req.params
            const userId = req.user?.id;

            if (!isValidObjectId(subCompetency)) {
                return response.error(res, null, "Category not found");
            }

            const result = await ScoreModel.find({ bySubCompetency: subCompetency, createdBy: userId }).exec();
            response.success(res, result, "Success find Score");
        } catch (error) {
            response.error(res, error, "Failed to find Score")
        }
    },
    async findAllByUser(req: IReqUser, res: Response) {
        try {
            const userId = req.user?.id;
            const result = await ScoreModel.find({ createdBy: userId }).exec();
            response.success(res, result, "Success find Score");
        } catch (error) {
            response.error(res, error, "Failed to find Score")
        }
    },
    async exportScore(req: IReqUser, res: Response) {
        try {
        const { competency, subCompetency } = req.query;

        const objectIdCompetency = competency ? new mongoose.Types.ObjectId(String(competency)) : null;
        const objectIdSubCompetency = subCompetency ? new mongoose.Types.ObjectId(String(subCompetency)) : null;

        const result = await UserModel.aggregate([
            {
            $lookup: {
                from: "scores",
                let: { userId: "$_id" },
                pipeline: [
                {
                    $match: {
                    $expr: { $eq: ["$createdBy", "$$userId"] },
                    ...(objectIdSubCompetency ? { bySubCompetency: objectIdSubCompetency } : {}),
                    },
                },
                {
                    $lookup: {
                    from: "subcompetencies",
                    let: { subCompetencyId: "$bySubCompetency" },
                    pipeline: [
                        {
                        $match: {
                            $expr: { $eq: ["$_id", "$$subCompetencyId"] },
                            ...(objectIdCompetency ? { byCompetency: objectIdCompetency } : {}),
                        },
                        },
                        {
                        $lookup: {
                            from: "competencies",
                            localField: "byCompetency",
                            foreignField: "_id",
                            as: "competencyData",
                        },
                        },
                        { $unwind: { path: "$competencyData", preserveNullAndEmptyArrays: true } },
                    ],
                    as: "subCompetencyData",
                    },
                },
                { $unwind: { path: "$subCompetencyData", preserveNullAndEmptyArrays: true } },
                ],
                as: "scoreData",
            },
            },
            {
            $addFields: {
                isDone: { $cond: [{ $gt: [{ $size: "$scoreData" }, 0] }, true, false] },
            },
            },
            {
            $project: {
                fullName: 1,
                email: 1,
                department: 1,
                "scoreData.total_score": 1,
                "scoreData.total_question": 1,
                "scoreData.isPass": 1,
                "scoreData.createdAt": 1,
                "scoreData.subCompetencyData.title": 1,
                "scoreData.subCompetencyData.competencyData.title": 1,
                isDone: 1,
            },
            },
            { $sort: { fullName: 1 } },
        ]);

        response.success(res, result, "Success export score data");
        } catch (error) {
        response.error(res, error, "Failed to export score data");
        }
    },
    async exportFinalScore(req: IReqUser, res: Response) {
        try {
        const { competencyId, mainCompetency } = req.query;

        const objectIdCompetency = competencyId
            ? new mongoose.Types.ObjectId(String(competencyId))
            : null;

        const result = await UserModel.aggregate([
            {
            $lookup: {
                from: "scores",
                let: { userId: "$_id" },
                pipeline: [
                {
                    $match: {
                    $expr: { $eq: ["$createdBy", "$$userId"] },
                    },
                },
                {
                    $lookup: {
                    from: "subcompetencies",
                    localField: "bySubCompetency",
                    foreignField: "_id",
                    as: "subCompetencyData",
                    },
                },
                { $unwind: "$subCompetencyData" },
                {
                    $lookup: {
                    from: "competencies",
                    localField: "subCompetencyData.byCompetency",
                    foreignField: "_id",
                    as: "competencyData",
                    },
                },
                { $unwind: "$competencyData" },
                {
                    $match: {
                    ...(objectIdCompetency ? { "competencyData._id": objectIdCompetency } : {}),
                    ...(mainCompetency
                        ? { "competencyData.main_competency": { $regex: String(mainCompetency), $options: "i" } }
                        : {}),
                    },
                },
                {
                    $project: {
                    total_score: { $toInt: "$total_score" },
                    total_question: { $toInt: "$total_question" },
                    competencyTitle: "$competencyData.title",
                    mainCompetency: "$competencyData.main_competency",
                    },
                },
                ],
                as: "scoreData",
            },
            },
            { $unwind: { path: "$scoreData", preserveNullAndEmptyArrays: true } },
            {
            $group: {
                _id: {
                userId: "$_id",
                competency: "$scoreData.competencyTitle",
                mainCompetency: "$scoreData.mainCompetency",
                },
                fullName: { $first: "$fullName" },
                email: { $first: "$email" },
                department: { $first: "$department" },
                totalScore: { $sum: "$scoreData.total_score" },
                totalQuestion: { $sum: "$scoreData.total_question" },
            },
            },
            {
            $addFields: {
                percentage: {
                $cond: [
                    { $gt: ["$totalQuestion", 0] },
                    { $multiply: [{ $divide: ["$totalScore", "$totalQuestion"] }, 100] },
                    0,
                ],
                },
            },
            },
            {
            $project: {
                fullName: 1,
                email: 1,
                department: 1,
                competency: "$_id.competency",
                mainCompetency: "$_id.mainCompetency",
                percentage: 1,
            },
            },
            { $sort: { fullName: 1 } },
        ]);

        response.success(res, result, "Success export final score data");
        } catch (error) {
        response.error(res, error, "Failed to export final score data");
        }
    },
}