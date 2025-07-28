import mongoose, { ObjectId } from "mongoose";
import * as Yup from "yup";

export const LKP_MODEL_NAME = "Lkp";
const Schema = mongoose.Schema;

export const STATUS_OPTIONS = [
  "Dikerjakan secara berjamaah",
  "Dikerjakan namun tidak berjamaah",
  "Tidak mengerjakan",
  "Tidak Sholat karena haid (Perempuan)"
];

export const lkpDAO = Yup.object({
  createdBy: Yup.string().required(),
  date: Yup.string().required(),
  subuh: Yup.string().oneOf(STATUS_OPTIONS).required(),
  dzuhur: Yup.string().oneOf(STATUS_OPTIONS).required(),
  ashar: Yup.string().oneOf(STATUS_OPTIONS).required(),
  magrib: Yup.string().oneOf(STATUS_OPTIONS).required(),
  isya: Yup.string().oneOf(STATUS_OPTIONS).required(),
});

export type TLkp = Yup.InferType<typeof lkpDAO>;

export interface Lkp extends Omit<TLkp, "createdBy"> {
  createdBy: ObjectId;
}

const LkpSchema = new Schema<Lkp>(
  {
    createdBy: { 
        type: Schema.Types.ObjectId, 
        ref: "User", 
        required: true 
    },
    date: { 
        type: Schema.Types.String, 
        required: true 
    },
    subuh: { 
        type: Schema.Types.String, 
        enum: STATUS_OPTIONS, 
        required: true 
    },
    dzuhur: { 
        type: Schema.Types.String, 
        enum: STATUS_OPTIONS, 
        required: true 
    },
    ashar: { 
        type: Schema.Types.String, 
        enum: STATUS_OPTIONS, 
        required: true 
    },
    magrib: { 
        type: Schema.Types.String, 
        enum: STATUS_OPTIONS, 
        required: true 
    },
    isya: { 
        type: Schema.Types.String, 
        enum: STATUS_OPTIONS, 
        required: true 
    },
  },
  { timestamps: true }
);

LkpSchema.index({ 
    createdBy: 1, 
    date: 1 
}, { unique: true });

const LkpModel = mongoose.models[LKP_MODEL_NAME] || mongoose.model(LKP_MODEL_NAME, LkpSchema);
export default LkpModel;