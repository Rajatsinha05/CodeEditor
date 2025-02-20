import React from 'react';
import { Github, Linkedin, Mail, Phone, ExternalLink } from 'lucide-react';

const ProfessionalTemplate = ({ student, forwardedRef }) => {
  return (
    <div ref={forwardedRef} className="bg-white p-8 shadow-lg">
      <div className="max-w-4xl mx-auto">
        <header className="border-b-4 border-gray-800 pb-6 mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">{student.name}</h1>
          <p className="text-xl text-gray-600 mb-4">{student.course}</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <a href={`mailto:${student.email}`} className="flex items-center gap-2 text-gray-600 hover:text-gray-900">
              <Mail size={18} /> {student.email}
            </a>
            <a href={`tel:${student.phoneNumber}`} className="flex items-center gap-2 text-gray-600 hover:text-gray-900">
              <Phone size={18} /> {student.phoneNumber}
            </a>
            <a href={`https://github.com/${student.githubURL}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-gray-600 hover:text-gray-900">
              <Github size={18} /> GitHub
            </a>
            <a href={student.linkedInURL} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-gray-600 hover:text-gray-900">
              <Linkedin size={18} /> LinkedIn
            </a>
          </div>
        </header>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Professional Summary</h2>
              <p className="text-gray-700 leading-relaxed">{student.summary}</p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Professional Experience</h2>
              {student.experiences.map((exp) => (
                <div key={exp.id} className="mb-6">
                  <div className="flex justify-between items-baseline mb-2">
                    <h3 className="text-xl font-semibold text-gray-800">{exp.jobTitle}</h3>
                    <span className="text-gray-600 text-sm">
                      {new Date(exp.startDate).toLocaleDateString()} - 
                      {exp.endDate ? new Date(exp.endDate).toLocaleDateString() : 'Present'}
                    </span>
                  </div>
                  <p className="text-gray-700 font-medium mb-2">{exp.company}</p>
                  <p className="text-gray-600">{exp.description}</p>
                </div>
              ))}
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Projects</h2>
              {student.projects.map((project) => (
                <div key={project.id} className="mb-6">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-semibold text-gray-800">{project.title}</h3>
                    <div className="flex gap-2">
                      <a href={project.githubLink} target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-gray-900">
                        <Github size={18} />
                      </a>
                      <a href={project.link} target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-gray-900">
                        <ExternalLink size={18} />
                      </a>
                    </div>
                  </div>
                  <div dangerouslySetInnerHTML={{ __html: project.description }} className="text-gray-700 mb-2" />
                  <div className="flex flex-wrap gap-2">
                    {project.technologies.split(',').map((tech) => (
                      <span key={tech} className="bg-gray-100 text-gray-700 px-3 py-1 rounded text-sm">
                        {tech.trim()}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </section>
          </div>

          <div>
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Skills</h2>
              <div className="flex flex-col gap-2">
                {student.skills.map((skill) => (
                  <span key={skill} className="bg-gray-800 text-white px-3 py-2 rounded text-sm">
                    {skill}
                  </span>
                ))}
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Education</h2>
              {student.education.map((edu) => (
                <div key={edu.id} className="mb-4">
                  <h3 className="text-lg font-semibold text-gray-800">{edu.degree}</h3>
                  <p className="text-gray-600">{edu.institution}</p>
                  <p className="text-sm text-gray-500">
                    {new Date(edu.startDate).toLocaleDateString()} - {new Date(edu.endDate).toLocaleDateString()}
                  </p>
                  <p className="text-gray-700">Grade: {edu.grade}</p>
                </div>
              ))}
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Certifications</h2>
              {student.certificates.map((cert) => (
                <div key={cert.id} className="mb-4">
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-semibold text-gray-800">{cert.title}</h3>
                    <a href={cert.link} target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-gray-900">
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
    </div>
  );
};

export default ProfessionalTemplate;