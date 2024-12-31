import React, { useState } from "react";
import {
  Flex,
  Box,
  Select,
  Input,
  IconButton,
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  Button,
  useColorModeValue,
  Text,
} from "@chakra-ui/react";
import { FiFilter } from "react-icons/fi";
import { DeleteIcon } from "@chakra-ui/icons";
import { getBranch } from "../data/branch";
import { GetRoles } from "../../Permissions/Roles";
import Ability from "../../Permissions/Ability";
import { months } from "../data/Months";

const FilterSection = ({ filters, setFilters }) => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleClearFilters = () => {
    setFilters({
      branch: "",
      name: "",
      month: "",
      year: "",
    });
  };

  const currentYear = new Date().getFullYear();
  const years = [currentYear - 2, currentYear - 1, currentYear];

  // Define dynamic colors based on theme
  const borderColor = useColorModeValue("red.400", "teal.300");
  const hoverBorderColor = useColorModeValue("red.600", "teal.500");
  const drawerBg = useColorModeValue("gray.50", "gray.900");

  // Render filter options
  const renderFilters = () => (
    <Flex
      direction="column"
      gap={4}
      align="stretch"
      border="1px solid"
      borderColor={borderColor}
      p={4}
      rounded="md"
    >
      <Ability roles={["SUPERADMIN"]}>
        <Box>
          <Text mb={2} fontWeight="bold">
            Branch
          </Text>
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
        </Box>
      </Ability>
      <Box>
        <Text mb={2} fontWeight="bold">
          Batch Name
        </Text>
        <Input
          placeholder="Search by Batch Name"
          value={filters.name}
          onChange={(e) => handleFilterChange("name", e.target.value)}
        />
      </Box>
      <Box>
        <Text mb={2} fontWeight="bold">
          Month
        </Text>
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
      </Box>
      <Box>
        <Text mb={2} fontWeight="bold">
          Year
        </Text>
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
      </Box>
    </Flex>
  );

  return (
    <Ability roles={GetRoles()}>
      <>
        {/* Filter Icon */}
        <Flex justifyContent="flex-end" mb={6}>
          <IconButton
            aria-label="Filter"
            icon={<FiFilter />}
            onClick={() => setIsDrawerOpen(true)}
            variant="outline"
            borderColor={borderColor}
            _hover={{
              borderColor: hoverBorderColor,
            }}
            size="lg"
            bg={useColorModeValue("white", "gray.800")}
          />
        </Flex>

        {/* Drawer for Filters */}
        <Drawer
          isOpen={isDrawerOpen}
          placement="right"
          onClose={() => setIsDrawerOpen(false)}
        >
          <DrawerOverlay />
          <DrawerContent bg={drawerBg}>
            <DrawerCloseButton />
            <DrawerHeader>All Filters</DrawerHeader>
            <DrawerBody>
              {renderFilters()}
              <Button
                mt={6}
                colorScheme="red"
                onClick={handleClearFilters}
                w="full"
                leftIcon={<DeleteIcon />}
                _hover={{
                  bg: "red.600",
                }}
              >
                Clear Filters
              </Button>
            </DrawerBody>
          </DrawerContent>
        </Drawer>
      </>
    </Ability>
  );
};

export default FilterSection;
