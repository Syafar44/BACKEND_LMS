import mongoose, { ObjectId } from "mongoose";
import * as Yup from "yup";

export const KUIS_KAJIAN_MODEL_NAME = "KuisKajian";

const Schema = mongoose.Schema

export const kuisKajianDAO = Yup.object({
    byKajian: Yup.string().required(),
    question: Yup.string().required(),
    option1: Yup.string().required(),
    option2: Yup.string().required(),
    option3: Yup.string().required(),
    option4: Yup.string().required(),
    optionValid: Yup.number().required(),
})

export type TKuisKajian = Yup.InferType<typeof kuisKajianDAO>

export interface KuisKajian extends Omit<TKuisKajian, "byKajian" > {
    byKajian: ObjectId
}

const SopKajianScema = new Schema<KuisKajian>({
    byKajian: {
        type: Schema.Types.ObjectId,
        ref: "Kajian",
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

const KuisKajianModel = mongoose.model(KUIS_KAJIAN_MODEL_NAME, SopKajianScema)

export default KuisKajianModel