import mongoose from "mongoose";
import * as Yup from "yup";

export const KAJIAN_MODEL_NAME = "Kajian";

const Schema = mongoose.Schema

export const kajianDAO = Yup.object({
    title: Yup.string().required(),
    description: Yup.string().required(),
    image: Yup.string().required(),
    video: Yup.string().required(),
    slug: Yup.string(),
})

export type TKajian = Yup.InferType<typeof kajianDAO>

const KajianScema = new Schema<TKajian>({
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
    slug: {
        type: Schema.Types.String,
        unique: true,
    }
}, {
    timestamps: true,
})

KajianScema.pre("save", function () {
    if (!this.slug) {
        const slug = this.title.split(" ").join("-").toLowerCase();
        this.slug = `${slug}`;
    }
});

const KajianModel = mongoose.model(KAJIAN_MODEL_NAME, KajianScema)

export default KajianModel