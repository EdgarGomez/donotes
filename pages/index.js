import {
  getNotes,
  saveNote,
  newNote,
  deleteNote,
  deleteTag,
  newTag,
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
import Shortcuts from "@/components/Shortcuts";
import Drawer from "@/components/Drawer";
import ReactMarkdown from "react-markdown";
import gfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import ReactTags from "react-tag-autocomplete";

export default function Notes() {
  const renderers = {
    code: ({ language, value }) => {
      return <SyntaxHighlighter language={language} children={value} />;
    },
  };
  const { isOpen, onOpen, onToggle } = useDisclosure();

  const [notes, setNotes] = useState([]);
  const [currentNote, setCurrentNote] = useState(false);
  const [currentTags, setCurrentTags] = useState([]);
  const [currentTag, setCurrentTag] = useState("");
  const [preview, setPreview] = useState(false);
  const [tags, setTags] = useState([]);

  const handleFormChange = ({ target: { type, name, value } }) => {
    setCurrentNote({ ...currentNote, [name]: value });
  };

  const selectNote = (note) => {
    setCurrentNote({
      ...currentNote,
      id: note.id,
      title: note.title,
      content: note.content,
    });
  };

  const removeTag = (tag) => {
    const deletetag = currentTags.slice(0);
    const deletetaginfo = deletetag.splice(tag, 1);
    deleteTag(deletetaginfo, setTags, setCurrentTags, currentNote);
  };

  const addTag = (tag) => {
    tag.name = tag.name.toLowerCase();
    let newtag = currentTags.find((item) => item.name === tag.name);
    if (!newtag) {
      newTag(tag, tags, setTags, currentNote, setCurrentTags);
    }
  };

  useEffect(() => {
    onOpen();
    const timeoutId = setTimeout(
      () =>
        saveNote(
          currentNote,
          setNotes,
          setCurrentNote,
          currentTag,
          setCurrentTags
        ),
      1000
    );
    return () => clearTimeout(timeoutId);
  }, [currentNote.title, currentNote.content]);

  useEffect(async () => {
    getNotes(setNotes, setCurrentNote, "", setCurrentTags);
  }, []);

  const suggestions = [
    { id: 3, name: "Bananas" },
    { id: 4, name: "Bangos" },
    { id: 5, name: "Lemons" },
    { id: 6, name: "Apricots" },
  ];

  return (
    <>
      <Hotkeys
        keyName="shift+n"
        onKeyDown={() => newNote(setNotes, setCurrentNote, setCurrentTags)}
      />
      <Hotkeys
        keyName="shift+d"
        onKeyDown={() =>
          deleteNote(currentNote.id, setNotes, setCurrentNote, setCurrentTags)
        }
      />
      <Hotkeys keyName="shift+t" onKeyDown={() => showToolbar()} />
      <Hotkeys keyName="shift+s" onKeyDown={() => onToggle()} />
      <Hotkeys keyName="shift+p" onKeyDown={() => setPreview(!preview)} />

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
                  <Drawer
                    setCurrentTag={setCurrentTag}
                    setNotes={setNotes}
                    setCurrentNote={setCurrentNote}
                    tags={tags}
                    setTags={setTags}
                    setCurrentTags={setCurrentTags}
                    currentNote={currentNote}
                  />
                </Box>
                <Box>
                  <Heading fontSize="xl">
                    {currentTag === ""
                      ? "Notes"
                      : `Notes filtered by ${currentTag.name}`}
                  </Heading>
                </Box>
                <Box>
                  {" "}
                  <IconButton
                    colorScheme="blue"
                    size="md"
                    icon={<FilePlus />}
                    variant="ghost"
                    onClick={() =>
                      newNote(setNotes, setCurrentNote, setCurrentTags)
                    }
                  />
                </Box>
              </HStack>
            </Box>

            <Box px="15px" py="15px">
              <List className="notes-list">
                {notes.map((note, i) => (
                  <ListItem
                    onClick={() => selectNote(note)}
                    key={i}
                    borderWidth="1px"
                    borderLeft="0"
                    borderRight="0"
                    borderTop="0"
                    py="5px"
                    cursor="pointer"
                    bgGradient={
                      currentNote.id === note.id
                        ? "linear(to-r, blue.500, blue.100)"
                        : ""
                    }
                    color={currentNote.id === note.id ? "white" : ""}
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
              size="md"
              icon={<Sidebar />}
              variant="ghost"
              onClick={onToggle}
            />
            <Box>
              <IconButton
                colorScheme="blue"
                size="md"
                icon={<Eye />}
                variant="ghost"
                onClick={() => setPreview(!preview)}
              />
              <Shortcuts />
              <IconButton
                colorScheme="blue"
                aria-label="delete"
                size="md"
                icon={<Trash />}
                variant="ghost"
                onClick={() =>
                  deleteNote(
                    currentNote.id,
                    setNotes,
                    setCurrentNote,
                    setCurrentTags
                  )
                }
              />
            </Box>
          </HStack>
          <Box px="40px" overflow="scroll" position="relative">
            <Input
              variant="unstyled"
              placeholder="New note"
              value={currentNote.title || ""}
              onChange={handleFormChange}
              w="100%"
              height="5vh"
              fontSize="22px"
              name="title"
            />
            {preview ? (
              <Box h="90vh">
                <ReactMarkdown
                  plugins={[gfm]}
                  renderers={renderers}
                  allowDangerousHtml
                  children={currentNote.content || ""}
                />
              </Box>
            ) : (
              <Textarea
                variant="unstyled"
                placeholder="Content"
                height="90vh"
                value={currentNote.content || ""}
                onChange={handleFormChange}
                resize="none"
                w="100%"
                name="content"
              />
            )}
            <Box position="absolute" bottom="5px" w="100%" left="0">
              <ReactTags
                //ref={this.reactTags}
                tags={currentTags}
                suggestions={tags}
                onDelete={removeTag}
                onAddition={addTag}
                allowNew
              />
            </Box>
          </Box>
        </Box>
      </Box>
    </>
  );
}
