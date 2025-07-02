import mongoose, { ObjectId } from "mongoose";
import * as Yup from "yup";

export const HISTORYLKP_MODEL_NAME = "HistoryLkp";

const Schema = mongoose.Schema

export const historyLkpDAO = Yup.object({
    createdBy: Yup.string(),
    count: Yup.number().min(0).max(5).default(0),
    date: Yup.string().required(),
})

export type THistoryLkp = Yup.InferType<typeof historyLkpDAO>

export interface HistoryLkp extends Omit<THistoryLkp, "createdBy" > {
    createdBy: ObjectId
}

const HistoryLkpSchema = new Schema<HistoryLkp>({
    count: {
        type: Schema.Types.Number,
        default: 0
    },
    date: {
        type: Schema.Types.String,
        required: true,
    },
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: "User",
    },
}, {
    timestamps: true,
})

HistoryLkpSchema.index({ createdBy: 1, date: 1 }, { unique: true });

const HistoryLkpModel = mongoose.models[HISTORYLKP_MODEL_NAME] || mongoose.model(HISTORYLKP_MODEL_NAME, HistoryLkpSchema);

export default HistoryLkpModel;
