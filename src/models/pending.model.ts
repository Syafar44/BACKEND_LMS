import mongoose, { ObjectId } from "mongoose";
import * as Yup from "yup";

export const PENDING_MODEL_NAME = "Pending";

const Schema = mongoose.Schema

export const pendingDAO = Yup.object({
    createdBy: Yup.string(),
})

export type TPending = Yup.InferType<typeof pendingDAO>

export interface Pending extends Omit<TPending, "createdBy" > {
    createdBy: ObjectId
}

const PendingScema = new Schema<Pending>({
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: "User",
    },
}, {
    timestamps: true,
})

const PendingModel = mongoose.model(PENDING_MODEL_NAME, PendingScema)

export default PendingModel