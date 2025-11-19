"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Sparkles, Send, Loader2, Bot, User, CheckCircle2, X } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

interface Message {
  role: "user" | "assistant"
  content: string
  timestamp: Date
}

interface AISuggestion {
  productName?: string
  category?: string
  quantity?: number
  description?: string
  warrantyStatus?: string
  maxBudget?: number
  deliveryCity?: string
  deliveryDistrict?: string
  offerDeadline?: string
  exampleImageUrl?: string
  brandModel?: string
}

interface AIAssistantModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function AIAssistantModal({ open, onOpenChange }: AIAssistantModalProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Merhaba! Ben Woopy AI Asistanınız. Ürün talebinizi oluşturmanıza yardımcı olacağım. Hangi ürünü satın almak istiyorsunuz?",
      timestamp: new Date(),
    },
  ])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [suggestions, setSuggestions] = useState<AISuggestion>({})
  const scrollRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  useEffect(() => {
    if (open && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100)
    }
  }, [open])

  const handleSend = async () => {
    if (!input.trim() || isLoading) return

    const userMessage: Message = {
      role: "user",
      content: input,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    try {
      const response = await fetch("/api/ai/request-assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...messages, userMessage].map((m) => ({
            role: m.role,
            content: m.content,
          })),
          currentFormData: {},
        }),
      })

      if (!response.ok) {
        throw new Error("AI assistant request failed")
      }

      const data = await response.json()

      const assistantMessage: Message = {
        role: "assistant",
        content: data.message,
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, assistantMessage])

      if (data.suggestions && Object.keys(data.suggestions).length > 0) {
        setSuggestions(data.suggestions)
      }
    } catch (error) {
      console.error("Error sending message:", error)
      const errorMessage: Message = {
        role: "assistant",
        content: "Üzgünüm, bir hata oluştu. Lütfen tekrar deneyin.",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const getCategoryLabel = (category: string) => {
    const labels: Record<string, string> = {
      "elektronik": "Elektronik",
      "giyim": "Giyim",
      "ev-yasam": "Ev & Yaşam",
      "spor-outdoor": "Spor & Outdoor",
      "kitap-muzik-film": "Kitap, Müzik & Film",
      "otomotiv": "Otomotiv",
      "anne-bebek": "Anne & Bebek",
      "kozmetik": "Kozmetik",
      "diger": "Diğer",
    }
    return labels[category] || category
  }

  const handleCopyToForm = () => {
    // Store suggestions in localStorage for form to pick up
    if (Object.keys(suggestions).length > 0) {
      localStorage.setItem("aiSuggestions", JSON.stringify(suggestions))
      onOpenChange(false)
      // Trigger custom event for form to listen
      window.dispatchEvent(new CustomEvent("aiSuggestionsReady"))
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl h-[80vh] p-0 gap-0 flex flex-col">
        <DialogHeader className="px-6 py-4 border-b bg-gradient-to-r from-emerald-50 to-teal-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
                <Sparkles className="h-5 w-5 text-white" />
              </div>
              <div>
                <DialogTitle className="text-xl font-bold text-gray-900">Woopy AI Asistan</DialogTitle>
                <DialogDescription className="text-sm text-gray-600">
                  Ürün talebinizi oluşturmak için benimle sohbet edin
                </DialogDescription>
              </div>
            </div>
          </div>
        </DialogHeader>

        {/* Suggestions Bar */}
        {Object.keys(suggestions).length > 0 && (
          <div className="px-6 py-3 border-b bg-emerald-50/50">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs font-semibold text-emerald-900 flex items-center gap-1">
                <Sparkles className="h-3 w-3" />
                Toplanan Bilgiler ({Object.keys(suggestions).length})
              </p>
              <Button
                size="sm"
                onClick={handleCopyToForm}
                className="h-7 text-xs bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700"
              >
                Forma Aktar
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {suggestions.productName && (
                <Badge variant="outline" className="bg-white border-emerald-200 text-emerald-700">
                  <CheckCircle2 className="h-3 w-3 mr-1" />
                  {suggestions.productName}
                </Badge>
              )}
              {suggestions.category && (
                <Badge variant="outline" className="bg-white border-emerald-200 text-emerald-700">
                  <CheckCircle2 className="h-3 w-3 mr-1" />
                  {getCategoryLabel(suggestions.category)}
                </Badge>
              )}
              {suggestions.quantity && (
                <Badge variant="outline" className="bg-white border-emerald-200 text-emerald-700">
                  <CheckCircle2 className="h-3 w-3 mr-1" />
                  {suggestions.quantity} adet
                </Badge>
              )}
              {suggestions.warrantyStatus && (
                <Badge variant="outline" className="bg-white border-emerald-200 text-emerald-700">
                  <CheckCircle2 className="h-3 w-3 mr-1" />
                  Garanti: {suggestions.warrantyStatus}
                </Badge>
              )}
              {suggestions.deliveryCity && (
                <Badge variant="outline" className="bg-white border-emerald-200 text-emerald-700">
                  <CheckCircle2 className="h-3 w-3 mr-1" />
                  {suggestions.deliveryCity}
                  {suggestions.deliveryDistrict && ` / ${suggestions.deliveryDistrict}`}
                </Badge>
              )}
              {suggestions.maxBudget && (
                <Badge variant="outline" className="bg-white border-emerald-200 text-emerald-700">
                  <CheckCircle2 className="h-3 w-3 mr-1" />
                  {suggestions.maxBudget.toLocaleString("tr-TR")} ₺
                </Badge>
              )}
            </div>
          </div>
        )}

        {/* Messages */}
        <ScrollArea className="flex-1 px-6 py-4" ref={scrollRef}>
          <div className="space-y-4 pb-4">
            <AnimatePresence>
              {messages.map((message, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className={`flex gap-3 ${
                    message.role === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  {message.role === "assistant" && (
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
                      <Bot className="h-4 w-4 text-white" />
                    </div>
                  )}
                  <div
                    className={`max-w-[75%] rounded-2xl px-4 py-3 ${
                      message.role === "user"
                        ? "bg-gradient-to-r from-emerald-500 to-teal-600 text-white"
                        : "bg-gray-100 text-gray-900"
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap break-words">{message.content}</p>
                    <p
                      className={`text-xs mt-1 ${
                        message.role === "user" ? "text-white/70" : "text-gray-500"
                      }`}
                    >
                      {message.timestamp.toLocaleTimeString("tr-TR", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                  {message.role === "user" && (
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                      <User className="h-4 w-4 text-gray-600" />
                    </div>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
            {isLoading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex gap-3"
              >
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
                  <Bot className="h-4 w-4 text-white" />
                </div>
                <div className="bg-gray-100 rounded-2xl px-4 py-3">
                  <Loader2 className="h-4 w-4 animate-spin text-gray-500" />
                </div>
              </motion.div>
            )}
          </div>
        </ScrollArea>

        {/* Input */}
        <div className="px-6 py-4 border-t bg-gray-50">
          <div className="flex gap-2">
            <Input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Mesajınızı yazın..."
              disabled={isLoading}
              className="flex-1 bg-white"
            />
            <Button
              onClick={handleSend}
              disabled={!input.trim() || isLoading}
              size="icon"
              className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
