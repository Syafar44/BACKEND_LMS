import mongoose, { ObjectId } from "mongoose";
import * as Yup from "yup";

export const KUIS_IK_MODEL_NAME = "KuisIk";

const Schema = mongoose.Schema

export const kuisIkDAO = Yup.object({
    byIk: Yup.string().required(),
    question: Yup.string().required(),
    option1: Yup.string().required(),
    option2: Yup.string().required(),
    option3: Yup.string().required(),
    option4: Yup.string().required(),
    optionValid: Yup.number().required(),
})

export type TKuisIk = Yup.InferType<typeof kuisIkDAO>

export interface KuisIk extends Omit<TKuisIk, "byIk" > {
    byIk: ObjectId
}

const SopIkScema = new Schema<KuisIk>({
    byIk: {
        type: Schema.Types.ObjectId,
        ref: "Ik",
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

const KuisIkModel = mongoose.model(KUIS_IK_MODEL_NAME, SopIkScema)

export default KuisIkModel