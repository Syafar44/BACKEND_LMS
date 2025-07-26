import mongoose, { ObjectId } from "mongoose";
import * as Yup from "yup";

export const LKP_SUNNAH_MODEL_NAME = "Lkp-Sunnah";
const Schema = mongoose.Schema;

export const DHUHA = [
  "2 Rakaat",
  "4 Rakaat",
  "8 Rakaat"
];

export const AL_QURAN = [
  "1 Halaman",
  "2 Halaman",
  "Lebih dari 2 Halaman"
];

export const lkpSunnahDAO = Yup.object({
  createdBy: Yup.string().required(),
  date: Yup.string(),
  dhuha: Yup.string().oneOf(DHUHA),
  rawatib: Yup.number(),
  al_quran: Yup.string().oneOf(AL_QURAN),
});

export type TLkpSunnah = Yup.InferType<typeof lkpSunnahDAO>;

export interface Lkp extends Omit<TLkpSunnah, "createdBy"> {
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
    dhuha: { 
        type: Schema.Types.String, 
        enum: DHUHA, 
        default: "Tidak Mengerjakan"
    },
    rawatib: { 
        type: Schema.Types.Number, 
        default: 0
    },
    al_quran: { 
        type: Schema.Types.String, 
        enum: AL_QURAN, 
        default: "Tidak Mengerjakan" 
    },
  },
  { timestamps: true }
);

LkpSchema.index({ 
    createdBy: 1, 
    date: 1 
}, { unique: true });

const LkpSunnahModel = mongoose.models[LKP_SUNNAH_MODEL_NAME] || mongoose.model(LKP_SUNNAH_MODEL_NAME, LkpSchema);
export default LkpSunnahModel;