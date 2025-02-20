import React from 'react';
import { Github, Linkedin, Mail, Phone, ExternalLink } from 'lucide-react';

const MinimalTemplate = ({ student, forwardedRef }) => {
  return (
    <div ref={forwardedRef} className="bg-white p-8 shadow-lg max-w-4xl mx-auto">
      <header className="mb-8">
        <h1 className="text-3xl font-light text-gray-900 mb-2">{student.name}</h1>
        <p className="text-gray-600 mb-4">{student.course}</p>
        <div className="flex flex-wrap gap-4 text-sm text-gray-600">
          <a href={`mailto:${student.email}`} className="flex items-center gap-1 hover:text-gray-900">
            <Mail size={16} /> {student.email}
          </a>
          <a href={`tel:${student.phoneNumber}`} className="flex items-center gap-1 hover:text-gray-900">
            <Phone size={16} /> {student.phoneNumber}
          </a>
          <a href={`https://github.com/${student.githubURL}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:text-gray-900">
            <Github size={16} /> GitHub
          </a>
          <a href={student.linkedInURL} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:text-gray-900">
            <Linkedin size={16} /> LinkedIn
          </a>
        </div>
      </header>

      <section className="mb-6">
        <p className="text-gray-700 leading-relaxed">{student.summary}</p>
      </section>

      <section className="mb-8">
        <h2 className="text-lg font-medium text-gray-900 mb-3">Skills</h2>
        <div className="flex flex-wrap gap-2">
          {student.skills.map((skill) => (
            <span key={skill} className="text-gray-600 text-sm border border-gray-200 px-2 py-1 rounded">
              {skill}
            </span>
          ))}
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Experience</h2>
        {student.experiences.map((exp) => (
          <div key={exp.id} className="mb-4">
            <div className="flex justify-between items-baseline mb-1">
              <h3 className="text-gray-900">{exp.jobTitle} at {exp.company}</h3>
              <span className="text-sm text-gray-500">
                {new Date(exp.startDate).toLocaleDateString()} - 
                {exp.endDate ? new Date(exp.endDate).toLocaleDateString() : 'Present'}
              </span>
            </div>
            <p className="text-gray-700 text-sm">{exp.description}</p>
          </div>
        ))}
      </section>

      <section className="mb-8">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Projects</h2>
        <div className="grid gap-4">
          {student.projects.map((project) => (
            <div key={project.id} className="border-l-2 border-gray-200 pl-4">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-gray-900">{project.title}</h3>
                <div className="flex gap-2">
                  <a href={project.githubLink} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-gray-900">
                    <Github size={14} />
                  </a>
                  <a href={project.link} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-gray-900">
                    <ExternalLink size={14} />
                  </a>
                </div>
              </div>
              <div dangerouslySetInnerHTML={{ __html: project.description }} className="text-gray-700 text-sm mb-2" />
              <div className="flex flex-wrap gap-1">
                {project.technologies.split(',').map((tech) => (
                  <span key={tech} className="text-xs text-gray-500">
                    {tech.trim()}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <div className="grid grid-cols-2 gap-8">
        <section>
          <h2 className="text-lg font-medium text-gray-900 mb-4">Education</h2>
          {student.education.map((edu) => (
            <div key={edu.id} className="mb-3">
              <h3 className="text-gray-900">{edu.degree}</h3>
              <p className="text-sm text-gray-600">{edu.institution}</p>
              <p className="text-xs text-gray-500">
                {new Date(edu.startDate).toLocaleDateString()} - {new Date(edu.endDate).toLocaleDateString()}
                {edu.grade && ` • Grade: ${edu.grade}`}
              </p>
            </div>
          ))}
        </section>

        <section>
          <h2 className="text-lg font-medium text-gray-900 mb-4">Certifications</h2>
          {student.certificates.map((cert) => (
            <div key={cert.id} className="mb-3">
              <div className="flex items-center gap-2">
                <h3 className="text-gray-900">{cert.title}</h3>
                <a href={cert.link} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-gray-900">
                  <ExternalLink size={14} />
                </a>
              </div>
              <p className="text-sm text-gray-600">{cert.institution}</p>
              <p className="text-xs text-gray-500">Issued: {new Date(cert.dateIssued).toLocaleDateString()}</p>
            </div>
          ))}
        </section>
      </div>
    </div>
  );
};

export default MinimalTemplate;