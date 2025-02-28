"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import styles from "../../../styles/portfolio.module.css";
export default function Portfolio() {
  const [selectedProject, setSelectedProject] = useState<number | null>(null);

  return (
    <div className="min-h-screen  text-white p-8 flex flex-col items-center">
      {/* Header */}
      <div className="grid md:grid-cols-3 gap-2 content-center">
        <div className="col-span-2">

          {/* Hero Section */}
          <motion.section
            className="text-left mt-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 2.2 }}
          >
            <h1 className="md:text-6xl font-bold tracking-wide text-text">
              Hi 👋<br/>
              I am<br/>
              <span className="text-blue-400 text-7xl">Shankar</span>
              <br/>And I build<br/>
              things for web
            </h1>
            <p className="text-xl mt-4 text-gray-300">
              Full Stack Developer | React | Next.js | Node.js
            </p>
            <motion.button
              className="mt-6 px-8 py-3 bg-blue-600 rounded-lg text-lg font-semibold hover:bg-blue-700 transition transform hover:scale-105"
              whileHover={{ scale: 1.1 }}
            >
              <Link href="#projects">View My Work</Link>
            </motion.button>
          </motion.section>
        </div>
        {/**Image */}
        <motion.section
       initial={{ scale: 0.5, opacity:0 }}
       animate={{ scale: 1 , opacity:1}}
       transition={{
         type: "spring",
         stiffness: 100,
         damping: 20
       }}
       className="flex items-center justify-center"
        >
          <div className="flex items-center justify-center">
            <div className="rounded-full p-[4px] bg-gradient-to-r from-[#E70FAA] via-[#4A86E2] to-[#13B0F5] ">
              <Image
                src="/my_photo-removebg-preview.png"
                alt="profile"
                width={200}
                height={200}
                className={`${styles.portfolioImage} bg-background-gradient`}
              />
            </div>
          </div>
        </motion.section>
      </div>

      {/* Projects Section */}
      <motion.section
        id="projects"
        className="mt-20 w-full max-w-5xl"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5 }}
      >
        <h2 className="text-4xl font-bold text-center mb-8">Projects</h2>
        <div className="grid md:grid-cols-2 gap-10">
          {[1, 2, 3].map((project, index) => (
            <motion.div
              key={index}
              className="bg-gray-800 p-8 rounded-lg shadow-lg transform hover:scale-105 transition duration-300"
              whileHover={{ scale: 1.05 }}
            >
              <h3 className="text-2xl font-semibold">Project {project}</h3>
              <p className="mt-2 text-gray-400">
                An amazing project showcasing my skills.
              </p>
              <motion.button
                className="mt-4 px-6 py-2 bg-blue-500 rounded-lg hover:bg-blue-600 transition"
                whileHover={{ scale: 1.1 }}
                onClick={() => setSelectedProject(project)}
              >
                View Details
              </motion.button>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Animated Modal */}
      <AnimatePresence>
        {selectedProject !== null && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-gray-800 p-8 rounded-lg shadow-lg max-w-md w-full text-center"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
            >
              <h3 className="text-3xl font-bold">Project {selectedProject}</h3>
              <p className="mt-4 text-gray-300">
                Detailed information about the project goes here.
              </p>
              <motion.button
                className="mt-6 px-6 py-2 bg-red-500 rounded-lg hover:bg-red-600 transition"
                whileHover={{ scale: 1.1 }}
                onClick={() => setSelectedProject(null)}
              >
                Close
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
