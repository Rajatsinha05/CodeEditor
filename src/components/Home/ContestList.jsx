import React from "react";
import { VStack, Text, useColorModeValue } from "@chakra-ui/react";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import ContestCard from "./ContestCard";

dayjs.extend(duration);

const ContestList = ({ contests, onStartContestClick, user }) => {
  console.log("user: ", user);
  // Filter contests based on the user's role
  const filteredContests =
    user.role === "SUPERADMIN" || user.role === "STUDENT"
      ? contests
      : contests.filter((contest) => contest.createdBy === user.id);

  return (
    <VStack spacing={4} align="stretch">
      {filteredContests.length > 0 ? (
        filteredContests.map((contest) => (
          <ContestCard
            key={contest.id}
            contest={contest}
            onStartClick={onStartContestClick}
          />
        ))
      ) : (
        <Text color={useColorModeValue("gray.700", "gray.100")}>
          No contests available for the selected filter.
        </Text>
      )}
    </VStack>
  );
};

export default ContestList;
