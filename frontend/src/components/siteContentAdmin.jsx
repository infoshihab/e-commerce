import React, { useEffect, useState } from "react";
import { useAppContext } from "../context/AppContext";
import { toast } from "react-toastify";

const SiteContentAdmin = () => {
  const {
    siteContent,
    siteLoading,
    adminUpdateSiteContent,
    adminDeleteBanner,
    adminGetSiteContent,
  } = useAppContext();

  const [about, setAbout] = useState("");
  const [policies, setPolicies] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [logoFile, setLogoFile] = useState(null);
  const [logoPreview, setLogoPreview] = useState(null);
  const [bannerFiles, setBannerFiles] = useState([]);
  const [bannerPreviews, setBannerPreviews] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  // Load existing content
  useEffect(() => {
    if (!siteContent) return;
    setAbout(siteContent.about || "");
    setPolicies(siteContent.policies || "");
    setContactEmail(siteContent.contactEmail || "");
    setContactPhone(siteContent.contactPhone || "");
    setLogoPreview(siteContent.logo?.url || null);
    setBannerPreviews(siteContent.banners || []);
  }, [siteContent]);

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    setLogoFile(file);
    setLogoPreview(URL.createObjectURL(file));
  };

  const handleBannerChange = (e) => {
    const files = Array.from(e.target.files);
    setBannerFiles((prev) => [...prev, ...files]);
    const previews = files.map((file) => ({ url: URL.createObjectURL(file) }));
    setBannerPreviews((prev) => [...prev, ...previews]);
  };

  const handleRemoveBanner = (index) => {
    const updatedFiles = [...bannerFiles];
    if (index < bannerFiles.length) updatedFiles.splice(index, 1);
    setBannerFiles(updatedFiles);

    const updatedPreviews = [...bannerPreviews];
    updatedPreviews.splice(index, 1);
    setBannerPreviews(updatedPreviews);
  };

  const handleDeleteBanner = async (bannerId) => {
    if (!window.confirm("Are you sure you want to delete this banner?")) return;
    const res = await adminDeleteBanner(bannerId);
    if (res.success) {
      toast.success("Banner deleted successfully");
      await adminGetSiteContent();
    } else {
      toast.error(res.message || "Failed to delete banner");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    const formData = new FormData();
    formData.append("about", about);
    formData.append("policies", policies);
    formData.append("contactEmail", contactEmail);
    formData.append("contactPhone", contactPhone);
    if (logoFile) formData.append("logo", logoFile);
    bannerFiles.forEach((file) => formData.append("banners", file));

    const res = await adminUpdateSiteContent(formData);
    if (res.success) {
      toast.success("Site content saved successfully");
      setBannerFiles([]);
      await adminGetSiteContent();
    } else {
      toast.error(res.message || "Failed to save site content");
    }

    setSubmitting(false);
  };

  if (siteLoading)
    return <p className="text-center mt-10">Loading site content...</p>;

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold mb-4 text-center">
        Admin: Site Content
      </h1>

      {/* About & Policies */}
      <div className="bg-white shadow rounded p-6 space-y-4">
        <h2 className="text-xl font-semibold">About</h2>
        <textarea
          className="w-full border p-2 rounded resize-none"
          rows={4}
          value={about}
          onChange={(e) => setAbout(e.target.value)}
        />

        <h2 className="text-xl font-semibold mt-4">Policies</h2>
        <textarea
          className="w-full border p-2 rounded resize-none"
          rows={4}
          value={policies}
          onChange={(e) => setPolicies(e.target.value)}
        />
      </div>

      {/* Contact Info */}
      <div className="bg-white shadow rounded p-6 space-y-4">
        <h2 className="text-xl font-semibold">Contact Info</h2>
        <input
          type="email"
          className="w-full border p-2 rounded"
          placeholder="Contact Email"
          value={contactEmail}
          onChange={(e) => setContactEmail(e.target.value)}
        />
        <input
          type="text"
          className="w-full border p-2 rounded"
          placeholder="Contact Phone"
          value={contactPhone}
          onChange={(e) => setContactPhone(e.target.value)}
        />
      </div>

      {/* Logo */}
      <div className="bg-white shadow rounded p-6 space-y-4">
        <h2 className="text-xl font-semibold">Logo</h2>
        {logoPreview && (
          <img
            src={logoPreview}
            alt="Logo Preview"
            className="h-28 mb-2 object-contain border p-1"
          />
        )}
        <input type="file" accept="image/*" onChange={handleLogoChange} />
      </div>

      {/* Banners */}
      <div className="bg-white shadow rounded p-6 space-y-4">
        <h2 className="text-xl font-semibold">Banners</h2>
        <div className="flex gap-4 overflow-x-auto pb-2">
          {bannerPreviews.map((b, i) => (
            <div key={i} className="relative flex-shrink-0">
              <img
                src={b.url}
                alt={`Banner ${i + 1}`}
                className="h-32 w-48 object-cover border rounded"
              />
              {b._id ? (
                <button
                  type="button"
                  className="absolute top-1 right-1 bg-red-500 text-white px-2 rounded hover:bg-red-600"
                  onClick={() => handleDeleteBanner(b._id)}
                >
                  X
                </button>
              ) : (
                <button
                  type="button"
                  className="absolute top-1 right-1 bg-red-500 text-white px-2 rounded hover:bg-red-600"
                  onClick={() => handleRemoveBanner(i)}
                >
                  X
                </button>
              )}
            </div>
          ))}
        </div>
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={handleBannerChange}
        />
      </div>

      <div className="text-center">
        <button
          type="button"
          disabled={submitting}
          onClick={handleSubmit}
          className="bg-blue-600 text-white px-8 py-3 rounded hover:bg-blue-700 transition disabled:opacity-50"
        >
          {submitting
            ? "Saving..."
            : siteContent
            ? "Update Site Content"
            : "Save Site Content"}
        </button>
      </div>
    </div>
  );
};

export default SiteContentAdmin;
