import { Authenticated, Unauthenticated, useMutation, useQuery } from "convex/react";
import { SignInForm } from "./SignInForm";
import { SignOutButton } from "./SignOutButton";
import { useState, useEffect } from "react";
import { api } from "../convex/_generated/api";
import { BossList } from "./components/BossList";
import { HideoutProgress } from "./components/HideoutProgress";
import { CollectorItems } from "./components/CollectorItems";
import { PrestigeProgress } from "./components/PrestigeProgress";
import { LightkeeperRequirements } from "./components/LightkeeperRequirements";
import { Toaster } from "sonner";
import { KappaTaskList } from "./components/KappaTaskList";
import { VersionLabel } from "@/components/VersionLabel";
import { Notepad } from "./components/Notepad";

export default function App() {
  const [activeTab, setActiveTab] = useState("tasks");
  const [isNotepadVisible, setIsNotepadVisible] = useState(false);
  const loggedInUser = useQuery(api.auth.loggedInUser);

  return (
    <div className="min-h-screen flex flex-col bg-[#1a1a1a] text-gray-100 relative">
      <header className="sticky top-0 z-10 bg-gray-800/80 backdrop-blur-sm p-4 flex justify-between items-center border-b border-gray-700">
        <h2 className="text-xl font-semibold text-amber-500">Tarkov Kappa Tracker</h2>
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setIsNotepadVisible(!isNotepadVisible)}
            className="p-2 rounded hover:bg-gray-700 transition-colors"
            title={isNotepadVisible ? "Hide Notepad" : "Show Notepad"}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>
          {/* Conditionally render user info and sign out button */}
          {loggedInUser && (
            <div className="flex items-center space-x-2">
              {loggedInUser.image ? (
                <img
                  src={loggedInUser.image}
                  alt={loggedInUser.name ?? "User Avatar"}
                  className="h-8 w-8 rounded-full"
                />
              ) : (
                <div className="h-8 w-8 rounded-full bg-gray-600 flex items-center justify-center text-xs font-semibold">
                  U
                </div>
              )}
              {loggedInUser.name && (
                <span className="text-sm font-medium hidden sm:inline">
                  {loggedInUser.name}
                </span>
              )}
              <SignOutButton />
            </div>
          )}
        </div>
      </header>
      <main className="flex-1 p-8 pb-16">
        <div className="max-w-6xl mx-auto space-y-8">
          <Content activeTab={activeTab} setActiveTab={setActiveTab} />
        </div>
      </main>
      <VersionLabel />
      <Toaster theme="dark" />

      <Notepad
        isVisible={isNotepadVisible}
        onClose={() => setIsNotepadVisible(false)}
      />
      
      <footer className="py-10 text-center text-gray-400 text-sm mt-8">
        <p className="mb-2">
          <a 
            href="https://www.twitch.tv/pestily" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-amber-500 hover:underline"
          >
            Pestily's
          </a> EFT tracker. General sheet made by <span className="text-amber-500">ItzPyroGG</span>, thanks to 
          <span className="text-amber-500"> Mr2am</span> and <span className="text-amber-500">Magicman</span> for adding boss progression and hideout requirements.
        </p>
        <a 
          href="https://bit.ly/PrestigeTracker" 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-amber-500 hover:underline"
        >
          View the original spreadsheet here
        </a>
      </footer>
    </div>
  );
}

interface ContentProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

function Content({
  activeTab,
  setActiveTab,
}: ContentProps) {
  return (
    <div className="flex flex-col gap-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-amber-500 mb-4">
          Tarkov Kappa Prestige Tracker
        </h1>
        <Authenticated>
          <EnsureUser />
          <Tabs activeTab={activeTab} setActiveTab={setActiveTab} />
          <TabContent activeTab={activeTab} />
        </Authenticated>
        <Unauthenticated>
          <p className="text-xl text-gray-400 mb-8">
            Sign in to track your progress
          </p>
          <SignInForm />
        </Unauthenticated>
      </div>
    </div>
  );
}

function Tabs({
  activeTab,
  setActiveTab,
}: {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}) {
  const tabs = [
    { id: "tasks", label: "Kappa Tasks", type: "internal" as const },
    { id: "collector", label: "Collector Items", type: "internal" as const },
    { id: "lightkeeper", label: "Lightkeeper Req.", type: "internal" as const },
    { id: "bosses", label: "Boss Progression", type: "internal" as const },
    { id: "hideout", label: "Hideout", type: "internal" as const },
    { id: "prestige", label: "Prestige Goals", type: "internal" as const },
    { id: "storyline", label: "1.0 Storyline quests", type: "external" as const, href: "https://www.youtube.com/watch?v=dQw4w9WgXcQ" },
  ];

  return (
    <div className="border-b border-gray-700 relative">
      <nav
        className="-mb-px flex space-x-8 overflow-x-auto whitespace-nowrap scrollbar-hide sm:overflow-visible sm:whitespace-normal"
        aria-label="Tabs"
      >
        {tabs.map((tab) => {
          const commonClasses = `
            border-b-2 py-4 px-1 text-sm font-medium whitespace-nowrap
          `;
          const activeClasses = "border-amber-500 text-amber-500";
          const inactiveClasses = "border-transparent text-gray-400 hover:border-gray-300 hover:text-gray-300";

          if (tab.type === "internal") {
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`${commonClasses} ${
                  activeTab === tab.id ? activeClasses : inactiveClasses
                }`}
              >
                {tab.label}
              </button>
            );
          } else {
            return (
              <a
                key={tab.id}
                href={tab.href}
                target="_blank"
                rel="noopener noreferrer"
                className={`${commonClasses} ${inactiveClasses} animate-flash-blue`}
              >
                {tab.label}
              </a>
            );
          }
        })}
      </nav>
      <div
        className="pointer-events-none absolute top-0 right-0 h-full w-8 bg-gradient-to-l from-gray-900 via-gray-900/80 to-transparent sm:hidden"
        aria-hidden="true"
      />
    </div>
  );
}

interface TabContentProps {
  activeTab: string;
}

function TabContent({ activeTab }: TabContentProps) {
  switch (activeTab) {
    case "tasks":
      return <KappaTaskList />;
    case "collector":
      return <CollectorItems />;
    case "bosses":
      return <BossList />;
    case "hideout":
      return <HideoutProgress />;
    case "prestige":
      return <PrestigeProgress />;
    case "lightkeeper":
      return <LightkeeperRequirements />;
    default:
      return <div className="text-gray-400 mt-8">Coming soon...</div>;
  }
}

function EnsureUser() {
  const ensureUserMutation = useMutation(api.users.ensureUser);

  useEffect(() => {
    void ensureUserMutation({});
  }, [ensureUserMutation]);

  return null;
}
