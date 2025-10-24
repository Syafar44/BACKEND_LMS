import { Response } from "express";
import { IReqUser } from "../utils/interfaces";

import response from "../utils/response";
import CompletedModel, { completedDAO, TCompleted } from "../models/completed.model";

export default {
    async create(req: IReqUser, res: Response) {
        try {
            const userId = req.user?.id;
            const payload = {...req.body, createdBy: userId} as TCompleted
            await completedDAO.validate(payload)
            const result = await CompletedModel.create(payload)
            response.success(res, result, "Success create pending")
        } catch (error) {
            response.error(res, error, "Failed create pending")
        }
    },
    async findAllByUser(req: IReqUser, res: Response) {
        try {
            const userId = req.user?.id;
            const result = await CompletedModel.find({ createdBy: userId }).exec();
            response.success(res, result, "Success find pending");
        } catch (error) {
            response.error(res, error, "Failed to find pending")
        }
    },
}