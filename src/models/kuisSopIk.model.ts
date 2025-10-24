import mongoose, { ObjectId } from "mongoose";
import * as Yup from "yup";

export const KUIS_SOP_IK_MODEL_NAME = "KuisSopIk";

const Schema = mongoose.Schema

export const kuisSopIkDAO = Yup.object({
    bySopIk: Yup.string().required(),
    question: Yup.string().required(),
    option1: Yup.string().required(),
    option2: Yup.string().required(),
    option3: Yup.string().required(),
    option4: Yup.string().required(),
    optionValid: Yup.number().required(),
})

export type TKuisSopIk = Yup.InferType<typeof kuisSopIkDAO>

export interface KuisSopIk extends Omit<TKuisSopIk, "bySopIk" > {
    bySopIk: ObjectId
}

const SopIkScema = new Schema<KuisSopIk>({
    bySopIk: {
        type: Schema.Types.ObjectId,
        ref: "SopIk",
        required: true,
    },
    question: {
        type: Schema.Types.String,
        required: true,
    },
    option1: {
        type: Schema.Types.String,
        required: true,
    },
    option2: {
        type: Schema.Types.String,
        required: true,
    },
    option3: {
        type: Schema.Types.String,
        required: true,
    },
    option4: {
        type: Schema.Types.String,
        required: true,
    },
    optionValid: {
        type: Schema.Types.Number,
        required: true,
    },
}, {
    timestamps: true,
})

const KuisSopIkModel = mongoose.model(KUIS_SOP_IK_MODEL_NAME, SopIkScema)

export default KuisSopIkModel