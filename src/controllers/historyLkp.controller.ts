import { Response } from "express";
import LkpModel from "../models/lkp.model";
import HistoryLkpModel from "../models/historyLkp.model";
import dayjs from "dayjs";
import response from "../utils/response";

export default {
  async rekapHarian(_req: any, res: Response) {
    try {
      const yesterday = dayjs().subtract(1, "day").format("YYYY-MM-DD");

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
  }
};
