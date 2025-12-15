import { useState } from 'react'

function App() {
  const [agents, setAgents] = useState<string[]>([])

  return (
    <div className="flex h-screen bg-gray-900 text-white">
      {/* Sidebar */}
      <div className="w-64 bg-gray-800 border-r border-gray-700 flex flex-col">
        <div className="p-4 border-b border-gray-700">
          <h1 className="text-2xl font-bold text-blue-400">Arbiter</h1>
          <p className="text-sm text-gray-400 mt-1">LLM Agent Coordinator</p>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold text-gray-300">Agents</h2>
            <button
              onClick={() => setAgents([...agents, `Agent ${agents.length + 1}`])}
              className="px-2 py-1 bg-blue-600 hover:bg-blue-700 rounded text-xs transition-colors"
            >
              + New
            </button>
          </div>

          <div className="space-y-2">
            {agents.length === 0 ? (
              <p className="text-sm text-gray-500 italic">No agents yet</p>
            ) : (
              agents.map((agent, index) => (
                <div
                  key={index}
                  className="p-3 bg-gray-700 hover:bg-gray-650 rounded-lg cursor-pointer transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm">{agent}</span>
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

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="h-16 bg-gray-800 border-b border-gray-700 flex items-center px-6">
          <h2 className="text-lg font-semibold">Agent Coordination Dashboard</h2>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="max-w-4xl mx-auto">
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
              <h3 className="text-xl font-semibold mb-4">Welcome to Arbiter</h3>
              <p className="text-gray-300 mb-4">
                A harness for coordinating multiple LLM agents. This is your central
                control panel for managing agent workflows and interactions.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                <div className="bg-gray-700 rounded-lg p-4">
                  <h4 className="font-semibold text-blue-400 mb-2">Quick Start</h4>
                  <p className="text-sm text-gray-300">
                    Click "+ New" in the sidebar to create your first agent and begin
                    coordinating multi-agent workflows.
                  </p>
                </div>

                <div className="bg-gray-700 rounded-lg p-4">
                  <h4 className="font-semibold text-green-400 mb-2">Cross-Platform</h4>
                  <p className="text-sm text-gray-300">
                    Built with Electron to run seamlessly on macOS, Windows, and Linux.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
