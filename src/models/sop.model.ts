import mongoose from "mongoose";
import * as Yup from "yup";

export const SOP_MODEL_NAME = "Sop";

const Schema = mongoose.Schema

export const sopDAO = Yup.object({
    title: Yup.string().required(),
    description: Yup.string().required(),
    file: Yup.string(),
    duration: Yup.string(),
    countdown: Yup.string(),
    slug: Yup.string(),
})

export type TSop = Yup.InferType<typeof sopDAO>

const SopScema = new Schema<TSop>({
    title: {
        type: Schema.Types.String,
        required: true,
    },
    description: {
        type: Schema.Types.String,
        required: true,
    },
    file: {
        type: Schema.Types.String,
    },
    duration: {
        type: Schema.Types.String,
    },
    countdown: {
        type: Schema.Types.String,
    },
    slug: {
        type: Schema.Types.String,
        unique: true,
    }
}, {
    timestamps: true,
})

SopScema.pre("save", function () {
    if (!this.slug) {
        const slug = this.title.split(" ").join("-").toLowerCase();
        this.slug = `${slug}`;
    }
});

const SopModel = mongoose.model(SOP_MODEL_NAME, SopScema)

export default SopModel