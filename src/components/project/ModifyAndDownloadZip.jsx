import React, { useState } from "react";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import {
  Box,
  Spinner,
  Text,
  VStack,
  useToast,
  Button,
  Tooltip,
  useColorModeValue,
} from "@chakra-ui/react";
import { DownloadIcon } from "@chakra-ui/icons";
import Cookies from "js-cookie";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import axiosInstance from "../../config/axiosConfig";

const ModifyAndDownloadZip = ({ fileName, testDetail }) => {
  const { user } = useSelector((store) => store.user);
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();
  const token = Cookies.get("token");
  const { projectId } = useParams();

  const getTestFiles = async (fileName, token, zip, testFilePath) => {
    try {
      const response = await axiosInstance.get(
        `/api/sandbox/test-files/${fileName}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.status !== 200) {
        throw new Error(
          `Failed to fetch test files: ${response.status} ${response.statusText}`
        );
      }

      zip.file(testFilePath, response.data);
    } catch (error) {
      throw new Error(`Error fetching test files: ${error.message}`);
    }
  };

  const handleDownload = async () => {
    setIsLoading(true);
    try {
      const zip = new JSZip();
      const response = await fetch("/template/PR_Template.zip");
      if (!response.ok) throw new Error("Failed to fetch the zip file.");

      const zipData = await response.blob();
      const loadedZip = await zip.loadAsync(zipData);

      const metadataPath = ".github/workflows/metadata.json";
      const testFilePath = "_test/cypress/e2e/test.cy.js";

      if (loadedZip.file(metadataPath)) {
        const metadataFile = await loadedZip.file(metadataPath).async("string");
        const metadata = JSON.parse(metadataFile);

        metadata.assetTag = fileName;
        metadata.uniqueCode = user?.id;
        metadata.secureHash = token;
        metadata.pId = projectId;
        metadata.timeIdentifier = testDetail?.endTime;
        loadedZip.file(metadataPath, JSON.stringify(metadata, null, 2));
      } else {
        throw new Error("metadata.json not found in the zip.");
      }

      await getTestFiles(fileName, token, loadedZip, testFilePath);

      const modifiedZipBlob = await loadedZip.generateAsync({ type: "blob" });
      saveAs(modifiedZipBlob, "PR_Template.zip");

      toast({
        title: "Download Complete",
        description:
          "Your template file has been modified and is ready for use.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box p={6} borderRadius="md" shadow="sm">
      <Text
        fontSize="xl"
        fontWeight="bold"
        mb={4}
        color={useColorModeValue("teal.600", "teal.300")}
      >
        Project Submission Guide
      </Text>
      <VStack align="start" spacing={3}>
        <Text fontSize="md" color={useColorModeValue("gray.700", "gray.300")}>
          1. Download the template file by clicking the button below.
        </Text>
        <Text fontSize="md" color={useColorModeValue("gray.700", "gray.300")}>
          2. Write your code within the provided template structure.
        </Text>
        <Text fontSize="md" color={useColorModeValue("gray.700", "gray.300")}>
          3. Push your code to GitHub to auto-submit your project and receive
          marks.
        </Text>
      </VStack>

      <Box mt={6} display="flex" alignItems="center" gap={4}>
        <Tooltip
          label="Click to download the template"
          aria-label="Download template tooltip"
        >
          <Button
            onClick={handleDownload}
            isLoading={isLoading}
            colorScheme="teal"
            leftIcon={isLoading ? <Spinner size="sm" /> : <DownloadIcon />}
          >
            Download Template File
          </Button>
        </Tooltip>
        <Text fontSize="sm" color={useColorModeValue("gray.500", "gray.400")}>
          Ensure you do not manually modify the downloaded file.
        </Text>
      </Box>
    </Box>
  );
};

export default ModifyAndDownloadZip;
