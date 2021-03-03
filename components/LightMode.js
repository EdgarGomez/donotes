import {
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  IconButton,
  useColorMode,
  useColorModeValue,
} from "@chakra-ui/react";
import { Sun, Moon } from "react-feather";

export default function LightMode() {
  const { colorMode, toggleColorMode } = useColorMode();

  const checkPremium = () => {
    if (1) {
      toggleColorMode();
    } else {
      onOpen();
    }
  };

  return (
    <>
      <IconButton
        colorScheme="blue"
        aria-label="Light mode"
        size="md"
        onClick={() => checkPremium()}
        icon={colorMode === "light" ? <Moon /> : <Sun />}
        variant="solid"
      />
    </>
  );
}
