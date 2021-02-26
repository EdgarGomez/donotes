import {
  getNotes,
  saveNote,
  newNote,
  deleteNote,
} from "@/utils/supabase-client";
import {
  Box,
  Text,
  Heading,
  Input,
  Textarea,
  List,
  ListItem,
  IconButton,
  HStack,
  Collapse,
  useDisclosure,
} from "@chakra-ui/react";
import { FilePlus, Menu, Trash, Sidebar, Eye } from "react-feather";
import Moment from "react-moment";
import Hotkeys from "react-hot-keys";
import { useState, useEffect } from "react";
import SunEditor from "suneditor-react";
import "suneditor/dist/css/suneditor.min.css"; // Import Sun Editor's CSS File
import Shortcuts from "@/components/Shortcuts";

export default function Notes() {
  const { isOpen, onOpen, onToggle } = useDisclosure();

  const [notes, setNotes] = useState([]);
  const [currentNoteId, setCurrentNoteId] = useState("");
  const [currentNoteTitle, setCurrentNoteTitle] = useState("");
  const [currentNoteContent, setCurrentNoteContent] = useState("");
  const [viewToolbar, setViewToolbar] = useState(false);

  const showToolbar = () => {
    setViewToolbar(!viewToolbar);
  };

  const selectNote = (note) => {
    getNotes(
      setCurrentNoteId,
      setCurrentNoteTitle,
      setCurrentNoteContent,
      setNotes,
      note.id,
      note.title,
      note.content
    );
  };

  useEffect(() => {
    onOpen();
    const timeoutId = setTimeout(
      () => saveNote(currentNoteId, currentNoteTitle, currentNoteContent),

      1000
    );
    return () => clearTimeout(timeoutId);
  }, [currentNoteContent, currentNoteTitle]);

  useEffect(() => {
    getNotes(
      setCurrentNoteId,
      setCurrentNoteTitle,
      setCurrentNoteContent,
      setNotes,
      "",
      "",
      ""
    );
  }, []);

  return (
    <>
      <Hotkeys
        keyName="shift+n"
        onKeyDown={() =>
          newNote(
            setCurrentNoteId,
            setCurrentNoteTitle,
            setCurrentNoteContent,
            setNotes
          )
        }
      />
      <Hotkeys
        keyName="shift+d"
        onKeyDown={() =>
          deleteNote(
            currentNoteId,
            setCurrentNoteId,
            setCurrentNoteTitle,
            setCurrentNoteContent,
            setNotes
          )
        }
      />
      <Hotkeys keyName="shift+t" onKeyDown={() => showToolbar()} />
      <Hotkeys keyName="shift+s" onKeyDown={() => onToggle()} />

      <Box height="100vh" width="100%" display="flex" color="black">
        <Collapse in={isOpen} animateOpacity className="collapse-aside">
          <Box
            as="aside"
            borderWidth="1px"
            borderTop="0"
            borderLeft="0"
            borderBottom="0"
            height="100%"
          >
            <Box
              borderWidth="1px"
              borderLeft="0"
              borderRight="0"
              borderTop="0"
              height="5vh"
              display="flex"
            >
              <HStack w="100%" justify="space-between">
                <Box>
                  {" "}
                  <IconButton
                    colorScheme="blue"
                    size="md"
                    icon={<Menu />}
                    variant="ghost"
                    onClick={onToggle}
                  />
                </Box>
                <Box>
                  <Heading fontSize="xl">Notes</Heading>
                </Box>
                <Box>
                  {" "}
                  <IconButton
                    colorScheme="blue"
                    size="md"
                    icon={<FilePlus />}
                    variant="ghost"
                    onClick={() =>
                      newNote(
                        setCurrentNoteId,
                        setCurrentNoteTitle,
                        setCurrentNoteContent,
                        setNotes
                      )
                    }
                  />
                </Box>
              </HStack>
            </Box>

            <Box px="15px" py="15px">
              <List>
                {notes.map((note) => (
                  <ListItem
                    onClick={() => selectNote(note)}
                    key={note.id}
                    borderWidth="1px"
                    borderLeft="0"
                    borderRight="0"
                    borderTop="0"
                    py="5px"
                    cursor="pointer"
                  >
                    <Box w="100%">{note.title}</Box>
                  </ListItem>
                ))}
              </List>
            </Box>
          </Box>
        </Collapse>
        <Box as="main" w="100%" overflow="hidden">
          <HStack
            borderWidth="1px"
            borderLeft="0"
            borderRight="0"
            borderTop="0"
            height="5vh"
            display="flex"
            justify="space-between"
          >
            <IconButton
              colorScheme="blue"
              aria-label="delete"
              size="md"
              icon={<Sidebar />}
              variant="ghost"
              onClick={onToggle}
            />
            <Box>
              <IconButton
                colorScheme="blue"
                aria-label="delete"
                size="md"
                icon={<Trash />}
                variant="ghost"
                onClick={() =>
                  deleteNote(
                    currentNoteId,
                    setCurrentNoteId,
                    setCurrentNoteTitle,
                    setCurrentNoteContent,
                    setNotes
                  )
                }
              />
              <IconButton
                colorScheme="blue"
                size="md"
                icon={<Eye />}
                variant="ghost"
                onClick={() => showToolbar()}
              />
              <Shortcuts />
            </Box>
          </HStack>
          <Box px="40px" overflow="scroll">
            <Input
              variant="unstyled"
              placeholder="New note"
              value={currentNoteTitle}
              onChange={(e) => setCurrentNoteTitle(e.target.value)}
              w="100%"
              height="5vh"
              fontSize="22px"
            />
            <SunEditor
              setContents={currentNoteContent}
              onChange={(content) => setCurrentNoteContent(content)}
              showToolbar={viewToolbar}
              height="90vh"
              resize="none"
              setDefaultStyle="font-size: 16px;"
            />
            {/*<Textarea
              variant="unstyled"
              placeholder="Content"
              height="90vh"
              value={currentNoteContent}
              onChange={(e) => setCurrentNoteContent(e.target.value)}
              resize="none"
              w="100%"
            />*/}
          </Box>
        </Box>
      </Box>
    </>
  );
}
