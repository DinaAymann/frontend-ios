import React, { createContext, useContext, useState } from "react";
import chatData from "../constants/chats.json";
const ChatContext = createContext();

export const useChat = () => useContext(ChatContext);

export const ChatProvider = ({ children }) => {
  const [chats, setChats] = useState(chatData);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedChatIds, setSelectedChatIds] = useState([]);

  const sendMessage = (chatId, text, type = "text") => {
    const newMessage = {
      text,
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      isOutgoing: true,
      type,
    };

    setChats((currentChats) =>
      currentChats.map((chat) =>
        chat.id === chatId
          ? {
              ...chat,
              messages: [newMessage, ...chat.messages],
              lastMessage: type === "text" ? text : "Audio Message",
              time: newMessage.timestamp,
            }
          : chat
      )
    );
  };

  const sendAudio = (chatId, audioUri) => {
    sendMessage(chatId, audioUri, "audio");
  };
  const openModal = () => setIsModalVisible(true);
  const closeModal = () => setIsModalVisible(false);

  const toggleChatSelection = (id) => {
    setSelectedChatIds((prevSelected) => {
      const isSelected = prevSelected.includes(id);
      const updatedSelectedChats = isSelected
        ? prevSelected.filter((chatId) => chatId !== id)
        : [...prevSelected, id];

      return updatedSelectedChats;
    });
  };
  const clearSelectedChats = () => {
    setSelectedChatIds([]);
  };

  return (
    <ChatContext.Provider
      value={{
        chats,
        sendMessage,
        sendAudio,
        isModalVisible,
        openModal,
        closeModal,
        selectedChatIds,
        toggleChatSelection,
        clearSelectedChats,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};
