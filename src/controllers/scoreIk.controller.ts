import { Response } from "express";
import { IPaginationQuery, IReqUser } from "../utils/interfaces";
import response from "../utils/response";
import mongoose, { isValidObjectId } from "mongoose";
import UserModel from "../models/user.model";
import ScoreIkModel, { scoreIkDAO, TScoreIk } from "../models/scoreIk.model";

export default {
    async create(req: IReqUser, res: Response) {
      try {
        const userId = req.user?.id;

        if (!userId) {
          return response.unauthorized(res, "Unauthorized: user not authenticated");
        }

        const payload = {
          ...req.body,
          createdBy: userId,
        } as TScoreIk;

        await scoreIkDAO.validate(payload);

        const result = await ScoreIkModel.create(payload);

        response.success(res, result, "Success create IK");
      } catch (error) {
        response.error(res, error, "Failed create IK");
      }
    },
    async findAll(req: IReqUser, res: Response) {
  const { page = 1, limit = 9999, search, ik } = req.query as unknown as IPaginationQuery;

  try {
    const match: any = {};

    if (ik) {
      match["byIk"] = new mongoose.Types.ObjectId(ik);
    }

    const pipeline: any[] = [
      { $match: match },

      // Populate SOP/IK
      {
        $lookup: {
          from: "iks",
          localField: "byIk",
          foreignField: "_id",
          as: "byIk",
        },
      },
      { $unwind: { path: "$byIk", preserveNullAndEmptyArrays: true } },

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
            { "byIk.title": { $regex: search, $options: "i" } },
            { "createdBy.fullName": { $regex: search, $options: "i" } },
          ],
        },
      });
    }

    // Sorting & Pagination
    pipeline.push({ $sort: { createdAt: -1 } });
    pipeline.push({ $skip: (Number(page) - 1) * Number(limit) });
    pipeline.push({ $limit: Number(limit) });

    const result = await ScoreIkModel.aggregate(pipeline);

    // Count total data (tanpa skip/limit)
    const countPipeline = pipeline.filter(stage =>
      !("$skip" in stage) && !("$limit" in stage) && !("$sort" in stage)
    );
    countPipeline.push({ $count: "total" });

    const countResult = await ScoreIkModel.aggregate(countPipeline);
    const count = countResult[0]?.total || 0;

    response.pagination(
      res,
      result,
      {
        total: count,
        totalPages: Math.ceil(count / Number(limit)),
        current: Number(page),
      },
      "Success find all IK"
    );
  } catch (error) {
    response.error(res, error, "Failed find all IK");
  }
},
    async findOne(req: IReqUser, res: Response) {
        try {
            const { id } = req.params
            
            if (!isValidObjectId(id)) {
                return response.notFound(res, "failed find one a IK");
            }
            
            const result = await ScoreIkModel.findById(id)
            response.success(res, result, "Success find a IK")
        } catch (error) {
            response.error(res, error, "Failed find a IK")
        }
    },
    async remove(req: IReqUser, res: Response) {
        try {
            const { id } = req.params
            
            if (!isValidObjectId(id)) {
                return response.notFound(res, "Failed find one a IK");
            }
            
                const result = await ScoreIkModel.findByIdAndDelete(id, {new: true})
                response.success(res, result, "Success remove IK")
        } catch (error) {
            response.error(res, error, "Failed remove IK")
        }
    },
    async findAllByIk(req: IReqUser, res: Response) {
        try {
            const { ik } = req.params
            const userId = req.user?.id;

            if (!isValidObjectId(ik)) {
                return response.error(res, null, "IK not found");
            }

            const result = await ScoreIkModel.find({ byIk: ik, createdBy: userId }).exec();
            response.success(res, result, "Success find Score");
        } catch (error) {
            response.error(res, error, "Failed to find Score")
        }
    },
    async findAllByUser(req: IReqUser, res: Response) {
        try {
            const userId = req.user?.id;
            const result = await ScoreIkModel.find({ createdBy: userId }).exec();
            response.success(res, result, "Success find Score");
        } catch (error) {
            response.error(res, error, "Failed to find Score")
        }
    },
    async exportScore(req: IReqUser, res: Response) {
  try {
    const { ik } = req.query;
    const objectIdIk = ik ? new mongoose.Types.ObjectId(String(ik)) : null;

    const result = await UserModel.aggregate([
      // Ambil semua user
      {
        $lookup: {
          from: "scoreiks",
          let: { userId: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: { $eq: ["$createdBy", "$$userId"] },
                ...(objectIdIk ? { byIk: objectIdIk } : {}),
              },
            },

            {
              $lookup: {
                from: "iks", // perbaiki nama koleksi (hindari 'sop&iks')
                localField: "byIk",
                foreignField: "_id",
                as: "ikData",
              },
            },
            { $unwind: { path: "$ikData", preserveNullAndEmptyArrays: true } },
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
          "scoreData.ikData.title": 1,
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