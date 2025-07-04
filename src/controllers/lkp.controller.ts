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

            const date = dayjs().format("YYYY-MM-DD");

            const payload = { ...req.body, createdBy: userId, date } as TLkp;
            await lkpDAO.validate(payload);

            const result = await LkpModel.findOneAndUpdate(
                { createdBy: userId, date },
                { $set: payload },
                { upsert: true, new: true }
            );

            return response.success(res, result, "Absensi sholat berhasil disimpan");
        } catch (error) {
            return response.error(res, error, "Gagal menyimpan absensi");
        }
    },
    async getLkpByUser(req: IReqUser, res: Response) {
        try {
            const userId = req.user?.id;
            if (!userId) return response.error(res, null, "User tidak terautentikasi");

            const date = dayjs().format("YYYY-MM-DD");

            const result = await LkpModel.findOne({ createdBy: userId, date }).lean();

            response.success(res, result, "Success mendapatkan absensi");
        } catch (error) {
            response.error(res, error, "Failed mendapatkan absensi");
        }
    },
};
