import mongoose, { ObjectId } from "mongoose";
import * as Yup from "yup";

export const SCORE_MODEL_NAME = "Score";

const Schema = mongoose.Schema

export const scoreDAO = Yup.object({
    bySubCompetency: Yup.string().required(),
    createdBy: Yup.string(),
    isPass: Yup.boolean(),
    total_question: Yup.string().required(),
    total_score: Yup.string().required(),
})

export type TScore = Yup.InferType<typeof scoreDAO>

export interface Score extends Omit<TScore, "bySubCompetency" | "createdBy" > {
    bySubCompetency: ObjectId
    createdBy: ObjectId
}

const CompetencyScema = new Schema<Score>({
    bySubCompetency: {
        type: Schema.Types.ObjectId,
        ref: "KuisCompetency",
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

const ScoreModel = mongoose.model(SCORE_MODEL_NAME, CompetencyScema)

export default ScoreModel