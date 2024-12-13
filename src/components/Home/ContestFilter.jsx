import React from "react";
import { HStack, Button, Tooltip, IconButton } from "@chakra-ui/react";
import { MdEventAvailable, MdFilterListOff, MdAddCircle } from "react-icons/md";
import { CalendarIcon, RepeatIcon } from "@chakra-ui/icons";
import { FaList } from "react-icons/fa";
import Ability from "../../Permissions/Ability";

const ContestFilter = ({ filter, setFilter, onCreateContest }) => {
  return (
    <HStack justify="space-between" mb={6} spacing={4}>
      {/* Contest Filters */}
      <HStack spacing={4}>
        <Tooltip label="Active Contests" aria-label="Active Contests">
          <Button
            leftIcon={<MdEventAvailable />}
            colorScheme={filter === "active" ? "teal" : "gray"}
            onClick={() => setFilter("active")}
          >
            Active
          </Button>
        </Tooltip>
        <Tooltip label="Upcoming Contests" aria-label="Upcoming Contests">
          <Button
            leftIcon={<CalendarIcon />}
            colorScheme={filter === "upcoming" ? "yellow" : "gray"}
            onClick={() => setFilter("upcoming")}
          >
            Upcoming
          </Button>
        </Tooltip>
        <Tooltip label="Past Contests" aria-label="Past Contests">
          <Button
            leftIcon={<RepeatIcon />}
            colorScheme={filter === "past" ? "red" : "gray"}
            onClick={() => setFilter("past")}
          >
            Past
          </Button>
        </Tooltip>
        <Tooltip label="All Contests" aria-label="All Contests">
          <Button
            leftIcon={<FaList />}
            colorScheme={filter === "all" ? "blue" : "gray"}
            onClick={() => setFilter("all")}
          >
            All
          </Button>
        </Tooltip>
      </HStack>

      <Ability roles={["ADMIN", "SUPERADMIN"]}>
        <Tooltip label="Create Contest" aria-label="Create Contest">
          <IconButton
            icon={<MdAddCircle />}
            colorScheme="teal"
            onClick={onCreateContest}
            aria-label="Create Contest"
          />
        </Tooltip>
      </Ability>
    </HStack>
  );
};

export default React.memo(ContestFilter);
