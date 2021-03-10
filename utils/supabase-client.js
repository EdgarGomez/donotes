import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export const getShared = async (currentNote, setShared) => {
  if (!currentNote) {
    setShared([]);
  } else {
    const { data, error } = await supabase
      .from("shared_notes")
      .select()
      .filter("note_id", "eq", currentNote.id)
      .order("email", { ascending: false });
    if (error) {
      console.log(error.message);
      throw error;
    }

    setShared(data);
  }
};

export const newShared = async (currentNote, setShared, email) => {
  const { data, error } = await supabase.from("shared_notes").insert([
    {
      note_id: currentNote.id,
      email: email,
    },
  ]);

  if (error) {
    console.log(error.message);
    throw error;
  }

  getShared(currentNote, setShared);
};

export const deleteShared = async (item, currentNote, setShared) => {
  const { data, error } = await supabase
    .from("shared_notes")
    .delete()
    .match({ id: item.id });

  if (error) {
    console.log(error.message);
    throw error;
  }

  getShared(currentNote, setShared);
};

export const getNotes = async (
  setNotes,
  setCurrentNote,
  currentNote,
  setCurrentTags,
  userid
) => {
  const { data, error } = await supabase
    .from("notes")
    .select()
    .filter("status", "eq", true)
    .filter("user_id", "eq", userid)
    .order("created_at", { ascending: false });

  if (error) {
    console.log(error.message);
    throw error;
  }

  setNotes(data);
  if (currentNote === "") {
    setCurrentNote(data[0]);
    getCurrentTags(data[0], setCurrentTags, userid);
  } else {
    setCurrentNote(currentNote);
    getCurrentTags(currentNote, setCurrentTags, userid);
  }
};

export const getTrashNotes = async (
  setNotes,
  setCurrentNote,
  currentNote,
  setCurrentTags,
  userid
) => {
  const { data, error } = await supabase
    .from("notes")
    .select()
    .filter("status", "eq", false)
    .filter("user_id", "eq", userid)
    .order("created_at", { ascending: false });

  if (error) {
    console.log(error.message);
    throw error;
  }

  setNotes(data);
  if (currentNote === "") {
    setCurrentNote(data[0]);
    getCurrentTags(data[0], setCurrentTags, userid);
  } else {
    setCurrentNote(currentNote);
    getCurrentTags(currentNote, setCurrentTags, userid);
  }
};

export const getSharedNotes = async (
  setNotes,
  setCurrentNote,
  currentNote,
  setCurrentTags,
  userid,
  useremail
) => {
  const { data, error } = await supabase
    .from("notes")
    .select(`*, shared_notes ( * )`)
    .filter("shared_notes.email", "eq", useremail)
    .filter("status", "eq", true);

  if (error) {
    console.log(error.message);
    throw error;
  }
  let finalData = data;
  let notes = [];
  let i = 0;
  if (finalData.length > 0) {
    finalData.map((note) => {
      if (note.shared_notes[0] && note.shared_notes[0].id != "") {
        notes[i] = note;
        i++;
      }
    });
  }
  setNotes(notes);
  if (notes.length === 0) {
    setCurrentNote(false);
  } else {
    if (currentNote === "") {
      setCurrentNote(notes[0]);
    } else {
      setCurrentNote(currentNote);
    }
  }
};

export const getCurrentTags = async (currentNote, setCurrentTags, userid) => {
  if (currentNote) {
    const { data, error } = await supabase
      .from("notetag")
      .select(`*, tags( * )`)
      .filter("note_id", "eq", currentNote && currentNote.id)
      .filter("tags.user_id", "eq", userid);

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
  }
};

export const getFilterNotes = async (
  tag,
  setNotes,
  setCurrentNote,
  currentNote,
  userid,
  email,
  setCurrentTags
) => {
  let finalData = false;
  if (tag.name === "Trash") {
    const { data, error } = await supabase
      .from("notes")
      .select()
      .filter("status", "eq", false)
      .filter("user_id", "eq", userid)
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
  } else if (tag.name === "Shared") {
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
    if (notes.length === 0) {
      setCurrentNote(false);
    } else {
      if (currentNote === "") {
        setCurrentNote(notes[0]);
      } else {
        setCurrentNote(currentNote);
      }
    }
  }
};

export const getTags = async (setTags, userid) => {
  const { data, error } = await supabase
    .from("tags")
    .select()
    .filter("user_id", "eq", userid)
    .order("name", { ascending: false });

  if (error) {
    console.log(error.message);
    throw error;
  }

  setTags(data);
};

export const saveUserInfo = async (id, name, email) => {
  const { data, error } = await supabase
    .from("users")
    .update({
      full_name: name,
      email: email,
    })
    .match({ id: id });

  if (error) {
    console.log(error.message);
    throw error;
  }
};

export const publishNote = async (currentNote, published, setPublished) => {
  const { data, error } = await supabase
    .from("notes")
    .update({
      published: published,
    })
    .match({ id: currentNote.id });

  if (error) {
    console.log(error.message);
    throw error;
  }
  setPublished(data.published);
};

export const saveNote = async (
  currentNote,
  setNotes,
  setCurrentNote,
  currentTag,
  setCurrentTags,
  userid
) => {
  if (currentNote) {
    const { data, error } = await supabase
      .from("notes")
      .update({
        title: currentNote && currentNote.title,
        content: currentNote && currentNote.content,
        edited_at: new Date().toISOString(),
      })
      .match({ id: currentNote && currentNote.id });

    if (error) {
      console.log(error.message);
      throw error;
    }
    if (currentTag == "") {
      getNotes(setNotes, setCurrentNote, currentNote, setCurrentTags, userid);
    } else {
      getFilterNotes(currentTag, setNotes, setCurrentNote, currentNote, userid);
    }
  }
};

export const deleteNote = async (
  id,
  setNotes,
  setCurrentNote,
  setCurrentTags,
  userid
) => {
  const { data, error } = await supabase
    .from("notes")
    .update({ status: false })
    .match({ id: id });

  if (error) {
    console.log(error.message);
    throw error;
  }

  getNotes(setNotes, setCurrentNote, "", setCurrentTags, userid);
};

export const restoreNote = async (
  id,
  setNotes,
  setCurrentNote,
  setCurrentTags,
  userid
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
  getFilterNotes(tag, setNotes, setCurrentNote, "", userid);
};

export const deleteForeverNote = async (
  id,
  setNotes,
  setCurrentNote,
  setCurrentTags,
  userid
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
  getFilterNotes(tag, setNotes, setCurrentNote, "", userid);
  //getNotes(setNotes, setCurrentNote, "", setCurrentTags);
};

export const newNote = async (
  setNotes,
  setCurrentNote,
  setCurrentTags,
  userid
) => {
  const { data, error } = await supabase.from("notes").insert([
    {
      title: "New note",
      user_id: userid,
    },
  ]);

  if (error) {
    console.log(error.message);
    throw error;
  }

  getNotes(setNotes, setCurrentNote, "", setCurrentTags, userid);
};

export const newTag = async (
  tag,
  tags,
  setTags,
  currentNote,
  setCurrentTags,
  userid
) => {
  let newtag = tags.find((item) => item.name === tag.name);
  let finalData = {};

  if (!newtag) {
    const { data, error } = await supabase.from("tags").insert([
      {
        name: tag.name,
        user_id: userid,
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
      .filter("name", "eq", tag.name)
      .filter("user_id", "eq", userid);

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

  getTags(setTags, userid);
  getCurrentTags(currentNote, setCurrentTags, userid);
};

export const deleteTag = async (
  tag,
  setTags,
  setCurrentTags,
  currentNote,
  userid
) => {
  const { data, error } = await supabase
    .from("notetag")
    .delete()
    .match({ tag_id: tag[0].id, note_id: currentNote.id });

  if (error) {
    console.log(error.message);
    throw error;
  }

  getTags(setTags, userid);
  getCurrentTags(currentNote, setCurrentTags, userid);
};

export const removeTag = async (
  tag,
  setTags,
  setCurrentTags,
  currentNote,
  userid
) => {
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

  getTags(setTags, userid);
  getCurrentTags(currentNote, setCurrentTags, userid);
};
