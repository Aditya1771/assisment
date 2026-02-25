import mongoose, { Schema, model, models } from "mongoose";

export interface IMessageLog {
  _id: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  channel: "whatsapp" | "sms" | "email";
  to: string;
  body: string;
  context?: string;
  status: "sent" | "failed";
  error?: string;
  createdAt: Date;
}

const MessageLogSchema = new Schema<IMessageLog>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    channel: { type: String, enum: ["whatsapp", "sms", "email"], required: true },
    to: { type: String, required: true },
    body: { type: String, required: true },
    context: String,
    status: { type: String, enum: ["sent", "failed"], required: true },
    error: String,
  },
  { timestamps: true }
);

MessageLogSchema.index({ userId: 1, createdAt: -1 });

export default models.MessageLog ?? model<IMessageLog>("MessageLog", MessageLogSchema);
