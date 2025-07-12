import React, { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';

const socket = io(process.env.NODE_ENV === 'production' ? window.location.origin : 'http://localhost:5000');

function App() {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [username, setUsername] = useState('Người ẩn danh');
  const [userCount, setUserCount] = useState(0);
  const [isTyping, setIsTyping] = useState(false);
  const [typingUser, setTypingUser] = useState('');
  const [showNameModal, setShowNameModal] = useState(false);
  const [newUsername, setNewUsername] = useState('');
  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  useEffect(() => {
    socket.on('previous_messages', (previousMessages) => {
      setMessages(previousMessages);
    });

    socket.on('receive_message', (messageData) => {
      setMessages((prevMessages) => [...prevMessages, messageData]);
    });

    socket.on('user_count', (count) => {
      setUserCount(count);
    });

    socket.on('user_typing', (data) => {
      setIsTyping(true);
      setTypingUser(data.username);
    });

    socket.on('user_stopped_typing', () => {
      setIsTyping(false);
      setTypingUser('');
    });

    return () => {
      socket.off('previous_messages');
      socket.off('receive_message');
      socket.off('user_count');
      socket.off('user_typing');
      socket.off('user_stopped_typing');
    };
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (inputMessage.trim()) {
      socket.emit('send_message', {
        username: username,
        message: inputMessage.trim()
      });
      setInputMessage('');
      socket.emit('user_stopped_typing');
    }
  };

  const handleInputChange = (e) => {
    setInputMessage(e.target.value);
    
    if (e.target.value.trim()) {
      socket.emit('user_typing', { username });
      
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      
      typingTimeoutRef.current = setTimeout(() => {
        socket.emit('user_stopped_typing');
      }, 1000);
    } else {
      socket.emit('user_stopped_typing');
    }
  };

  const handleChangeUsername = () => {
    setNewUsername(username);
    setShowNameModal(true);
  };

  const handleSaveUsername = () => {
    if (newUsername.trim()) {
      setUsername(newUsername.trim());
      setShowNameModal(false);
    }
  };

  const handleCancelUsername = () => {
    setShowNameModal(false);
    setNewUsername('');
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSaveUsername();
    }
  };

  return (
    <div className="chat-container">
      <div className="chat-header">
        <h1 className="chat-title">Phòng Chat</h1>
        <div className="user-info">
          <span className="user-count">{userCount} người online</span>
          <span className="username-display">Tên: {username}</span>
          <button className="change-name-btn" onClick={handleChangeUsername}>
            Đổi tên
          </button>
        </div>
      </div>

      <div className="messages-container">
        {messages.map((msg) => (
          <div key={msg.id} className="message">
            <div className="message-header">
              <span className="message-username">{msg.username}</span>
              <span className="message-timestamp">{msg.timestamp}</span>
            </div>
            <div className="message-content">{msg.message}</div>
          </div>
        ))}
        
        {isTyping && (
          <div className="typing-indicator">
            {typingUser} đang nhập...
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      <div className="message-input-container">
        <form onSubmit={handleSendMessage} className="message-input-form">
          <input
            type="text"
            value={inputMessage}
            onChange={handleInputChange}
            placeholder="Nhập tin nhắn..."
            className="message-input"
            maxLength={500}
          />
          <button 
            type="submit" 
            className="send-btn"
            disabled={!inputMessage.trim()}
          >
            Gửi
          </button>
        </form>
      </div>

      {showNameModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2 className="modal-title">Đổi tên hiển thị</h2>
            <input
              type="text"
              value={newUsername}
              onChange={(e) => setNewUsername(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Nhập tên mới..."
              className="modal-input"
              maxLength={20}
              autoFocus
            />
            <div className="modal-buttons">
              <button 
                className="modal-btn modal-btn-secondary"
                onClick={handleCancelUsername}
              >
                Hủy
              </button>
              <button 
                className="modal-btn modal-btn-primary"
                onClick={handleSaveUsername}
                disabled={!newUsername.trim()}
              >
                Lưu
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
