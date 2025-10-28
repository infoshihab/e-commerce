// src/pages/Policy.jsx
import React, { useEffect } from "react";
import { useAppContext } from "../context/AppContext";

const Policy = () => {
  const { siteContent, siteLoading, fetchSiteContent } = useAppContext();

  useEffect(() => {
    if (!siteContent.policies && !siteLoading) {
      fetchSiteContent(); // Fetch the site content if not already loaded
    }
  }, [siteContent, siteLoading, fetchSiteContent]);

  if (siteLoading) {
    return <div className="text-center text-lg">Loading...</div>;
  }

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Privacy Policy</h1>
      <div
        className="policy-content text-lg text-gray-700 leading-relaxed"
        dangerouslySetInnerHTML={{ __html: siteContent.policies }}
      ></div>
    </div>
  );
};

export default Policy;
