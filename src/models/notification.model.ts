import mongoose, { ObjectId } from "mongoose";
import * as Yup from "yup";

export const NOTIFICATION_MODEL_NAME = "Notification";

const Schema = mongoose.Schema

export const notificationDAO = Yup.object({
    token: Yup.string().required(),
    createdBy: Yup.string(),
    isPass: Yup.boolean(),
})

export type TNotification = Yup.InferType<typeof notificationDAO>

export interface Notification extends Omit<TNotification, "createdBy" > {
    createdBy: ObjectId
}

const NotificationScema = new Schema<Notification>({
    token: {
        type: Schema.Types.String,
        required: true,
        unique: true,
    },
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: "User",
    },
}, {
    timestamps: true,
})

const NotificationModel = mongoose.model(NOTIFICATION_MODEL_NAME, NotificationScema)

export default NotificationModel