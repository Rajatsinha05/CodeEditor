import React from "react";
import { Github, Linkedin, Mail, Phone, ExternalLink } from "lucide-react";

const ModernTemplate = ({ student, forwardedRef }) => {
  return (
    <div
      ref={forwardedRef}
      className="bg-white p-8 shadow-lg modern-template"
      // data-pdf-ignore="true"
    >
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">
          {student.name}
        </h1>
        <p className="text-lg text-gray-600 mb-4">{student.course}</p>
        <div className="flex justify-center gap-4 text-gray-600">
          <a
            href={`mailto:${student.email}`}
            className="flex items-center gap-1 hover:text-blue-600"
          >
            <Mail size={18} /> {student.email}
          </a>
          <a
            href={`tel:${student.phoneNumber}`}
            className="flex items-center gap-1 hover:text-blue-600"
          >
            <Phone size={18} /> {student.phoneNumber}
          </a>
          <a
            href={`https://github.com/${student.githubURL}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 hover:text-blue-600"
          >
            <Github size={18} /> GitHub
          </a>
          <a
            href={student.linkedInURL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 hover:text-blue-600"
          >
            <Linkedin size={18} /> LinkedIn
          </a>
        </div>
      </div>

      <section className="mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-3 border-b-2 border-gray-200 pb-2">
          Summary
        </h2>
        <p className="text-gray-700">{student.summary}</p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-3 border-b-2 border-gray-200 pb-2">
          Skills
        </h2>
        <div className="flex flex-wrap gap-2">
          {student.skills.map((skill) => (
            <span
              key={skill}
              className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm"
            >
              {skill}
            </span>
          ))}
        </div>
      </section>

      <div className="grid grid-cols-2 gap-8">
        <div>
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-3 border-b-2 border-gray-200 pb-2">
              Experience
            </h2>
            {student.experiences.map((exp) => (
              <div key={exp.id} className="mb-4">
                <h3 className="text-xl font-semibold text-gray-800">
                  {exp.jobTitle}
                </h3>
                <p className="text-gray-600">{exp.company}</p>
                <p className="text-sm text-gray-500">
                  {new Date(exp.startDate).toLocaleDateString()} -
                  {exp.endDate
                    ? new Date(exp.endDate).toLocaleDateString()
                    : "Present"}
                </p>
                <p className="text-gray-700 mt-2">{exp.description}</p>
              </div>
            ))}
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-3 border-b-2 border-gray-200 pb-2">
              Education
            </h2>
            {student.education.map((edu) => (
              <div key={edu.id} className="mb-4">
                <h3 className="text-xl font-semibold text-gray-800">
                  {edu.degree}
                </h3>
                <p className="text-gray-600">{edu.institution}</p>
                <p className="text-sm text-gray-500">
                  {new Date(edu.startDate).toLocaleDateString()} -{" "}
                  {new Date(edu.endDate).toLocaleDateString()}
                </p>
                <p className="text-gray-700">Grade: {edu.grade}</p>
              </div>
            ))}
          </section>
        </div>

        <div>
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-3 border-b-2 border-gray-200 pb-2">
              Projects
            </h2>
            {student.projects.map((project) => (
              <div key={project.id} className="mb-4">
                <div className="flex items-center gap-2">
                  <h3 className="text-xl font-semibold text-gray-800">
                    {project.title}
                  </h3>
                  <div className="flex gap-2">
                    <a
                      href={project.githubLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-600 hover:text-blue-600"
                    >
                      <Github size={16} />
                    </a>
                    <a
                      href={project.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-600 hover:text-blue-600"
                    >
                      <ExternalLink size={16} />
                    </a>
                  </div>
                </div>
                <div
                  dangerouslySetInnerHTML={{ __html: project.description }}
                  className="text-gray-700 mt-1"
                />
                <div className="flex flex-wrap gap-2 mt-2">
                  {project.technologies.split(",").map((tech) => (
                    <span
                      key={tech}
                      className="bg-gray-100 text-gray-700 px-2 py-1 rounded-md text-sm"
                    >
                      {tech.trim()}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-3 border-b-2 border-gray-200 pb-2">
              Certifications
            </h2>
            {student.certificates.map((cert) => (
              <div key={cert.id} className="mb-4">
                <div className="flex items-center gap-2">
                  <h3 className="text-xl font-semibold text-gray-800">
                    {cert.title}
                  </h3>
                  <a
                    href={cert.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-600 hover:text-blue-600"
                  >
                    <ExternalLink size={16} />
                  </a>
                </div>
                <p className="text-gray-600">{cert.institution}</p>
                <p className="text-sm text-gray-500">
                  Issued: {new Date(cert.dateIssued).toLocaleDateString()}
                </p>
              </div>
            ))}
          </section>
        </div>
      </div>
    </div>
  );
};

export default ModernTemplate;
