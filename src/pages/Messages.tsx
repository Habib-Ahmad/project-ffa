import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, Paperclip } from "lucide-react";

export default function Messages() {
  const { t } = useLanguage();
  const [selectedThread, setSelectedThread] = useState<string | null>(null);

  // Mock data
  const threads = [
    {
      id: "1",
      projectTitle: "Youth Entrepreneurship Program 2024",
      lastMessage: "Thank you for the update",
      unread: 2,
      timestamp: "2024-01-25 14:30",
    },
    {
      id: "2",
      projectTitle: "Education Initiative",
      lastMessage: "Please provide additional documents",
      unread: 0,
      timestamp: "2024-01-24 10:15",
    },
  ];

  const messages = [
    {
      id: "1",
      sender: "Marie Dubois",
      role: "Applicant",
      content: "Hello, I have a question about the eligibility criteria.",
      timestamp: "2024-01-25 10:00",
      attachments: [],
    },
    {
      id: "2",
      sender: "You",
      role: "Intervener",
      content: "Hello Marie, please feel free to ask your question.",
      timestamp: "2024-01-25 10:30",
      attachments: [],
    },
    {
      id: "3",
      sender: "Marie Dubois",
      role: "Applicant",
      content: "Can organizations apply if they were founded less than a year ago?",
      timestamp: "2024-01-25 11:00",
      attachments: [],
    },
    {
      id: "4",
      sender: "You",
      role: "Intervener",
      content: "Yes, new organizations are eligible. Please include your registration documents with your application.",
      timestamp: "2024-01-25 14:30",
      attachments: [],
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">{t("nav.messages")}</h1>
        <p className="text-muted-foreground mt-1">
          Communicate with applicants and administrators
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Threads</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <ScrollArea className="h-[600px]">
              {threads.map((thread) => (
                <div
                  key={thread.id}
                  className={`p-4 cursor-pointer hover:bg-muted/50 border-b ${
                    selectedThread === thread.id ? "bg-muted" : ""
                  }`}
                  onClick={() => setSelectedThread(thread.id)}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-sm truncate">
                        {thread.projectTitle}
                      </h3>
                      <p className="text-sm text-muted-foreground truncate mt-1">
                        {thread.lastMessage}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {thread.timestamp}
                      </p>
                    </div>
                    {thread.unread > 0 && (
                      <Badge variant="default" className="shrink-0">
                        {thread.unread}
                      </Badge>
                    )}
                  </div>
                </div>
              ))}
            </ScrollArea>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          {selectedThread ? (
            <>
              <CardHeader>
                <CardTitle>
                  {threads.find((t) => t.id === selectedThread)?.projectTitle}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <ScrollArea className="h-[450px] pr-4">
                  <div className="space-y-4">
                    {messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${
                          message.sender === "You" ? "justify-end" : "justify-start"
                        }`}
                      >
                        <div
                          className={`max-w-[80%] rounded-lg p-3 ${
                            message.sender === "You"
                              ? "bg-primary text-primary-foreground"
                              : "bg-muted"
                          }`}
                        >
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-medium text-sm">
                              {message.sender}
                            </span>
                            <Badge
                              variant="outline"
                              className="text-xs"
                            >
                              {message.role}
                            </Badge>
                          </div>
                          <p className="text-sm">{message.content}</p>
                          <p className="text-xs opacity-70 mt-2">
                            {message.timestamp}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>

                <div className="space-y-2">
                  <Textarea
                    placeholder="Type your message..."
                    rows={3}
                  />
                  <div className="flex justify-between items-center">
                    <Button variant="outline" size="sm">
                      <Paperclip className="h-4 w-4 mr-2" />
                      Attach
                    </Button>
                    <Button size="sm">
                      <Send className="h-4 w-4 mr-2" />
                      Send
                    </Button>
                  </div>
                </div>
              </CardContent>
            </>
          ) : (
            <div className="flex items-center justify-center h-[600px]">
              <p className="text-muted-foreground">
                Select a thread to view messages
              </p>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
