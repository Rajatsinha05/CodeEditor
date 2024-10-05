import React, { useState, useEffect } from "react";
import {
  Box,
  Heading,
  VStack,
  FormControl,
  FormLabel,
  Input,
  Select,
  Button,
  Tabs,
  TabPanels,
  TabPanel,
  useToast,
  Flex,
  IconButton,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  DrawerHeader,
  DrawerBody,
  useDisclosure,
  useColorModeValue,
  Tab,
  TabList,
} from "@chakra-ui/react";
import { FaBars } from "react-icons/fa";
import { useSelector, useDispatch } from "react-redux";
import { createStudent, getsolvedQuestions } from "../redux/apiSlice";
import StudentStats from "../components/StudentStats";
import * as XLSX from "xlsx"; // Import to handle Excel files
import Rankings from "../components/Ranking/Rankings ";

// To install the required npm packages:
// npm install xlsx
// npm install @chakra-ui/react @emotion/react @emotion/styled framer-motion
// npm install react-icons
// npm install react-redux
// npm install @reduxjs/toolkit

const Profile = () => {
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedTab, setSelectedTab] = useState(0);
  const [studentData, setStudentData] = useState({
    name: "",
    email: "",
    grid: "",
    branchCode: "",
    password: "",
    course: "",
  });

  const { user } = useSelector((store) => store.data);
  const isAdmin = user?.role === "ADMIN" || user?.role === "SUPERADMIN";
  const isSuperAdmin = user?.role === "SUPERADMIN";
  const isStudent = user?.role === "STUDENT";

  const dispatch = useDispatch();
  const [solvedQuestions, setSolvedQuestions] = useState([]);
  const [excelData, setExcelData] = useState(null); // Added state for Excel data
  const [isCreateButtonVisible, setCreateButtonVisible] = useState(false); // To show "Create Students" button

  useEffect(() => {
    if (isStudent) {
      dispatch(getsolvedQuestions({ studentId: user.id }))
        .unwrap()
        .then((data) => {
          setSolvedQuestions(data.solvedQuestions);
        })
        .catch((error) => {
          toast({
            title: "Error fetching solved questions",
            description: error.message,
            status: "error",
            duration: 5000,
            isClosable: true,
          });
        });
    }
  }, [dispatch, user.id, isStudent, toast]);

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
      studentData.name === "" ||
      studentData.email === "" ||
      studentData.grid === "" ||
      studentData.branchCode === "" ||
      studentData.password === "" ||
      studentData.course === ""
    ) {
      toast({
        title: "Validation Error",
        description: "All fields are required.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } else {
      dispatch(createStudent({ ...studentData, user: { id: user.id } }));
      toast({
        title: "Student created",
        description: "A new student has been created successfully.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      setStudentData({
        name: "",
        email: "",
        grid: "",
        branchCode: "",
        password: "",
        course: "",
      });
    }
  };

  const handleChange = (e) => {
    const { id, value } = e.target;
    setStudentData((prevData) => ({
      ...prevData,
      [id]: value,
    }));
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const binaryStr = event.target.result;
        const workbook = XLSX.read(binaryStr, { type: "binary" });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const data = XLSX.utils.sheet_to_json(sheet);
        setExcelData(data);
        setCreateButtonVisible(true); // Show "Create Students" button after file upload
        toast({
          title: "File Uploaded",
          description:
            "Excel file has been successfully uploaded. Click 'Create Students' to proceed.",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      };
      reader.readAsBinaryString(file);
    }
  };

  const handleBulkCreateStudents = () => {
    if (excelData && excelData.length > 0) {
      excelData.forEach((student) => {
        // Validation for each student
        if (
          student.name &&
          student.email &&
          student.grid &&
          student.branchCode &&
          student.password &&
          student.course
        ) {
          dispatch(createStudent({ ...student, user: { id: user.id } }))
            .then(() => {
              toast({
                title: `Student ${student.name} created`,
                status: "success",
                duration: 3000,
                isClosable: true,
              });
            })
            .catch((error) => {
              toast({
                title: "Error creating student",
                description: `Failed to create student ${student.name}: ${error.message}`,
                status: "error",
                duration: 5000,
                isClosable: true,
              });
            });
        } else {
          toast({
            title: `Validation Error`,
            description: `All fields are required for student ${student.name}`,
            status: "error",
            duration: 3000,
            isClosable: true,
          });
        }
      });
    }
  };

  const handleDownloadTemplate = () => {
    const worksheet = XLSX.utils.json_to_sheet([
      {
        name: "",
        email: "",
        grid: "",
        branchCode: "",
        password: "",
        course:
          "Available options: full stack Developer, frontend Developer, backend Developer, android Developer, C, C++",
      },
    ]);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Students");
    XLSX.writeFile(workbook, "StudentTemplate.xlsx");
  };

  // Theme colors
  const bgColor = useColorModeValue("gray.50", "gray.800");
  const sidebarBgColor = useColorModeValue("gray.100", "gray.700");
  const primaryColor = useColorModeValue("blue.500", "blue.200");
  const textColor = useColorModeValue("gray.900", "gray.100");

  return (
    <Flex minH="100vh" bg={bgColor}>
      <Box flex="1" ml={{ base: 0, md: "60" }} p={5} bg={bgColor}>
        <Tabs colorScheme="blue">
          <TabList>
            <Tab>Profile</Tab>
            {isStudent && <Tab>Stats</Tab>}
          </TabList>
          <TabPanels>
            <TabPanel>
              <Heading size="lg">Welcome, {user.name}</Heading>
            </TabPanel>
            <TabPanel>
              <TabPanel>
                <VStack spacing={4}>
                  <Heading size="md">Ranking</Heading>
                  <Rankings /> {/* Add this line to display the ranking data */}
                </VStack>
              </TabPanel>
            </TabPanel>
            {isStudent && (
              <TabPanel>
                <StudentStats student={{ ...user, solvedQuestions }} />
              </TabPanel>
            )}
          </TabPanels>
        </Tabs>
      </Box>
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
            <DrawerHeader color={primaryColor}>Dashboard</DrawerHeader>
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
                  <FormControl id="name" isRequired>
                    <FormLabel>Name</FormLabel>
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
                  <FormControl id="name" isRequired>
                    <FormLabel>Student Name</FormLabel>
                    <Input type="text" id="name" value={studentData.name} />
                  </FormControl>
                  <FormControl id="email" isRequired>
                    <FormLabel>Student Email</FormLabel>
                    <Input type="email" id="email" value={studentData.email} />
                  </FormControl>
                  <FormControl id="grid" isRequired>
                    <FormLabel>Grid</FormLabel>
                    <Input type="text" id="grid" value={studentData.grid} />
                  </FormControl>
                  <FormControl id="branchCode" isRequired>
                    <FormLabel>Branch Code</FormLabel>
                    <Input
                      type="text"
                      id="branchCode"
                      value={studentData.branchCode}
                    />
                  </FormControl>
                  <FormControl id="password" isRequired>
                    <FormLabel>Password</FormLabel>
                    <Input
                      type="password"
                      id="password"
                      value={studentData.password}
                    />
                  </FormControl>
                  <FormControl id="course" isRequired>
                    <FormLabel>Course</FormLabel>
                    <Select id="course" value={studentData.course}>
                      <option value="">Choose</option>
                      <option value="full stack Developer">
                        Full Stack Developer
                      </option>
                      <option value="frontend Developer">
                        Frontend Developer
                      </option>
                      <option value="backend Developer">
                        Backend Developer
                      </option>
                      <option value="android Developer">
                        Android Developer
                      </option>
                      <option value="c">C</option>
                      <option value="cpp">C++</option>
                    </Select>
                  </FormControl>
                  <Button type="submit" colorScheme="blue" w="full">
                    Create Student
                  </Button>
                  {/* Added Excel file upload and download buttons */}
                  <Input
                    type="file"
                    accept=".xlsx, .xls"
                    onChange={handleFileUpload}
                    mt={4}
                  />
                  <Button
                    colorScheme="blue"
                    onClick={handleDownloadTemplate}
                    w="full"
                  >
                    Download Excel Template
                  </Button>
                  {isCreateButtonVisible && (
                    <Button
                      colorScheme="green"
                      onClick={handleBulkCreateStudents}
                      w="full"
                      mt={4}
                    >
                      Create Students
                    </Button>
                  )}
                </VStack>
              )}
            </TabPanel>
            <TabPanel>
              <VStack spacing={4}>
                <Heading size="md">Ranking</Heading>
              </VStack>
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
