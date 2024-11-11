// ProblemItem.js

import React from "react";
import { Link } from "react-router-dom";
import {
  Box,
  Flex,
  Text,
  ListItem,
  IconButton,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
} from "@chakra-ui/react";
import { MdDelete, MdEdit } from "react-icons/md";
import { useDispatch } from "react-redux";
import { deleteQuestion } from "../../redux/Question/questionApi";
import AddQuestions from "../../Pages/AddQuestions";
// Adjust the path as needed

const ProblemItem = ({ question, currentUserId, currentUserRole }) => {
  const dispatch = useDispatch();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const canModify =
    currentUserRole === "SUPERADMIN" || question.userId === currentUserId;

  const handleDelete = (e) => {
    e.preventDefault();
    dispatch(deleteQuestion(question.id));
  };

  const handleEdit = (e) => {
    e.preventDefault();
    onOpen(); // Open the modal
  };

  return (
    <>
      <ListItem borderRadius="md" backgroundColor="rgba(0, 0, 0, 0.03)">
        <Flex p={4} alignItems="center" justifyContent="space-between">
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
          {canModify && (
            <Box>
              <IconButton
                icon={<MdEdit />}
                aria-label="Edit Question"
                onClick={handleEdit}
                colorScheme="blue"
                mr={2}
              />
              <IconButton
                icon={<MdDelete />}
                aria-label="Delete Question"
                onClick={handleDelete}
                colorScheme="red"
              />
            </Box>
          )}
        </Flex>
      </ListItem>

      {/* Edit Modal */}
      <Modal isOpen={isOpen} onClose={onClose} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Edit Question</ModalHeader>
          <ModalCloseButton />
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

export default ProblemItem;
