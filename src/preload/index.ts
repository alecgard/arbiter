import { contextBridge, ipcRenderer } from 'electron'

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('electronAPI', {
  // Example IPC methods for agent coordination
  sendMessage: (channel: string, data: any) => {
    // Whitelist channels for security
    const validChannels = ['agent:create', 'agent:message', 'agent:terminate']
    if (validChannels.includes(channel)) {
      ipcRenderer.send(channel, data)
    }
  },

  onMessage: (channel: string, callback: (data: any) => void) => {
    const validChannels = ['agent:response', 'agent:status', 'agent:error']
    if (validChannels.includes(channel)) {
      const subscription = (_event: any, data: any) => callback(data)
      ipcRenderer.on(channel, subscription)

      // Return unsubscribe function
      return () => {
        ipcRenderer.removeListener(channel, subscription)
      }
    }
  },
})

// Type definitions for the exposed API
export interface ElectronAPI {
  sendMessage: (channel: string, data: any) => void
  onMessage: (channel: string, callback: (data: any) => void) => (() => void) | undefined
}

declare global {
  interface Window {
    electronAPI: ElectronAPI
  }
}
