import { ChakraProvider } from "@chakra-ui/react";
import theme from "@/components/theme";
import { UserContextProvider } from "@/components/UserContext";
import "../styles/globals.css";

function MyApp({ Component, pageProps }) {
  return (
    <ChakraProvider resetCSS theme={theme}>
      <UserContextProvider>
        <Component {...pageProps} />
      </UserContextProvider>
    </ChakraProvider>
  );
}

export default MyApp;
