import mongoose from "mongoose";
import * as Yup from "yup";

export const COMPETENCY_MODEL_NAME = "Competency";

const Schema = mongoose.Schema

export const competencyDAO = Yup.object({
    title: Yup.string().required(),
    description: Yup.string().required(),
    image: Yup.string().required(),
    access: Yup.array().required(),
    slug: Yup.string(),
})

export type TCompetency = Yup.InferType<typeof competencyDAO>

const CompetencyScema = new Schema<TCompetency>({
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
    access: {
        type: [String],
        required: true,
    },
    slug: {
        type: Schema.Types.String,
        unique: true,
    }
}, {
    timestamps: true,
})

CompetencyScema.pre("save", function () {
    if (!this.slug) {
      const slug = this.title.split(" ").join("-").toLowerCase();
      this.slug = `${slug}`;
    }
  });

const CompetencyModel = mongoose.model(COMPETENCY_MODEL_NAME, CompetencyScema)

export default CompetencyModel