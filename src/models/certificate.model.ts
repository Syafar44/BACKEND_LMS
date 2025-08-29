import mongoose, { ObjectId } from "mongoose";
import * as Yup from "yup";
import { getId } from "../utils/id";

export const CERTIFICATE_MODEL_NAME = "Certificate";

const Schema = mongoose.Schema

export const certificateDAO = Yup.object({
    competency: Yup.string().required(),
    createdBy: Yup.string(),
})

export type TCertificate = Yup.InferType<typeof certificateDAO>

export interface Certificate extends Omit<TCertificate, "competency" | "createdBy" > {
    id: string
    competency: ObjectId
    createdBy: ObjectId
}

const CertificateScema = new Schema<Certificate>({
    id: {
        type: String,
    },
    competency: {
        type: Schema.Types.ObjectId,
        ref: "Competency",
        required: true,
    },
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: "User",
    },
}, {
    timestamps: true,
})

CertificateScema.pre("save", async function () {
    const certificate = this
    certificate.id = getId(6)
})

const CertificateModel = mongoose.model(CERTIFICATE_MODEL_NAME, CertificateScema)

export default CertificateModel
