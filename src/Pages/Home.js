import React, { useEffect } from "react";
import {
  Box,
  Container,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
} from "@chakra-ui/react";
import SignIn from "../components/authentication/SignIn";
import SignUp from "../components/authentication/SignUp";
import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();

  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    if (userInfo) {
      navigate("/chats");
    }
  }, [navigate]);

  return (
    <Container maxW={"xl"} centerContent>
      <Box className="home-header" bg={"gray.800"}>
        <Text fontSize="4xl" fontFamily="Work Sans" color="gray.300">
          Chit Chat
        </Text>
      </Box>
      <Box className="home-tabs" bg={"gray.800"}>
        <Tabs variant={"soft-rounded"}>
          <TabList mb={"1em"}>
            <Tab width={"50%"} color="gray.300">Sign In</Tab>
            <Tab width={"50%"} color="gray.300">Sign Up</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <SignIn />
            </TabPanel>
            <TabPanel>
              <SignUp />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </Container>
  );
}

export default Home;
