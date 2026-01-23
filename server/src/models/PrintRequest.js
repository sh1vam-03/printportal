import mongoose from "mongoose";

// Helper to convert UTC Date -> India Time string when sending to frontend
function toIndiaTime(date) {
  if (!date) return date;

  return new Date(date).toLocaleString("en-IN", {
    timeZone: "Asia/Kolkata",
  });
}

const printRequestSchema = new mongoose.Schema(
  {
    teacher: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    organization: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Organization",
      required: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    fileUrl: {
      type: String,
      required: true,
    },

    fileType: {
      type: String, // MIME type
      required: true,
    },

    fileSize: {
      type: Number, // Bytes
      required: true,
    },

    originalName: {
      type: String,
      required: true,
    },

    copies: {
      type: Number,
      required: true,
      min: 1,
    },

    printType: {
      type: String,
      enum: ["SINGLE_SIDE", "DOUBLE_SIDE"],
      required: true,
    },

    deliveryType: {
      type: String,
      enum: ["PICKUP", "ROOM_DELIVERY"],
      required: true,
    },

    deliveryRoom: {
      type: String,
      default: null,
    },

    // IMPORTANT: Always store as Date (UTC), interpret input as local time
    dueDateTime: {
      type: Date,
      required: true,
    },

    status: {
      type: String,
      enum: [
        "PENDING",
        "APPROVED",
        "REJECTED",
        "IN_PROGRESS",
        "COMPLETED",
      ],
      default: "PENDING",
    },
  },
  {
    timestamps: true, // creates createdAt & updatedAt in UTC

    // This ensures all Date fields are converted to India time when sent as JSON
    toJSON: {
      transform: function (doc, ret) {
        if (ret.dueDateTime) {
          ret.dueDateTime = toIndiaTime(ret.dueDateTime);
        }

        if (ret.createdAt) {
          ret.createdAt = toIndiaTime(ret.createdAt);
        }

        if (ret.updatedAt) {
          ret.updatedAt = toIndiaTime(ret.updatedAt);
        }

        return ret;
      },
    },
  }
);

const PrintRequest = mongoose.model("PrintRequest", printRequestSchema);

export default PrintRequest;
