import SiteContent from "../models/SiteContent.js";
import cloudinary from "../config/cloudinary.js";
import fs from "fs";

export const addOrUpdateContent = async (req, res) => {
  try {
    const { about, policies, contactEmail, contactPhone } = req.body;

    let newBanners = [];
    let logoData = null;

    // Handle banner uploads (multiple)
    if (req.files?.banners && req.files.banners.length > 0) {
      for (let file of req.files.banners) {
        const result = await cloudinary.uploader.upload(file.path, {
          folder: "site/banners",
        });
        newBanners.push({
          url: result.secure_url,
          public_id: result.public_id,
        });
        fs.unlinkSync(file.path); // remove temp file
      }
    }

    // Handle logo upload (single file)
    if (req.files?.logo && req.files.logo[0]) {
      const result = await cloudinary.uploader.upload(req.files.logo[0].path, {
        folder: "site/logo",
      });
      logoData = { url: result.secure_url, public_id: result.public_id };
      fs.unlinkSync(req.files.logo[0].path);
    }

    // Find existing site content (only one doc allowed)
    let content = await SiteContent.findOne();

    if (content) {
      // Update fields
      content.about = about || content.about;
      content.policies = policies || content.policies;
      content.contactEmail = contactEmail || content.contactEmail;
      content.contactPhone = contactPhone || content.contactPhone;

      // Append new banners instead of replacing
      if (newBanners.length > 0) {
        content.banners = [...content.banners, ...newBanners];
      }

      // Update logo if uploaded
      if (logoData) content.logo = logoData;

      await content.save();
    } else {
      // Create new site content
      content = await SiteContent.create({
        about,
        policies,
        contactEmail,
        contactPhone,
        banners: newBanners,
        logo: logoData,
        createdBy: req.user._id,
      });
    }

    res.status(200).json({ success: true, content });
  } catch (error) {
    console.error("addOrUpdateContent error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get site content (public)
export const getContent = async (req, res) => {
  try {
    const content = await SiteContent.findOne();
    if (!content) return res.status(404).json({ message: "Content not found" });
    res.status(200).json(content);
  } catch (error) {
    console.error("getContent error:", error);
    res.status(500).json({ message: error.message });
  }
};

// Delete a single banner by public_id
export const deleteBanner = async (req, res) => {
  try {
    const { bannerId } = req.params;
    const content = await SiteContent.findOne();
    if (!content) return res.status(404).json({ message: "Content not found" });

    const bannerToDelete = content.banners.find(
      (b) => b._id.toString() === bannerId
    );
    if (!bannerToDelete)
      return res.status(404).json({ message: "Banner not found" });

    // Delete from Cloudinary
    await cloudinary.uploader.destroy(bannerToDelete.public_id);

    // Remove from array
    content.banners = content.banners.filter(
      (b) => b._id.toString() !== bannerId
    );
    await content.save();

    res.status(200).json({ success: true, content });
  } catch (error) {
    console.error("deleteBanner error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};
