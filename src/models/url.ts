import mongoose, { Document, Schema } from "mongoose";

export interface IUrl extends Document {
  shortId: string;
  originalUrl: string;
  clicks: number;
  createdAt: Date;
}

const urlSchema: Schema = new Schema({
  shortId: {
    type: String,
    required: true,
    unique: true,
  },
  originalUrl: {
    type: String,
    required: true,
  },
  clicks: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Add index for faster lookup by originalUrl
urlSchema.index({ originalUrl: 1 });

export default mongoose.model<IUrl>("Url", urlSchema);
