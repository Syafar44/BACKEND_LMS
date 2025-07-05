import { Response } from "express";
import HistoryLkpModel from "../models/historyLkp.model";
import dayjs from "dayjs";
import response from "../utils/response";
import { IReqUser } from "../utils/interfaces";
import LkpModel from "../models/lkp.model";

export default {
  async rekapHarian(_req: IReqUser, res: Response) {
    try {
      const yesterday = dayjs().subtract(1, "day").format("YYYY-MM-DD"); // 0 nya nanti di ganti dulu menjadi 1

      const lkps = await LkpModel.find({ date: yesterday });

      if (!lkps.length) {
        return response.success(res, [], "Tidak ada data yang direkap");
      }

      const inserted = await HistoryLkpModel.insertMany(
        lkps.map(item => ({
          createdBy: item.createdBy,
          date: item.date,
          subuh: item.subuh,
          dzuhur: item.dzuhur,
          ashar: item.ashar,
          magrib: item.magrib,
          isya: item.isya,
        })),
        { ordered: false }
      );

      await LkpModel.deleteMany({ date: yesterday });

      return response.success(res, inserted, "Rekap harian berhasil dipindahkan ke HistoryLkp");
    } catch (error) {
      return response.error(res, error, "Gagal memproses rekap harian");
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
      const histories = await HistoryLkpModel.find(query)
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

      const count = await HistoryLkpModel.countDocuments(query);

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
