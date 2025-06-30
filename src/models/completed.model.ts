import mongoose, { ObjectId } from "mongoose";
import * as Yup from "yup";

export const COMPLETED_MODEL_NAME = "Completed";

const Schema = mongoose.Schema

export const completedDAO = Yup.object({
    competency: Yup.string().required(),
    createdBy: Yup.string(),
})

export type TCompleted = Yup.InferType<typeof completedDAO>

export interface Completed extends Omit<TCompleted, "competency" | "createdBy" > {
    competency: ObjectId
    createdBy: ObjectId
}

const CompletedScema = new Schema<Completed>({
    competency: {
        type: Schema.Types.ObjectId,
        ref: "Competency",
        required: true,
    },
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: "User",
    },
}, {
    timestamps: true,
})

const CompletedModel = mongoose.model(COMPLETED_MODEL_NAME, CompletedScema)

export default CompletedModel