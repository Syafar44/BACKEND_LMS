import mongoose, { ObjectId } from "mongoose";
import * as Yup from "yup";

export const KUIS_SOP_MODEL_NAME = "KuisSop";

const Schema = mongoose.Schema

export const kuisSopDAO = Yup.object({
    bySop: Yup.string().required(),
    question: Yup.string().required(),
    option1: Yup.string().required(),
    option2: Yup.string().required(),
    option3: Yup.string().required(),
    option4: Yup.string().required(),
    optionValid: Yup.number().required(),
})

export type TKuisSop = Yup.InferType<typeof kuisSopDAO>

export interface KuisSop extends Omit<TKuisSop, "bySop" > {
    bySop: ObjectId
}

const SopIkScema = new Schema<KuisSop>({
    bySop: {
        type: Schema.Types.ObjectId,
        ref: "Sop",
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

const KuisSopModel = mongoose.model(KUIS_SOP_MODEL_NAME, SopIkScema)

export default KuisSopModel