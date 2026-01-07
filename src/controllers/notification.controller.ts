import { Response } from "express";
import { IReqUser } from "../utils/interfaces";
import response from "../utils/response";
import NotificationModel, { notificationDAO, TNotification } from "../models/notification.model";
import { messaging } from "../libs/firebase/admin";

export default {
    async token(req: IReqUser, res: Response) {
        const { token } = req.body;

        try {
            const userId = req.user?.id;
            const payload = { ...req.body, createdBy: userId } as TNotification;

            await notificationDAO.validate(payload);

            const isExists = await NotificationModel.findOne({ token });
            if (isExists) {
                return res.status(200).json({
                    message: "Token already exists",
                    data: isExists,
                });
            }

            const result = await NotificationModel.create(payload);
            response.success(res, result, "Success create token");
        } catch (error) {
            response.error(res, error, "Failed create token");
        }
        },
    async sendNotif(req: IReqUser, res: Response) {
        const { title, body } = req.body;

        try {
            const tokens = await NotificationModel.find().distinct("token");

            const message = {
                data: {
                    title: title || "Hai semuanya! 👋",
                    body: body || "Ini adalah pesan broadcast dari admin.",
                },
            };

            const results = await Promise.allSettled(
                tokens.map((token) =>
                messaging.send({
                    ...message,
                    token,
                })
                )
            );

            const successCount = results.filter((r) => r.status === "fulfilled").length;
            const failCount = results.filter((r) => r.status === "rejected").length;

            return response.success(res, { successCount, failCount }, "Notifikasi berhasil dikirim.");
        } catch (error) {
            return response.error(res, error, "Gagal mengirim notifikasi.");
        }
    },
}