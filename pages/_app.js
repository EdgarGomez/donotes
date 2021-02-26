import { ChakraProvider } from "@chakra-ui/react";
import theme from "@/components/theme";
import { UserContextProvider } from "@/components/UserContext";
import "../styles/globals.css";

function MyApp({ Component, pageProps }) {
  return (
    <UserContextProvider>
      <ChakraProvider resetCSS theme={theme}>
        <Component {...pageProps} />
      </ChakraProvider>
    </UserContextProvider>
  );
}

export default MyApp;
