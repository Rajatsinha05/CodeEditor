import React from 'react';
import {
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  DrawerCloseButton,
  VStack,
  Box,
  Text,
  Icon,
  Spinner,
  Flex,
} from '@chakra-ui/react';
import { CheckCircleIcon, WarningIcon } from '@chakra-ui/icons';

const TestResultsDrawer = ({ isLoading, isDrawerOpen, toggleDrawer, testResults }) => (
  <Drawer placement="right" onClose={toggleDrawer} isOpen={isDrawerOpen} size="md">
    <DrawerOverlay />
    <DrawerContent bg="gray.900" color="gray.100">
      <DrawerCloseButton />
      <DrawerHeader bg="teal.500" color="white">
        Test Cases Result
      </DrawerHeader>
      <DrawerBody>
        {isLoading ? (
          <Flex justify="center" align="center" h="100%">
            <Spinner size="xl" color="teal.500" />
          </Flex>
        ) : (
          <VStack spacing={4} align="stretch">
            {testResults.map((test, index) => (
              <Box
                key={index}
                p={4}
                borderWidth="1px"
                borderColor={test.passed ? 'green.500' : 'red.500'}
                borderRadius="md"
                bg={test.passed ? 'green.100' : 'red.100'}
                display="flex"
                alignItems="center"
              >
                <Icon
                  as={test.passed ? CheckCircleIcon : WarningIcon}
                  color={test.passed ? 'green.500' : 'red.500'}
                  mr={4}
                  boxSize={6}
                />
                <Box>
                  <Text fontWeight="bold" color="gray.800">
                    {test.passed ? 'Passed' : 'Failed'}
                  </Text>
                  <Text fontSize="sm" color="gray.600">
                    Expected: {test.expected}, Got: {test.output}
                  </Text>
                </Box>
              </Box>
            ))}
          </VStack>
        )}
      </DrawerBody>
    </DrawerContent>
  </Drawer>
);

export default TestResultsDrawer;
