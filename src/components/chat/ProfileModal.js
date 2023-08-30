import { ViewIcon } from "@chakra-ui/icons";
import {
  Button,
  IconButton,
  Image,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import React from "react";

const ProfileModal = ({ user, children }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <>
      {children ? (
        <span onClick={onOpen}>{children}</span>
      ) : (
        <IconButton
          display={{ base: "flex" }}
          icon={<ViewIcon />}
          onClick={onOpen}
          variant="ghost"
          color="gray.300" // Adjust icon color
          _hover={{ color: "gray.700" }} // Adjust hover icon color
        />
      )}

      <Modal isOpen={isOpen} onClose={onClose} size={"lg"} isCentered>
        <ModalOverlay />
        <ModalContent height={"410px"} bg="gray.700" color="white">
          <ModalHeader
            fontSize={"40px"}
            fontFamily={"Work Sans"}
            display={"flex"}
            justifyContent={"center"}
          >
            {user.name}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody
            display={"flex"}
            flexDir={"column"}
            alignItems={"center"}
            justifyContent={"space-between"}
          >
            <Image
              borderRadius={"full"}
              boxSize={"150px"}
              src={user.photo}
              alt={user.name}
            />
            <Text fontSize={{ base: "28px", md: "30px" }}>
              Email: {user.email}
            </Text>
          </ModalBody>

          <ModalFooter>
            <Button
              colorScheme="blue"
              mr={3}
              onClick={onClose}
              _hover={{ bg: "blue.500" }} // Adjust hover background color
            >
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default ProfileModal;
