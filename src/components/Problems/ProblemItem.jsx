import React from "react";
import { Link } from "react-router-dom";
import {
  Box,
  Flex,
  Text,
  ListItem,
  IconButton,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  Button,
  useColorModeValue,
  Divider,
  VStack,
} from "@chakra-ui/react";
import { MdMoreVert, MdDelete, MdEdit, MdBookmark } from "react-icons/md";
import { useDispatch } from "react-redux";
import { deleteQuestion } from "../../redux/Question/questionApi";
import AddQuestions from "../../Pages/AddQuestions"; // Adjust the path as needed

const ProblemItem = ({ question, currentUserId, currentUserRole }) => {
  const dispatch = useDispatch();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const canModify =
    currentUserRole === "SUPERADMIN" || currentUserRole === "ADMIN";

  const handleDelete = (e) => {
    e.preventDefault();
    dispatch(deleteQuestion(question.id));
  };

  const handleEdit = (e) => {
    e.preventDefault();
    onOpen(); // Open the modal
  };

  const handleBookmark = (e) => {
    e.preventDefault();
    // Logic for bookmarking the question
  };
  const headerBgColor = useColorModeValue("gray.100", "gray.700");
  const bodyBgColor = useColorModeValue("white", "gray.800");
  return (
    <>
      <ListItem borderRadius="md" backgroundColor="rgba(0, 0, 0, 0.03)">
        <Flex p={4} alignItems="center" justifyContent="space-between">
          {/* Question Title and Details */}
          <Link
            to={`/problem/${question.id}`}
            style={{ textDecoration: "none", display: "block", flexGrow: 1 }}
          >
            <Box>
              <Text>{question.title}</Text>
              <Text mt={2} color="gray.500">
                {question.difficulty}
              </Text>
            </Box>
          </Link>

          {/* Actions Menu */}
          <Menu>
            <MenuButton
              as={IconButton}
              icon={<MdMoreVert />}
              aria-label="Actions"
              variant="ghost"
            />
            <MenuList>
              <MenuItem icon={<MdBookmark />} onClick={handleBookmark}>
                Bookmark
              </MenuItem>
              {canModify && (
                <>
                  <MenuItem icon={<MdEdit />} onClick={handleEdit}>
                    Edit
                  </MenuItem>
                  <MenuItem
                    icon={<MdDelete />}
                    onClick={handleDelete}
                    color="red.500"
                  >
                    Delete
                  </MenuItem>
                </>
              )}
            </MenuList>
          </Menu>
        </Flex>
      </ListItem>

      {/* Edit Modal */}
      <Modal isOpen={isOpen} onClose={onClose} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalBody>
            <AddQuestions
              isOpen={isOpen}
              onClose={onClose}
              initialData={question}
              isEditing={true}
            />
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default React.memo(ProblemItem);
