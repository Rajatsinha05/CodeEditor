import React from "react";
import { Input, Button, HStack, useToast, Tooltip } from "@chakra-ui/react";
import { FaDownload, FaUpload } from "react-icons/fa";
import * as XLSX from "xlsx";

const ExcelUpload = ({ setCreateButtonVisible, setUploadedData }) => {
  const toast = useToast();

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const binaryStr = event.target.result;
          const workbook = XLSX.read(binaryStr, { type: "binary" });
          const sheetName = workbook.SheetNames[0];
          const sheet = workbook.Sheets[sheetName];
          const data = XLSX.utils.sheet_to_json(sheet);

          if (data.length === 0) {
            toast({
              title: "Validation Error",
              description: "The uploaded file is empty or not in the correct format.",
              status: "error",
              duration: 3000,
              isClosable: true,
            });
            return;
          }

          setCreateButtonVisible(true);
          setUploadedData(data);
          toast({
            title: "File Uploaded",
            description: "Excel file has been successfully uploaded.",
            status: "success",
            duration: 3000,
            isClosable: true,
          });
        } catch (error) {
          toast({
            title: "File Error",
            description: "An error occurred while processing the Excel file.",
            status: "error",
            duration: 3000,
            isClosable: true,
          });
          
        }
      };
      reader.readAsBinaryString(file);
    }
  };

  const handleDownloadTemplate = () => {
    const templateData = [
      {
        name: "Name",
        email: "Email",
        grid: "Grid (4-digit number)",
        branchCode: "Branch Code (rw1-rw8)",
        password: "Password (min. 8 characters)",
        course: "Course (e.g., Full Stack Developer, Frontend Developer, etc.)",
      },
    ];
    const worksheet = XLSX.utils.json_to_sheet(templateData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Template");
    XLSX.writeFile(workbook, "StudentUserTemplate.xlsx");
  };

  return (
    <HStack spacing={4} width="full">
      <Tooltip label="Download Template File" aria-label="Download Template Tooltip">
        <Button colorScheme="teal" leftIcon={<FaDownload />} onClick={handleDownloadTemplate}>
          Download Template
        </Button>
      </Tooltip>
      <Tooltip label="Upload Excel File" aria-label="Upload Excel Tooltip">
        <Button colorScheme="blue" leftIcon={<FaUpload />}>
          <Input
            type="file"
            accept=".xlsx, .xls"
            onChange={handleFileUpload}
            position="absolute"
            opacity="0"
            aria-hidden="true"
          />
          Upload File
        </Button>
      </Tooltip>
    </HStack>
  );
};

export default ExcelUpload;
