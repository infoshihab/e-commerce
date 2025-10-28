// src/pages/About.jsx
import React, { useEffect } from "react";
import { useAppContext } from "../context/AppContext";

const About = () => {
  const { siteContent, siteLoading, fetchSiteContent } = useAppContext();

  useEffect(() => {
    if (!siteContent.about && !siteLoading) {
      fetchSiteContent(); // Fetch the site content if not already loaded
    }
  }, [siteContent, siteLoading, fetchSiteContent]);

  if (siteLoading) {
    return <div className="text-center text-lg">Loading...</div>;
  }

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">About Us</h1>
      <div
        className="about-content text-lg text-gray-700 leading-relaxed"
        dangerouslySetInnerHTML={{ __html: siteContent.about }}
      ></div>
    </div>
  );
};

export default About;
