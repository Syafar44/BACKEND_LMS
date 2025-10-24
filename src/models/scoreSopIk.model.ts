import mongoose, { ObjectId } from "mongoose";
import * as Yup from "yup";

export const SCORE_MODEL_NAME = "ScoreSopIk";

const Schema = mongoose.Schema

export const scoreSopIkDAO = Yup.object({
    bySopIk: Yup.string().required(),
    createdBy: Yup.string(),
    isPass: Yup.boolean(),
    total_question: Yup.string().required(),
    total_score: Yup.string().required(),
})

export type TScoreSopIk = Yup.InferType<typeof scoreSopIkDAO>

export interface ScoreSopIk extends Omit<TScoreSopIk, "bySopIk" | "createdBy" > {
    bySopIk: ObjectId
    createdBy: ObjectId
}

const ScoreSopIkScema = new Schema<ScoreSopIk>({
    bySopIk: {
        type: Schema.Types.ObjectId,
        ref: "SopIk",
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

const ScoreSopIkModel = mongoose.model(SCORE_MODEL_NAME, ScoreSopIkScema)

export default ScoreSopIkModel