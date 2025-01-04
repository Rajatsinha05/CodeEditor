import React from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
  Select,
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
  Text,
  Flex,
} from "@chakra-ui/react";
import { FiFilter } from "react-icons/fi";

const FilterModal = ({
  isOpen,
  onClose,
  statusFilter,
  setStatusFilter,
  marksRange,
  setMarksRange,
  courseFilter,
  setCourseFilter,
  courses,
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          <Flex align="center">
            <FiFilter style={{ marginRight: "8px" }} /> Filters
          </Flex>
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Select
            placeholder="Filter by status"
            mb={4}
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="PASSED">PASSED</option>
            <option value="FAILED">FAILED</option>
          </Select>
         
          <Flex justify="space-between" mt={2} mb={4}>
            <Text>{marksRange[0]}</Text>
            <Text>{marksRange[1]}</Text>
          </Flex>
          <Select
            placeholder="Filter by course"
            value={courseFilter}
            onChange={(e) => setCourseFilter(e.target.value)}
          >
            {courses.map((course) => (
              <option key={course} value={course}>
                {course}
              </option>
            ))}
          </Select>
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="teal" onClick={onClose}>
            Apply Filters
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default FilterModal;
