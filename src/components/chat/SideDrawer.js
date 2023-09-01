import {
  Avatar,
  Box,
  Button,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  Input,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  Spinner,
  Text,
  Tooltip,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { BellIcon, ChevronDownIcon } from "@chakra-ui/icons";
import React, { useState } from "react";
import { ChatState } from "../../context/ChatProvider";
import ProfileModal from "./ProfileModal";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import ChatLoading from "./ChatLoading";
import UserListItem from "../User/UserListItem";
import { getSender } from "../../resusables/util";
import { Effect } from "react-notification-badge";
import NotificationBadge from "react-notification-badge/lib/components/NotificationBadge";
import { Icon } from "@chakra-ui/react";
import { SearchIcon } from "@chakra-ui/icons";
import debounce from "lodash/debounce";
import { axiosInstance } from "../../resusables/axiosConfig";

const SideDrawer = () => {
  const {
    user,
    setSelectedChat,
    chats,
    setChats,
    notification,
    setNotification,
  } = ChatState();
  const navigate = useNavigate();
  const [search, setSearch] = useState();
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingChat, setLoadingChat] = useState();

  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  const delayedSearch = debounce(async () => {
    if (!search) {
      setSearchResult([]); // Clear search results if search is empty
      return;
    }

    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axiosInstance.get(`/api/user?search=${search}`, config);
      setSearchResult(data);
    } catch (error) {
      toast({
        title: "Error occurred",
        description: "Failed to load the search results",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top-right",
      });
    } finally {
      setLoading(false);
    }
  }, 3000); // Wait for 3000 milliseconds (3 seconds) before performing search

  const handleSearchInputChange = (e) => {
    setSearch(e.target.value);
    delayedSearch(); // Invoke the delayed search function
  };

  const logOutUser = () => {
    localStorage.removeItem("userInfo");
    navigate("/");
  };

  const accessChat = async (userId) => {
    try {
      setLoadingChat(true);

      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axiosInstance.post("/api/chat", { userId }, config);
      if (!chats.find((c) => c._id === data._id)) setChats([data, ...chats]);
      setSelectedChat(data);
      onClose();
      setLoadingChat(false);
    } catch (error) {
      toast({
        title: "Error fetching chat",
        description: error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top-right",
      });
    } finally {
      setLoadingChat(false);
    }
  };

  return (
    <>
      <Box
        display={"flex"}
        justifyContent={"space-between"}
        alignItems={"center"}
        bg={"gray.800"} // Change background color for dark theme
        w="100%"
        p="5px 10px 5px 10px"
        borderWidth={"5px"}
      >
        <Tooltip label="Search Users" hasArrow placement="bottom-end">
          <Button variant={"ghost"} onClick={onOpen}>
            <Icon
              as={SearchIcon}
              fontSize="1.2rem"
              marginRight="1"
              color="gray.400"
            />
            <Text
              display={{ base: "none", md: "flex" }}
              px={"4"}
              color="gray.300"
            >
              
              {/* Adjust text color */}
              Search User
            </Text>
          </Button>
        </Tooltip>

        <Text
          fontSize={"2xl"}
          fontWeight={"bold"}
          fontFamily={"Work Sans"}
          color="white"
        >
          
          {/* Adjust text color */}
          Chit Chat
        </Text>

        <div>
          <Menu>
            <MenuButton p={1}>
              <NotificationBadge
                count={notification.length}
                effect={Effect.SCALE}
              />
              <BellIcon fontSize={"3xl"} m={1} color="gray.400" />
              {/* Adjust icon color */}
            </MenuButton>
            <MenuList pl={3} bg="gray.900">
              
              {/* Adjust background color */}
              {!notification.length && (
                <MenuItem
                  color="gray.400"
                  bg="gray.900"
                  _hover={{ color: "white" }}
                  fontSize="sm"
                >
                  No New Messages
                </MenuItem>
              )}
              {/* Adjust text color */}
              {notification.map((noti) => (
                <MenuItem
                  key={noti._id}
                  onClick={() => {
                    setSelectedChat(noti.chat);
                    setNotification(
                      notification.filter((n) => n._id !== noti._id)
                    );
                  }}
                  _hover={{ color: "white" }} // Adjust hover text and background color
                  color="gray.400" // Adjust text color
                  fontSize="sm" // Adjust font size
                  justifyContent="flex-start" // Adjust alignment
                  bg="gray.900" // Explicitly set background color
                >
                  {noti.chat.isGroupChat ? (
                    <Text>{`New Message in ${noti.chat.chatName}`}</Text>
                  ) : (
                    <Text>{`New Message from ${getSender(
                      user,
                      noti.chat.users
                    )}`}</Text>
                  )}
                </MenuItem>
              ))}
            </MenuList>
          </Menu>

          <Menu>
            <MenuButton
              as={Button}
              rightIcon={<ChevronDownIcon />}
              variant="ghost"
              color="gray.300" // Adjust icon color
              _hover={{ color: "white" }} // Adjust hover text color
              _active={{color: "gray.700"}}
            >
              <Avatar
                size={"sm"}
                cursor={"pointer"}
                name={user.name}
                src={user.photo}
                borderColor="gray.600" // Adjust border color
              />
            </MenuButton>
            <MenuList bg="gray.700">
              {/* Adjust background color */}
              <ProfileModal user={user}>
                <MenuItem
                  color="white"
                  bg="gray.700"
                  _hover={{ color: "white" }}
                >
                  My Profile
                </MenuItem>
                {/* Adjust text color */}
              </ProfileModal>
              <MenuDivider />
              <MenuItem
                color="white"
                bg="gray.700"
                _hover={{ color: "white" }}
                onClick={logOutUser}
              >
                Logout
              </MenuItem>
              {/* Adjust text color */}
            </MenuList>
          </Menu>
        </div>
      </Box>

      <Drawer placement="left" isOpen={isOpen} onClose={onClose}>
        <DrawerOverlay />
        <DrawerContent bg="gray.800" color="white">
          {/* Adjust background and text color */}
          <DrawerHeader borderBottomWidth={"1px"}>Search Users</DrawerHeader>
          <DrawerBody>
            <Box display={"flex"} pb={2}>
              <Input
                placeholder="Search by Name or Email"
                mr={2}
                value={search}
                onChange={handleSearchInputChange}
              />
            </Box>
            {loading ? (
              <ChatLoading />
            ) : (
              searchResult?.map((user) => (
                <UserListItem
                  key={user._id}
                  user={user}
                  handleOnClick={() => accessChat(user._id)}
                />
              ))
            )}
            {loadingChat && <Spinner ml={"auto"} display={"flex"} />}
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default SideDrawer;
