import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export const getNotes = async (
  setCurrentNoteId,
  setCurrentNoteTitle,
  setCurrentNoteContent,
  setNotes,
  id,
  title,
  content
) => {
  const { data, error } = await supabase
    .from("notes")
    .select()
    .filter("status", "eq", true)
    .order("created_at", { ascending: false });

  if (error) {
    console.log(error.message);
    throw error;
  }

  if (id === "") {
    setCurrentNoteId(data[0].id);
  } else {
    setCurrentNoteId(id);
  }

  if (title === "") {
    setCurrentNoteTitle(data[0].title);
  } else {
    setCurrentNoteTitle(title);
  }

  if (content === "") {
    setCurrentNoteContent(data[0].content);
  } else {
    setCurrentNoteContent(content);
  }

  setNotes(data);

  return data || [];
};

export const saveNote = async (id, title, content) => {
  const { data, error } = await supabase
    .from("notes")
    .update({ title: title, content: content })
    .match({ id: id });

  if (error) {
    console.log(error.message);
    throw error;
  }

  return data || [];
};

export const deleteNote = async (
  id,
  setCurrentNoteId,
  setCurrentNoteTitle,
  setCurrentNoteContent,
  setNotes
) => {
  const { data, error } = await supabase
    .from("notes")
    .update({ status: false })
    .match({ id: id });

  if (error) {
    console.log(error.message);
    throw error;
  }

  getNotes(
    setCurrentNoteId,
    setCurrentNoteTitle,
    setCurrentNoteContent,
    setNotes,
    "",
    "",
    ""
  );

  return data || [];
};

export const newNote = async (
  setCurrentNoteId,
  setCurrentNoteTitle,
  setCurrentNoteContent,
  setNotes
) => {
  const { data, error } = await supabase.from("notes").insert([
    {
      title: "New note",
    },
  ]);

  if (error) {
    console.log(error.message);
    throw error;
  }

  getNotes(
    setCurrentNoteId,
    setCurrentNoteTitle,
    setCurrentNoteContent,
    setNotes,
    data[0].id,
    data[0].title,
    " "
  );

  return data || [];
};
