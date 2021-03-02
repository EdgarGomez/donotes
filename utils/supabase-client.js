import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export const getNotes = async (setNotes, setCurrentNote, currentNote) => {
  const { data, error } = await supabase
    .from("notes")
    .select()
    .filter("status", "eq", true)
    .order("created_at", { ascending: false });

  if (error) {
    console.log(error.message);
    throw error;
  }

  setNotes(data);
  if (currentNote === "") {
    setCurrentNote(data[0]);
  } else {
    setCurrentNote(currentNote);
  }
};

export const getFilterNotes = async (
  tag,
  setNotes,
  setCurrentNote,
  currentNote
) => {
  const { data, error } = await supabase
    .from("notes")
    .select(`*, notetag ( * )`)
    .filter("notetag.tag_id", "eq", tag.id)
    .filter("status", "eq", true);

  if (error) {
    console.log(error.message);
    throw error;
  }

  let notes = [];
  let i = 0;

  data.map((note) => {
    if (note.notetag[0] && note.notetag[0].id != "") {
      notes[i] = note;
      i++;
    }
  });

  setNotes(notes);
  if (currentNote === "") {
    setCurrentNote(notes[0]);
  } else {
    setCurrentNote(currentNote);
  }
};

export const getTags = async (setTags) => {
  const { data, error } = await supabase
    .from("tags")
    .select()
    .order("name", { ascending: false });

  if (error) {
    console.log(error.message);
    throw error;
  }

  setTags(data);
};

export const saveNote = async (
  currentNote,
  setNotes,
  setCurrentNote,
  currentTag
) => {
  const { data, error } = await supabase
    .from("notes")
    .update({ title: currentNote.title, content: currentNote.content })
    .match({ id: currentNote.id });

  if (error) {
    console.log(error.message);
    throw error;
  }
  if (currentTag == "") {
    getNotes(setNotes, setCurrentNote, currentNote);
  } else {
    getFilterNotes(currentTag, setNotes, setCurrentNote, currentNote);
  }
};

export const deleteNote = async (id, setNotes, setCurrentNote) => {
  const { data, error } = await supabase
    .from("notes")
    .update({ status: false })
    .match({ id: id });

  if (error) {
    console.log(error.message);
    throw error;
  }

  getNotes(setNotes, setCurrentNote, "");
};

export const newNote = async (setNotes, setCurrentNote) => {
  const { data, error } = await supabase.from("notes").insert([
    {
      title: "New note",
    },
  ]);

  if (error) {
    console.log(error.message);
    throw error;
  }

  getNotes(setNotes, setCurrentNote, "");
};

export const newTag = async (tag, setTags) => {
  const { data, error } = await supabase.from("tags").insert([
    {
      name: tag.name,
    },
  ]);

  if (error) {
    console.log(error.message);
    throw error;
  }

  getTags(setTags);
};

export const deleteTag = async (tag, setTags) => {
  const { data, error } = await supabase
    .from("tags")
    .delete()
    .match({ id: tag[0].id });

  if (error) {
    console.log(error.message);
    throw error;
  }

  getTags(setTags);
};
