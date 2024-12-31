import React from "react";
import {
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  DrawerHeader,
  DrawerBody,
  VStack,
  Button,
} from "@chakra-ui/react";

const MobileDrawer = ({ isOpen, onClose, isAdmin, isSuperAdmin }) => {
  return (
    <Drawer placement="left" onClose={onClose} isOpen={isOpen}>
      <DrawerOverlay />
      <DrawerContent>
        <DrawerCloseButton />
        <DrawerHeader>Dashboard</DrawerHeader>
        <DrawerBody>
          <VStack align="start" spacing={4}>
            {(isAdmin || isSuperAdmin) && (
              <>
                <Button w="full" colorScheme="blue" onClick={onClose}>
                  Create User
                </Button>
                <Button w="full" colorScheme="blue" onClick={onClose}>
                  Create Student
                </Button>
              </>
            )}
          </VStack>
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
};

export default React.memo(MobileDrawer);
