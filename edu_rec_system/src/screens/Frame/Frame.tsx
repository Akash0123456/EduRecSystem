import { MessageSquareIcon, SearchIcon, SendIcon } from "lucide-react";
import React from "react";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "../../components/ui/avatar";
import { Button } from "../../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Separator } from "../../components/ui/separator";

// Data for recent chats
const recentChats = [
  {
    id: 1,
    title: "Climate Change Effects",
    time: "2 hours ago",
    active: true,
    icon: "https://c.animaapp.com/m8rnoiwsmZEcq2/img/frame-10.svg",
  },
  {
    id: 2,
    title: "Quantum Physics",
    time: "Yesterday",
    active: false,
    icon: "https://c.animaapp.com/m8rnoiwsmZEcq2/img/frame-8.svg",
  },
];

// Data for sources
const sources = [
  {
    title: "IPCC Report 2025",
    url: "ipcc.ch/reports",
  },
  {
    title: "NASA Climate Change Analysis",
    url: "climate.nasa.gov",
  },
  {
    title: "Scientific American: The Truth About Global Warming",
    url: "scientificamerican.com/climate",
  },
];

export const Frame = (): JSX.Element => {
  return (
    <div className="flex flex-col bg-gray-900 min-h-screen">
      {/* Header */}
      <header className="w-full h-[69px] bg-[#111827f2] border-b border-gray-800 fixed top-0 z-10">
        <div className="max-w-7xl mx-auto h-full px-6 flex items-center justify-between">
          <div className="flex items-center space-x-8">
            <div className="font-bold text-2xl">
              <span className="text-gray-100">EduRec</span>
              <span className="text-cyan-400">.</span>
            </div>
            <nav className="flex space-x-6">
              <div className="text-gray-400">HomeIcon</div>
              <div className="text-gray-400">About</div>
              <div className="text-gray-400">SettingsIcon</div>
            </nav>
          </div>
          <div className="flex items-center">
            <Button variant="ghost" size="icon" className="rounded-full">
              <SearchIcon className="h-5 w-5 text-gray-100" />
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex pt-[69px] h-screen">
        {/* Sidebar */}
        <aside className="w-80 border-r border-gray-800 flex flex-col h-full">
          {/* User Profile */}
          <div className="p-6">
            <div className="flex items-center">
              <div className="relative">
                <Avatar className="h-12 w-12">
                  <AvatarImage
                    src="https://c.animaapp.com/m8rnoiwsmZEcq2/img/img.png"
                    alt="User"
                  />
                  <AvatarFallback>AM</AvatarFallback>
                </Avatar>
                <div className="absolute bottom-0 right-0 bg-cyan-500 rounded-full w-5 h-5 flex items-center justify-center">
                  <img
                    className="w-3 h-3"
                    alt="Frame"
                    src="https://c.animaapp.com/m8rnoiwsmZEcq2/img/frame.svg"
                  />
                </div>
              </div>
              <div className="ml-4">
                <div className="text-gray-100 text-base">Alex Mitchell</div>
                <div className="text-gray-400 text-sm">Premium Member</div>
              </div>
            </div>
          </div>

          {/* New Chat Button */}
          <Button className="mx-6 bg-cyan-500 hover:bg-cyan-600 text-white flex items-center justify-center gap-2">
            <MessageSquareIcon className="h-3.5 w-3.5" />
            <span>Start New Chat</span>
          </Button>

          {/* Recent Chats */}
          <div className="p-6 flex-1 overflow-auto">
            <div className="text-gray-400 text-sm mb-2">Recent Chats</div>
            <div className="space-y-2">
              {recentChats.map((chat) => (
                <Card
                  key={chat.id}
                  className={`${chat.active ? "bg-[#1f293780]" : "bg-transparent"} rounded-lg hover:bg-[#1f293780] transition-colors cursor-pointer`}
                >
                  <CardContent className="p-3">
                    <div className="flex items-start">
                      <div className="flex items-center justify-center mt-2.5">
                        <img
                          className="w-3.5 h-4"
                          alt="Chat icon"
                          src={chat.icon}
                        />
                      </div>
                      <div className="ml-[26px]">
                        <div className="text-gray-100 text-sm font-medium">
                          {chat.title}
                        </div>
                        <div className="text-gray-400 text-xs">{chat.time}</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </aside>

        {/* Main Chat Area */}
        <main className="flex-1 flex flex-col h-full">
          {/* Chat History */}
          <div className="flex-1 p-6 overflow-auto">
            {/* User Question */}
            <div className="flex justify-end mb-6">
              <div className="bg-[#06b6d433] rounded-[16px_2px_16px_16px] p-4 max-w-[338px]">
                <div className="text-cyan-50 text-base">
                  What are the causes of climate change?
                </div>
              </div>
            </div>

            {/* AI Response */}
            <Card className="bg-[#1f293780] border-gray-700 rounded-[2px_16px_16px_16px] mb-6 max-w-[768px]">
              <CardContent className="p-6">
                <div className="flex">
                  <div className="bg-[#06b6d433] rounded-lg p-1.5 h-8 w-9 flex items-center justify-center">
                    <img
                      className="w-5 h-4"
                      alt="AI icon"
                      src="https://c.animaapp.com/m8rnoiwsmZEcq2/img/frame-9.svg"
                    />
                  </div>
                  <div className="ml-[52px] space-y-4 flex-1">
                    <div className="text-gray-100 text-base leading-4">
                      Climate change is primarily caused by greenhouse gas
                      emissions from burning fossil fuels, deforestation, and
                      industrial activities.
                    </div>

                    <Separator className="my-4 bg-gray-700" />

                    <div>
                      <div className="text-gray-400 text-sm mb-4">Sources:</div>
                      <div className="space-y-2">
                        {sources.map((source, index) => (
                          <div key={index} className="flex justify-between">
                            <div className="text-cyan-400 text-sm">
                              {source.title}
                            </div>
                            <div className="text-gray-400 text-xs">
                              {source.url}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <Card className="bg-[#3741514c] border-0 rounded-lg mt-4">
                      <CardHeader className="p-4 pb-0">
                        <CardTitle className="text-gray-100 text-sm font-normal">
                          Analysis Methodology
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="p-4 pt-2 text-gray-300 text-sm space-y-[20px]">
                        <p>
                          The response was formulated through a systematic
                          analysis of peer-reviewed scientific literature and
                          authoritative climate research. Primary sources were
                          evaluated based on their scientific validity, with
                          particular emphasis on data from international climate
                          research organizations and academic institutions. The
                          synthesis process involved cross-referencing multiple
                          scientific studies to ensure accuracy and
                          comprehensive coverage of the primary factors
                          contributing to climate change. Special consideration
                          was given to the most recent findings from leading
                          climate research bodies and their established
                          methodologies for climate science analysis.
                        </p>
                      </CardContent>
                    </Card>

                    <div className="flex space-x-[8px]">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-[30px] w-[26px] p-0"
                      >
                        <img
                          className="w-[10.5px] h-3.5"
                          alt="Copy"
                          src="https://c.animaapp.com/m8rnoiwsmZEcq2/img/frame-1.svg"
                        />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-[30px] w-7 p-0"
                      >
                        <img
                          className="w-[12.25px] h-3.5"
                          alt="Bookmark"
                          src="https://c.animaapp.com/m8rnoiwsmZEcq2/img/frame-3.svg"
                        />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-[30px] w-[30px] p-0"
                      >
                        <img
                          className="w-3.5 h-3.5"
                          alt="Share"
                          src="https://c.animaapp.com/m8rnoiwsmZEcq2/img/frame-4.svg"
                        />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Chat Input */}
          <div className="border-t border-gray-800 p-4">
            <div className="max-w-3xl mx-auto relative">
              <div className="bg-[#1f293780] rounded-xl flex items-center">
                <Input
                  className="bg-transparent border-0 h-14 px-4 text-gray-100 focus-visible:ring-0 focus-visible:ring-offset-0"
                  placeholder="What are the causes of climate change?"
                  defaultValue="What are the causes of climate change?"
                />
                <Button variant="ghost" size="icon" className="mr-2">
                  <img
                    className="w-3 h-4"
                    alt="Microphone"
                    src="https://c.animaapp.com/m8rnoiwsmZEcq2/img/frame-6.svg"
                  />
                </Button>
                <Button className="bg-cyan-500 hover:bg-cyan-600 text-white rounded-lg h-10 px-4 mr-2 flex items-center gap-2">
                  <SendIcon className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};
