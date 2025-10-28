import React from "react";
import Banner from "../components/banner";
import AllProduct from "../components/allProducts";
import Footer from "../components/footer";
import Collection from "../components/collection";

export default function Home() {
  return (
    <>
      <Banner />
      <AllProduct />
      <Collection />
    </>
  );
}
