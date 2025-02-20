import React from 'react';
import { Github, Linkedin, Mail, Phone, ExternalLink } from 'lucide-react';

const CreativeTemplate = ({ student, forwardedRef }) => {
  return (
    <div ref={forwardedRef} className="bg-gradient-to-br from-indigo-50 to-white p-8 shadow-lg">
      <div className="max-w-4xl mx-auto">
        <header className="text-center mb-12">
          <h1 className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 mb-4">
            {student.name}
          </h1>
          <p className="text-xl text-gray-600 mb-6">{student.course}</p>
          <div className="flex justify-center gap-6 text-gray-600">
            <a href={`mailto:${student.email}`} className="flex items-center gap-2 hover:text-indigo-600 transition-colors">
              <Mail size={20} /> {student.email}
            </a>
            <a href={`tel:${student.phoneNumber}`} className="flex items-center gap-2 hover:text-indigo-600 transition-colors">
              <Phone size={20} /> {student.phoneNumber}
            </a>
            <a href={`https://github.com/${student.githubURL}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-indigo-600 transition-colors">
              <Github size={20} /> GitHub
            </a>
            <a href={student.linkedInURL} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-indigo-600 transition-colors">
              <Linkedin size={20} /> LinkedIn
            </a>
          </div>
        </header>

        <section className="mb-12 text-center max-w-2xl mx-auto">
          <p className="text-lg text-gray-700 leading-relaxed">{student.summary}</p>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold text-indigo-600 mb-6 text-center">Skills</h2>
          <div className="flex flex-wrap justify-center gap-3">
            {student.skills.map((skill) => (
              <span key={skill} className="px-4 py-2 bg-white rounded-full shadow-md text-indigo-600 font-medium">
                {skill}
              </span>
            ))}
          </div>
        </section>

        <div className="grid md:grid-cols-2 gap-12">
          <section>
            <h2 className="text-2xl font-bold text-indigo-600 mb-6">Experience</h2>
            {student.experiences.map((exp) => (
              <div key={exp.id} className="mb-8 relative pl-6 before:content-[''] before:absolute before:left-0 before:top-0 before:bottom-0 before:w-0.5 before:bg-indigo-200">
                <h3 className="text-xl font-semibold text-gray-800">{exp.jobTitle}</h3>
                <p className="text-indigo-600 mb-1">{exp.company}</p>
                <p className="text-sm text-gray-500 mb-2">
                  {new Date(exp.startDate).toLocaleDateString()} - 
                  {exp.endDate ? new Date(exp.endDate).toLocaleDateString() : 'Present'}
                </p>
                <p className="text-gray-700">{exp.description}</p>
              </div>
            ))}
          </section>

          <section>
            <h2 className="text-2xl font-bold text-indigo-600 mb-6">Projects</h2>
            {student.projects.map((project) => (
              <div key={project.id} className="mb-8 bg-white p-6 rounded-lg shadow-md">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-xl font-semibold text-gray-800">{project.title}</h3>
                  <div className="flex gap-3">
                    <a href={project.githubLink} target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-indigo-600 transition-colors">
                      <Github size={20} />
                    </a>
                    <a href={project.link} target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-indigo-600 transition-colors">
                      <ExternalLink size={20} />
                    </a>
                  </div>
                </div>
                <div dangerouslySetInnerHTML={{ __html: project.description }} className="text-gray-700 mb-3" />
                <div className="flex flex-wrap gap-2">
                  {project.technologies.split(',').map((tech) => (
                    <span key={tech} className="px-2 py-1 bg-indigo-50 text-indigo-600 rounded text-sm">
                      {tech.trim()}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </section>
        </div>

        <div className="grid md:grid-cols-2 gap-12 mt-12">
          <section>
            <h2 className="text-2xl font-bold text-indigo-600 mb-6">Education</h2>
            {student.education.map((edu) => (
              <div key={edu.id} className="mb-6 bg-white p-4 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold text-gray-800">{edu.degree}</h3>
                <p className="text-indigo-600">{edu.institution}</p>
                <p className="text-sm text-gray-500">
                  {new Date(edu.startDate).toLocaleDateString()} - {new Date(edu.endDate).toLocaleDateString()}
                </p>
                <p className="text-gray-700 mt-1">Grade: {edu.grade}</p>
              </div>
            ))}
          </section>

          <section>
            <h2 className="text-2xl font-bold text-indigo-600 mb-6">Certifications</h2>
            {student.certificates.map((cert) => (
              <div key={cert.id} className="mb-6 bg-white p-4 rounded-lg shadow-md">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-semibold text-gray-800">{cert.title}</h3>
                  <a href={cert.link} target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-indigo-600 transition-colors">
                    <ExternalLink size={20} />
                  </a>
                </div>
                <p className="text-indigo-600">{cert.institution}</p>
                <p className="text-sm text-gray-500">Issued: {new Date(cert.dateIssued).toLocaleDateString()}</p>
              </div>
            ))}
          </section>
        </div>
      </div>
    </div>
  );
};

export default CreativeTemplate;