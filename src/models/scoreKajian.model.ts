import mongoose, { ObjectId } from "mongoose";
import * as Yup from "yup";

export const SCORE_KAJIAN_MODEL_NAME = "ScoreKajian";

const Schema = mongoose.Schema

export const scoreKajianDAO = Yup.object({
    byKajian: Yup.string().required(),
    createdBy: Yup.string(),
    isPass: Yup.boolean(),
    total_question: Yup.string().required(),
    total_score: Yup.string().required(),
})

export type TScoreKajian = Yup.InferType<typeof scoreKajianDAO>

export interface ScoreKajian extends Omit<TScoreKajian, "byKajian" | "createdBy" > {
    byKajian: ObjectId
    createdBy: ObjectId
}

const ScoreKajianScema = new Schema<ScoreKajian>({
    byKajian: {
        type: Schema.Types.ObjectId,
        ref: "Kajian",
        required: true,
    },
    isPass: {
        type: Schema.Types.Boolean,
        required: true,
    },
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: "User",
    },
    total_question: {
        type: Schema.Types.String,
        required: true,
    },
    total_score: {
        type: Schema.Types.String,
        required: true,
    },
}, {
    timestamps: true,
})

const ScoreKajianModel = mongoose.model(SCORE_KAJIAN_MODEL_NAME, ScoreKajianScema)

export default ScoreKajianModel