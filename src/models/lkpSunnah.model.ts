import mongoose, { ObjectId } from "mongoose";
import * as Yup from "yup";

export const LKP_SUNNAH_MODEL_NAME = "Lkp-Sunnah";
const Schema = mongoose.Schema;

export const lkpSunnahDAO = Yup.object({
  createdBy: Yup.string().required(),
  date: Yup.string(),
  rawatib: Yup.string(),
  dhuha: Yup.number(),
  al_quran: Yup.string(),
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
    rawatib: { 
        type: Schema.Types.String,  
        default: "Tidak Mengerjakan"
    },
    dhuha: { 
        type: Schema.Types.Number, 
        default: 0
    },
    al_quran: { 
        type: Schema.Types.String, 
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