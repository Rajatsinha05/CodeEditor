// import React, { useEffect } from "react";
// import Navbar from "../components/Profile/portfolio/Navbar";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchStudentDetailsById } from "../redux/Student/studentsSlice";

import React from "react";
import { useEffect, useState } from "react";
import {
  Menu,
  Github,
  Linkedin,
  Mail,
  Phone,
  GraduationCap,
  Award,
  Briefcase,
  Code2,
  Sun,
  Moon,
  Star,
  GitFork,
} from "lucide-react";
import GitHubCalendar from "react-github-calendar";
import { motion } from "framer-motion";

function Portfolio() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true); // Dark mode by default
  const [githubStats, setGithubStats] = useState({ stars: 0, forks: 0 });
  const [githuabData, setGithuabData] = useState({});
  const { studentId } = useParams();
  const SolvedQuestions = 200;
  const dispatch = useDispatch();
  const { student } = useSelector((store) => store.student);
  // Fetch student details
  const refreshStudentData = () => {
    if (studentId) {
      dispatch(fetchStudentDetailsById(studentId));
    }
  };
  // 

  useEffect(() => {
    refreshStudentData();
  }, [studentId]);

  useEffect(() => {
    const fetchGitHubStats = async () => {
      try {
        const response = await fetch(
          `https://api.github.com/users/${student?.githubURL}/repos`
        );
        const repos = await response.json();
        const stars = repos.reduce(
          (acc, repo) => acc + repo.stargazers_count,
          0
        );
        const forks = repos.reduce((acc, repo) => acc + repo.forks_count, 0);
        setGithubStats({ stars, forks });
        setGithuabData(repos);
      } catch (error) {}
    };

    fetchGitHubStats();
  }, [student]);

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${
        isDarkMode ? "bg-[#0f172a] text-gray-100" : "bg-gray-50 text-gray-900"
      }`}
    >
      {/* Navigation */}
      <nav
        className={`${
          isDarkMode ? "bg-[#1e293b]" : "bg-white"
        } shadow-lg sticky top-0 z-50 transition-colors duration-300`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <motion.h1
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="text-xl font-bold"
              >
                {student?.name}
              </motion.h1>
            </div>
            <div className="hidden md:flex items-center space-x-6">
              <a
                href="#about"
                className={`${
                  isDarkMode
                    ? "text-gray-300 hover:text-purple-400"
                    : "text-gray-700 hover:text-purple-600"
                } transition-colors duration-300`}
              >
                About
              </a>
              <a
                href="#experience"
                className={`${
                  isDarkMode
                    ? "text-gray-300 hover:text-purple-400"
                    : "text-gray-700 hover:text-purple-600"
                } transition-colors duration-300`}
              >
                Experience
              </a>
              <a
                href="#projects"
                className={`${
                  isDarkMode
                    ? "text-gray-300 hover:text-purple-400"
                    : "text-gray-700 hover:text-purple-600"
                } transition-colors duration-300`}
              >
                Projects
              </a>
              <a
                href="#education"
                className={`${
                  isDarkMode
                    ? "text-gray-300 hover:text-purple-400"
                    : "text-gray-700 hover:text-purple-600"
                } transition-colors duration-300`}
              >
                Education
              </a>
              <a
                href="#skills"
                className={`${
                  isDarkMode
                    ? "text-gray-300 hover:text-purple-400"
                    : "text-gray-700 hover:text-purple-600"
                } transition-colors duration-300`}
              >
                Skills
              </a>
              <button
                onClick={() => setIsDarkMode(!isDarkMode)}
                className="p-2 rounded-full hover:bg-gray-700/20 transition-colors duration-300"
              >
                {isDarkMode ? (
                  <Sun className="h-5 w-5 text-purple-400" />
                ) : (
                  <Moon className="h-5 w-5 text-purple-600" />
                )}
              </button>
            </div>
            <div className="md:hidden flex items-center space-x-4">
              <button
                onClick={() => setIsDarkMode(!isDarkMode)}
                className="p-2 rounded-full hover:bg-gray-700/20 transition-colors duration-300"
              >
                {isDarkMode ? (
                  <Sun className="h-5 w-5 text-purple-400" />
                ) : (
                  <Moon className="h-5 w-5 text-purple-600" />
                )}
              </button>
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className={
                  isDarkMode
                    ? "text-gray-300 hover:text-purple-400"
                    : "text-gray-700 hover:text-purple-600"
                }
              >
                <Menu className="h-6 w-6" />
              </button>
            </div>
          </div>
        </div>
        {/* Mobile menu */}
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="md:hidden"
          >
            <div
              className={`px-2 pt-2 pb-3 space-y-1 ${
                isDarkMode ? "bg-[#1e293b]" : "bg-white"
              }`}
            >
              <a
                href="#about"
                className={`block px-3 py-2 ${
                  isDarkMode
                    ? "text-gray-300 hover:text-purple-400"
                    : "text-gray-700 hover:text-purple-600"
                }`}
              >
                About
              </a>
              <a
                href="#experience"
                className={`block px-3 py-2 ${
                  isDarkMode
                    ? "text-gray-300 hover:text-purple-400"
                    : "text-gray-700 hover:text-purple-600"
                }`}
              >
                Experience
              </a>
              <a
                href="#projects"
                className={`block px-3 py-2 ${
                  isDarkMode
                    ? "text-gray-300 hover:text-purple-400"
                    : "text-gray-700 hover:text-purple-600"
                }`}
              >
                Projects
              </a>
              <a
                href="#education"
                className={`block px-3 py-2 ${
                  isDarkMode
                    ? "text-gray-300 hover:text-purple-400"
                    : "text-gray-700 hover:text-purple-600"
                }`}
              >
                Education
              </a>
              <a
                href="#skills"
                className={`block px-3 py-2 ${
                  isDarkMode
                    ? "text-gray-300 hover:text-purple-400"
                    : "text-gray-700 hover:text-purple-600"
                }`}
              >
                Skills
              </a>
            </div>
          </motion.div>
        )}
      </nav>

      {/* Hero Section */}

      {student && (
        <div>
          <div
            className={`bg-gradient-to-r ${
              isDarkMode
                ? "from-[#2d1b69] to-[#1e293b]"
                : "from-purple-500 to-pink-500"
            } transition-colors duration-300`}
          >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="flex flex-col md:flex-row items-center justify-between"
              >
                <div className="md:w-1/2 mb-8 md:mb-0">
                  <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="text-5xl font-bold mb-4 text-white bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-300"
                  >
                    {student.name}
                  </motion.h1>
                  <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="text-2xl mb-6 text-gray-200 font-light"
                  >
                    {student.course}
                  </motion.p>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="flex space-x-6"
                  >
                    <a
                      href={student.githubURL}
                      className="text-gray-200 hover:text-purple-400 transition-colors duration-300"
                    >
                      <Github className="h-7 w-7" />
                    </a>
                    <a
                      href={student.linkedInURL}
                      className="text-gray-200 hover:text-purple-400 transition-colors duration-300"
                    >
                      <Linkedin className="h-7 w-7" />
                    </a>
                    <a
                      href={`mailto:${student.email}`}
                      className="text-gray-200 hover:text-purple-400 transition-colors duration-300"
                    >
                      <Mail className="h-7 w-7" />
                    </a>
                    <a
                      href={`tel:${student.phoneNumber}`}
                      className="text-gray-200 hover:text-purple-400 transition-colors duration-300"
                    >
                      <Phone className="h-7 w-7" />
                    </a>
                  </motion.div>
                </div>
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3 }}
                  className="md:w-1/3"
                >
                  <div className="relative group">
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-tilt blur-lg"></div>
                    <img
                      src={githuabData[0]?.owner?.avatar_url}
                      alt={student.name}
                      className="relative rounded-full w-64 h-64 object-cover shadow-2xl transform transition duration-500 hover:scale-105"
                    />
                  </div>
                </motion.div>
              </motion.div>
            </div>
          </div>

          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            {/* About Section */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              id="about"
              className="mb-16"
            >
              <h2
                className={`text-3xl font-bold mb-8 ${
                  isDarkMode ? "text-purple-400" : "text-purple-600"
                }`}
              >
                About Me
              </h2>
              <p
                className={`leading-relaxed text-lg ${
                  isDarkMode ? "text-gray-300" : "text-gray-700"
                }`}
              >
                {student.summary}
              </p>
            </motion.section>

            {/* Experience Section */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              id="experience"
              className="mb-16"
            >
              <h2
                className={`text-3xl font-bold mb-8 ${
                  isDarkMode ? "text-purple-400" : "text-purple-600"
                }`}
              >
                Experience
              </h2>
              <div className="space-y-8">
                {student.experiences.map((exp, index) => (
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    key={exp.id}
                    className={`p-6 rounded-lg shadow-xl ${
                      isDarkMode
                        ? "bg-[#1e293b] hover:bg-[#2d3748]"
                        : "bg-white hover:bg-gray-50"
                    } transition-all duration-300 transform hover:-translate-y-1`}
                  >
                    <div className="flex items-center mb-4">
                      <Briefcase
                        className={`h-6 w-6 mr-2 ${
                          isDarkMode ? "text-purple-400" : "text-purple-600"
                        }`}
                      />
                      <h3 className="text-xl font-semibold">{exp.jobTitle}</h3>
                    </div>
                    <p
                      className={`mb-2 ${
                        isDarkMode ? "text-gray-300" : "text-gray-600"
                      }`}
                    >
                      {exp.company}
                    </p>
                    <p
                      className={`text-sm ${
                        isDarkMode ? "text-gray-400" : "text-gray-500"
                      }`}
                    >
                      {exp.startDate} - {exp.endDate || "Present"}
                    </p>
                    <p
                      className={`mt-4 ${
                        isDarkMode ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      {exp.description}
                    </p>
                  </motion.div>
                ))}
              </div>
            </motion.section>

            {/* Projects Section */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              id="projects"
              className="mb-16"
            >
              <h2
                className={`text-3xl font-bold mb-8 ${
                  isDarkMode ? "text-purple-400" : "text-purple-600"
                }`}
              >
                Projects
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {student.projects.map((project, index) => (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    key={project.id}
                    className={`p-6 rounded-lg shadow-xl ${
                      isDarkMode
                        ? "bg-[#1e293b] hover:bg-[#2d3748]"
                        : "bg-white hover:bg-gray-50"
                    } transition-all duration-300 transform hover:-translate-y-1`}
                  >
                    <div className="flex items-center mb-4">
                      <Code2
                        className={`h-6 w-6 mr-2 ${
                          isDarkMode ? "text-purple-400" : "text-purple-600"
                        }`}
                      />
                      <h3 className="text-xl font-semibold">{project.title}</h3>
                    </div>
                    <div
                      dangerouslySetInnerHTML={{ __html: project.description }}
                      className={`mb-4 ${
                        isDarkMode ? "text-gray-300" : "text-gray-700"
                      }`}
                    />
                    <div className="flex flex-wrap gap-2 mb-4">
                      {project.technologies.split(",").map((tech) => (
                        <span
                          key={tech}
                          className={`px-3 py-1 rounded-full text-sm ${
                            isDarkMode
                              ? "bg-purple-900/50 text-purple-200"
                              : "bg-purple-100 text-purple-800"
                          } transition-colors duration-300`}
                        >
                          {tech.trim()}
                        </span>
                      ))}
                    </div>
                    <div className="flex space-x-4">
                      <a
                        href={project.githubLink}
                        className={`flex items-center ${
                          isDarkMode
                            ? "text-purple-400 hover:text-purple-300"
                            : "text-purple-600 hover:text-purple-800"
                        }`}
                      >
                        <Github className="h-5 w-5 mr-1" />
                        <span>Code</span>
                      </a>
                      <a
                        href={project.link}
                        className={`flex items-center ${
                          isDarkMode
                            ? "text-purple-400 hover:text-purple-300"
                            : "text-purple-600 hover:text-purple-800"
                        }`}
                      >
                        Live Demo
                      </a>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.section>

            {/* Education Section */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              id="education"
              className="mb-16"
            >
              <h2
                className={`text-3xl font-bold mb-8 ${
                  isDarkMode ? "text-purple-400" : "text-purple-600"
                }`}
              >
                Education
              </h2>
              <div className="space-y-8">
                {student.education.map((edu, index) => (
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    key={edu.id}
                    className={`p-6 rounded-lg shadow-xl ${
                      isDarkMode
                        ? "bg-[#1e293b] hover:bg-[#2d3748]"
                        : "bg-white hover:bg-gray-50"
                    } transition-all duration-300 transform hover:-translate-y-1`}
                  >
                    <div className="flex items-center mb-4">
                      <GraduationCap
                        className={`h-6 w-6 mr-2 ${
                          isDarkMode ? "text-purple-400" : "text-purple-600"
                        }`}
                      />
                      <h3 className="text-xl font-semibold">{edu.degree}</h3>
                    </div>
                    <p
                      className={`mb-2 ${
                        isDarkMode ? "text-gray-300" : "text-gray-600"
                      }`}
                    >
                      {edu.institution}
                    </p>
                    <p
                      className={`text-sm ${
                        isDarkMode ? "text-gray-400" : "text-gray-500"
                      }`}
                    >
                      {edu.startDate} - {edu.endDate}
                    </p>
                    <p
                      className={`mt-2 ${
                        isDarkMode ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      Grade: {edu.grade}
                    </p>
                  </motion.div>
                ))}
              </div>
            </motion.section>

            {/* Skills Section */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              id="skills"
              className="mb-16"
            >
              <h2
                className={`text-3xl font-bold mb-8 ${
                  isDarkMode ? "text-purple-400" : "text-purple-600"
                }`}
              >
                Skills
              </h2>
              <div className="flex flex-wrap gap-4">
                {student.skills.map((skill, index) => (
                  <motion.span
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.05 }}
                    key={skill}
                    className={`px-4 py-2 rounded-full font-medium ${
                      isDarkMode
                        ? "bg-purple-900/30 text-purple-200 hover:bg-purple-800/40"
                        : "bg-purple-100 text-purple-800 hover:bg-purple-200"
                    } transition-all duration-300 transform hover:-translate-y-1 cursor-default`}
                  >
                    {skill}
                  </motion.span>
                ))}
              </div>
            </motion.section>

            {/* GitHub Stats Section */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mb-16"
            >
              <h2
                className={`text-3xl font-bold mb-8 ${
                  isDarkMode ? "text-purple-400" : "text-purple-600"
                }`}
              >
                GitHub Activity
              </h2>
              <div
                className={`p-8 rounded-lg shadow-xl ${
                  isDarkMode ? "bg-[#1e293b]" : "bg-white"
                } transition-all duration-300`}
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    className={`p-6 rounded-lg ${
                      isDarkMode ? "bg-[#2d3748]" : "bg-purple-50"
                    }`}
                  >
                    <div className="flex items-center justify-center space-x-4">
                      <Star
                        className={`h-8 w-8 ${
                          isDarkMode ? "text-purple-400" : "text-purple-600"
                        }`}
                      />
                      <div className="text-center">
                        <p
                          className={`text-3xl font-bold ${
                            isDarkMode ? "text-purple-400" : "text-purple-600"
                          }`}
                        >
                          {githubStats.stars}
                        </p>
                        <p
                          className={`text-sm ${
                            isDarkMode ? "text-gray-400" : "text-gray-600"
                          }`}
                        >
                          Total Stars
                        </p>
                      </div>
                    </div>
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    className={`p-6 rounded-lg ${
                      isDarkMode ? "bg-[#2d3748]" : "bg-purple-50"
                    }`}
                  >
                    <div className="flex items-center justify-center space-x-4">
                      <GitFork
                        className={`h-8 w-8 ${
                          isDarkMode ? "text-purple-400" : "text-purple-600"
                        }`}
                      />
                      <div className="text-center">
                        <p
                          className={`text-3xl font-bold ${
                            isDarkMode ? "text-purple-400" : "text-purple-600"
                          }`}
                        >
                          {githubStats.forks}
                        </p>
                        <p
                          className={`text-sm ${
                            isDarkMode ? "text-gray-400" : "text-gray-600"
                          }`}
                        >
                          Total Forks
                        </p>
                      </div>
                    </div>
                  </motion.div>
                </div>
                <div className="flex flex-col md:flex-row gap-8 items-center">
                  {/* GitHub Calendar */}
                  <div className="w-full overflow-x-auto">
                    <GitHubCalendar
                      username={student?.githubURL}
                      colorScheme={isDarkMode ? "dark" : "light"}
                    />
                  </div>

                  {/* GitHub Streak Stats */}
                  <div>
                    <img
                      className="max-w-full h-auto object-cover"
                      src={`https://github-readme-streak-stats.herokuapp.com/?user=${githuabData?.[0]?.owner?.login}&theme=radical&hide_border=false`}
                      alt="GitHub Streak Stats"
                    />
                  </div>
                </div>
              </div>
            </motion.section>
          </main>
        </div>
      )}
      {/* Footer */}
      <footer
        className={`${
          isDarkMode ? "bg-[#1e293b]" : "bg-gray-900"
        } text-white py-8 transition-colors duration-300`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <p>
                &copy; {new Date().getFullYear()} {student?.name}. All rights
                reserved.
              </p>
            </div>
            <div className="flex space-x-6">
              <a
                href={student?.githubURL}
                className="text-gray-300 hover:text-purple-400 transition-colors duration-300"
              >
                <Github className="h-6 w-6" />
              </a>
              <a
                href={student?.linkedInURL}
                className="text-gray-300 hover:text-purple-400 transition-colors duration-300"
              >
                <Linkedin className="h-6 w-6" />
              </a>
              <a
                href={`mailto:${student?.email}`}
                className="text-gray-300 hover:text-purple-400 transition-colors duration-300"
              >
                <Mail className="h-6 w-6" />
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Portfolio;
