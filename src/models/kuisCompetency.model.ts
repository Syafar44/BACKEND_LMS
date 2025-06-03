import mongoose, { ObjectId } from "mongoose";
import * as Yup from "yup";

export const KUIS_COMPETENCY_MODEL_NAME = "KuisCompetency";

const Schema = mongoose.Schema

export const kuisCompetencyDAO = Yup.object({
    bySubCompetency: Yup.string().required(),
    question: Yup.string().required(),
    option1: Yup.string().required(),
    option2: Yup.string().required(),
    option3: Yup.string().required(),
    option4: Yup.string().required(),
    optionValid: Yup.number().required(),
})

export type TKuisCompetency = Yup.InferType<typeof kuisCompetencyDAO>

export interface KuisCompetency extends Omit<TKuisCompetency, "bySubCompetency" > {
    bySubCompetency: ObjectId
}

const CompetencyScema = new Schema<KuisCompetency>({
    bySubCompetency: {
        type: Schema.Types.ObjectId,
        ref: "SubCompetency",
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

const KuisCompetencyModel = mongoose.model(KUIS_COMPETENCY_MODEL_NAME, CompetencyScema)

export default KuisCompetencyModel