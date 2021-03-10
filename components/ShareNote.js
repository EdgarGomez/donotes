import {
  getShared,
  newShared,
  deleteShared,
  publishNote,
} from "@/utils/supabase-client";
import { useState, useEffect } from "react";
import Moment from "react-moment";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  IconButton,
  Button,
  FormControl,
  FormLabel,
  FormErrorMessage,
  FormHelperText,
  Input,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  InputRightElement,
  InputGroup,
  Heading,
  Text,
  Box,
  ListItem,
  List,
  HStack,
  Tooltip,
  Checkbox,
} from "@chakra-ui/react";
import { Share, Trash } from "react-feather";

export default function ShareNote({ currentNote }) {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [shared, setShared] = useState([]);
  const [email, setEmail] = useState("");
  const [published, setPublished] = useState(
    (currentNote && currentNote.published) || false
  );

  useEffect(async () => {
    getShared(currentNote, setShared);
    setPublished(currentNote && currentNote.published);
  }, [currentNote && currentNote]);

  const handleFormChange = ({ target: { type, name, value } }) => {
    setEmail(value);
  };

  const addShared = () => {
    let newEmail = shared.find((item) => item.email === email);
    if (!newEmail) {
      newShared(currentNote, setShared, email);
      setEmail("");
    }
  };

  return (
    <>
      <IconButton
        colorScheme="blue"
        size="md"
        icon={<Share />}
        variant="ghost"
        onClick={onOpen}
        hidden={!currentNote}
      />
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Sharing options</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Tabs isFitted>
              <TabList>
                <Tab>Share</Tab>
                <Tab>Publish</Tab>
              </TabList>

              <TabPanels>
                <TabPanel>
                  <FormControl id="email">
                    <FormLabel>Share with</FormLabel>
                    <InputGroup>
                      <Input
                        type="email"
                        placeholder="Email"
                        name="email"
                        value={email}
                        onChange={handleFormChange}
                      />
                      <InputRightElement>
                        <Button
                          size="md"
                          colorScheme="blue"
                          variant="solid"
                          onClick={addShared}
                        >
                          Add
                        </Button>
                      </InputRightElement>
                    </InputGroup>
                    <FormHelperText>
                      An account with this email must already exist.
                    </FormHelperText>
                  </FormControl>
                  <Box mt="30px" pb="30px">
                    <Heading fontSize="md">Shared with</Heading>
                    <List className="notes-list">
                      {shared &&
                        shared.map((item, i) => (
                          <ListItem
                            key={i}
                            //borderWidth="1px"
                            borderLeft="0"
                            borderRight="0"
                            borderTop="0"
                            py="5px"
                            cursor="pointer"
                          >
                            <HStack w="100%" justifyContent="space-between">
                              <Text>{item.email}</Text>
                              <Tooltip
                                hasArrow
                                label="Stop sharing"
                                colorScheme="blue"
                              >
                                <IconButton
                                  colorScheme="red"
                                  size="sm"
                                  icon={<Trash />}
                                  variant="ghost"
                                  onClick={() =>
                                    deleteShared(item, currentNote, setShared)
                                  }
                                />
                              </Tooltip>
                            </HStack>
                          </ListItem>
                        ))}
                    </List>
                  </Box>
                </TabPanel>
                <TabPanel>
                  <FormControl id="email">
                    <FormLabel>Publish this note to the world</FormLabel>
                    <Checkbox
                      isChecked={published}
                      onChange={(e) =>
                        publishNote(currentNote, !published, setPublished)
                      }
                    >
                      Publish
                    </Checkbox>
                    <FormHelperText>
                      Anyone with this link can access the note.
                    </FormHelperText>
                  </FormControl>
                </TabPanel>
              </TabPanels>
            </Tabs>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}
