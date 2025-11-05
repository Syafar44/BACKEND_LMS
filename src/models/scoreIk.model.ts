import mongoose, { ObjectId } from "mongoose";
import * as Yup from "yup";

export const SCORE_IK_MODEL_NAME = "ScoreIk";

const Schema = mongoose.Schema

export const scoreIkDAO = Yup.object({
    byIk: Yup.string().required(),
    createdBy: Yup.string(),
    isPass: Yup.boolean(),
    total_question: Yup.string().required(),
    total_score: Yup.string().required(),
})

export type TScoreIk = Yup.InferType<typeof scoreIkDAO>

export interface ScoreIk extends Omit<TScoreIk, "byIk" | "createdBy" > {
    byIk: ObjectId
    createdBy: ObjectId
}

const ScoreIkScema = new Schema<ScoreIk>({
    byIk: {
        type: Schema.Types.ObjectId,
        ref: "Ik",
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

const ScoreIkModel = mongoose.model(SCORE_IK_MODEL_NAME, ScoreIkScema)

export default ScoreIkModel