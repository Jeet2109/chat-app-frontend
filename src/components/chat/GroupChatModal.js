import {
  Box,
  Button,
  FormControl,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Spinner,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { ChatState } from "../../context/ChatProvider";
import axios from "axios";
import UserListItem from "../User/UserListItem";
import UserBadgeItem from "../User/UserBadgeItem";

const GroupChatModal = ({ children }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [groupChatName, setGroupChatName] = useState("");
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const toast = useToast();

  const { user, setChats } = ChatState();

  const config = {
    headers: {
      Authorization: `Bearer ${user.token}`,
    },
  };

  const handleSearch = async (searchValue) => {
    setSearch(searchValue);
    if (!searchValue || searchValue.length < 3) {
      setSearchResult([]);
      return;
    }

    try {
      setLoading(true);
      const { data } = await axios.get(`/api/user?search=${search}`, config);
      setSearchResult(data);
      setLoading(false);
    } catch (error) {
      toast({
        title: "Error occured",
        description: "Failed to load users",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top-right",
      });
      setLoading(false);
    }
  };

  const onModalClose = () => {
    setGroupChatName("");
    setSelectedUsers([]);
    onClose();
  };

  const handleSetGroupUsers = (userToAdd) => {
    if (selectedUsers.includes(userToAdd)) {
      toast({
        title: "User already selected",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
      return;
    }

    setSelectedUsers([...selectedUsers, userToAdd]);
  };

  const handleRemoveGroupUsers = (userToDelete) => {
    setSelectedUsers(
      selectedUsers.filter((sel) => sel._id !== userToDelete._id)
    );
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const { data } = await axios.post(
        "/api/chat/group/create",
        {
          name: groupChatName,
          users: selectedUsers.map((item) => item._id),
        },
        config
      );
      setChats((prevChats) => [data, ...prevChats]);
      onClose();
      setSubmitting(false);
      setSelectedUsers([]);
      toast({
        title: "New Group Chat Created",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "top-right",
      });
    } catch (error) {
      toast({
        title: "Failed To Create Group Chat",
        description: error.response.data,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top-right",
      });
      setSubmitting(false);
    }
  };
  return (
    <>
      <span onClick={onOpen}>{children}</span>
      <Modal isOpen={isOpen} onClose={onModalClose}>
        <ModalOverlay>
          <ModalContent bg="gray.800" color="white">
            <ModalHeader
              fontSize={"35px"}
              fontFamily={"Work sans"}
              display={"flex"}
              justifyContent={"center"}
            >
              Create Group Chat
            </ModalHeader>
            <ModalCloseButton />
            <ModalBody
              display={"flex"}
              flexDir={"column"}
              alignItems={"center"}
            >
              <FormControl>
                <Input
                  placeholder="Group Name"
                  mb={3}
                  onChange={(e) => setGroupChatName(e.target.value)}
                />
              </FormControl>
              <FormControl>
                <Input
                  placeholder="Add Users"
                  mb={1}
                  onChange={(e) => handleSearch(e.target.value)}
                />
              </FormControl>

              <Box w="100%" display={"flex"} flexWrap={"wrap"}>
                {selectedUsers.map((user) => (
                  <UserBadgeItem
                    key={user._id}
                    user={user}
                    handleOnClick={() => handleRemoveGroupUsers(user)}
                  />
                ))}
              </Box>

              {loading ? (
                <Spinner />
              ) : (
                searchResult.map((user) => (
                  <UserListItem
                    key={user._id}
                    user={user}
                    handleOnClick={() => handleSetGroupUsers(user)}
                  />
                ))
              )}
            </ModalBody>

            <ModalFooter>
              <Button
                colorScheme="blue"
                onClick={handleSubmit}
                isDisabled={
                  !groupChatName ||
                  !selectedUsers.length ||
                  loading ||
                  submitting
                }
                isLoading={submitting}
              >
                Create
              </Button>
            </ModalFooter>
          </ModalContent>
        </ModalOverlay>
      </Modal>
    </>
  );
};

export default GroupChatModal;
