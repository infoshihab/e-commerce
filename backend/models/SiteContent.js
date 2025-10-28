import mongoose from "mongoose";

const siteContentSchema = new mongoose.Schema(
  {
    about: {
      type: String,
      required: true,
    },
    policies: {
      type: String,
      required: true,
    },

    // ✅ New fields added
    contactEmail: {
      type: String,
      required: true,
    },
    contactPhone: {
      type: String,
      required: true,
    },

    // ✅ Logo image (single image)
    logo: {
      url: { type: String },
      public_id: { type: String },
    },

    // ✅ Banners (multiple images)
    banners: [
      {
        url: { type: String },
        public_id: { type: String },
      },
    ],

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // admin user
      required: true,
    },
  },
  { timestamps: true }
);

const SiteContent = mongoose.model("SiteContent", siteContentSchema);

export default SiteContent;
