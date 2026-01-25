import mongoose from "mongoose";



const printRequestSchema = new mongoose.Schema(
  {
    employee: {
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

    cloudinaryId: {
      type: String,
      default: null, // For backward compatibility with local files
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

    timestamps: true,
  }
);

const PrintRequest = mongoose.model("PrintRequest", printRequestSchema);

export default PrintRequest;
