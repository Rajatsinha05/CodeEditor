import { Button, Icon, useColorModeValue } from "@chakra-ui/react";

const SidebarButton = ({ icon, label, onClick, hoverBg, iconColor }) => {
  const textColor = useColorModeValue("gray.800", "white");

  return (
    <Button
      variant="ghost"
      w="full"
      justifyContent="flex-start"
      leftIcon={<Icon as={icon} boxSize={5} color={iconColor} />}
      color={textColor}
      _hover={{ bg: hoverBg }}
      onClick={onClick}
    >
      {label}
    </Button>
  );
};

export default SidebarButton;
