import mongoose, { ObjectId } from "mongoose";
import * as Yup from "yup";

export const SUB_COMPETENCY_MODEL_NAME = "SubCompetency";

const Schema = mongoose.Schema

export const subCompetencyDAO = Yup.object({
    byCompetency: Yup.string().required(),
    title: Yup.string().required(),
    description: Yup.string().required(),
    video: Yup.string().required(),
    slug: Yup.string(),
})

export type TSubCompetency = Yup.InferType<typeof subCompetencyDAO>

export interface SubCompetency extends Omit<TSubCompetency, "byCompetency" > {
    byCompetency: ObjectId
}

const SubCompetencyScema = new Schema<SubCompetency>({
    byCompetency: {
        type: Schema.Types.ObjectId,
        ref: "Competency",
        required: true,
    },
    title: {
        type: Schema.Types.String,
        required: true,
    },
    description: {
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

SubCompetencyScema.pre("save", function () {
    if (!this.slug) {
      const slug = this.title.split(" ").join("-").toLowerCase();
      this.slug = `${slug}`;
    }
  });

const SubCompetencyModel = mongoose.model(SUB_COMPETENCY_MODEL_NAME, SubCompetencyScema)

export default SubCompetencyModel