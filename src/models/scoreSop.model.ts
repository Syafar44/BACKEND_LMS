import mongoose, { ObjectId } from "mongoose";
import * as Yup from "yup";

export const SCORE_SOP_MODEL_NAME = "ScoreSop";

const Schema = mongoose.Schema

export const scoreSopDAO = Yup.object({
    bySop: Yup.string().required(),
    createdBy: Yup.string(),
    isPass: Yup.boolean(),
    total_question: Yup.string().required(),
    total_score: Yup.string().required(),
})

export type TScoreSop = Yup.InferType<typeof scoreSopDAO>

export interface ScoreSop extends Omit<TScoreSop, "bySop" | "createdBy" > {
    bySop: ObjectId
    createdBy: ObjectId
}

const ScoreSopScema = new Schema<ScoreSop>({
    bySop: {
        type: Schema.Types.ObjectId,
        ref: "Sop",
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

const ScoreSopModel = mongoose.model(SCORE_SOP_MODEL_NAME, ScoreSopScema)

export default ScoreSopModel