import mongoose, { ObjectId } from "mongoose";
import * as Yup from "yup";

export const HISTORYLKP_MODEL_NAME = "HistroyLkp";
const Schema = mongoose.Schema;

export const STATUS_OPTIONS = [
  "Dikerjakan secara berjamaah",
  "Dikerjakan namun tidak berjamaah",
  "Tidak mengerjakan"
];

export const historyLkpkpDAO = Yup.object({
  createdBy: Yup.string().required(),
  date: Yup.string().required(),
  subuh: Yup.string().oneOf(STATUS_OPTIONS).required(),
  dzuhur: Yup.string().oneOf(STATUS_OPTIONS).required(),
  ashar: Yup.string().oneOf(STATUS_OPTIONS).required(),
  magrib: Yup.string().oneOf(STATUS_OPTIONS).required(),
  isya: Yup.string().oneOf(STATUS_OPTIONS).required(),
});

export type THistoryLkp = Yup.InferType<typeof historyLkpkpDAO>;

export interface HistoryLkp extends Omit<THistoryLkp, "createdBy"> {
  createdBy: ObjectId;
}

const HistoryLkpSchema = new Schema<HistoryLkp>(
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

HistoryLkpSchema.index({ 
    createdBy: 1, 
    date: 1 
}, { unique: true });

const HistoryLkpModel = mongoose.models[HISTORYLKP_MODEL_NAME] || mongoose.model(HISTORYLKP_MODEL_NAME, HistoryLkpSchema);
export default HistoryLkpModel;
