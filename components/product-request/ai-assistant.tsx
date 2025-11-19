"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Sparkles, Send, Loader2, Bot, User, CheckCircle2 } from "lucide-react"
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
}

interface AIAssistantProps {
  currentFormData: any
  onApplySuggestion: (field: string, value: any) => void
}

export function AIAssistant({ currentFormData, onApplySuggestion }: AIAssistantProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Merhaba! Ürün talebinizi oluşturmanıza yardımcı olacağım. Hangi ürünü satın almak istiyorsunuz?",
      timestamp: new Date(),
    },
  ])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [suggestions, setSuggestions] = useState<AISuggestion>({})
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

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
          currentFormData,
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

  const applySuggestion = (field: string, value: any) => {
    onApplySuggestion(field, value)
    setSuggestions((prev) => {
      const newSuggestions = { ...prev }
      delete newSuggestions[field as keyof AISuggestion]
      return newSuggestions
    })
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

  const applyAllSuggestions = () => {
    Object.entries(suggestions).forEach(([field, value]) => {
      if (field === "warrantyStatus") {
        // Handle warranty as dynamic field
        onApplySuggestion("dynamicFields", { warrantyStatus: value })
      } else {
        onApplySuggestion(field, value)
      }
    })
    setSuggestions({})
  }

  return (
    <Card className="h-full flex flex-col border-[#770022]/20 shadow-lg">
      <CardHeader className="border-b border-gray-100 bg-gradient-to-r from-[#770022]/5 to-[#770022]/10">
        <CardTitle className="text-lg font-semibold text-[#1F1B24] flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-[#770022]" />
          AI Asistan
        </CardTitle>
        <CardDescription className="text-sm">
          Detaylı talep oluşturmanıza yardımcı oluyorum
        </CardDescription>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col p-0">
        {/* Suggestions */}
        {Object.keys(suggestions).length > 0 && (
          <div className="p-4 border-b border-gray-100 bg-amber-50/50 space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-xs font-medium text-amber-900 flex items-center gap-1">
                <Sparkles className="h-3 w-3" />
                AI Önerileri ({Object.keys(suggestions).length})
              </p>
              <Button
                size="sm"
                onClick={applyAllSuggestions}
                className="h-7 text-xs bg-[#770022] hover:bg-[#5a0019]"
              >
                Tümünü Uygula
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {suggestions.productName && (
                <Badge
                  variant="outline"
                  className="cursor-pointer hover:bg-[#770022] hover:text-white transition-colors"
                  onClick={() => applySuggestion("productName", suggestions.productName)}
                >
                  <CheckCircle2 className="h-3 w-3 mr-1" />
                  Ürün: {suggestions.productName}
                </Badge>
              )}
              {suggestions.category && (
                <Badge
                  variant="outline"
                  className="cursor-pointer hover:bg-[#770022] hover:text-white transition-colors"
                  onClick={() => applySuggestion("category", suggestions.category)}
                >
                  <CheckCircle2 className="h-3 w-3 mr-1" />
                  Kategori: {getCategoryLabel(suggestions.category)}
                </Badge>
              )}
              {suggestions.quantity && (
                <Badge
                  variant="outline"
                  className="cursor-pointer hover:bg-[#770022] hover:text-white transition-colors"
                  onClick={() => applySuggestion("quantity", suggestions.quantity)}
                >
                  <CheckCircle2 className="h-3 w-3 mr-1" />
                  Miktar: {suggestions.quantity} adet
                </Badge>
              )}
              {suggestions.description && (
                <Badge
                  variant="outline"
                  className="cursor-pointer hover:bg-[#770022] hover:text-white transition-colors max-w-full"
                  onClick={() => applySuggestion("description", suggestions.description)}
                >
                  <CheckCircle2 className="h-3 w-3 mr-1 flex-shrink-0" />
                  <span className="truncate">Açıklama: {suggestions.description.substring(0, 50)}...</span>
                </Badge>
              )}
              {suggestions.warrantyStatus && (
                <Badge
                  variant="outline"
                  className="cursor-pointer hover:bg-[#770022] hover:text-white transition-colors"
                  onClick={() => {
                    onApplySuggestion("dynamicFields", { warrantyStatus: suggestions.warrantyStatus })
                    setSuggestions((prev) => {
                      const newSuggestions = { ...prev }
                      delete newSuggestions.warrantyStatus
                      return newSuggestions
                    })
                  }}
                >
                  <CheckCircle2 className="h-3 w-3 mr-1" />
                  Garanti: {suggestions.warrantyStatus}
                </Badge>
              )}
              {suggestions.maxBudget && (
                <Badge
                  variant="outline"
                  className="cursor-pointer hover:bg-[#770022] hover:text-white transition-colors"
                  onClick={() => applySuggestion("maxBudget", suggestions.maxBudget)}
                >
                  <CheckCircle2 className="h-3 w-3 mr-1" />
                  Bütçe: {suggestions.maxBudget.toLocaleString("tr-TR")} ₺
                </Badge>
              )}
              {suggestions.deliveryCity && (
                <Badge
                  variant="outline"
                  className="cursor-pointer hover:bg-[#770022] hover:text-white transition-colors"
                  onClick={() => applySuggestion("deliveryCity", suggestions.deliveryCity)}
                >
                  <CheckCircle2 className="h-3 w-3 mr-1" />
                  Şehir: {suggestions.deliveryCity}
                </Badge>
              )}
            </div>
          </div>
        )}

        {/* Messages */}
        <ScrollArea className="flex-1 p-4" ref={scrollRef}>
          <div className="space-y-4">
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
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#770022]/10 flex items-center justify-center">
                      <Bot className="h-4 w-4 text-[#770022]" />
                    </div>
                  )}
                  <div
                    className={`max-w-[80%] rounded-lg px-4 py-2 ${
                      message.role === "user"
                        ? "bg-[#770022] text-white"
                        : "bg-gray-100 text-gray-900"
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap">{message.content}</p>
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
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#770022]/10 flex items-center justify-center">
                  <Bot className="h-4 w-4 text-[#770022]" />
                </div>
                <div className="bg-gray-100 rounded-lg px-4 py-2">
                  <Loader2 className="h-4 w-4 animate-spin text-gray-500" />
                </div>
              </motion.div>
            )}
          </div>
        </ScrollArea>

        {/* Input */}
        <div className="p-4 border-t border-gray-100">
          <div className="flex gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Mesajınızı yazın..."
              disabled={isLoading}
              className="flex-1"
            />
            <Button
              onClick={handleSend}
              disabled={!input.trim() || isLoading}
              size="icon"
              className="bg-[#770022] hover:bg-[#770022]/90"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
