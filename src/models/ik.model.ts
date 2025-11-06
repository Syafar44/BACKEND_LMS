import mongoose from "mongoose";
import * as Yup from "yup";

export const IK_MODEL_NAME = "Ik";

const Schema = mongoose.Schema

export const ikDAO = Yup.object({
    title: Yup.string().required(),
    description: Yup.string().required(),
    image: Yup.string().required(),
    video: Yup.string().required(),
    file: Yup.string(),
    duration: Yup.string(),
    countdown: Yup.string(),
    slug: Yup.string(),
})

export type TIk = Yup.InferType<typeof ikDAO>

const IkScema = new Schema<TIk>({
    title: {
        type: Schema.Types.String,
        required: true,
    },
    description: {
        type: Schema.Types.String,
        required: true,
    },
    image: {
        type: Schema.Types.String,
        required: true,
    },
    video: {
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

IkScema.pre("save", function () {
    if (!this.slug) {
        const slug = this.title.split(" ").join("-").toLowerCase();
        this.slug = `${slug}`;
    }
});

const IkModel = mongoose.model(IK_MODEL_NAME, IkScema)

export default IkModel