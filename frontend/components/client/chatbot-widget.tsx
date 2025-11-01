"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { MessageCircle, X, Send } from "lucide-react"

export function ChatbotWidget() {
  const [isOpen, setIsOpen] = useState(false)
  const [message, setMessage] = useState("")

  const quickReplies = [
    { id: 1, text: "Ver productos" },
    { id: 2, text: "Solicitar servicio técnico" },
    { id: 3, text: "Estado de mi pedido" },
    { id: 4, text: "Hablar con un agente" },
  ]

  const handleSend = () => {
    if (message.trim()) {
      console.log("[v0] Sending message:", message)
      setMessage("")
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <>
      {/* Chat Button */}
      {!isOpen && (
        <Button
          onClick={() => setIsOpen(true)}
          size="lg"
          className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-2xl bg-[#329ACF] hover:bg-[#2E78BF] z-50 p-0"
          aria-label="Abrir chat"
        >
          <MessageCircle className="h-6 w-6" />
        </Button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <Card className="fixed bottom-6 right-6 w-[380px] h-[550px] shadow-2xl z-50 flex flex-col">
          {/* Header */}
          <div className="bg-[#329ACF] text-white p-4 rounded-t-lg flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                <MessageCircle className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-semibold">Asistente SySCOM</h3>
                <p className="text-xs text-white/80">En línea</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(false)}
              className="text-white hover:bg-white/20 h-8 w-8"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Messages */}
          <CardContent className="flex-1 p-4 overflow-y-auto bg-[#F5F5F5]">
            <div className="space-y-4">
              {/* Bot Message */}
              <div className="flex gap-2">
                <div className="w-8 h-8 rounded-full bg-[#329ACF] flex items-center justify-center flex-shrink-0">
                  <MessageCircle className="h-4 w-4 text-white" />
                </div>
                <div className="bg-white rounded-lg rounded-tl-none p-3 shadow-sm max-w-[80%]">
                  <p className="text-sm text-foreground">
                    ¡Hola! Soy el asistente virtual de SySCOM. ¿En qué puedo ayudarte hoy?
                  </p>
                  <span className="text-xs text-muted-foreground mt-1 block">10:53 p.m.</span>
                </div>
              </div>

              {/* Quick Replies */}
              <div className="space-y-2">
                <p className="text-xs text-muted-foreground font-medium">Respuestas rápidas:</p>
                <div className="grid grid-cols-2 gap-2">
                  {quickReplies.map((reply) => (
                    <Button
                      key={reply.id}
                      variant="outline"
                      size="sm"
                      className="text-xs h-auto py-2 px-3 whitespace-normal text-left justify-start hover:bg-[#329ACF] hover:text-white hover:border-[#329ACF] bg-transparent"
                      onClick={() => setMessage(reply.text)}
                    >
                      {reply.text}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>

          {/* Input */}
          <div className="p-4 border-t bg-white rounded-b-lg">
            <div className="flex gap-2">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Escribe tu mensaje..."
                className="flex-1 px-4 py-2 border border-input rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-[#329ACF] bg-background"
              />
              <Button
                onClick={handleSend}
                size="icon"
                className="rounded-full bg-[#329ACF] hover:bg-[#2E78BF] flex-shrink-0"
                aria-label="Enviar mensaje"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-xs text-muted-foreground text-center mt-2">Presiona Enter para enviar</p>
          </div>
        </Card>
      )}
    </>
  )
}
