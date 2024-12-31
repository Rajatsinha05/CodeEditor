import React, { useState } from "react";
import {
  Box,
  Heading,
  List,
  ListItem,
  Text,
  Button,
  IconButton,
  Flex,
  Link,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  useColorModeValue,
  VStack,
  HStack,
  useToast,
  Icon,
} from "@chakra-ui/react";
import {
  FaPlus,
  FaEllipsisV,
  FaGithub,
  FaExternalLinkAlt,
  FaCode,
  FaToolbox,
  FaEdit,
  FaTrash,
  FaProjectDiagram,
} from "react-icons/fa";
import { useDispatch } from "react-redux";
import ProjectsModal from "./ProjectsModal";
import { deleteProject } from "../../../redux/Student/proejctApi";
import { showToast } from "../../../utils/toastUtils";

const ProjectsSection = ({ student, onRefresh }) => {
  // Theme-based colors
  const bgColor = useColorModeValue("white", "gray.900");
  const cardBgColor = useColorModeValue("red.50", "gray.800");
  const hoverBgColor = useColorModeValue("red.100", "teal.800");
  const textColor = useColorModeValue("gray.800", "white");
  const headingColor = useColorModeValue("red.600", "teal.300");
  const buttonBg = useColorModeValue("red.100", "teal.600");
  const buttonText = useColorModeValue("red.900", "white");
  const iconColor = useColorModeValue("red.500", "teal.300");
  const linkColor = useColorModeValue("red.500", "teal.300");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentProject, setCurrentProject] = useState(null);
  const dispatch = useDispatch();
  const toast = useToast();

  const handleSave = () => {
    onRefresh();
    setIsModalOpen(false);
  };

  const handleEditProject = (project) => {
    setCurrentProject(project);
    setIsModalOpen(true);
  };

  const handleDeleteProject = async (projectId) => {
    try {
      await dispatch(deleteProject(projectId));
      onRefresh();
      showToast(toast, "Project deleted successfully!", "success");
    } catch (error) {
      showToast(toast, "Failed to delete the project.", "error");
    }
  };

  return (
    <Box
      bg={bgColor}
      p={6}
      borderRadius="lg"
      boxShadow="lg"
      mb={6}
      w="100%"
      maxW="1200px"
      mx="auto"
    >
      <Flex align="center" justify="space-between" mb={6}>
        <Flex align="center">
          <Icon as={FaProjectDiagram} color={headingColor} mr={2} />
          <Heading size="lg" color={headingColor}>
            Projects
          </Heading>
        </Flex>
        <Button
          size="md"
          bg={buttonBg}
          color={buttonText}
          leftIcon={<FaPlus />}
          onClick={() => {
            setCurrentProject(null);
            setIsModalOpen(true);
          }}
          _hover={{ bg: useColorModeValue("red.200", "teal.500") }}
        >
          Add Project
        </Button>
      </Flex>
      {student?.projects?.length > 0 ? (
        <List spacing={6}>
          {student.projects.map((project) => (
            <ListItem
              key={project.id}
              bg={cardBgColor}
              p={5}
              borderRadius="lg"
              boxShadow="sm"
              _hover={{ bg: hoverBgColor, boxShadow: "md" }}
              transition="background-color 0.3s, box-shadow 0.3s"
            >
              <Flex align="center" justify="space-between">
                <VStack align="start" spacing={3} w="full">
                  <HStack>
                    <FaCode color={linkColor} />
                    <Text fontWeight="bold" fontSize="lg" color={textColor}>
                      {project.title}
                    </Text>
                  </HStack>
                  <Box
                    color={textColor}
                    p={3}
                    borderRadius="md"
                    fontSize="sm"
                    w="full"
                  >
                    <strong>Description:</strong>{" "}
                    <Box
                      dangerouslySetInnerHTML={{ __html: project.description }}
                    />
                  </Box>
                  <HStack>
                    <FaToolbox color={linkColor} />
                    <Text fontSize="sm" color={textColor}>
                      <strong>Technologies:</strong> {project.technologies}
                    </Text>
                  </HStack>
                  <HStack spacing={4}>
                    {project.githubLink && (
                      <Link
                        href={project.githubLink}
                        color={linkColor}
                        isExternal
                        display="flex"
                        alignItems="center"
                      >
                        <FaGithub style={{ marginRight: "5px" }} />
                        GitHub
                      </Link>
                    )}
                    {project.link && (
                      <Link
                        href={project.link}
                        color={linkColor}
                        isExternal
                        display="flex"
                        alignItems="center"
                      >
                        <FaExternalLinkAlt style={{ marginRight: "5px" }} />
                        Live Demo
                      </Link>
                    )}
                  </HStack>
                </VStack>
                <Menu>
                  <MenuButton
                    as={IconButton}
                    icon={<FaEllipsisV />}
                    size="sm"
                    aria-label="Options"
                    variant="ghost"
                    color={linkColor}
                  />
                  <MenuList>
                    <MenuItem
                      icon={<FaEdit />}
                      onClick={() => handleEditProject(project)}
                    >
                      Edit
                    </MenuItem>
                    <MenuItem
                      icon={<FaTrash />}
                      onClick={() => handleDeleteProject(project.id)}
                    >
                      Delete
                    </MenuItem>
                  </MenuList>
                </Menu>
              </Flex>
            </ListItem>
          ))}
        </List>
      ) : (
        <Text color={textColor} textAlign="center" mt={6} fontSize="lg">
          No projects added yet.
        </Text>
      )}
      <ProjectsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        projects={student?.projects || []}
        onSave={handleSave}
        studentId={student?.id}
        currentProject={currentProject}
      />
    </Box>
  );
};

export default React.memo(ProjectsSection);
