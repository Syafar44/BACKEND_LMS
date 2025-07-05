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
      const { userId, month, year, name, email, department } = req.query;

      const filter: any = {};

      // Optional: filter by user
      if (userId) {
        filter.createdBy = userId;
      }

      // Optional: filter by month & year
      if (month && year) {
        filter.date = {
          $regex: `^${year}-${month.toString().padStart(2, "0")}` // e.g. "2025-07"
        };
      }

      const histories = await HistoryLkpModel.find(filter)
        .populate("createdBy", "fullName email department")
        .sort({ date: -1 });

      const filtered = histories.filter((item) => {
        const user = item.createdBy as any;
        return (
          (!name || user.fullName?.toLowerCase().includes((name as string).toLowerCase())) &&
          (!email || user.email?.toLowerCase().includes((email as string).toLowerCase())) &&
          (!department || user.department?.toLowerCase().includes((department as string).toLowerCase()))
        );
      });
      return response.success(res, filtered, "Data history LKP berhasil diambil");
    } catch (error) {
      return response.error(res, error, "Gagal mengambil data history");
    }
  }
};
