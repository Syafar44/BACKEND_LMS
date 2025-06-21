import mongoose, { ObjectId } from "mongoose";
import * as Yup from "yup";

export const Resume_MODEL_NAME = "Resume";

const Schema = mongoose.Schema

export const resumeDAO = Yup.object({
    kajian: Yup.string().required(),
    resume: Yup.string().required(),
    createdBy: Yup.string(),
    isPass: Yup.boolean(),
})

export type TResume = Yup.InferType<typeof resumeDAO>

export interface Resume extends Omit<TResume, "kajian" | "createdBy" > {
    kajian: ObjectId
    createdBy: ObjectId
}

const ResumeScema = new Schema<Resume>({
    kajian: {
        type: Schema.Types.ObjectId,
        ref: "Kajian",
        required: true,
    },
    resume: {
        type: Schema.Types.String,
        required: true,
    },
    isPass: {
        type: Schema.Types.Boolean,
        default: true
    },
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: "User",
    },
}, {
    timestamps: true,
})

const ResumeModel = mongoose.model(Resume_MODEL_NAME, ResumeScema)

export default ResumeModel