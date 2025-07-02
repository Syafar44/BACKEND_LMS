import mongoose, { ObjectId } from "mongoose";
import * as Yup from "yup";

export const LKP_MODEL_NAME = "Lkp";

const Schema = mongoose.Schema

export const lkpDAO = Yup.object({
    createdBy: Yup.string(),
    count: Yup.number().min(0).max(5).default(0),
    date: Yup.string().required(),
})

export type TLkp = Yup.InferType<typeof lkpDAO>

export interface Lkp extends Omit<TLkp, "createdBy" > {
    createdBy: ObjectId
}

const LkpSchema = new Schema<Lkp>({
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

LkpSchema.index({ createdBy: 1, date: 1 }, { unique: true });

const LkpModel = mongoose.models[LKP_MODEL_NAME] || mongoose.model(LKP_MODEL_NAME, LkpSchema);

export default LkpModel;