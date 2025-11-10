import { Response } from "express";
import { IPaginationQuery, IReqUser } from "../utils/interfaces";
import response from "../utils/response";
import mongoose, { isValidObjectId } from "mongoose";
import UserModel from "../models/user.model";
import ScoreKajianModel, { scoreKajianDAO, TScoreKajian } from "../models/scoreKajian.model";

export default {
    async create(req: IReqUser, res: Response) {
        try {
            const userId = req.user?.id;
            const payload = {...req.body, createdBy: userId} as TScoreKajian
            await scoreKajianDAO.validate(payload)
            const result = await ScoreKajianModel.create(payload)
            response.success(res, result, "Success create Kajian")
        } catch (error) {
            response.error(res, error, "Failed create Kajian")
        }
    },
    async findAll(req: IReqUser, res: Response) {
  const { page = 1, limit = 9999, search, kajian } = req.query as unknown as IPaginationQuery;

  try {
    const match: any = {};

    if (kajian) {
      match["byKajian"] = new mongoose.Types.ObjectId(kajian);
    }

    const pipeline: any[] = [
      { $match: match },

      // Populate SOP/Kajian
      {
        $lookup: {
          from: "kajians",
          localField: "byKajian",
          foreignField: "_id",
          as: "byKajian",
        },
      },
      { $unwind: { path: "$byKajian", preserveNullAndEmptyArrays: true } },

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

    // Search (jKajiana ada keyword)
    if (search) {
      pipeline.push({
        $match: {
          $or: [
            { "byKajian.title": { $regex: search, $options: "i" } },
            { "createdBy.fullName": { $regex: search, $options: "i" } },
          ],
        },
      });
    }

    // Sorting & Pagination
    pipeline.push({ $sort: { createdAt: -1 } });
    pipeline.push({ $skip: (Number(page) - 1) * Number(limit) });
    pipeline.push({ $limit: Number(limit) });

    const result = await ScoreKajianModel.aggregate(pipeline);

    // Count total data (tanpa skip/limit)
    const countPipeline = pipeline.filter(stage =>
      !("$skip" in stage) && !("$limit" in stage) && !("$sort" in stage)
    );
    countPipeline.push({ $count: "total" });

    const countResult = await ScoreKajianModel.aggregate(countPipeline);
    const count = countResult[0]?.total || 0;

    response.pagination(
      res,
      result,
      {
        total: count,
        totalPages: Math.ceil(count / Number(limit)),
        current: Number(page),
      },
      "Success find all Kajian"
    );
  } catch (error) {
    response.error(res, error, "Failed find all Kajian");
  }
},
    async findOne(req: IReqUser, res: Response) {
        try {
            const { id } = req.params
            
            if (!isValidObjectId(id)) {
                return response.notFound(res, "failed find one a Kajian");
            }
            
            const result = await ScoreKajianModel.findById(id)
            response.success(res, result, "Success find a Kajian")
        } catch (error) {
            response.error(res, error, "Failed find a Kajian")
        }
    },
    async remove(req: IReqUser, res: Response) {
        try {
            const { id } = req.params
            
            if (!isValidObjectId(id)) {
                return response.notFound(res, "Failed find one a Kajian");
            }
            
                const result = await ScoreKajianModel.findByIdAndDelete(id, {new: true})
                response.success(res, result, "Success remove Kajian")
        } catch (error) {
            response.error(res, error, "Failed remove Kajian")
        }
    },
    async findAllByKajian(req: IReqUser, res: Response) {
        try {
            const { kajian } = req.params
            const userId = req.user?.id;

            if (!isValidObjectId(kajian)) {
                return response.error(res, null, "Kajian not found");
            }

            const result = await ScoreKajianModel.find({ byKajian: kajian, createdBy: userId }).exec();
            response.success(res, result, "Success find Score");
        } catch (error) {
            response.error(res, error, "Failed to find Score")
        }
    },
    async findAllByUser(req: IReqUser, res: Response) {
        try {
            const userId = req.user?.id;
            const result = await ScoreKajianModel.find({ createdBy: userId }).exec();
            response.success(res, result, "Success find Score");
        } catch (error) {
            response.error(res, error, "Failed to find Score")
        }
    },
    async exportScore(req: IReqUser, res: Response) {
  try {
    const { kajian } = req.query;
    const objectIdKajian = kajian ? new mongoose.Types.ObjectId(String(kajian)) : null;

    const result = await UserModel.aggregate([
      // Ambil semua user
      {
        $lookup: {
          from: "scoreKajians",
          let: { userId: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: { $eq: ["$createdBy", "$$userId"] },
                ...(objectIdKajian ? { byKajian: objectIdKajian } : {}),
              },
            },

            {
              $lookup: {
                from: "kajians", // perbaKajiani nama koleksi (hindari 'sop&Kajians')
                localField: "byKajian",
                foreignField: "_id",
                as: "kajianData",
              },
            },
            { $unwind: { path: "$kajianData", preserveNullAndEmptyArrays: true } },
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
          "scoreData.kajianData.title": 1,
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