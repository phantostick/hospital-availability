'use client';

import { useState, useRef, useEffect } from 'react';
import { Navbar } from '@/components/navbar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send, Bot, User } from 'lucide-react';

interface Message {
  id: string;
  type: 'user' | 'bot';
  text: string;
}

export default function SMSDemo() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'bot',
      text: 'Hello! Welcome to Hospital Bed SMS Assistant. Type your query to find available beds.',
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const botResponses: { [key: string]: string } = {
    'general beds': 'General ward beds: City General Hospital has 12 available, St. Mary Medical Center has 45 available.',
    'icu': 'ICU beds: Regional Medical Institute has 10 available, Hope District Hospital has 7 available.',
    'ventilator': 'Ventilator support: Regional Medical Institute has 6 available, Hope District Hospital has 4 available.',
    'emergency': 'Emergency services available at: City General Hospital, St. Mary Medical Center, Apollo Care Hospital, and Regional Medical Institute.',
    'location': 'Please provide your location for nearby hospital recommendations.',
    'hello': 'Hi! How can I help you find hospital beds today?',
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      text: input,
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    // Simulate bot response delay
    setTimeout(() => {
      const userInput = input.toLowerCase();
      let botResponse = 'I can help you find hospital beds. Ask about: general beds, ICU, ventilator, emergency services, or location.';

      for (const [key, response] of Object.entries(botResponses)) {
        if (userInput.includes(key)) {
          botResponse = response;
          break;
        }
      }

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        text: botResponse,
      };

      setMessages(prev => [...prev, botMessage]);
      setIsLoading(false);
    }, 800);
  };

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-8">
        <div className="max-w-2xl mx-auto px-4">
          <div className="space-y-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">SMS Assistant</h1>
              <p className="text-gray-600 mt-1">Chat with our hospital bed finder bot</p>
            </div>

            <Card className="flex flex-col h-96">
              <CardHeader className="border-b">
                <CardTitle className="flex items-center gap-2">
                  <Bot className="w-5 h-5" />
                  Hospital Bed Assistant
                </CardTitle>
              </CardHeader>

              <CardContent className="flex-1 overflow-y-auto p-4 space-y-3">
                {messages.map(message => (
                  <div
                    key={message.id}
                    className={`flex gap-3 ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    {message.type === 'bot' && (
                      <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0">
                        <Bot className="w-4 h-4 text-white" />
                      </div>
                    )}

                    <div
                      className={`max-w-xs px-4 py-2 rounded-lg ${
                        message.type === 'user'
                          ? 'bg-blue-600 text-white rounded-br-none'
                          : 'bg-gray-200 text-gray-900 rounded-bl-none'
                      }`}
                    >
                      <p className="text-sm">{message.text}</p>
                    </div>

                    {message.type === 'user' && (
                      <div className="w-8 h-8 rounded-full bg-gray-400 flex items-center justify-center flex-shrink-0">
                        <User className="w-4 h-4 text-white" />
                      </div>
                    )}
                  </div>
                ))}

                {isLoading && (
                  <div className="flex gap-3">
                    <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center">
                      <Bot className="w-4 h-4 text-white" />
                    </div>
                    <div className="bg-gray-200 px-4 py-2 rounded-lg rounded-bl-none">
                      <div className="flex gap-1">
                        <div className="w-2 h-2 bg-gray-600 rounded-full animate-bounce" />
                        <div className="w-2 h-2 bg-gray-600 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                        <div className="w-2 h-2 bg-gray-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                      </div>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </CardContent>

              <div className="border-t p-4">
                <form onSubmit={handleSendMessage} className="flex gap-2">
                  <Input
                    placeholder="Type a message..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    disabled={isLoading}
                  />
                  <Button
                    type="submit"
                    disabled={isLoading || !input.trim()}
                    size="icon"
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </form>
              </div>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Try asking about:</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-wrap gap-2">
                {['general beds', 'ICU', 'ventilator', 'emergency', 'location'].map(query => (
                  <Button
                    key={query}
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setInput(query);
                    }}
                  >
                    {query}
                  </Button>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </>
  );
}
