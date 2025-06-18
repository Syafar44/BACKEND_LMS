import mongoose, { ObjectId } from "mongoose";
import * as Yup from "yup";

export const VIDEO_MODEL_NAME = "Video";

const Schema = mongoose.Schema

export const videoDAO = Yup.object({
    bySubCompetency: Yup.string().required(),
    createdBy: Yup.string(),
    viewed: Yup.boolean(),
})

export type TVideo = Yup.InferType<typeof videoDAO>

export interface Video extends Omit<TVideo, "bySubCompetency" | "createdBy" > {
    bySubCompetency: ObjectId
    createdBy: ObjectId
}

const CompetencyScema = new Schema<Video>({
    bySubCompetency: {
        type: Schema.Types.ObjectId,
        ref: "KuisCompetency",
        required: true,
    },
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: "User",
    },
    viewed: {
        type: Schema.Types.Boolean,
        default: true,
    }
}, {
    timestamps: true,
})

const VideoModel = mongoose.model(VIDEO_MODEL_NAME, CompetencyScema)

export default VideoModel