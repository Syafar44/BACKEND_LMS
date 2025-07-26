import { Response } from "express";
import { IReqUser } from "../utils/interfaces";

import response from "../utils/response";
import LkpSunnahModel, { lkpSunnahDAO, TLkpSunnah } from "../models/lkpSunnah.model";
import dayjs from "dayjs";

export default {
    async mark(req: IReqUser, res: Response) {
        try {
            const userId = req.user?.id;
            if (!userId) return response.error(res, null, "User tidak terautentikasi");

            const date = dayjs().format("YYYY-MM-DD");

            // Cek apakah user sudah mengisi absensi hari ini
            const existing = await LkpSunnahModel.findOne({ createdBy: userId, date });
            if (existing) {
                return response.error(res, null, "Kamu sudah mengisi ibadah sunnah hari ini.");
            }

            const payload = { ...req.body, createdBy: userId, date } as TLkpSunnah;
            await lkpSunnahDAO.validate(payload);

            const result = await LkpSunnahModel.create(payload);

            return response.success(res, result, "Ibadah sunnah berhasil disimpan");
        } catch (error) {
            return response.error(res, error, "Gagal menyimpan ibadah sunnah");
        }
    },
    async getLkpByUser(req: IReqUser, res: Response) {
        try {
            const userId = req.user?.id;
            if (!userId) return response.error(res, null, "User tidak terautentikasi");

            const date = dayjs().format("YYYY-MM-DD");

            const result = await LkpSunnahModel.findOne({ createdBy: userId, date }).lean();

            response.success(res, result, "Success mendapatkan ibadah sunnah");
        } catch (error) {
            response.error(res, error, "Failed mendapatkan ibadah sunnah");
        }
    },
    async getAllHistory(req: IReqUser, res: Response) {
        try {
          const { page = 1, limit = 10, search, month, year, userId, department } = req.query as unknown as {
            page?: number;
            limit?: number;
            search?: string;
            month?: string;
            year?: string;
            userId?: string;
            department?: string;
          };
    
          const query: any = {};
    
          // Filter tanggal berdasarkan bulan & tahun
          if (month && year) {
            query.date = { $regex: `^${year}-${month.toString().padStart(2, "0")}` };
          }
    
          // Filter berdasarkan userId
          if (userId) {
            query.createdBy = userId;
          }
    
          // Query data
          const histories = await LkpSunnahModel.find(query)
            .populate("createdBy", "fullName email department")
            .sort({ date: -1 })
            .limit(Number(limit))
            .skip((Number(page) - 1) * Number(limit))
            .exec();
    
          // Filter tambahan pakai search, nama, email, department (kalau diinginkan)
          const filtered = histories.filter((item) => {
            const user = item.createdBy as any;
            return (
              (!search || user.fullName?.toLowerCase().includes(search.toLowerCase()) || user.email?.toLowerCase().includes(search.toLowerCase())) &&
              (!department || user.department?.toLowerCase().includes(department.toLowerCase()))
            );
          });
    
          const count = await LkpSunnahModel.countDocuments(query);
    
          response.pagination(res, filtered, {
            total: count,
            totalPages: Math.ceil(count / Number(limit)),
            current: Number(page),
          }, "Data history LKP berhasil diambil");
        } catch (error) {
          response.error(res, error, "Gagal mengambil data history");
        }
      }
};
