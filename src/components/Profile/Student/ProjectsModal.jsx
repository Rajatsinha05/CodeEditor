import React, { useState, useEffect } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  Button,
  Input,
  List,
  ListItem,
  IconButton,
  Flex,
  Box,
  Text,
  useColorModeValue,
  useToast,
} from "@chakra-ui/react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css"; // Import Quill styles
import { FaTrash, FaPlus } from "react-icons/fa";
import { useDispatch } from "react-redux";
import {
  createProject,
  updateProject,
} from "../../../redux/Student/proejctApi";
import { showToast } from "../../../utils/toastUtils";

const ProjectsModal = ({
  isOpen,
  onClose,
  projects,
  onSave,
  studentId,
  currentProject,
}) => {
  const [projectList, setProjectList] = useState([...projects]);
  const [newProject, setNewProject] = useState({
    id: null,
    title: "",
    description: "",
    technologies: "",
    githubLink: "",
    link: "",
  });

  const inputBgColor = useColorModeValue("white", "gray.800");
  const inputTextColor = useColorModeValue("gray.800", "white");
  const modalBgColor = useColorModeValue("gray.50", "gray.900");
  const dispatch = useDispatch();
  const toast = useToast();

  useEffect(() => {
    if (currentProject) {
      setNewProject(currentProject);
    } else {
      setNewProject({
        id: null,
        title: "",
        description: "",
        technologies: "",
        githubLink: "",
        link: "",
      });
    }
  }, [currentProject]);

  const handleAddOrUpdateProject = async () => {
    if (newProject.title.trim() && newProject.description.trim()) {
      try {
        if (newProject.id) {
          // Update existing project
          const updatedProjects = projectList.map((project) =>
            project.id === newProject.id ? newProject : project
          );
          setProjectList(updatedProjects);
          await dispatch(
            updateProject({
              id: newProject.id,
              updates: { ...newProject, studentId },
            })
          );
          showToast(toast, "Project Updated", "success");
        } else {
          // Add new project
          const newProjectWithId = { ...newProject, id: Date.now().toString() };
          setProjectList([...projectList, newProjectWithId]);
          await dispatch(createProject({ ...newProjectWithId, studentId }));
          showToast(toast, "Project Added", "success");
        }

        setNewProject({
          id: null,
          title: "",
          description: "",
          technologies: "",
          githubLink: "",
          link: "",
        });
      } catch (error) {
        showToast(toast, error, "error");
      }
    }
  };

  const handleRemoveProject = async (index) => {
    try {
      const updatedProjects = projectList.filter((_, i) => i !== index);
      setProjectList(updatedProjects);
      showToast(toast, "Project Removed", "success");
    } catch (error) {
      showToast(toast, error, "error");
    }
  };

  const isAddDisabled =
    !newProject.title.trim() || !newProject.description.trim();

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent bg={modalBgColor}>
        <ModalHeader>
          {newProject.id ? "Edit Project" : "Add Project"}
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <List spacing={4} mb={4}>
            {projectList.map((project, index) => (
              <ListItem key={index}>
                <Flex
                  align="center"
                  justify="space-between"
                  bg={useColorModeValue("gray.100", "gray.700")}
                  p={3}
                  borderRadius="md"
                >
                  <Box>
                    <Text fontWeight="bold">{project.title}</Text>
                    <Text fontSize="sm" noOfLines={2}>
                      {project.description}
                    </Text>
                    <Text fontSize="sm">
                      <strong>Technologies:</strong> {project.technologies}
                    </Text>
                  </Box>
                  <Flex gap={2}>
                    <IconButton
                      icon={<FaTrash />}
                      size="sm"
                      colorScheme="red"
                      onClick={() => handleRemoveProject(index)}
                      aria-label="Remove Project"
                    />
                  </Flex>
                </Flex>
              </ListItem>
            ))}
          </List>
          <Flex direction="column" gap={3}>
            <Input
              placeholder="Project Title"
              value={newProject.title}
              onChange={(e) =>
                setNewProject((prev) => ({ ...prev, title: e.target.value }))
              }
              bg={inputBgColor}
              color={inputTextColor}
            />
            <ReactQuill
              theme="snow"
              value={newProject.description}
              onChange={(value) =>
                setNewProject((prev) => ({ ...prev, description: value }))
              }
              style={{
                backgroundColor: inputBgColor,
                color: inputTextColor,
                borderRadius: "8px",
              }}
            />
            <Input
              placeholder="Technologies (comma-separated)"
              value={newProject.technologies}
              onChange={(e) =>
                setNewProject((prev) => ({
                  ...prev,
                  technologies: e.target.value,
                }))
              }
              bg={inputBgColor}
              color={inputTextColor}
            />
            <Input
              placeholder="GitHub Link"
              value={newProject.githubLink}
              onChange={(e) =>
                setNewProject((prev) => ({
                  ...prev,
                  githubLink: e.target.value,
                }))
              }
              bg={inputBgColor}
              color={inputTextColor}
            />
            <Input
              placeholder="Live Demo Link (optional)"
              value={newProject.link}
              onChange={(e) =>
                setNewProject((prev) => ({
                  ...prev,
                  link: e.target.value,
                }))
              }
              bg={inputBgColor}
              color={inputTextColor}
            />
            <Button
              size="sm"
              leftIcon={<FaPlus />}
              colorScheme="teal"
              onClick={handleAddOrUpdateProject}
              isDisabled={isAddDisabled}
            >
              {newProject.id ? "Update Project" : "Add Project"}
            </Button>
          </Flex>
        </ModalBody>
        <ModalFooter>
          <Button
            size="sm"
            colorScheme="teal"
            mr={2}
            onClick={() => onSave(projectList)}
          >
            Save All
          </Button>
          <Button size="sm" variant="ghost" onClick={onClose}>
            Cancel
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default React.memo(ProjectsModal);
