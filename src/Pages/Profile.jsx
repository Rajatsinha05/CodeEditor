import React, { useState } from "react";
import { Box, Heading, VStack, FormControl, FormLabel, Input, Button, Tabs, TabPanels, TabPanel, useToast, Flex, IconButton, Drawer, DrawerOverlay, DrawerContent, DrawerCloseButton, DrawerHeader, DrawerBody, useDisclosure, useColorModeValue } from "@chakra-ui/react";
import { FaBars } from "react-icons/fa";
import { useSelector, useDispatch } from "react-redux";

const Profile = () => {
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedTab, setSelectedTab] = useState(0);
  const [studentData, setStudentData] = useState({
    studentName: "",
    studentEmail: "",
    grid: "",
    branchCode: "",
    studentPassword: ""
  });

  const { user } = useSelector((store) => store.data);
  const isAdmin = user?.role === "ADMIN" || user?.role === "SUPERADMIN";
  const isSuperAdmin = user?.role === "SUPERADMIN";

  const dispatch = useDispatch();

  const handleCreateUser = (e) => {
    e.preventDefault();
    toast({
      title: "User created",
      description: "A new user has been created successfully.",
      status: "success",
      duration: 3000,
      isClosable: true,
    });
  };

  const handleCreateStudent = (e) => {
    e.preventDefault();
    // Validation
    if (
      studentData.studentName === "" ||
      studentData.studentEmail === "" ||
      studentData.grid === "" ||
      studentData.branchCode === "" ||
      studentData.studentPassword === ""
    ) {
      toast({
        title: "Validation Error",
        description: "All fields are required.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } else {
      // Dispatch action to store/send data through API
      dispatch(createStudent(studentData));
      toast({
        title: "Student created",
        description: "A new student has been created successfully.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      // Reset form data
      setStudentData({
        studentName: "",
        studentEmail: "",
        grid: "",
        branchCode: "",
        studentPassword: ""
      });
    }
  };

  const handleChange = (e) => {
    const { id, value } = e.target;
    setStudentData((prevData) => ({
      ...prevData,
      [id]: value
    }));
  };

  // Theme colors
  const bgColor = useColorModeValue("gray.50", "gray.800");
  const sidebarBgColor = useColorModeValue("gray.100", "gray.700");
  const primaryColor = useColorModeValue("blue.500", "blue.200");
  const textColor = useColorModeValue("gray.900", "gray.100");

  return (
    <Flex minH="100vh" bg={bgColor}>
      {/* Sidebar for larger screens */}
      <Box
        w={{ base: "full", md: "60" }}
        pos="fixed"
        top="0"
        left="0"
        h="full"
        bg={sidebarBgColor}
        p={4}
        display={{ base: "none", md: "block" }}
        color={textColor}
        zIndex="1"
      >
        <Heading mb={6} textAlign="center" color={primaryColor}>
          Admin Dashboard
        </Heading>
        <VStack align="start" spacing={4}>
          {isAdmin && (
            <>
              <Button
                w="full"
                onClick={() => setSelectedTab(0)}
                colorScheme="blue"
              >
                Create User
              </Button>
              <Button
                w="full"
                onClick={() => setSelectedTab(1)}
                colorScheme="blue"
              >
                Create Student
              </Button>
            </>
          )}
          {isSuperAdmin && (
            <Button
              w="full"
              onClick={() => setSelectedTab(2)}
              colorScheme="blue"
            >
              Other Features
            </Button>
          )}
        </VStack>
      </Box>

      {/* Main content area */}
      <Box
        flex="1"
        ml={{ base: 0, md: "60" }}
        p={5}
        bg={bgColor}
        color={textColor}
        zIndex="0"
      >
        {/* Icon button for mobile drawer */}
        <IconButton
          icon={<FaBars />}
          aria-label="Open Menu"
          display={{ base: "block", md: "none" }}
          onClick={onOpen}
          mb={4}
          colorScheme="blue"
        />

        {/* Drawer for mobile sidebar */}
        <Drawer placement="left" onClose={onClose} isOpen={isOpen}>
          <DrawerOverlay />
          <DrawerContent bg={sidebarBgColor} color={textColor}>
            <DrawerCloseButton />
            <DrawerHeader color={primaryColor}>Admin Dashboard</DrawerHeader>
            <DrawerBody>
              <VStack align="start" spacing={4}>
                {isAdmin && (
                  <>
                    <Button
                      w="full"
                      onClick={() => {
                        setSelectedTab(0);
                        onClose();
                      }}
                      colorScheme="blue"
                    >
                      Create User
                    </Button>
                    <Button
                      w="full"
                      onClick={() => {
                        setSelectedTab(1);
                        onClose();
                      }}
                      colorScheme="blue"
                    >
                      Create Student
                    </Button>
                  </>
                )}
                {isSuperAdmin && (
                  <Button
                    w="full"
                    onClick={() => {
                      setSelectedTab(2);
                      onClose();
                    }}
                    colorScheme="blue"
                  >
                    Other Features
                  </Button>
                )}
              </VStack>
            </DrawerBody>
          </DrawerContent>
        </Drawer>

        {/* Tabs for main content */}
        <Tabs
          index={selectedTab}
          onChange={(index) => setSelectedTab(index)}
          colorScheme="blue"
        >
          <TabPanels>
            <TabPanel>
              {isAdmin && (
                <VStack as="form" spacing={4} onSubmit={handleCreateUser}>
                  <FormControl id="username" isRequired>
                    <FormLabel>Username</FormLabel>
                    <Input type="text" />
                  </FormControl>
                  <FormControl id="email" isRequired>
                    <FormLabel>Email</FormLabel>
                    <Input type="email" />
                  </FormControl>
                  <FormControl id="password" isRequired>
                    <FormLabel>Password</FormLabel>
                    <Input type="password" />
                  </FormControl>
                  <Button type="submit" colorScheme="blue" w="full">
                    Create User
                  </Button>
                </VStack>
              )}
            </TabPanel>
            <TabPanel>
            {isAdmin && (
                <VStack
                  as="form"
                  spacing={4}
                  onSubmit={handleCreateStudent}
                  onChange={handleChange}
                >
                  <FormControl id="studentName" isRequired>
                    <FormLabel>Student Name</FormLabel>
                    <Input
                      type="text"
                      id="studentName"
                      value={studentData.studentName}
                    />
                  </FormControl>
                  <FormControl id="studentEmail" isRequired>
                    <FormLabel>Student Email</FormLabel>
                    <Input
                      type="email"
                      id="studentEmail"
                      value={studentData.studentEmail}
                    />
                  </FormControl>
                  <FormControl id="grid" isRequired>
                    <FormLabel>Grid</FormLabel>
                    <Input
                      type="text"
                      id="grid"
                      value={studentData.grid}
                    />
                  </FormControl>
                  <FormControl id="branchCode" isRequired>
                    <FormLabel>Branch Code</FormLabel>
                    <Input
                      type="text"
                      id="branchCode"
                      value={studentData.branchCode}
                    />
                  </FormControl>
                  <FormControl id="studentPassword" isRequired>
                    <FormLabel>Password</FormLabel>
                    <Input
                      type="password"
                      id="studentPassword"
                      value={studentData.studentPassword}
                    />
                  </FormControl>
                  <Button type="submit" colorScheme="blue" w="full">
                    Create Student
                  </Button>
                </VStack>
              )}
            </TabPanel>
            <TabPanel>
              {isSuperAdmin && (
                <VStack spacing={4}>
                  <Heading size="md">Other Features</Heading>
                  {/* Add more features here */}
                </VStack>
              )}
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </Flex>
  );
};

export default Profile;

