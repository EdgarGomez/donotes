import { Box, Center, Button } from "@chakra-ui/react";
import { useEffect } from "react";
import { saveUserInfo } from "@/utils/supabase-client";
import { supabase } from "@/utils/initSupabase";
import { Auth } from "@supabase/ui";
import { useUser } from "@/components/UserContext";
import Link from "next/link";
export default function Home() {
  const { user, signOut } = useUser();
  useEffect(async () => {
    if (user) {
      console.log(user);
      saveUserInfo(
        user.id,
        user.user_metadata && user.user_metadata.full_name,
        user.email
      );
    }
  }, [user]);
  return (
    <>
      {user ? (
        <>
          <Center>
            <Box width="360px" mt="50px">
              <Link href="/app">
                <Button w="100%" colorScheme="blue" size="lg" mb="40px">
                  Open Notes
                </Button>
              </Link>
              <Button
                variant="outline"
                colorScheme="blue"
                onClick={() => signOut()}
                w="100%"
              >
                Sign out
              </Button>
            </Box>
          </Center>
        </>
      ) : (
        <Center>
          <Box
            width="360px"
            mt="50px"
            borderWidth="1px"
            backgroundColor="blue.900"
            padding="15px"
            borderRadius="10px"
            color="white"
          >
            <Auth
              providers={["github"]}
              socialButtonSize="medium"
              socialLayout="horizontal"
              supabaseClient={supabase}
              view="sign_in"
            />
          </Box>
        </Center>
      )}
    </>
  );
}
