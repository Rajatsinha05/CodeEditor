import React, { useState } from "react";
import {
  Flex,
  Select,
  Input,
  IconButton,
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  useColorModeValue,
  useBreakpointValue,
} from "@chakra-ui/react";
import { FiFilter } from "react-icons/fi";
import { getBranch } from "../data/branch";
import { GetRoles } from "../../Permissions/Roles";
import Ability from "../../Permissions/Ability";
import { months } from "../data/Months";

const FilterSection = ({ filters, setFilters }) => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const isMobile = useBreakpointValue({ base: true, md: false });

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const currentYear = new Date().getFullYear();
  const years = [currentYear - 2, currentYear - 1, currentYear];

  // Define border colors based on theme
  const borderColor = useColorModeValue("red.400", "teal.300");
  const hoverBorderColor = useColorModeValue("red.600", "teal.500");

  const renderFilters = () => (
    <Flex
      direction="column"
      gap={4}
      align="stretch"
      border="1px solid"
      borderColor={borderColor}
      _hover={{
        borderColor: hoverBorderColor,
      }}
      p={4}
      rounded="md"
    >
      <Ability roles={["SUPERADMIN"]}>
        <Select
          placeholder="Filter by Branch"
          value={filters.branch}
          onChange={(e) => handleFilterChange("branch", e.target.value)}
        >
          {getBranch().map((branch) => (
            <option key={branch} value={branch}>
              {branch}
            </option>
          ))}
        </Select>
      </Ability>
      <Input
        placeholder="Search by Batch Name"
        value={filters.name}
        onChange={(e) => handleFilterChange("name", e.target.value)}
      />
      <Select
        placeholder="Filter by Month"
        value={filters.month}
        onChange={(e) => handleFilterChange("month", e.target.value)}
      >
        {months.map((month) => (
          <option key={month} value={month}>
            {month}
          </option>
        ))}
      </Select>
      <Select
        placeholder="Filter by Year"
        value={filters.year}
        onChange={(e) => handleFilterChange("year", e.target.value)}
      >
        {years.map((year) => (
          <option key={year} value={year}>
            {year}
          </option>
        ))}
      </Select>
    </Flex>
  );

  return (
    <Ability roles={GetRoles()}>
      {isMobile ? (
        <>
          <IconButton
            aria-label="Filter"
            icon={<FiFilter />}
            onClick={() => setIsDrawerOpen(true)}
            variant="outline"
            borderColor={borderColor}
            _hover={{
              borderColor: hoverBorderColor,
            }}
            m={4} // Added margin for spacing
            p={2} // Added padding for better appearance
          />
          <Drawer
            isOpen={isDrawerOpen}
            placement="right"
            onClose={() => setIsDrawerOpen(false)}
          >
            <DrawerOverlay />
            <DrawerContent>
              <DrawerCloseButton />
              <DrawerHeader>All Filters</DrawerHeader>
              <DrawerBody>{renderFilters()}</DrawerBody>
            </DrawerContent>
          </Drawer>
        </>
      ) : (
        <Flex
          mb={8}
          gap={4}
          align="center"
          wrap="wrap"
          border="1px solid"
          borderColor={borderColor}
          _hover={{
            borderColor: hoverBorderColor,
          }}
          p={4}
          rounded="md"
          w="100%" // Ensures it spans the width of the container
        >
          <Ability roles={["SUPERADMIN"]}>
            <Select
              placeholder="Filter by Branch"
              value={filters.branch}
              onChange={(e) => handleFilterChange("branch", e.target.value)}
              maxW="300px"
            >
              {getBranch().map((branch) => (
                <option key={branch} value={branch}>
                  {branch}
                </option>
              ))}
            </Select>
          </Ability>
          <Input
            placeholder="Search by Batch Name"
            value={filters.name}
            onChange={(e) => handleFilterChange("name", e.target.value)}
            maxW="300px"
          />
          <Select
            placeholder="Filter by Month"
            value={filters.month}
            onChange={(e) => handleFilterChange("month", e.target.value)}
            maxW="200px"
          >
            {months.map((month) => (
              <option key={month} value={month}>
                {month}
              </option>
            ))}
          </Select>
          <Select
            placeholder="Filter by Year"
            value={filters.year}
            onChange={(e) => handleFilterChange("year", e.target.value)}
            maxW="200px"
          >
            {years.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </Select>
        </Flex>
      )}
    </Ability>
  );
};

export default FilterSection;
