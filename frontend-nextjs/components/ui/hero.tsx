"use client";

import React from "react";
import { motion } from "framer-motion";
import { Typewriter } from "react-simple-typewriter";

const Hero: React.FC = () => {
  return (
    <section className="relative w-full  flex flex-col items-center justify-center text-center p-6 text-gray-900 overflow-hidden">
      {/* Main Heading Animation */}
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="text-5xl md:text-6xl font-extrabold text-gray-300"
      >
        Deploy Your Project <br />
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
          In One Click
        </span>
      </motion.h1>

      {/* Subheading Animation */}
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.8, ease: "easeOut" }}
        className="text-lg md:text-xl text-gray-200 mt-4"
      >
        Simply provide your <span className="text-blue-400">GitHub URL</span> &{" "}
        <span className="text-purple-400">Subdomain Name</span>, and we handle the rest!
      </motion.p>

      {/* Typewriter Animation for Steps */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
        className="mt-6 text-lg font-semibold text-gray-100"
      >
        <span className="text-blue-400">How to Get Started: </span>
        <span className="text-gray-100">
          <Typewriter
            words={[
              "Step 1: Enter your GitHub URL 📂",
              "Step 2: Choose a Subdomain 🌍",
              "Step 3: Click Deploy 🚀",
              "Step 4: Your Project is Live! 🎉",
            ]}
            loop={0}
            typeSpeed={50}
            deleteSpeed={30}
            delaySpeed={1000}
          />
        </span>
      </motion.div>
    </section>
  );
};

export default Hero;
