import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import './App.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

function App() {
  const [sessionId, setSessionId] = useState(null);
  const [selectedRM, setSelectedRM] = useState('RM3');
  const [rmList, setRmList] = useState([]);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [rmData, setRmData] = useState(null);
  const [showSettings, setShowSettings] = useState(false);
  const [systemPrompt, setSystemPrompt] = useState('');
  const [taskPrompt, setTaskPrompt] = useState('');
  const [activeTab, setActiveTab] = useState('system');
  const messagesEndRef = useRef(null);

  // Quick action pills
  const quickActions = [
    '📅 Plan to improve Target achievement & incentives',
    '🔄 Activate dormant CPs',
    '💎 Top CPs to focus',
    '📍 Find new CPs in my area',
    '💬 Generate pitch for CP'
  ];

  // Load RM list on mount
  useEffect(() => {
    fetchRMList();
  }, []);

  // Initialize session when RM is selected
  useEffect(() => {
    if (selectedRM) {
      initializeSession();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedRM]);

  // Scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Fetch RM data when session is created
  useEffect(() => {
    if (sessionId && selectedRM) {
      fetchRMData(selectedRM);
    }
  }, [sessionId, selectedRM]);

  const fetchRMList = async () => {
    try {
      const response = await axios.get(`${API_URL}/rms`);
      setRmList(response.data);
    } catch (error) {
      console.error('Failed to fetch RM list:', error);
    }
  };

  const fetchPrompts = async () => {
    try {
      const response = await axios.get(`${API_URL}/prompts/current`);
      setSystemPrompt(response.data.systemPrompt);
      setTaskPrompt(response.data.taskPrompt);
    } catch (error) {
      console.error('Failed to fetch prompts:', error);
    }
  };

  const handleSavePrompts = async () => {
    try {
      await axios.post(`${API_URL}/prompts/update`, {
        systemPrompt: systemPrompt,
        taskPrompt: taskPrompt
      });
      alert('✅ Prompts updated successfully! Start a new chat to see changes.');
      setShowSettings(false);
    } catch (error) {
      console.error('Failed to save prompts:', error);
      alert('❌ Failed to save prompts. Check console for errors.');
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const initializeSession = async () => {
    try {
      const response = await axios.post(`${API_URL}/session/start`, {
        rmId: selectedRM
      });
      setSessionId(response.data.sessionId);
      
      // Add persona-based welcome message from server
      setMessages([
        {
          role: 'assistant',
          content: response.data.welcomeMessage || 'Welcome to ARYA!',
          timestamp: new Date()
        }
      ]);
    } catch (error) {
      console.error('Failed to initialize session:', error);
    }
  };

  const fetchRMData = async (rmId) => {
    try {
      const response = await axios.get(`${API_URL}/data/rm/${rmId}`);
      setRmData(response.data);
    } catch (error) {
      console.error('Failed to fetch RM data:', error);
    }
  };

  const handleRMChange = (e) => {
    const newRM = e.target.value;
    setSelectedRM(newRM);
    setMessages([]);
    setSessionId(null);
  };

  const sendMessage = async (message) => {
    if (!message.trim() || !sessionId) return;

    // Add user message to UI
    const userMessage = {
      role: 'user',
      content: message,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setLoading(true);

    try {
      const response = await axios.post(`${API_URL}/chat`, {
        sessionId,
        message
      });

      // Add AI response to UI
      const aiMessage = {
        role: 'assistant',
        content: response.data.response,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Failed to send message:', error);
      const errorMessage = {
        role: 'assistant',
        content: '❌ Sorry, I encountered an error. Please try again.',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const handleQuickAction = (action) => {
    sendMessage(action);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    sendMessage(inputMessage);
  };

  return (
    <div className="app">
      {/* Header */}
      <div className="header">
        <div className="header-title">
          🤖 ARYA - Sales Assistant
          <button 
            className="settings-btn" 
            onClick={() => {
              setShowSettings(!showSettings);
              if (!showSettings) fetchPrompts();
            }}
            title="Settings"
          >
            ⚙️
          </button>
        </div>
        
        <div className="rm-selector">
          <label>Select RM:</label>
          <select value={selectedRM} onChange={handleRMChange} className="rm-select">
            {rmList.map(rm => (
              <option key={rm.rm_id} value={rm.rm_id}>
                {rm.name} ({rm.target_achievement_percent}% | Rank: {rm.contest_rank || 'N/A'})
              </option>
            ))}
          </select>
        </div>
        
        {rmData && (
          <div className="user-info">
            <div className="user-name">{rmData.rm.name}</div>
            <div className="user-details">
              Target: {rmData.rm.target_achievement_percent}% | Active CPs: {rmData.rm.active_cps} | 
              Incentive: ₹{rmData.rm.incentive_earned.toLocaleString()}
            </div>
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="quick-actions">
        <div className="quick-actions-title">Quick Actions</div>
        <div className="quick-actions-grid">
          {quickActions.map((action, index) => (
            <button
              key={index}
              className="quick-action-btn"
              onClick={() => handleQuickAction(action)}
              disabled={loading}
            >
              {action}
            </button>
          ))}
        </div>
      </div>

      {/* Messages */}
      <div className="messages-container">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`message ${message.role === 'user' ? 'user-message' : 'ai-message'}`}
          >
            <div className="message-content">
              {message.content.split('\n').map((line, i) => (
                <React.Fragment key={i}>
                  {line}
                  {i < message.content.split('\n').length - 1 && <br />}
                </React.Fragment>
              ))}
            </div>
            <div className="message-time">
              {new Date(message.timestamp).toLocaleTimeString('en-IN', {
                hour: '2-digit',
                minute: '2-digit'
              })}
            </div>
          </div>
        ))}
        {loading && (
          <div className="message ai-message">
            <div className="message-content loading">
              <div className="typing-indicator">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Settings Modal */}
      {showSettings && (
        <div className="settings-modal">
          <div className="settings-content">
            <div className="settings-header">
              <h2>⚙️ ARYA Prompts</h2>
              <button className="close-btn" onClick={() => setShowSettings(false)}>✕</button>
            </div>
            
            <div className="settings-tabs">
              <button 
                className={`tab-btn ${activeTab === 'system' ? 'active' : ''}`}
                onClick={() => setActiveTab('system')}
              >
                📋 System Prompt
              </button>
              <button 
                className={`tab-btn ${activeTab === 'task' ? 'active' : ''}`}
                onClick={() => setActiveTab('task')}
              >
                💬 Task Prompt
              </button>
            </div>
            
            <div className="settings-body">
              {activeTab === 'system' && (
                <>
                  <p className="settings-info">
                    <strong>System Prompt:</strong> Core principles, decision science, beat plan rules, and RM segmentation logic.
                  </p>
                  <textarea
                    className="prompt-editor"
                    value={systemPrompt}
                    onChange={(e) => setSystemPrompt(e.target.value)}
                    placeholder="Loading system prompt..."
                  />
                </>
              )}
              
              {activeTab === 'task' && (
                <>
                  <p className="settings-info">
                    <strong>Task Prompt:</strong> Conversation flow, user confirmations, probing questions, and interaction patterns.
                  </p>
                  <textarea
                    className="prompt-editor"
                    value={taskPrompt}
                    onChange={(e) => setTaskPrompt(e.target.value)}
                    placeholder="Loading task prompt..."
                  />
                </>
              )}
            </div>
            
            <div className="settings-footer">
              <button className="save-btn" onClick={handleSavePrompts}>
                💾 Save Both Prompts
              </button>
              <button className="cancel-btn" onClick={() => setShowSettings(false)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Input */}
      <form className="input-container" onSubmit={handleSubmit}>
        <input
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          placeholder="Type your message..."
          className="message-input"
          disabled={loading}
        />
        <button
          type="submit"
          className="send-btn"
          disabled={loading || !inputMessage.trim()}
        >
          ↑
        </button>
      </form>
    </div>
  );
}

export default App;
