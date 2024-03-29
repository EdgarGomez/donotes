import {
  getNotes,
  getSharedNotes,
  getTags,
  getFilterNotes,
  removeTag,
  getTrashNotes,
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
  Tooltip,
} from "@chakra-ui/react";
import { Menu, Trash, Settings, LogOut } from "react-feather";
import Hotkeys from "react-hot-keys";
import LightMode from "./LightMode";
import { useRouter } from "next/router";

export default function MenuDrawer({
  setCurrentTag,
  setNotes,
  setCurrentNote,
  tags,
  setTags,
  setCurrentTags,
  currentNote,
  user,
  signOut,
}) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const router = useRouter();

  const selectTag = (tag) => {
    if (user) {
      setCurrentTag(tag);
      if (tag === "") {
        getNotes(setNotes, setCurrentNote, "", setCurrentTags, user.id);
      } else if (tag === "Trash") {
        getTrashNotes(setNotes, setCurrentNote, "", setCurrentTags, user.id);
        setCurrentTag({ ["name"]: "Trash" });
      } else if (tag === "Shared") {
        getSharedNotes(
          setNotes,
          setCurrentNote,
          "",
          setCurrentTags,
          user.id,
          user.email
        );
        setCurrentTag({ ["name"]: "Shared" });
      } else {
        getFilterNotes(
          tag,
          setNotes,
          setCurrentNote,
          "",
          user.id,
          user.email,
          setCurrentTags
        );
      }
      onClose();
    }
  };

  const deleteTag = (tag) => {
    if (user) removeTag(tag, setTags, setCurrentTags, currentNote, user.id);
  };

  const logOut = () => {
    signOut();
    router.replace("/");
  };

  useEffect(async () => {
    if (user) getTags(setTags, user.id);
  }, []);

  return (
    <>
      <Hotkeys keyName="shift+q" onKeyDown={() => onOpen()} />
      <Tooltip hasArrow label="Menu" colorScheme="blue">
        <IconButton
          colorScheme="blue"
          size="md"
          icon={<Menu />}
          variant="ghost"
          onClick={onOpen}
        />
      </Tooltip>
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
                  My Notes
                </Button>
                <Button
                  colorScheme="blue"
                  w="100%"
                  mb="20px"
                  onClick={() => selectTag("Shared")}
                >
                  Shared Notes
                </Button>
                <Button
                  colorScheme="blue"
                  w="100%"
                  onClick={() => selectTag("Trash")}
                >
                  Deleted Notes
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
                        <Tooltip
                          hasArrow
                          label="Delete tag forever"
                          colorScheme="blue"
                        >
                          <IconButton
                            colorScheme="red"
                            size="sm"
                            icon={<Trash />}
                            variant="ghost"
                            onClick={() => deleteTag(tag)}
                          />
                        </Tooltip>
                      </HStack>
                    </ListItem>
                  ))}
                </List>
              </Box>
            </DrawerBody>

            <DrawerFooter display="flex" justifyContent="space-between">
              <IconButton
                colorScheme="blue"
                size="md"
                icon={<LogOut />}
                onClick={() => logOut()}
                variant="solid"
              />

              <LightMode />
              <IconButton
                colorScheme="blue"
                size="md"
                icon={<Settings />}
                variant="solid"
              />
            </DrawerFooter>
          </DrawerContent>
        </DrawerOverlay>
      </ChakraDrawer>
    </>
  );
}
