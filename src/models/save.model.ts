import mongoose, { ObjectId } from "mongoose";
import * as Yup from "yup";

export const SAVE_MODEL_NAME = "Save";

const Schema = mongoose.Schema

export const saveDAO = Yup.object({
    subcompetency: Yup.string().required(),
    createdBy: Yup.string(),
    workingOn: Yup.boolean(),
    progress: Yup.number().required()
})

export type TSave = Yup.InferType<typeof saveDAO>

export interface Save extends Omit<TSave, "subcompetency" | "createdBy" > {
    subcompetency: ObjectId
    createdBy: ObjectId
}

const SaveScema = new Schema<Save>({
    subcompetency: {
        type: Schema.Types.ObjectId,
        ref: "Competency",
        required: true,
    },
    workingOn: {
        type: Schema.Types.Boolean,
        default: true,
    },
    progress: {
        type: Schema.Types.Number,
        default: 0,
    },
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: "User",
    },
}, {
    timestamps: true,
})

const SaveModel = mongoose.model(SAVE_MODEL_NAME, SaveScema)

export default SaveModel