import { useState, useRef, useEffect } from 'react'

interface Agent {
  id: string
  name: string
  description?: string
  model?: string
  systemPrompt?: string
  status: 'idle' | 'active' | 'error'
}

interface Message {
  id: string
  role: 'user' | 'arbiter'
  content: string
  timestamp: Date
  options?: string[]
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
      content: 'Hello! I\'m Arbiter. I can help you coordinate multiple LLM agents to work together on complex tasks. Try `/agents new` to create an agent.',
      timestamp: new Date()
    }
  ])
  const [inputValue, setInputValue] = useState('')
  const [subAgents, setSubAgents] = useState<SubAgent[]>([])
  const [agentCreationState, setAgentCreationState] = useState<{
    active: boolean
    step: 'name' | 'description' | 'model' | 'systemPrompt' | null
    data: {
      name: string
      description: string
      model: string
      systemPrompt: string
    }
  }>({
    active: false,
    step: null,
    data: {
      name: '',
      description: '',
      model: '',
      systemPrompt: ''
    }
  })
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const addMessage = (role: 'user' | 'arbiter', content: string, options?: string[]) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      role,
      content,
      timestamp: new Date(),
      options
    }
    setMessages(prev => [...prev, newMessage])
  }

  const handleOptionClick = (option: string) => {
    // Add user message
    addMessage('user', option)

    // Process the response
    if (agentCreationState.active) {
      handleAgentCreationResponse(option)
    }
  }

  const handleAgentCreationResponse = (response: string) => {
    const state = agentCreationState

    switch (state.step) {
      case 'name':
        setAgentCreationState({
          ...state,
          step: 'description',
          data: { ...state.data, name: response }
        })
        addMessage('arbiter', 'Great! Now, provide a brief description for this agent (or type "skip" to skip):')
        break

      case 'description':
        setAgentCreationState({
          ...state,
          step: 'model',
          data: { ...state.data, description: response === 'skip' ? '' : response }
        })
        addMessage('arbiter', 'Which model should this agent use?', [
          'Claude 3.5 Sonnet',
          'Claude 3 Opus',
          'Claude 3 Haiku',
          'GPT-4',
          'GPT-3.5 Turbo'
        ])
        break

      case 'model':
        const modelMap: { [key: string]: string } = {
          'Claude 3.5 Sonnet': 'claude-3-5-sonnet-20241022',
          'Claude 3 Opus': 'claude-3-opus-20240229',
          'Claude 3 Haiku': 'claude-3-haiku-20240307',
          'GPT-4': 'gpt-4',
          'GPT-3.5 Turbo': 'gpt-3.5-turbo'
        }
        setAgentCreationState({
          ...state,
          step: 'systemPrompt',
          data: { ...state.data, model: modelMap[response] || response }
        })
        addMessage('arbiter', 'Finally, provide a system prompt that defines the agent\'s role and behavior (or type "skip" to skip):')
        break

      case 'systemPrompt':
        const newAgent: Agent = {
          id: Date.now().toString(),
          name: state.data.name,
          description: state.data.description,
          model: state.data.model,
          systemPrompt: response === 'skip' ? '' : response,
          status: 'idle'
        }
        setAgents([...agents, newAgent])
        setAgentCreationState({
          active: false,
          step: null,
          data: { name: '', description: '', model: '', systemPrompt: '' }
        })
        addMessage('arbiter', `Perfect! Agent "${newAgent.name}" has been created successfully. You can see it in the left panel.`)
        break
    }
  }

  const handleCommand = (command: string) => {
    const trimmedCommand = command.trim()

    if (trimmedCommand.startsWith('/agents')) {
      const args = trimmedCommand.slice(7).trim()
      const parts = args.split(' ')
      const subcommand = parts[0]

      switch (subcommand) {
        case 'new':
          // Check if inline arguments provided
          const restArgs = parts.slice(1).join(' ')

          if (restArgs.length > 0) {
            // Parse inline format: /agents new <name> [description] [model] [systemPrompt]
            // Simple parsing: first word is name, rest can be flags or quoted strings
            const nameMatch = restArgs.match(/^(\S+)/)
            const name = nameMatch ? nameMatch[1] : ''

            // Look for --description, --model, --prompt flags
            const descMatch = restArgs.match(/--description\s+"([^"]+)"|--description\s+(\S+)/)
            const modelMatch = restArgs.match(/--model\s+"([^"]+)"|--model\s+(\S+)/)
            const promptMatch = restArgs.match(/--prompt\s+"([^"]+)"|--prompt\s+(.+?)(?:\s+--|$)/)

            const description = descMatch ? (descMatch[1] || descMatch[2]) : ''
            const model = modelMatch ? (modelMatch[1] || modelMatch[2]) : 'claude-3-5-sonnet-20241022'
            const systemPrompt = promptMatch ? (promptMatch[1] || promptMatch[2]) : ''

            if (name) {
              const newAgent: Agent = {
                id: Date.now().toString(),
                name,
                description,
                model,
                systemPrompt,
                status: 'idle'
              }
              setAgents([...agents, newAgent])
              addMessage('arbiter', `Agent "${name}" has been created successfully with the provided configuration!`)
            } else {
              addMessage('arbiter', 'Invalid format. Use: `/agents new <name> --description "..." --model "..." --prompt "..."`')
            }
          } else {
            // Start interactive flow
            setAgentCreationState({
              active: true,
              step: 'name',
              data: { name: '', description: '', model: '', systemPrompt: '' }
            })
            addMessage('arbiter', 'Let\'s create a new agent! What would you like to name it?')
          }
          break
        case 'list':
          if (agents.length === 0) {
            addMessage('arbiter', 'No agents configured yet. Use `/agents new` to create one.')
          } else {
            const agentList = agents.map((a, i) => `${i + 1}. ${a.name} (${a.status})`).join('\n')
            addMessage('arbiter', `Configured agents:\n${agentList}`)
          }
          break
        case 'delete':
          const agentName = args.slice(1).join(' ')
          if (!agentName) {
            addMessage('arbiter', 'Please specify an agent name: `/agents delete <name>`')
          } else {
            const agentToDelete = agents.find(a => a.name === agentName)
            if (agentToDelete) {
              setAgents(agents.filter(a => a.name !== agentName))
              addMessage('arbiter', `Agent "${agentName}" has been deleted.`)
            } else {
              addMessage('arbiter', `Agent "${agentName}" not found.`)
            }
          }
          break
        default:
          addMessage('arbiter', 'Available commands:\n- `/agents new` - Create a new agent\n- `/agents list` - List all agents\n- `/agents delete <name>` - Delete an agent')
      }
      return true
    }
    return false
  }

  const handleSendMessage = () => {
    if (!inputValue.trim()) return

    const userInput = inputValue
    addMessage('user', userInput)
    setInputValue('')

    // Check if we're in agent creation flow
    if (agentCreationState.active) {
      handleAgentCreationResponse(userInput)
      return
    }

    // Otherwise, try to handle as command
    const commandHandled = handleCommand(userInput)

    if (!commandHandled) {
      // Simulate Arbiter response for non-command messages
      setTimeout(() => {
        addMessage('arbiter', 'I received your message. I would coordinate agents to help with this task.')
      }, 500)
    }
  }

  const handleCreateAgent = () => {
    addMessage('user', '/agents new')
    setAgentCreationState({
      active: true,
      step: 'name',
      data: { name: '', description: '', model: '', systemPrompt: '' }
    })
    setTimeout(() => {
      addMessage('arbiter', 'Let\'s create a new agent! What would you like to name it?')
    }, 300)
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
            <div key={message.id}>
              <div
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
                  <div className="text-sm whitespace-pre-wrap">{message.content}</div>

                  {/* Option Buttons */}
                  {message.options && message.options.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {message.options.map((option, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleOptionClick(option)}
                          className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 rounded text-xs font-medium transition-colors"
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                  )}

                  <div className="text-xs mt-1 opacity-60">
                    {message.timestamp.toLocaleTimeString()}
                  </div>
                </div>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
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
