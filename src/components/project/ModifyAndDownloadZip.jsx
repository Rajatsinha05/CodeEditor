import React, { useState } from "react";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import {
  Box,
  Flex,
  IconButton,
  Spinner,
  Text,
  VStack,
  useToast,
  Button,
} from "@chakra-ui/react";
import { DownloadIcon } from "@chakra-ui/icons";
import Cookies from "js-cookie";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";

const ModifyAndDownloadZip = ({ fileName }) => {
  const { user } = useSelector((store) => store.user);
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();
  const token = Cookies.get("token");
  const { projectId } = useParams();

  const handleDownload = async () => {
    setIsLoading(true);
    try {
      const zip = new JSZip();
      const response = await fetch("/template/PR_Template.zip");
      if (!response.ok) throw new Error("Failed to fetch the zip file.");

      const contentType = response.headers.get("Content-Type");
      if (!contentType.includes("zip"))
        throw new Error("The fetched file is not a valid ZIP file.");

      const zipData = await response.blob();
      const loadedZip = await zip.loadAsync(zipData);

      const metadataPath = ".github/workflows/metadata.json";
      if (loadedZip.file(metadataPath)) {
        const metadataFile = await loadedZip.file(metadataPath).async("string");
        const metadata = JSON.parse(metadataFile);

        metadata.assetTag = fileName;
        metadata.uniqueCode = user?.id;
        metadata.secureHash = token;
        metadata.pId = projectId;

        loadedZip.file(metadataPath, JSON.stringify(metadata, null, 2));
      } else {
        throw new Error("metadata.json not found in the zip.");
      }

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
    <Box p={6} bg="white" borderRadius="lg" shadow="md">
      <Text fontSize="lg" fontWeight="bold" mb={4} color="teal.600">
        Project Submission Guide
      </Text>
      <VStack align="start" spacing={3}>
        <Text fontSize="md" color="gray.700">
          1. Download the template file by clicking the button below.
        </Text>
        <Text fontSize="md" color="gray.700">
          2. Write your code within the provided template structure.
        </Text>
        <Text fontSize="md" color="gray.700">
          3. Push your code to GitHub to auto-submit your project and receive
          marks.
        </Text>
      </VStack>

      <Box mt={6} display="flex" alignItems="center" gap={4}>
        <Button
          onClick={handleDownload}
          isLoading={isLoading}
          colorScheme="teal"
          leftIcon={isLoading ? <Spinner size="sm" /> : <DownloadIcon />}
        >
          Download Template File
        </Button>
        <Text fontSize="sm" color="gray.500">
          Ensure you do not manually modify the downloaded file.
        </Text>
      </Box>
    </Box>
  );
};

export default ModifyAndDownloadZip;
