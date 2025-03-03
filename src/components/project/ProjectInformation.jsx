import React from "react";
import {
  Box,
  VStack,
  Flex,
  Text,
  Icon,
  Badge,
  Divider,
  useColorModeValue,
  Heading,
  Skeleton,
} from "@chakra-ui/react";
import { FiFileText, FiCode, FiShield, FiAward, FiClock } from "react-icons/fi";
import dayjs from "dayjs";
import ModifyAndDownloadZip from "./ModifyAndDownloadZip";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
const ProjectInformation = ({ testDetail, isLoading }) => {
  const bgColor = useColorModeValue("white", "gray.700");
  const textColor = useColorModeValue("gray.700", "white");
  const subTextColor = useColorModeValue("gray.600", "gray.300");
  // const subTextColor = useColorModeValue("gray.600", "gray.300");
  const borderColor = useColorModeValue("gray.200", "gray.600");

  if (isLoading) {
    return (
      <Box p={6} bg={bgColor} rounded="lg" shadow="lg">
        <Skeleton height="24px" mb={4} />
        <Skeleton height="16px" mb={2} />
        <Skeleton height="16px" mb={2} />
        <Skeleton height="16px" mb={2} />
      </Box>
    );
  }

  if (!testDetail) {
    return (
      <Box p={6} bg={bgColor} rounded="lg" shadow="lg" textAlign="center">
        <Text fontSize="lg" color={subTextColor}>
          No project information available.
        </Text>
      </Box>
    );
  }
  

  return (
    <Box p={6} bg={bgColor} rounded="lg" shadow="lg">
      <Heading size="md" mb={4} color={textColor}>
        Project Information
      </Heading>
      <Divider mb={4} />
      <VStack align="start" spacing={4}>
        {[
          {
            label: "Title",
            value: testDetail.title || "N/A",
            icon: FiFileText,
          },
          { label: "Module", value: testDetail.module || "N/A", icon: FiCode },

          { label: "Marks", value: testDetail.marks || "N/A", icon: FiAward },
          {
            label: "Start Time",
            value: testDetail.startTime
              ? dayjs(testDetail.startTime).format("MMMM D, YYYY h:mm A")
              : "N/A",
            icon: FiClock,
          },
          {
            label: "End Time",
            value: testDetail.endTime
              ? dayjs(testDetail.endTime).format("MMMM D, YYYY h:mm A")
              : "N/A",
            icon: FiClock,
          },
        ].map((detail, index) => (
          <Flex key={index} align="center" gap={2}>
            <Icon as={detail.icon} color="teal.500" />
            <Text fontWeight="bold" color={textColor}>
              {detail.label}:
            </Text>
            <Text color={subTextColor}>{detail.value}</Text>
          </Flex>
        ))}
      </VStack>

      <ModifyAndDownloadZip
        fileName={testDetail.fileName}
        testDetail={testDetail}
      />
      {/* {testDetail.description && (
        <>
          <Divider my={4} />
          {/* <Box
            dangerouslySetInnerHTML={{ __html: testDetail.description }}
            fontSize="sm"
            color={subTextColor}
          /> */}
      {/* <ReactMarkdown>{testDetail.description}</ReactMarkdown> */}
      {testDetail.description && (
        <>
          <Divider my={4} />
          <Box
            p={4}
            border="1px"
            borderColor={borderColor}
            rounded="lg"
            w="full"
            bg={useColorModeValue("gray.50", "gray.900")}
            fontSize="sm"
            // sx={{
            //   userSelect: "none",
            //   pointerEvents: "none", // Prevents interactions (optional)
            // }}
            userSelect="none" // Prevents text selection
            onCopy={(e) => e.preventDefault()} // Disables copying
          >
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              rehypePlugins={[rehypeRaw]}
              components={{
                code({ node, inline, className, children, ...props }) {
                  const match = /language-(\w+)/.exec(className || "");
                  return !inline && match ? (
                    <SyntaxHighlighter
                      style={oneDark}
                      language={match[1]}
                      PreTag="div"
                    >
                      {String(children).replace(/\n$/, "")}
                    </SyntaxHighlighter>
                  ) : (
                    <code {...props} className={className}>
                      {children}
                    </code>
                  );
                },
                table({ children }) {
                  return (
                    <Box overflowX="auto">
                      <table className="chakra-ui-table">{children}</table>
                    </Box>
                  );
                },
                th({ children }) {
                  return (
                    <Text
                      as="th"
                      fontWeight="bold"
                      p={2}
                      borderBottom="1px solid"
                      borderColor={borderColor}
                    >
                      {children}
                    </Text>
                  );
                },
                td({ children }) {
                  return (
                    <Text
                      as="td"
                      p={2}
                      borderBottom="1px solid"
                      borderColor={borderColor}
                    >
                      {children}
                    </Text>
                  );
                },
                blockquote({ children }) {
                  return (
                    <Box
                      as="blockquote"
                      p={3}
                      bg={useColorModeValue("gray.100", "gray.700")}
                      borderLeft="4px solid teal"
                      color={subTextColor}
                      fontStyle="italic"
                    >
                      {children}
                    </Box>
                  );
                },
                ul({ children }) {
                  return (
                    <Box as="ul" pl={5} listStyleType="disc">
                      {children}
                    </Box>
                  );
                },
                ol({ children }) {
                  return (
                    <Box as="ol" pl={5} listStyleType="decimal">
                      {children}
                    </Box>
                  );
                },
                li({ children }) {
                  return (
                    <Box as="li" ml={4}>
                      {children}
                    </Box>
                  );
                },
              }}
            >
              {testDetail.description}
            </ReactMarkdown>
          </Box>
        </>
      )}
    </Box>
  );
};

export default ProjectInformation;
