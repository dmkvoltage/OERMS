"use client"

import React from "react"
import { create } from "zustand"

// Types for our socket store
interface SocketStore {
  socket: WebSocket | null
  isConnected: boolean
  connect: () => void
  disconnect: () => void
}

// Simple store for managing connection state without notifications
export const useSocketStore = create<SocketStore>((set, get) => ({
  socket: null,
  isConnected: false,

  connect: () => {
    const state = get()
    if (state.socket && state.socket.readyState === WebSocket.OPEN) {
      return
    }

    try {
      if (process.env.NODE_ENV === "development") {
        setTimeout(() => {
          set({ isConnected: true })
        }, 1000)
        return
      }

      const wsUrl = process.env.NEXT_PUBLIC_SOCKET_URL || "wss://api.examportal.cm/ws"
      const newSocket = new WebSocket(wsUrl)

      newSocket.onopen = () => {
        set({ isConnected: true, socket: newSocket })
      }

      newSocket.onclose = () => {
        set({ isConnected: false })
      }

      newSocket.onerror = () => {
        set({ isConnected: false })
      }

      set({ socket: newSocket })
    } catch (error) {
      set({ isConnected: false })
    }
  },

  disconnect: () => {
    const state = get()
    if (state.socket) {
      state.socket.close()
      set({ socket: null, isConnected: false })
    }
  },
}))

// Simple connection hook without notifications
export function useWebSocketConnection() {
  const { isConnected, connect, disconnect } = useSocketStore()

  React.useEffect(() => {
    // Auto-connect when component mounts
    connect()

    // Cleanup on unmount
    return () => {
      disconnect()
    }
  }, [connect, disconnect])

  return { isConnected }
}

// Create a store for notifications
interface NotificationStore {
  notifications: any[]
  unreadCount: number
  addNotification: (notification: any) => void
  markAsRead: (id: string) => void
  markAllAsRead: () => void
  clearNotification: (id: string) => void
  clearAllNotifications: () => void
}

export const useNotificationStore = create<NotificationStore>((set) => ({
  notifications: [],
  unreadCount: 0,

  addNotification: (notification) => {
    set((state) => ({
      notifications: [notification, ...state.notifications],
      unreadCount: state.unreadCount + 1,
    }))
  },

  markAsRead: (id) => {
    set((state) => {
      const updatedNotifications = state.notifications.map((notification) =>
        notification.id === id ? { ...notification, read: true } : notification,
      )

      const unreadCount = updatedNotifications.filter((n) => !n.read).length

      return {
        notifications: updatedNotifications,
        unreadCount,
      }
    })
  },

  markAllAsRead: () => {
    set((state) => ({
      notifications: state.notifications.map((notification) => ({ ...notification, read: true })),
      unreadCount: 0,
    }))
  },

  clearNotification: (id) => {
    set((state) => {
      const updatedNotifications = state.notifications.filter((notification) => notification.id !== id)
      const unreadCount = updatedNotifications.filter((n) => !n.read).length

      return {
        notifications: updatedNotifications,
        unreadCount,
      }
    })
  },

  clearAllNotifications: () => {
    set({
      notifications: [],
      unreadCount: 0,
    })
  },
}))

// Hook for subscribing to specific WebSocket events
export function useWebSocketEvent<T>(eventType: string, callback: (data: T) => void) {
  const { socket, isConnected } = useSocketStore()

  React.useEffect(() => {
    if (!socket || !isConnected) return

    const handleMessage = (event: MessageEvent) => {
      try {
        const data = JSON.parse(event.data)
        if (data.type === eventType) {
          callback(data.payload)
        }
      } catch (err) {
        console.error("Error handling WebSocket message:", err)
      }
    }

    socket.addEventListener("message", handleMessage)

    return () => {
      socket.removeEventListener("message", handleMessage)
    }
  }, [socket, isConnected, eventType, callback])
}

// For demo purposes, we'll simulate incoming notifications in development
export function useMockNotifications() {
  const addNotification = useNotificationStore((state) => state.addNotification)

  React.useEffect(() => {
    if (process.env.NODE_ENV !== "development") {
      return // Only run in development
    }

    // Simulate some initial notifications
    const timeouts: NodeJS.Timeout[] = []

    timeouts.push(
      setTimeout(() => {
        addNotification({
          title: "New Registration",
          message: "Alice Johnson has registered for Advanced Mathematics exam",
          type: "info",
          category: "registration",
        })
      }, 3000),
    )

    timeouts.push(
      setTimeout(() => {
        addNotification({
          title: "Results Published",
          message: "GCE Advanced Level 2024 results have been published",
          type: "success",
          category: "result",
          link: "/dashboard/exam-body/results",
        })
      }, 7000),
    )

    // Set up interval for random notifications (for demo purposes)
    const interval = setInterval(() => {
      const randomTypes = ["info", "success", "warning", "error"] as const

      const mockNotifications = [
        {
          title: "New Registration",
          message: "A new student has registered for an upcoming examination",
          type: randomTypes[Math.floor(Math.random() * randomTypes.length)],
          category: "registration" as const,
        },
        {
          title: "System Update",
          message: "The system will undergo maintenance in 24 hours",
          type: "warning" as const,
          category: "system" as const,
        },
        {
          title: "Results Ready",
          message: "Examination results are ready for review",
          type: "success" as const,
          category: "result" as const,
          link: "/dashboard/exam-body/results",
        },
        {
          title: "Registration Deadline",
          message: "Registration deadline for BEPC 2024 is approaching",
          type: "warning" as const,
          category: "exam" as const,
        },
      ]

      const randomNotification = mockNotifications[Math.floor(Math.random() * mockNotifications.length)]
      addNotification(randomNotification)
    }, 45000) // Every 45 seconds

    return () => {
      timeouts.forEach(clearTimeout)
      clearInterval(interval)
    }
  }, [addNotification])
}
