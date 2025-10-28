import React from "react";
import { FaPhoneAlt, FaPhone } from "react-icons/fa"; // Import the phone icon

const AnnouncementBar = () => {
  return (
    <div className="w-full bg-[#fc8934] text-white text-sm md:text-base py-2 px-4 text-center">
      <p className="font-medium">
        {/* Phone icon with number */}
        আমাদের যে কোন পণ্য অর্ডার করতে কল বা WhatsApp করুন:{" "}
        <a
          href="https://wa.me/8801321208940"
          className="hover:text-gray-100"
          target="_blank"
          rel="noopener noreferrer"
        >
          {/* Add left margin to the phone icon */}
          <FaPhoneAlt className="inline ml-2 mr-2" size={16} />
          +8801612208940
        </a>{" "}
        |<FaPhone className="inline ml-2 mr-2" size={16} /> হট লাইন:{" "}
        {/* Add left margin to the phone icon */}
        <span className="font-normal">09624-922292</span>
      </p>
    </div>
  );
};

export default AnnouncementBar;
