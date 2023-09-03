import React, { useEffect, useState } from "react";
import { ChatState } from "../../context/ChatProvider";
import { Box, Button, Stack, Text, useToast } from "@chakra-ui/react";
import { AddIcon } from "@chakra-ui/icons";
import ChatLoading from "./ChatLoading";
import { getSender } from "../../resusables/util";
import GroupChatModal from "./GroupChatModal";
import { axiosInstance } from "../../resusables/axiosConfig";
import socket from "../../resusables/socket";

const MyChats = ({ fetchAgain }) => {
  // eslint-disable-next-line no-unused-vars
  const [loggedUser, setLoggedUser] = useState();
  const { user, setSelectedChat, chats, setChats, selectedChat } = ChatState();

  const toast = useToast();

  useEffect(() => {
    setLoggedUser(JSON.parse(localStorage.getItem("userInfo")));
    fetchChats();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchAgain]);

  const leaveChat = (chatId) => {
    if (socket && chatId) {
      socket.emit("leave chat", chatId);
    }
  };

  const handleChatSelection = (chat) => {
    leaveChat(selectedChat?._id); // Leave the current chat
    setSelectedChat(chat); // Set the new selected chat
  };  

  const fetchChats = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axiosInstance.get("/api/chat", config);
      setChats(data);
    } catch (error) {
      toast({
        title: "Error occurred",
        description: "Failed to load chats",
        duration: 5000,
        isClosable: true,
        position: "top-right",
      });
    }
  };

  return (
    <Box
      display={{ base: selectedChat ? "none" : "flex", md: "flex" }}
      flexDir={"column"}
      alignItems={"center"}
      p={3}
      bg="gray.800" // Change background color for dark theme
      w={{ base: "100%", md: "31%" }}
      borderRadius={"lg"}
      borderWidth={"1px"}
    >
      <Box
        pb={3}
        px={3}
        fontSize={{ base: "28px", md: "30px" }}
        fontFamily={"Work Sans"}
        display={"flex"}
        w="100%"
        justifyContent={"space-between"}
        alignItems={"center"}
        color={ "white"} // Adjust colors
      >
        My Chats
        <GroupChatModal>
          <Button
            display={"flex"}
            fontSize={{ base: "17px", md: "10px", lg: "17px" }}
            rightIcon={<AddIcon />}
          >
            New Group Chat
          </Button>
        </GroupChatModal>
      </Box>

      <Box
        display={"flex"}
        flexDir={"column"}
        p={3}
        w="100%"
        height="100%"
        borderRadius={"lg"}
        overflowY={"hidden"}
      >
        {chats ? (
          <Stack overflowY={"scroll"}>
            {chats.map((chat) => (
              <Box
                onClick={() => handleChatSelection(chat)}
                cursor={"pointer"}
                bg={selectedChat?._id === chat._id ? "#4A90E2" : "#25282A"} // Adjust colors
                color={selectedChat?._id === chat._id ? "white" : "gray.200"} // Adjust colors
                px={3}
                py={2}
                borderRadius={"lg"}
                key={chat._id}
              >
                <Text>
                  {!chat.isGroupChat
                    ? getSender(user, chat.users)
                    : chat.chatName}
                </Text>
              </Box>
            ))}
          </Stack>
        ) : (
          <ChatLoading />
        )}
      </Box>
    </Box>
  );
};

export default MyChats;
