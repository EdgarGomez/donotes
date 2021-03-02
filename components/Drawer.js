import {
  getNotes,
  saveNote,
  newNote,
  deleteNote,
  getTags,
  getFilterNotes,
} from "@/utils/supabase-client";
import { useState, useEffect } from "react";
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
} from "@chakra-ui/react";
import { Menu } from "react-feather";
import Hotkeys from "react-hot-keys";

export default function Drawer({
  setCurrentTag,
  setNotes,
  setCurrentNote,
  tags,
  setTags,
}) {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const selectTag = (tag) => {
    setCurrentTag(tag);
    getFilterNotes(tag, setNotes, setCurrentNote, "");
  };

  useEffect(async () => {
    getTags(setTags);
  }, []);

  return (
    <>
      <Hotkeys keyName="shift+q" onKeyDown={() => onOpen()} />
      <IconButton
        colorScheme="blue"
        size="md"
        icon={<Menu />}
        variant="ghost"
        onClick={onOpen}
      />

      <ChakraDrawer isOpen={isOpen} placement="left" onClose={onClose}>
        <DrawerOverlay>
          <DrawerContent>
            <DrawerCloseButton />

            <DrawerBody>
              <Box px="15px" py="15px">
                <Button>All Notes</Button>
                <Button>Trash</Button>
              </Box>
              <Box px="15px" py="15px">
                <Heading as="h4">Tags</Heading>
                <List className="notes-list">
                  {tags.map((tag, i) => (
                    <ListItem
                      onClick={() => selectTag(tag)}
                      key={i}
                      borderWidth="1px"
                      borderLeft="0"
                      borderRight="0"
                      borderTop="0"
                      py="5px"
                      cursor="pointer"
                    >
                      <Box w="100%">{tag.name}</Box>
                    </ListItem>
                  ))}
                </List>
              </Box>
            </DrawerBody>

            <DrawerFooter>
              <Button variant="outline" mr={3} onClick={onClose}>
                Cancel
              </Button>
              <Button color="blue">Save</Button>
            </DrawerFooter>
          </DrawerContent>
        </DrawerOverlay>
      </ChakraDrawer>
    </>
  );
}
