"use client"
import React from "react";
import { motion } from "framer-motion";

const Header: React.FC = () => {
  return (
    <header className="fixed top-0 left-0 w-full p-4 bg-transparent z-50">
      <motion.h1
        className="text-2xl font-bold text-white ml-6 "
        initial={{ textShadow: "0px 0px 10px rgba(255, 255, 255, 0.5)" }}
        animate={{
          textShadow: [
            "0px 0px 10px rgba(164, 124, 243, 0.8)",
            "0px 0px 20px rgba(104, 63, 234, 1)",
            "0px 0px 10px rgba(164, 124, 243, 0.8)"
          ]
        }}
        transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
      >
        Deployer
      </motion.h1>
    </header>
  );
};

export default Header;
