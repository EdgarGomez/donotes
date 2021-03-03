import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export const getNotes = async (
  setNotes,
  setCurrentNote,
  currentNote,
  setCurrentTags
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

  setNotes(data);
  if (currentNote === "") {
    setCurrentNote(data[0]);
    getCurrentTags(data[0], setCurrentTags);
  } else {
    setCurrentNote(currentNote);
    getCurrentTags(currentNote, setCurrentTags);
  }
};

export const getTrashNotes = async (
  setNotes,
  setCurrentNote,
  currentNote,
  setCurrentTags
) => {
  const { data, error } = await supabase
    .from("notes")
    .select()
    .filter("status", "eq", false)
    .order("created_at", { ascending: false });

  if (error) {
    console.log(error.message);
    throw error;
  }

  setNotes(data);
  if (currentNote === "") {
    setCurrentNote(data[0]);
    getCurrentTags(data[0], setCurrentTags);
  } else {
    setCurrentNote(currentNote);
    getCurrentTags(currentNote, setCurrentTags);
  }
};

export const getCurrentTags = async (currentNote, setCurrentTags) => {
  const { data, error } = await supabase
    .from("notetag")
    .select(`*, tags( * )`)
    .filter("note_id", "eq", currentNote.id);

  if (error) {
    console.log(error.message);
    throw error;
  }

  let tags = [];
  let i = 0;

  data.map((tag) => {
    tags[i] = tag.tags;
    i++;
  });

  setCurrentTags(tags);
};

export const getFilterNotes = async (
  tag,
  setNotes,
  setCurrentNote,
  currentNote
) => {
  let finalData = false;
  if (tag.name === "Trash") {
    const { data, error } = await supabase
      .from("notes")
      .select()
      .filter("status", "eq", false)
      .order("created_at", { ascending: false });

    if (error) {
      console.log(error.message);
      throw error;
    }
    finalData = data;
    setNotes(finalData);
    if (currentNote === "") {
      setCurrentNote(finalData[0]);
    } else {
      setCurrentNote(currentNote);
    }
  } else {
    const { data, error } = await supabase
      .from("notes")
      .select(`*, notetag ( * )`)
      .filter("notetag.tag_id", "eq", tag.id)
      .filter("status", "eq", true);

    if (error) {
      console.log(error.message);
      throw error;
    }
    finalData = data;

    let notes = [];
    let i = 0;

    finalData.map((note) => {
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
  currentTag,
  setCurrentTags
) => {
  const { data, error } = await supabase
    .from("notes")
    .update({
      title: currentNote.title,
      content: currentNote.content,
      edited_at: new Date().toISOString(),
    })
    .match({ id: currentNote.id });

  if (error) {
    console.log(error.message);
    throw error;
  }
  if (currentTag == "") {
    getNotes(setNotes, setCurrentNote, currentNote, setCurrentTags);
  } else {
    getFilterNotes(currentTag, setNotes, setCurrentNote, currentNote);
  }
};

export const deleteNote = async (
  id,
  setNotes,
  setCurrentNote,
  setCurrentTags
) => {
  const { data, error } = await supabase
    .from("notes")
    .update({ status: false })
    .match({ id: id });

  if (error) {
    console.log(error.message);
    throw error;
  }

  getNotes(setNotes, setCurrentNote, "", setCurrentTags);
};

export const restoreNote = async (
  id,
  setNotes,
  setCurrentNote,
  setCurrentTags
) => {
  const { data, error } = await supabase
    .from("notes")
    .update({ status: true })
    .match({ id: id });

  if (error) {
    console.log(error.message);
    throw error;
  }

  const tag = { ["name"]: "Trash" };
  getFilterNotes(tag, setNotes, setCurrentNote, "");
};

export const deleteForeverNote = async (
  id,
  setNotes,
  setCurrentNote,
  setCurrentTags
) => {
  const { data, error } = await supabase
    .from("notes")
    .delete()
    .match({ id: id });

  if (error) {
    console.log(error.message);
    throw error;
  }

  const tag = { ["name"]: "Trash" };
  getFilterNotes(tag, setNotes, setCurrentNote, "");
  //getNotes(setNotes, setCurrentNote, "", setCurrentTags);
};

export const newNote = async (setNotes, setCurrentNote, setCurrentTags) => {
  const { data, error } = await supabase.from("notes").insert([
    {
      title: "New note",
    },
  ]);

  if (error) {
    console.log(error.message);
    throw error;
  }

  getNotes(setNotes, setCurrentNote, "", setCurrentTags);
};

export const newTag = async (
  tag,
  tags,
  setTags,
  currentNote,
  setCurrentTags
) => {
  let newtag = tags.find((item) => item.name === tag.name);
  let finalData = {};

  if (!newtag) {
    console.log("pasa");
    const { data, error } = await supabase.from("tags").insert([
      {
        name: tag.name,
      },
    ]);

    if (error) {
      console.log(error.message);
      throw error;
    }
    finalData = data;
  } else {
    const { data, error } = await supabase
      .from("tags")
      .select()
      .filter("name", "eq", tag.name);

    if (error) {
      console.log(error.message);
      throw error;
    }
    finalData = data;
  }

  const { data2, error2 } = await supabase.from("notetag").insert([
    {
      note_id: currentNote.id,
      tag_id: finalData[0].id,
    },
  ]);

  if (error2) {
    console.log(error2.message);
    throw error2;
  }

  getTags(setTags);
  getCurrentTags(currentNote, setCurrentTags);
};

export const deleteTag = async (tag, setTags, setCurrentTags, currentNote) => {
  const { data, error } = await supabase
    .from("notetag")
    .delete()
    .match({ tag_id: tag[0].id, note_id: currentNote.id });

  if (error) {
    console.log(error.message);
    throw error;
  }

  getTags(setTags);
  getCurrentTags(currentNote, setCurrentTags);
};

export const removeTag = async (tag, setTags, setCurrentTags, currentNote) => {
  const { data, error } = await supabase
    .from("notetag")
    .delete()
    .match({ tag_id: tag.id });

  if (error) {
    console.log(error.message);
    throw error;
  }

  const { data2, error2 } = await supabase
    .from("tags")
    .delete()
    .match({ id: tag.id });

  if (error2) {
    console.log(error2.message);
    throw error2;
  }

  getTags(setTags);
  getCurrentTags(currentNote, setCurrentTags);
};
