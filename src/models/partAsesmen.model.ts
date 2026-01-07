import mongoose from "mongoose";
import * as Yup from "yup";
import { getNumId } from "../utils/id";

export const PART_ASESMEN_MODEL_NAME = "PartAsesmen";

const Schema = mongoose.Schema

export const partAsesmenDAO = Yup.object({
    protector_id: Yup.string(),
    title: Yup.string().required(),
    type: Yup.string().required(),
    completed: Yup.boolean().default(false),
    slug: Yup.string(),
})

export type TPartAsesmen = Yup.InferType<typeof partAsesmenDAO>

const PartAsesmenScema = new Schema<TPartAsesmen>({
    protector_id: {
        type: Schema.Types.String,
        unique: true,
    },
    title: {
        type: Schema.Types.String,
        required: true,
    },
    type: {
        type: Schema.Types.String,
        required: true,
    },
    completed: {
        type: Schema.Types.Boolean,
        default: false,
    },
}, {
    timestamps: true,
})

PartAsesmenScema.pre("save", function () {
    if (!this.protector_id) {
        const protector_id = getNumId(5);
        this.protector_id = `${protector_id}`;
    }
});

const PartAsesmenModel = mongoose.model(PART_ASESMEN_MODEL_NAME, PartAsesmenScema)

export default PartAsesmenModel