import { useState } from 'react'

interface Agent {
  id: string
  name: string
  status: 'idle' | 'active' | 'error'
}

interface Message {
  id: string
  role: 'user' | 'arbiter'
  content: string
  timestamp: Date
}

interface SubAgent {
  id: string
  name: string
  status: 'running' | 'completed' | 'failed'
  progress?: string
}

function App() {
  const [agents, setAgents] = useState<Agent[]>([])
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'arbiter',
      content: 'Hello! I\'m Arbiter. I can help you coordinate multiple LLM agents to work together on complex tasks. Create an agent to get started.',
      timestamp: new Date()
    }
  ])
  const [inputValue, setInputValue] = useState('')
  const [subAgents, setSubAgents] = useState<SubAgent[]>([])

  const handleSendMessage = () => {
    if (!inputValue.trim()) return

    const newMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputValue,
      timestamp: new Date()
    }

    setMessages([...messages, newMessage])
    setInputValue('')

    // Simulate Arbiter response
    setTimeout(() => {
      const response: Message = {
        id: (Date.now() + 1).toString(),
        role: 'arbiter',
        content: 'I received your message. I would coordinate agents to help with this task.',
        timestamp: new Date()
      }
      setMessages(prev => [...prev, response])
    }, 1000)
  }

  const handleCreateAgent = () => {
    const newAgent: Agent = {
      id: Date.now().toString(),
      name: `Agent ${agents.length + 1}`,
      status: 'idle'
    }
    setAgents([...agents, newAgent])
  }

  return (
    <div className="flex h-screen bg-gray-900 text-white">
      {/* Left Pane - Agents */}
      <div className="w-64 bg-gray-800 border-r border-gray-700 flex flex-col">
        <div className="p-4 border-b border-gray-700">
          <h1 className="text-2xl font-bold text-blue-400">Arbiter</h1>
          <p className="text-sm text-gray-400 mt-1">LLM Agent Coordinator</p>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold text-gray-300">Agents</h2>
            <button
              onClick={handleCreateAgent}
              className="px-2 py-1 bg-blue-600 hover:bg-blue-700 rounded text-xs transition-colors"
            >
              + New
            </button>
          </div>

          <div className="space-y-2">
            {agents.length === 0 ? (
              <p className="text-sm text-gray-500 italic">No agents yet</p>
            ) : (
              agents.map((agent) => (
                <div
                  key={agent.id}
                  className="p-3 bg-gray-700 hover:bg-gray-650 rounded-lg cursor-pointer transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${
                      agent.status === 'active' ? 'bg-green-500' :
                      agent.status === 'error' ? 'bg-red-500' :
                      'bg-gray-500'
                    }`}></div>
                    <span className="text-sm">{agent.name}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="p-4 border-t border-gray-700">
          <div className="text-xs text-gray-500">
            <div>Electron + React + TypeScript</div>
            <div className="mt-1">Press Cmd+Q to quit</div>
          </div>
        </div>
      </div>

      {/* Center Pane - Chat with Arbiter */}
      <div className="flex-1 flex flex-col bg-gray-900">
        <div className="h-16 bg-gray-800 border-b border-gray-700 flex items-center px-6">
          <h2 className="text-lg font-semibold">Chat with Arbiter</h2>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[70%] rounded-lg p-3 ${
                  message.role === 'user'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-800 text-gray-100 border border-gray-700'
                }`}
              >
                <div className="text-sm font-semibold mb-1">
                  {message.role === 'user' ? 'You' : 'Arbiter'}
                </div>
                <div className="text-sm">{message.content}</div>
                <div className="text-xs mt-1 opacity-60">
                  {message.timestamp.toLocaleTimeString()}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Input Area */}
        <div className="border-t border-gray-700 p-4 bg-gray-800">
          <div className="flex gap-2">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Type a message to Arbiter..."
              className="flex-1 bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={handleSendMessage}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm font-medium transition-colors"
            >
              Send
            </button>
          </div>
        </div>
      </div>

      {/* Right Pane - Running Subagents */}
      <div className="w-80 bg-gray-800 border-l border-gray-700 flex flex-col">
        <div className="p-4 border-b border-gray-700">
          <h2 className="text-lg font-semibold">Running Subagents</h2>
          <p className="text-xs text-gray-400 mt-1">Active tasks and workflows</p>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          {subAgents.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-gray-500 text-sm">No active subagents</div>
              <div className="text-gray-600 text-xs mt-2">
                Subagents will appear here when Arbiter delegates tasks
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              {subAgents.map((subAgent) => (
                <div
                  key={subAgent.id}
                  className="bg-gray-700 rounded-lg p-3 border border-gray-600"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-semibold">{subAgent.name}</span>
                    <span className={`text-xs px-2 py-1 rounded ${
                      subAgent.status === 'running' ? 'bg-blue-600' :
                      subAgent.status === 'completed' ? 'bg-green-600' :
                      'bg-red-600'
                    }`}>
                      {subAgent.status}
                    </span>
                  </div>
                  {subAgent.progress && (
                    <div className="text-xs text-gray-400 mt-1">
                      {subAgent.progress}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default App
