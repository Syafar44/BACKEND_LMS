import mongoose, { ObjectId } from "mongoose";
import * as Yup from "yup";

export const MODEL_NAME = "RetAsesmen";

const Schema = mongoose.Schema

export const retAsesmenDAO = Yup.object({
    byAsesmen: Yup.string().required(),
    createdBy: Yup.string(),
    answers: Yup.array()
        .of(
            Yup.object({
                answer: Yup.mixed().required(),
            })
        )
        .required(),
})

const AnswerSchema = new Schema(
    {
        answer: {
            type: Schema.Types.Mixed,
            required: true,
        },
    },
)

export type TRetAsesmen = Yup.InferType<typeof retAsesmenDAO>

export interface RetAsesmen extends Omit<TRetAsesmen, "byAsesmen" | "createdBy" > {
    byAsesmen: ObjectId
    createdBy: ObjectId
}

const RetAsesmenSchema = new Schema<RetAsesmen>({
    byAsesmen: {
        type: Schema.Types.ObjectId,
        ref: "Asesmen",
        required: true,
    },
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: "User",
    },
    answers: {
        type: [AnswerSchema],
        required: true,
    },
}, {
    timestamps: true,
})

const RetAsesmenModel = mongoose.model(MODEL_NAME, RetAsesmenSchema)

export default RetAsesmenModel