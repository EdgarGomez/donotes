import {
  getNotes,
  saveNote,
  newNote,
  deleteNote,
  getTags,
  getFilterNotes,
  removeTag,
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
  Tag,
  TagLabel,
  TagRightIcon,
  HStack,
} from "@chakra-ui/react";
import { Menu, Trash } from "react-feather";
import Hotkeys from "react-hot-keys";

export default function Drawer({
  setCurrentTag,
  setNotes,
  setCurrentNote,
  tags,
  setTags,
  setCurrentTags,
  currentNote,
}) {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const selectTag = (tag) => {
    setCurrentTag(tag);
    if (tag === "") {
      getNotes(setNotes, setCurrentNote, "", setCurrentTags);
    } else {
      getFilterNotes(tag, setNotes, setCurrentNote, "");
    }
    onClose();
  };

  const deleteTag = (tag) => {
    removeTag(tag, setTags, setCurrentTags, currentNote);
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
            <DrawerBody>
              <Box px="15px" py="15px">
                <Button
                  colorScheme="blue"
                  w="100%"
                  mb="20px"
                  onClick={() => selectTag("")}
                >
                  All Notes
                </Button>
                <Button colorScheme="blue" w="100%">
                  Trash
                </Button>
              </Box>
              <Box px="15px" py="15px">
                <Heading as="h4" fontSize="xl" mb="20px">
                  Filter by Tag
                </Heading>
                <List className="notes-list">
                  {tags.map((tag, i) => (
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
                        <Tag
                          size="lg"
                          colorScheme="blue"
                          borderRadius="full"
                          w="50%"
                          onClick={() => selectTag(tag)}
                        >
                          {tag.name}
                        </Tag>
                        <IconButton
                          colorScheme="red"
                          size="sm"
                          icon={<Trash />}
                          variant="ghost"
                          onClick={() => deleteTag(tag)}
                        />
                      </HStack>
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
