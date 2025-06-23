import mongoose, { ObjectId } from "mongoose";
import * as Yup from "yup";

export const SAVE_MODEL_NAME = "Save";

const Schema = mongoose.Schema

export const saveDAO = Yup.object({
    competency: Yup.string().required(),
    createdBy: Yup.string(),
    workingOn: Yup.boolean(),
})

export type TSave = Yup.InferType<typeof saveDAO>

export interface Save extends Omit<TSave, "competency" | "createdBy" > {
    competency: ObjectId
    createdBy: ObjectId
}

const CompetencyScema = new Schema<Save>({
    competency: {
        type: Schema.Types.ObjectId,
        ref: "Competency",
        required: true,
    },
    workingOn: {
        type: Schema.Types.Boolean,
        required: true,
    },
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: "User",
    },
}, {
    timestamps: true,
})

const SaveModel = mongoose.model(SAVE_MODEL_NAME, CompetencyScema)

export default SaveModel