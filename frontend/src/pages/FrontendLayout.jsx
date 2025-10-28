import React from "react";
import AnnouncementBar from "../components/announcement";
import Navbar from "../components/navbar";
import Footer from "../components/footer";

const FrontendLayout = ({ children }) => {
  return (
    <>
      <AnnouncementBar />
      <Navbar />
      <main>{children}</main>
      <Footer />
    </>
  );
};

export default FrontendLayout;
