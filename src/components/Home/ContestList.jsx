import React, { useEffect } from "react";
import { VStack, Text, useColorModeValue } from "@chakra-ui/react";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import ContestCard from "./ContestCard";

dayjs.extend(duration);

const ContestList = ({ contests, onStartContestClick }) => {
  return (
    <VStack spacing={4} align="stretch">
      {contests.length > 0 ? (
        contests.map((contest) => (
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

export default  React.memo(ContestList);