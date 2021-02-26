import { useRouter } from "next/router";
import { useState } from "react";
import { postData } from "../utils/helpers";
import { getStripe } from "../utils/initStripejs";
import { useUser } from "../components/UserContext";
import {
  Box,
  Button,
  Center,
  Heading,
  HStack,
  Text,
  Tabs,
  TabList,
  Tab,
} from "@chakra-ui/react";

export default function Pricing({ products }) {
  const [billingInterval, setBillingInterval] = useState("month");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { session, userLoaded, subscription } = useUser();

  const handleCheckout = async (price) => {
    setLoading(true);
    if (!session) {
      router.push("/");
      return;
    }
    if (subscription) {
      router.push("/account");
      return;
    }
    const { sessionId, error: apiError } = await postData({
      url: "/api/createCheckoutSession",
      data: { price },
      token: session.access_token,
    });
    if (apiError) return alert(apiError.message);
    const stripe = await getStripe();
    const { error: stripeError } = stripe.redirectToCheckout({ sessionId });
    if (stripeError) alert(error.message);
    setLoading(false);
  };

  if (!products.length)
    return (
      <Box>
        <Text>
          No subscription pricing plans found. Please contact the site admin.
        </Text>
      </Box>
    );

  return (
    <Center>
      <Box>
        <Box mb="20px">
          <Tabs isFitted variant="enclosed" colorScheme="green">
            <TabList>
              <Tab onClick={() => setBillingInterval("month")}>Monthly</Tab>
              <Tab onClick={() => setBillingInterval("year")}>Yearly</Tab>
            </TabList>
          </Tabs>
        </Box>
        <Box display="flex" alignItems="center">
          {products.map((product) => {
            const price = product.prices.find(
              (price) => price.interval === billingInterval
            );
            const priceString = new Intl.NumberFormat("es-ES", {
              style: "currency",
              currency: price.currency,
              minimumFractionDigits: 0,
            }).format(price.unit_amount / 100);
            return (
              <Box mx="auto" key={product.id}>
                <Box>
                  <Heading as="h4" fontSize="xl">
                    {product.name}
                  </Heading>
                  <Text>{product.description}</Text>
                  <HStack mb="20px">
                    <Text fontSize="2xl">{priceString}</Text>
                    <Text fontSize="xl"> / {billingInterval}</Text>
                  </HStack>
                  <Button
                    isDisabled={session && !userLoaded}
                    isLoading={loading}
                    onClick={() => handleCheckout(price.id)}
                    variant="solid"
                    colorScheme="green"
                    mx="auto"
                    w="100%"
                  >
                    {product.name === subscription?.prices?.products.name
                      ? "Manage"
                      : "Subscribe"}
                  </Button>
                  <Text mt="20px">Cancel anytime.</Text>
                </Box>
              </Box>
            );
          })}
        </Box>
      </Box>
    </Center>
  );
}
