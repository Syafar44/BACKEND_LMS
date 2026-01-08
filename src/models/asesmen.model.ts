import mongoose from "mongoose";
import * as Yup from "yup";

export const ASESMEN_MODEL_NAME = "Asesmen";

const Schema = mongoose.Schema

export const asesmenDAO = Yup.object({
    title: Yup.string().required(),
    type: Yup.string().required(),
    duration: Yup.string(),
    slug: Yup.string(),
})

export type TAsesmen = Yup.InferType<typeof asesmenDAO>

const AsesmenScema = new Schema<TAsesmen>({
    title: {
        type: Schema.Types.String,
        required: true,
    },
    type: {
        type: Schema.Types.String,
        required: true,
    },
    duration: {
        type: Schema.Types.String,
    },
    slug: {
        type: Schema.Types.String,
        unique: true,
    }
}, {
    timestamps: true,
})

AsesmenScema.pre("save", function () {
    if (!this.slug) {
        const slug = this.title.split(" ").join("-").toLowerCase();
        this.slug = `${slug}`;
    }
});

const AsesmenModel = mongoose.model(ASESMEN_MODEL_NAME, AsesmenScema)

export default AsesmenModel