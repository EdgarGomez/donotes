import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { getPublicNote } from "@/utils/supabase-client";
import { Box, Heading } from "@chakra-ui/layout";
import ReactMarkdown from "react-markdown";
import gfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";

export default function PublicNote() {
  const router = useRouter();
  const renderers = {
    code: ({ language, value }) => {
      return <SyntaxHighlighter language={language} children={value} />;
    },
  };
  const [publicNote, setPublicNote] = useState(false);
  //console.log(router);
  useEffect(async () => {
    if (router.query.slug) {
      getPublicNote(router.query.slug, setPublicNote);
    }
  }, [router.query.slug]);

  if (publicNote) {
    return (
      <Box width="800px" padding="30px" mx="auto" my="50px">
        <Heading mb="20px">{publicNote[0].title}</Heading>
        <ReactMarkdown
          plugins={[gfm]}
          renderers={renderers}
          allowDangerousHtml
          children={(publicNote && publicNote[0].content) || ""}
          className="content-preview"
        />
      </Box>
    );
  } else {
    return "Nothing to see here. Go back to Notes.";
  }
}
