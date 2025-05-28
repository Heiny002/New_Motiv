import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';

// Styled components for the chat interface
const ChatContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 500px;
  max-width: 800px;
  margin: 0 auto;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  background: #ffffff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const MessagesContainer = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const MessageBubble = styled(motion.div)`
  max-width: 70%;
  padding: 12px 16px;
  border-radius: 12px;
  font-size: 14px;
  line-height: 1.5;
  
  ${props => props.isUser ? `
    align-self: flex-end;
    background-color: #007AFF;
    color: white;
    border-bottom-right-radius: 4px;
  ` : `
    align-self: flex-start;
    background-color: #f0f0f0;
    color: #333;
    border-bottom-left-radius: 4px;
  `}
`;

const InputContainer = styled.div`
  display: flex;
  padding: 16px;
  border-top: 1px solid #e0e0e0;
  background: #ffffff;
`;

const MessageInput = styled.input`
  flex: 1;
  padding: 12px;
  border: 1px solid #e0e0e0;
  border-radius: 20px;
  font-size: 14px;
  outline: none;
  
  &:focus {
    border-color: #007AFF;
  }
`;

const SendButton = styled.button`
  margin-left: 12px;
  padding: 0 20px;
  background-color: #007AFF;
  color: white;
  border: none;
  border-radius: 20px;
  font-size: 14px;
  cursor: pointer;
  transition: background-color 0.2s;
  
  &:hover {
    background-color: #0056b3;
  }
  
  &:disabled {
    background-color: #cccccc;
    cursor: not-allowed;
  }
`;

const TypingIndicator = styled(motion.div)`
  align-self: flex-start;
  padding: 12px 16px;
  background-color: #f0f0f0;
  border-radius: 12px;
  font-size: 14px;
  color: #666;
`;

/**
 * CoachChat Component
 * 
 * A chat interface for interacting with the AI coach. Features include:
 * - Real-time message display with animations
 * - Message history persistence
 * - Typing indicators
 * - Auto-scroll to latest messages
 * - Responsive design
 * 
 * @param {Object} props
 * @param {Array} props.chatHistory - Array of message objects with sender and content
 * @param {Function} props.onSendMessage - Callback function when user sends a message
 * @param {boolean} props.isLoading - Whether the coach is currently generating a response
 */
const CoachChat = ({ chatHistory, onSendMessage, isLoading }) => {
  const [message, setMessage] = useState('');
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory]);

  // Focus input on mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim() && !isLoading) {
      onSendMessage(message.trim());
      setMessage('');
    }
  };

  return (
    <ChatContainer>
      <MessagesContainer>
        <AnimatePresence>
          {chatHistory.map((msg, index) => (
            <MessageBubble
              key={index}
              isUser={msg.sender === 'user'}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
            >
              {msg.content}
            </MessageBubble>
          ))}
        </AnimatePresence>
        
        {isLoading && (
          <TypingIndicator
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            Coach is typing...
          </TypingIndicator>
        )}
        
        <div ref={messagesEndRef} />
      </MessagesContainer>

      <form onSubmit={handleSubmit}>
        <InputContainer>
          <MessageInput
            ref={inputRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your message..."
            disabled={isLoading}
          />
          <SendButton
            type="submit"
            disabled={!message.trim() || isLoading}
          >
            Send
          </SendButton>
        </InputContainer>
      </form>
    </ChatContainer>
  );
};

export default CoachChat; 