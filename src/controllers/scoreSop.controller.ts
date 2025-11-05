import { Response } from "express";
import { IPaginationQuery, IReqUser } from "../utils/interfaces";
import response from "../utils/response";
import mongoose, { isValidObjectId } from "mongoose";
import UserModel from "../models/user.model";
import ScoreSopModel, { scoreSopDAO, TScoreSop } from "../models/scoreSop.model";

export default {
    async create(req: IReqUser, res: Response) {
        try {
            const userId = req.user?.id;
            console.log(userId)
            const payload = {...req.body, createdBy: userId} as TScoreSop
            await scoreSopDAO.validate(payload)
            const result = await ScoreSopModel.create(payload)
            response.success(res, result, "Success create SOP")
        } catch (error) {
            response.error(res, error, "Failed create SOP")
        }
    },
    async findAll(req: IReqUser, res: Response) {
  const { page = 1, limit = 9999, search, sop } = req.query as unknown as IPaginationQuery;

  try {
    const match: any = {};

    if (sop) {
      match["bySop"] = new mongoose.Types.ObjectId(sop);
    }

    const pipeline: any[] = [
      { $match: match },

      // Populate SOP/IK
      {
        $lookup: {
          from: "sops",
          localField: "bySop",
          foreignField: "_id",
          as: "bySop",
        },
      },
      { $unwind: { path: "$bySop", preserveNullAndEmptyArrays: true } },

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
            { "bySop.title": { $regex: search, $options: "i" } },
            { "createdBy.fullName": { $regex: search, $options: "i" } },
          ],
        },
      });
    }

    // Sorting & Pagination
    pipeline.push({ $sort: { createdAt: -1 } });
    pipeline.push({ $skip: (Number(page) - 1) * Number(limit) });
    pipeline.push({ $limit: Number(limit) });

    const result = await ScoreSopModel.aggregate(pipeline);

    // Count total data (tanpa skip/limit)
    const countPipeline = pipeline.filter(stage =>
      !("$skip" in stage) && !("$limit" in stage) && !("$sort" in stage)
    );
    countPipeline.push({ $count: "total" });

    const countResult = await ScoreSopModel.aggregate(countPipeline);
    const count = countResult[0]?.total || 0;

    response.pagination(
      res,
      result,
      {
        total: count,
        totalPages: Math.ceil(count / Number(limit)),
        current: Number(page),
      },
      "Success find all SOP"
    );
  } catch (error) {
    response.error(res, error, "Failed find all SOP");
  }
},
    async findOne(req: IReqUser, res: Response) {
        try {
            const { id } = req.params
            
            if (!isValidObjectId(id)) {
                return response.notFound(res, "failed find one a SOP");
            }
            
            const result = await ScoreSopModel.findById(id)
            response.success(res, result, "Success find a SOP")
        } catch (error) {
            response.error(res, error, "Failed find a SOP")
        }
    },
    async remove(req: IReqUser, res: Response) {
        try {
            const { id } = req.params
            
            if (!isValidObjectId(id)) {
                return response.notFound(res, "Failed find one a SOP");
            }
            
                const result = await ScoreSopModel.findByIdAndDelete(id, {new: true})
                response.success(res, result, "Success remove SOP")
        } catch (error) {
            response.error(res, error, "Failed remove SOP")
        }
    },
    async findAllBySop(req: IReqUser, res: Response) {
        try {
            const { sop } = req.params
            const userId = req.user?.id;

            if (!isValidObjectId(sop)) {
                return response.error(res, null, "SOP not found");
            }

            const result = await ScoreSopModel.find({ bySop: sop, createdBy: userId }).exec();
            response.success(res, result, "Success find Score");
        } catch (error) {
            response.error(res, error, "Failed to find Score")
        }
    },
    async findAllByUser(req: IReqUser, res: Response) {
        try {
            const userId = req.user?.id;
            const result = await ScoreSopModel.find({ createdBy: userId }).exec();
            response.success(res, result, "Success find Score");
        } catch (error) {
            response.error(res, error, "Failed to find Score")
        }
    },
    async exportScore(req: IReqUser, res: Response) {
  try {
    const { sop } = req.query;
    const objectIdSop = sop ? new mongoose.Types.ObjectId(String(sop)) : null;

    const result = await UserModel.aggregate([
      // Ambil semua user
      {
        $lookup: {
          from: "scoresops",
          let: { userId: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: { $eq: ["$createdBy", "$$userId"] },
                ...(objectIdSop ? { bySop: objectIdSop } : {}),
              },
            },

            {
              $lookup: {
                from: "sops", // perbaiki nama koleksi (hindari 'sop&iks')
                localField: "bySop",
                foreignField: "_id",
                as: "sopData",
              },
            },
            { $unwind: { path: "$sopData", preserveNullAndEmptyArrays: true } },
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
          "scoreData.sopData.title": 1,
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