import React, { useEffect, useRef, useState } from "react";
import {
  Box,
  Text,
  VStack,
  HStack,
  Divider,
  Link,
  Grid,
  GridItem,
  Icon,
  Badge,
  Tooltip,
} from "@chakra-ui/react";
import {
  FaGithub,
  FaLinkedin,
  FaEnvelope,
  FaPhone,
  FaDownload,
} from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { fetchStudentDetailsById } from "../../../redux/Student/studentsSlice";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";

const ResumeSection = () => {
  const { studentId } = useParams();
  const { student } = useSelector((store) => store.student);
  const dispatch = useDispatch();

  const printRef = useRef(null); // Reference for the printable component
  const [sections, setSections] = useState([
    "CONTACT",
    "EDUCATION",
    "SKILLS",
    "SUMMARY",
    "PROJECTS",
    "EXPERIENCE",
    "CERTIFICATIONS",
  ]);

  // Fetch student details
  const refreshStudentData = () => {
    if (studentId) {
      dispatch(fetchStudentDetailsById(studentId));
    }
  };

  useEffect(() => {
    refreshStudentData();
  }, [studentId]);

  // PDF Download Handler
  const handleDownloadPDF = async () => {
    const element = printRef.current;
    const canvas = await html2canvas(element, { scale: 2 });
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");
    const pdfWidth = 210; // A4 width in mm
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save(`${student?.name || "Student"}_${student?.grid || "Resume"}.pdf`);
  };

  // Handle drag and drop
  const handleDragStart = (index) => (event) => {
    event.dataTransfer.setData("sectionIndex", index);
  };

  const handleDrop = (index) => (event) => {
    const draggedIndex = parseInt(event.dataTransfer.getData("sectionIndex"), 10);
    const updatedSections = [...sections];
    const [draggedSection] = updatedSections.splice(draggedIndex, 1);
    updatedSections.splice(index, 0, draggedSection);
    setSections(updatedSections);
  };

  const allowDrop = (event) => {
    event.preventDefault();
  };

  if (!student) {
    return (
      <Box textAlign="center" py={10}>
        <Text>No student data available</Text>
      </Box>
    );
  }

  return (
    <Box textAlign="center" p={4}>
      {/* Download Icon */}
      <Tooltip label="Download PDF" aria-label="Download PDF">
        <Icon
          as={FaDownload}
          boxSize={6}
          color="gray.700"
          cursor="pointer"
          mb={4}
          onClick={handleDownloadPDF}
        />
      </Tooltip>

      <Box
        ref={printRef} // Attach the ref here
        bg="white"
        p={10}
        width="210mm" // A4 width in mm
        mx="auto"
        borderRadius="lg"
        shadow="xl"
        border="1px solid #e2e8f0"
        fontFamily="Arial, sans-serif"
      >
        {/* Header Section */}
        <VStack spacing={2} mb={6} textAlign="center">
          <Text fontSize="4xl" fontWeight="bold" color="black">
            {student.name?.toUpperCase() || "STUDENT NAME"}
          </Text>
          <Text fontSize="lg" fontWeight="semibold" color="gray.700">
            {student.course || "Course Name"}
          </Text>
        </VStack>

        <Divider borderColor="gray.300" my={4} />

        {/* Dynamic Sections */}
        {sections.map((section, index) => (
          <Box
            key={section}
            draggable
            onDragStart={handleDragStart(index)}
            onDrop={handleDrop(index)}
            onDragOver={allowDrop}
            mb={6}
          >
            {renderSection(section, student)}
          </Box>
        ))}
      </Box>
    </Box>
  );
};

const renderSection = (section, student) => {
  switch (section) {
    case "CONTACT":
      return (
        <Section title="CONTACT">
          <VStack align="start" spacing={2}>
            <HStack>
              <Icon as={FaPhone} color="black" />
              <Text fontSize="sm" color="gray.700">
                {student.phoneNumber || "N/A"}
              </Text>
            </HStack>
            <HStack>
              <Icon as={FaEnvelope} color="black" />
              <Text fontSize="sm" color="gray.700">
                {student.email || "N/A"}
              </Text>
            </HStack>
            <HStack>
              <Icon as={FaGithub} color="black" />
              {student.githubURL ? (
                <Link href={student.githubURL} isExternal color="gray.700">
                  @{new URL(student.githubURL).pathname.substring(1)}
                </Link>
              ) : (
                <Text color="gray.500">No GitHub link</Text>
              )}
            </HStack>
            <HStack>
              <Icon as={FaLinkedin} color="black" />
              {student.linkedInURL ? (
                <Link href={student.linkedInURL} isExternal color="gray.700">
                  @{new URL(student.linkedInURL).pathname.substring(1)}
                </Link>
              ) : (
                <Text color="gray.500">No LinkedIn link</Text>
              )}
            </HStack>
          </VStack>
        </Section>
      );
    case "EDUCATION":
      return (
        <Section title="EDUCATION">
          {student.education?.length > 0 ? (
            student.education.map((edu) => (
              <Box key={edu.id} mb={4}>
                <Text fontWeight="semibold" color="black">
                  {edu.degree || "Degree Name"}
                </Text>
                <Text fontSize="sm" color="gray.700">
                  {edu.institution || "Institution Name"}
                </Text>
                <Text fontSize="sm" color="gray.600">
                  {edu.startDate} - {edu.endDate || "Present"} (Grade: {edu.grade || "N/A"})
                </Text>
              </Box>
            ))
          ) : (
            <Text color="gray.500">No education details available</Text>
          )}
        </Section>
      );
    case "SKILLS":
      return (
        <Section title="SKILLS">
          <Box>
            {student.skills?.length > 0 ? (
              student.skills.map((skill, index) => (
                <Badge
                  key={index}
                  colorScheme="gray"
                  px={3}
                  py={1}
                  fontSize="xs"
                  mr={2}
                  mb={2}
                >
                  {skill}
                </Badge>
              ))
            ) : (
              <Text color="gray.500">No skills available</Text>
            )}
          </Box>
        </Section>
      );
    case "SUMMARY":
      return (
        <Section title="SUMMARY">
          <Text fontSize="sm" color="gray.700">
            {student.summary || "No summary provided."}
          </Text>
        </Section>
      );
    case "PROJECTS":
      return (
        <Section title="PROJECTS">
          {student.projects?.length > 0 ? (
            student.projects.map((project) => (
              <Box key={project.id} mb={4}>
                <HStack justify="space-between">
                  <Text fontWeight="semibold" color="black">
                    {project.title || "Project Title"}
                  </Text>
                  <Link
                    href={project.githubLink}
                    isExternal
                    color="gray.700"
                  >
                    GitHub
                  </Link>
                </HStack>
                <Text
                  fontSize="sm"
                  dangerouslySetInnerHTML={{
                    __html: project.description || "No description provided.",
                  }}
                  color="gray.700"
                />
                <Text fontSize="xs" color="gray.600">
                  Technologies: {project.technologies || "N/A"}
                </Text>
              </Box>
            ))
          ) : (
            <Text color="gray.500">No projects available</Text>
          )}
        </Section>
      );
    case "EXPERIENCE":
      return (
        <Section title="EXPERIENCE">
          {student.experiences?.length > 0 ? (
            student.experiences.map((exp) => (
              <Box key={exp.id} mb={4}>
                <Text fontWeight="semibold" color="black">
                  {exp.jobTitle || "Job Title"}
                </Text>
                <Text fontSize="sm" color="gray.700">
                  {exp.company || "Company Name"}
                </Text>
                <Text fontSize="sm" color="gray.600">
                  {exp.startDate} - {exp.endDate || "Present"}
                </Text>
                <Text fontSize="sm" color="gray.700">
                  {exp.description || "No description provided."}
                </Text>
              </Box>
            ))
          ) : (
            <Text color="gray.500">No experience available</Text>
          )}
        </Section>
      );
    case "CERTIFICATIONS":
      return (
        <Section title="CERTIFICATIONS">
          {student.certificates?.length > 0 ? (
            student.certificates.map((cert) => (
              <Box key={cert.id} mb={2}>
                <Text fontWeight="semibold" color="black">
                  {cert.title || "Certificate Title"}
                </Text>
                <Text fontSize="sm" color="gray.600">
                  {cert.institution || "Institution Name"} - Issued: {cert.dateIssued || "N/A"}
                </Text>
              </Box>
            ))
          ) : (
            <Text color="gray.500">No certifications available</Text>
          )}
        </Section>
      );
    default:
      return null;
  }
};

const Section = ({ title, children }) => (
  <Box align="start">
    <Text fontSize="lg" fontWeight="bold" mb={2} color="gray.700" textAlign="left">
      {title}
    </Text>
    <Divider borderColor="gray.300" mb={4} />
    {children}
  </Box>
);

export default ResumeSection;
