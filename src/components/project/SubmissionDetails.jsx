import React from "react";
import { Box, Heading } from "@chakra-ui/react";
import StudentSubmissionCard from "./StudentSubmissionCard";

const SubmissionDetails = ({
  selectedStudentId,
  groupedResults,
  textColor,
  cardBg,
}) => {
  if (!selectedStudentId) {
    return (
      <Heading size="md" color={textColor}>
        Select a student to view their submissions.
      </Heading>
    );
  }

  const submissions = groupedResults[selectedStudentId];

  return (
    <Box>
      <Heading size="md" mb={4} color={textColor}>
        Submissions for {submissions[0].name}
      </Heading>
      {submissions.map((result, index) => (
        <StudentSubmissionCard
          key={index}
          result={result}
          index={index}
          textColor={textColor}
          cardBg={cardBg}
        />
      ))}
    </Box>
  );
};

export default SubmissionDetails;
