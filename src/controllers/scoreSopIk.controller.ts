import { Response } from "express";
import { IPaginationQuery, IReqUser } from "../utils/interfaces";
import response from "../utils/response";
import mongoose, { isValidObjectId } from "mongoose";
import UserModel from "../models/user.model";
import ScoreSopIkModel, { scoreSopIkDAO, TScoreSopIk } from "../models/scoreSopIk.model";

export default {
    async create(req: IReqUser, res: Response) {
      try {
        const userId = req.user?.id;

        if (!userId) {
          return response.unauthorized(res, "Unauthorized");
        }

        const payload = {
          ...req.body,
          createdBy: userId,
        } as TScoreSopIk;

        await scoreSopIkDAO.validate(payload);
        const result = await ScoreSopIkModel.create(payload);

        response.success(res, result, "Success create SOP & IK");
      } catch (error) {
        response.error(res, error, "Failed create SOP & IK");
      }
    },
    async findAll(req: IReqUser, res: Response) {
      const { page = 1, limit = 9999, search, sopIk } = req.query as unknown as IPaginationQuery;

      try {
        const match: any = {};

        if (sopIk) {
          match["bySopIk"] = new mongoose.Types.ObjectId(sopIk);
        }

        const pipeline: any[] = [
          { $match: match },

          // Populate SOP/IK
          {
            $lookup: {
              from: "sop&iks",
              localField: "bySopIk",
              foreignField: "_id",
              as: "bySopIk",
            },
          },
          { $unwind: { path: "$bySopIk", preserveNullAndEmptyArrays: true } },

          // Populate CreatedBy
          {
            $lookup: {
              from: "users",
              localField: "createdBy",
              foreignField: "_id",
              as: "createdBy",
            },
          },
          { $unwind: { path: "$createdBy", preserveNullAndEmptyArrays: true } },
        ];

        // Search (jika ada keyword)
        if (search) {
          pipeline.push({
            $match: {
              $or: [
                { "bySopIk.title": { $regex: search, $options: "i" } },
                { "createdBy.fullName": { $regex: search, $options: "i" } },
              ],
            },
          });
        }

        // Sorting & Pagination
        pipeline.push({ $sort: { createdAt: -1 } });
        pipeline.push({ $skip: (Number(page) - 1) * Number(limit) });
        pipeline.push({ $limit: Number(limit) });

        const result = await ScoreSopIkModel.aggregate(pipeline);

        // Count total data (tanpa skip/limit)
        const countPipeline = pipeline.filter(stage =>
          !("$skip" in stage) && !("$limit" in stage) && !("$sort" in stage)
        );
        countPipeline.push({ $count: "total" });

        const countResult = await ScoreSopIkModel.aggregate(countPipeline);
        const count = countResult[0]?.total || 0;

        response.pagination(
          res,
          result,
          {
            total: count,
            totalPages: Math.ceil(count / Number(limit)),
            current: Number(page),
          },
          "Success find all SOP & IK"
        );
      } catch (error) {
        response.error(res, error, "Failed find all SOP & IK");
      }
    },
    async findOne(req: IReqUser, res: Response) {
        try {
            const { id } = req.params
            
            if (!isValidObjectId(id)) {
                return response.notFound(res, "failed find one a SOP & IK");
            }
            
            const result = await ScoreSopIkModel.findById(id)
            response.success(res, result, "Success find a SOP & IK")
        } catch (error) {
            response.error(res, error, "Failed find a SOP & IK")
        }
    },
    async remove(req: IReqUser, res: Response) {
        try {
            const { id } = req.params
            
            if (!isValidObjectId(id)) {
                return response.notFound(res, "Failed find one a SOP & IK");
            }
            
                const result = await ScoreSopIkModel.findByIdAndDelete(id, {new: true})
                response.success(res, result, "Success remove SOP & IK")
        } catch (error) {
            response.error(res, error, "Failed remove SOP & IK")
        }
    },
    async findAllBySopIk(req: IReqUser, res: Response) {
        try {
            const { sopIk } = req.params
            const userId = req.user?.id;

            if (!isValidObjectId(sopIk)) {
                return response.error(res, null, "Category not found");
            }

            const result = await ScoreSopIkModel.find({ bySopIk: sopIk, createdBy: userId }).exec();
            response.success(res, result, "Success find Score");
        } catch (error) {
            response.error(res, error, "Failed to find Score")
        }
    },
    async findAllByUser(req: IReqUser, res: Response) {
        try {
            const userId = req.user?.id;
            const result = await ScoreSopIkModel.find({ createdBy: userId }).exec();
            response.success(res, result, "Success find Score");
        } catch (error) {
            response.error(res, error, "Failed to find Score")
        }
    },
    async exportScore(req: IReqUser, res: Response) {
  try {
    const { sopik } = req.query;
    const objectIdSopIk = sopik ? new mongoose.Types.ObjectId(String(sopik)) : null;

    const result = await UserModel.aggregate([
      // Ambil semua user
      {
        $lookup: {
          from: "scoresopiks",
          let: { userId: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: { $eq: ["$createdBy", "$$userId"] },
                ...(objectIdSopIk ? { bySopIk: objectIdSopIk } : {}),
              },
            },

            {
              $lookup: {
                from: "sop&iks", // perbaiki nama koleksi (hindari 'sop&iks')
                localField: "bySopIk",
                foreignField: "_id",
                as: "sopIkData",
              },
            },
            { $unwind: { path: "$sopIkData", preserveNullAndEmptyArrays: true } },
          ],
          as: "scoreData",
        },
      },

      // Tambahkan flag apakah user sudah mengisi skor
      {
        $addFields: {
          isDone: { $gt: [{ $size: "$scoreData" }, 0] },
        },
      },

      // Pilih field yang ingin diexport
      {
        $project: {
          fullName: 1,
          email: 1,
          department: 1,
          "scoreData.total_score": 1,
          "scoreData.total_question": 1,
          "scoreData.isPass": 1,
          "scoreData.createdAt": 1,
          "scoreData.sopIkData.title": 1,
          isDone: 1,
        },
      },

      { $sort: { fullName: 1 } },
    ]);

    response.success(res, result, "Success export score data");
  } catch (error) {
    response.error(res, error, "Failed to export score data");
  }
}

}