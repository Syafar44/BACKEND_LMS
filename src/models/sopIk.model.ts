import mongoose from "mongoose";
import * as Yup from "yup";

export const SOP_IK_MODEL_NAME = "Sop&Ik";

const Schema = mongoose.Schema

export const sopIkDAO = Yup.object({
    title: Yup.string().required(),
    description: Yup.string().required(),
    slug: Yup.string(),
})

export type TSopIk = Yup.InferType<typeof sopIkDAO>

const SopIkScema = new Schema<TSopIk>({
    title: {
        type: Schema.Types.String,
        required: true,
    },
    description: {
        type: Schema.Types.String,
        required: true,
    },
    slug: {
        type: Schema.Types.String,
        unique: true,
    }
}, {
    timestamps: true,
})

SopIkScema.pre("save", function () {
    if (!this.slug) {
        const slug = this.title.split(" ").join("-").toLowerCase();
        this.slug = `${slug}`;
    }
});

const SopIkModel = mongoose.model(SOP_IK_MODEL_NAME, SopIkScema)

export default SopIkModel