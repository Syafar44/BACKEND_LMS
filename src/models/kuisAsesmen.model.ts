import mongoose, { ObjectId } from "mongoose";
import * as Yup from "yup";

export const KUIS_Asesmen_MODEL_NAME = "KuisAsesmen";

const Schema = mongoose.Schema

export const kuisAsesmenDAO = Yup.object({
    byAsesmen: Yup.string().required(),
    question: Yup.string().required(),
    option1: Yup.string().required(),
    option2: Yup.string().required(),
    option3: Yup.string().required(),
    option4: Yup.string().required(),
})

export type TKuisAsesmen = Yup.InferType<typeof kuisAsesmenDAO>

export interface KuisAsesmen extends Omit<TKuisAsesmen, "byAsesmen" > {
    byAsesmen: ObjectId
}

const SopAsesmenScema = new Schema<KuisAsesmen>({
    byAsesmen: {
        type: Schema.Types.ObjectId,
        ref: "Asesmen",
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
}, {
    timestamps: true,
})

const KuisAsesmenModel = mongoose.model(KUIS_Asesmen_MODEL_NAME, SopAsesmenScema)

export default KuisAsesmenModel