import {
  getNotes,
  saveNote,
  newNote,
  deleteNote,
  getTags,
  getFilterNotes,
  removeTag,
  getTrashNotes,
} from "@/utils/supabase-client";
import { useState, useEffect } from "react";
import Moment from "react-moment";
import {
  Drawer as ChakraDrawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  useDisclosure,
  List,
  ListItem,
  Box,
  IconButton,
  Button,
  Heading,
  Tag,
  TagLabel,
  TagRightIcon,
  HStack,
  Tooltip,
  Text,
} from "@chakra-ui/react";
import { Menu, Trash, Info } from "react-feather";
import Hotkeys from "react-hot-keys";

export default function InfoDrawer({
  setCurrentTag,
  setNotes,
  setCurrentNote,
  tags,
  setTags,
  setCurrentTags,
  currentNote,
}) {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [state, setState] = useState({});

  const wordCount = () => {
    if (currentNote && currentNote.content != null) {
      let wc = currentNote.content.match(/\S+/g);
      let charactersNoSpaces = currentNote.content.replace(/\s+/g, "").length;
      let characters = currentNote.content.length;
      let words = wc ? wc.length : 0;
      let lines = currentNote.content.split(/\r*\n/).length;
      setState({ charactersNoSpaces, characters, words, lines });
    }
  };

  useEffect(async () => {
    wordCount();
  }, [currentNote.content]);

  return (
    <>
      <IconButton
        colorScheme="blue"
        size="md"
        icon={<Info />}
        variant="ghost"
        onClick={onOpen}
      />
      <ChakraDrawer isOpen={isOpen} placement="right" onClose={onClose}>
        <DrawerOverlay>
          <DrawerContent>
            <DrawerCloseButton />
            <DrawerHeader>Note information</DrawerHeader>
            <DrawerBody>
              <Box py="15px">
                <List className="notes-list">
                  <ListItem
                    //borderWidth="1px"
                    borderLeft="0"
                    borderRight="0"
                    borderTop="0"
                    py="5px"
                  >
                    <Text>Note title: {currentNote.title}</Text>
                  </ListItem>

                  <ListItem
                    //borderWidth="1px"
                    borderLeft="0"
                    borderRight="0"
                    borderTop="0"
                    py="5px"
                    cursor="pointer"
                  >
                    <Text>
                      Note total characters (no spaces):{" "}
                      {state.charactersNoSpaces}
                    </Text>
                  </ListItem>
                  <ListItem
                    //borderWidth="1px"
                    borderLeft="0"
                    borderRight="0"
                    borderTop="0"
                    py="5px"
                    cursor="pointer"
                  >
                    <Text>Note total characters: {state.characters}</Text>
                  </ListItem>
                  <ListItem
                    //borderWidth="1px"
                    borderLeft="0"
                    borderRight="0"
                    borderTop="0"
                    py="5px"
                    cursor="pointer"
                  >
                    <Text>Note total words: {state.words}</Text>
                  </ListItem>
                  <ListItem
                    //borderWidth="1px"
                    borderLeft="0"
                    borderRight="0"
                    borderTop="0"
                    py="5px"
                    cursor="pointer"
                  >
                    <Text>Note total lines: {state.lines}</Text>
                  </ListItem>
                  <ListItem
                    //borderWidth="1px"
                    borderLeft="0"
                    borderRight="0"
                    borderTop="0"
                    py="5px"
                    cursor="pointer"
                  >
                    <Text>
                      Created{" "}
                      <Moment to={currentNote.created_at}>{Date.now()}</Moment>{" "}
                      (
                      <Moment format="DD/MM/YYYY - hh:mm:ss">
                        {currentNote.created_at}
                      </Moment>
                      )
                    </Text>
                  </ListItem>
                  <ListItem
                    //borderWidth="1px"
                    borderLeft="0"
                    borderRight="0"
                    borderTop="0"
                    py="5px"
                    cursor="pointer"
                  >
                    <Text>
                      Last time edited{" "}
                      <Moment to={currentNote.edited_at}>{Date.now()}</Moment> (
                      <Moment format="DD/MM/YYYY">
                        {currentNote.edited_at}
                      </Moment>
                      )
                    </Text>
                  </ListItem>
                </List>
              </Box>
            </DrawerBody>
          </DrawerContent>
        </DrawerOverlay>
      </ChakraDrawer>
    </>
  );
}
