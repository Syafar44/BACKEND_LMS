import { Response } from "express";
import { IReqUser } from "../utils/interfaces";

import response from "../utils/response";
import LkpModel, { lkpDAO, TLkp } from "../models/lkp.model";
import dayjs from "dayjs";

export default {
    async mark(req: IReqUser, res: Response) {
        try {
            const userId = req.user?.id;
            if (!userId) return response.error(res, null, "User tidak terautentikasi");

            const date = dayjs().subtract(1, "day").format("YYYY-MM-DD");

            // Cek apakah user sudah mengisi absensi hari ini
            const existing = await LkpModel.findOne({ createdBy: userId, date });
            if (existing) {
                return response.error(res, null, "Kamu sudah mengisi absensi hari ini.");
            }

            const payload = { ...req.body, createdBy: userId, date } as TLkp;
            await lkpDAO.validate(payload);

            const result = await LkpModel.create(payload);

            return response.success(res, result, "Absensi sholat berhasil disimpan");
        } catch (error) {
            return response.error(res, error, "Gagal menyimpan absensi");
        }
    },
    async getLkpByUser(req: IReqUser, res: Response) {
        try {
            const userId = req.user?.id;
            if (!userId) return response.error(res, null, "User tidak terautentikasi");

            const date = dayjs().subtract(1, "day").format("YYYY-MM-DD");

            const result = await LkpModel.findOne({ createdBy: userId, date }).lean();

            response.success(res, result, "Success mendapatkan absensi");
        } catch (error) {
            response.error(res, error, "Failed mendapatkan absensi");
        }
    },
    async getAllHistory(req: IReqUser, res: Response) {
      try {
        const { 
          page = 1, 
          limit = 9999999, 
          search, 
          month, 
          year, 
          department 
        } = req.query as unknown as {
          page?: number;
          limit?: number;
          search?: string;
          month?: string;
          year?: string;
          department?: string;
        };

        const matchStage: any = {};

        // Filter tanggal berdasarkan bulan & tahun
        if (month && year) {
          matchStage.date = { $regex: `^${year}-${month.toString().padStart(2, "0")}` };
        }

        const pipeline: any[] = [
          { $match: matchStage },
          {
            $lookup: {
              from: "users", // nama collection user
              localField: "createdBy",
              foreignField: "_id",
              as: "createdBy",
            },
          },
          { $unwind: "$createdBy" },
        ];

        // Filter langsung berdasarkan fullName, email, department
        if (search || department) {
          const andConditions: any[] = [];
          if (search) {
            andConditions.push({
              $or: [
                { "createdBy.fullName": { $regex: search, $options: "i" } },
                { "createdBy.email": { $regex: search, $options: "i" } },
              ],
            });
          }
          if (department) {
            andConditions.push({
              "createdBy.department": { $regex: department, $options: "i" },
            });
          }
          pipeline.push({ $match: { $and: andConditions } });
        }

        // Sort + Pagination
        pipeline.push(
          { $sort: { date: -1 } },
          { $skip: (Number(page) - 1) * Number(limit) },
          { $limit: Number(limit) }
        );

        const histories = await LkpModel.aggregate(pipeline);

        // Hitung total data
        const totalPipeline = pipeline.filter(
          stage => !("$skip" in stage || "$limit" in stage || "$sort" in stage)
        );
        totalPipeline.push({ $count: "total" });
        const totalCountResult = await LkpModel.aggregate(totalPipeline);
        const count = totalCountResult[0]?.total || 0;

        response.pagination(res, histories, {
          total: count,
          totalPages: Math.ceil(count / Number(limit)),
          current: Number(page),
        }, "Data history LKP berhasil diambil");

      } catch (error) {
        response.error(res, error, "Gagal mengambil data history");
      }
    }
};
