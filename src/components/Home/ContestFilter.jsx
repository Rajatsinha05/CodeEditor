import React from "react";
import {
  HStack,
  Button,
  Tooltip,
  IconButton,
  Wrap,
  WrapItem,
  Flex,
  useBreakpointValue,
  Text,
} from "@chakra-ui/react";
import { MdEventAvailable, MdFilterListOff, MdAddCircle } from "react-icons/md";
import { CalendarIcon, RepeatIcon } from "@chakra-ui/icons";
import { FaList } from "react-icons/fa";

const ContestFilter = ({ filter, setFilter, onCreateContest }) => {
  const buttonSize = useBreakpointValue({ base: "xs", md: "sm" });
  const showText = useBreakpointValue({ base: false, md: true });

  const filters = [
    {
      value: "active",
      label: "Active Contests",
      icon: <MdEventAvailable />,
      color: "teal",
    },
    {
      value: "upcoming",
      label: "Upcoming Contests",
      icon: <CalendarIcon />,
      color: "yellow",
    },
    {
      value: "past",
      label: "Past Contests",
      icon: <RepeatIcon />,
      color: "red",
    },
    {
      value: "all",
      label: "All Contests",
      icon: <FaList />,
      color: "blue",
    },
  ];

  return (
    <Flex direction="column" align="center" justify="center" mb={6} w="full">
      {/* Header */}

      {/* Contest Filters */}
      <Wrap spacing={{ base: 2, md: 4 }} justify="center" flex="1">
        {filters.map(({ value, label, icon, color }) => (
          <WrapItem key={value}>
            <Tooltip label={label} aria-label={label}>
              <Button
                leftIcon={icon}
                colorScheme={filter === value ? color : "gray"}
                onClick={() => setFilter(value)}
                size={buttonSize}
                px={{ base: 2, md: 4 }}
                borderRadius="md"
              >
                {label.split(" ")[0]} {/* Show shortened label */}
              </Button>
            </Tooltip>
          </WrapItem>
        ))}
      </Wrap>
    </Flex>
  );
};

export default React.memo(ContestFilter);
