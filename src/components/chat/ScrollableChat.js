import React, { useEffect, useRef } from "react";
import {
  isLastMessage,
  isSameSender,
  isSameSenderMargin,
  isSameUser,
} from "../../resusables/util";
import { ChatState } from "../../context/ChatProvider";
import { Avatar, Badge, Tooltip } from "@chakra-ui/react";
import moment from "moment";

const ScrollableChat = ({ messages, isGroupChat }) => {
  const { user } = ChatState();
  const messageEndRef = useRef(null);

  const scrollToBottom = () => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    const options = {
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    };
    return new Intl.DateTimeFormat("en-US", options).format(date);
  };

  const groupMessagesByDate = (messageArray) => {
    const groups = [];
    let currentGroup = null;

    for (const message of messageArray) {
      const messageDate = new Date(message.createdAt);
      const messageDateString = messageDate.toLocaleDateString();

      if (!currentGroup || currentGroup.date !== messageDateString) {
        currentGroup = {
          date: messageDateString,
          dateObj: messageDate, // Store the date object
          messages: [],
        };
        groups.push(currentGroup);
      }

      currentGroup.messages.push(message);
    }

    return groups;
  };

  const groupedMessages = groupMessagesByDate(messages);

  return (
    <div style={{ overflowY: "scroll" }}>
      {groupedMessages.map((group) => {
        const today = moment();
        const groupDate = moment(group.dateObj);
        const formattedDate =
          groupDate.isSame(today, "day")
            ? "Today"
            : groupDate.isSame(today.clone().subtract(1, "days"), "day")
            ? "Yesterday"
            : groupDate.isAfter(today.clone().subtract(7, "days"), "day")
            ? groupDate.format("dddd")
            : group.date; // If it's older than a week, display in DD/MM/YYYY format

        return (
          <div key={group.date}>
            <div style={{ textAlign: "center", marginBottom: "8px" }}>
              <Badge colorScheme='green'>{formattedDate}</Badge>
            </div>
            {group.messages.map((message, index) => (
              <div style={{ display: "flex" }} key={message._id}>
                {isGroupChat && (isSameSender(group.messages, message, index, user._id) ||
                  isLastMessage(group.messages, index, user._id)) && (
                  <Tooltip
                    label={message.sender.name}
                    placement="bottom-start"
                    hasArrow
                  >
                    <Avatar
                      mt={"7px"}
                      mr={1}
                      size={"sm"}
                      cursor={"pointer"}
                      name={message.sender.name}
                      src={message.sender.photo}
                    />
                  </Tooltip>
                )}
                <span
                  style={{
                    backgroundColor: `${
                      message.sender._id === user._id ? "#FBD38D" : "#CBD5E0"
                    }`,
                    borderRadius: "20px",
                    padding: "5px 15px",
                    maxWidth: "75%",
                    color: "black",
                    marginLeft: isSameSenderMargin(
                      group.messages,
                      message,
                      index,
                      user._id
                    ),
                    marginTop: isSameUser(
                      group.messages,
                      message,
                      index,
                      user._id
                    )
                      ? 3
                      : 10,
                  }}
                >
                  {message.content}
                  <span
                    style={{
                      fontSize: "12px",
                      color: "#02070e",
                      textAlign: "right",
                      marginLeft: "5px",
                    }}
                  >
                    {formatTime(message.createdAt)}
                  </span>
                </span>
              </div>
            ))}
          </div>
        );
      })}
      <div ref={messageEndRef} />
    </div>
  );
};

export default ScrollableChat;
