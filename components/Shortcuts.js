import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Kbd,
  Box,
  IconButton,
  Text,
  Heading,
  Tooltip,
} from "@chakra-ui/react";
import { Command } from "react-feather";

import Hotkeys from "react-hot-keys";

export default function Shortcuts() {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      <Hotkeys keyName="shift+/" onKeyDown={() => onOpen()} />
      <Tooltip hasArrow label="Shortcuts" colorScheme="blue">
        <IconButton
          colorScheme="blue"
          size="md"
          icon={<Command />}
          variant="ghost"
          onClick={onOpen}
        />
      </Tooltip>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Keyboard Shortcuts</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Box>
              <Heading fontSize="lg">Notes</Heading>
              <Text>
                <Kbd>shift</Kbd> + <Kbd>N</Kbd> - New Note
              </Text>
              <Text>
                <Kbd>shift</Kbd> + <Kbd>D</Kbd> - Delete Note
              </Text>
              <Text>
                <Kbd>shift</Kbd> + <Kbd>T</Kbd> - Toggle Note Toolbar
              </Text>
            </Box>
            <Box>
              <Heading fontSize="lg">Controls</Heading>
              <Text>
                <Kbd>shift</Kbd> + <Kbd>/</Kbd> - Shortcuts information
              </Text>
              <Text>
                <Kbd>shift</Kbd> + <Kbd>s</Kbd> - Focus Mode
              </Text>
              <Text>
                <Kbd>shift</Kbd> + <Kbd>p</Kbd> - Preview Mode
              </Text>
            </Box>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}
