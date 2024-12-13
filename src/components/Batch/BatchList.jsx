import React from "react";
import { VStack } from "@chakra-ui/react";
import BatchCard from "./BatchCard";

const BatchList = ({ batches }) => {
  return (
    <VStack spacing={6} align="stretch">
      {batches.map((batch) => (
        <BatchCard key={batch.id} batch={batch} />
      ))}
    </VStack>
  );
};

export default React.memo(BatchList);
