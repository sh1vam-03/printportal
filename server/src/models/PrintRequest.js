import mongoose from "mongoose";

// SAFE helper: converts only real Date -> India time string
function toIndiaTimeSafe(value) {
  // If already a string, do NOT reconvert
  if (typeof value === "string") return value;

  // If not a valid Date, return as is
  if (!(value instanceof Date) || isNaN(value)) return value;

  return value.toLocaleString("en-IN", {
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
      type: String,
      required: true,
    },

    fileSize: {
      type: Number,
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

    // Always store as Date (UTC)
    dueDateTime: {
      type: Date,
      required: true,
      validate: {
        validator: function (v) {
          return v instanceof Date && !isNaN(v);
        },
        message: "Invalid dueDateTime format",
      },
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
    timestamps: true,

    toJSON: {
      transform: function (doc, ret) {
        // Convert ONLY if real Date, never reconvert strings
        if (ret.dueDateTime) {
          ret.dueDateTime = toIndiaTimeSafe(ret.dueDateTime);
        }

        if (ret.createdAt) {
          ret.createdAt = toIndiaTimeSafe(ret.createdAt);
        }

        if (ret.updatedAt) {
          ret.updatedAt = toIndiaTimeSafe(ret.updatedAt);
        }

        return ret;
      },
    },
  }
);

const PrintRequest = mongoose.model("PrintRequest", printRequestSchema);

export default PrintRequest;
