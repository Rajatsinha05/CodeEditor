import React, { useMemo } from "react";
import { Stack, Button, Tooltip, useBreakpointValue } from "@chakra-ui/react";
import { MdEventAvailable } from "react-icons/md";
import { CalendarIcon, RepeatIcon } from "@chakra-ui/icons";
import { FaList } from "react-icons/fa";

const ContestFilter = React.memo(({ filter, setFilter }) => {

  const layout = useBreakpointValue({ base: "column", md: "row" });

  const buttons = useMemo(
    () => [
      {
        label: "Active Contests",
        icon: <MdEventAvailable />,
        colorScheme: "teal",
        filterKey: "active",
      },
      {
        label: "Upcoming Contests",
        icon: <CalendarIcon />,
        colorScheme: "yellow",
        filterKey: "upcoming",
      },
      {
        label: "Past Contests",
        icon: <RepeatIcon />,
        colorScheme: "red",
        filterKey: "past",
      },
      {
        label: "All Contests",
        icon: <FaList />,
        colorScheme: "blue",
        filterKey: "all",
      },
    ],
    []
  );

  return (
    <Stack
      direction={layout}
      spacing={4}
      align="center"
      justify="center"
      mb={6}
      width="100%"
    >
      {buttons.map(({ label, icon, colorScheme, filterKey }) => (
        <Tooltip key={filterKey} label={label} aria-label={label} hasArrow>
          <Button
            leftIcon={icon}
            colorScheme={filter === filterKey ? colorScheme : "gray"}
            variant={filter === filterKey ? "solid" : "outline"}
            onClick={() => setFilter(filterKey)}
            width={layout === "column" ? "100%" : "auto"}
          >
            {filterKey.charAt(0).toUpperCase() + filterKey.slice(1)}
          </Button>
        </Tooltip>
      ))}
    </Stack>
  );
});

export default ContestFilter;
