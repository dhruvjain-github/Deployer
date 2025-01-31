"use client";
import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { io } from "socket.io-client";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Github } from "lucide-react";
import { Fira_Code } from "next/font/google";
import Button2 from "@/components/ui/button2";
import Hero from "@/components/ui/hero";

const firaCode = Fira_Code({ subsets: ["latin"] });
const socket = io(process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:9002");

export default function Home() {
  const [repoURL, setRepoURL] = useState<string>("");
  const [subdomain, setsubdomain] = useState("");
  const [logs, setLogs] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [projectId, setProjectId] = useState<string | null>(null);
  const [deployURL, setDeployURL] = useState<string | null>(null);
  const logContainerRef = useRef<HTMLDivElement>(null);

  const isValidURL = useMemo(() => {
    const regex = /^(https?:\/\/)?(www\.)?github\.com\/[\w-]+\/[\w-]+$/;
    return regex.test(repoURL);
  }, [repoURL]);

  const handleDeploy = useCallback(async () => {
    if (!isValidURL) return;

    setLoading(true);
    try {
      const payload = {
        gitURL: repoURL,
        slug: subdomain.trim() || "", // Ensure slug is always sent
      };

      console.log("Sending payload:", payload); // Debugging log

      const { data } = await axios.post("http://localhost:9000/project", payload);

      if (data && data.data) {
        const { projectSlug, url } = data.data;
        setProjectId(projectSlug);
        setDeployURL(url);
        socket.emit("subscribe", `logs:${projectSlug}`);
      }
    } catch (error) {
      console.error("Deployment failed:", error);
      alert("Failed to deploy. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [repoURL, subdomain, isValidURL]);

  useEffect(() => {
    const handleSocketMessage = (message: any) => {
      console.log("Received message:", message); // Debugging log
      if (typeof message === "string") {
        try {
          const parsedMessage = JSON.parse(message);
          setLogs((prev) => [...prev, parsedMessage.log]);
        } catch (error) {
          console.error("Error parsing message:", error);
        }
      } else if (message?.log) {
        setLogs((prev) => [...prev, message.log]);
      }
      logContainerRef.current?.scrollIntoView({ behavior: "smooth" });
    };
  
    socket.on("message", handleSocketMessage);
  
    return () => {
      socket.off("message", handleSocketMessage);
    };
  }, []);
  

  return (
    <main className="flex flex-col h-screen items-center justify-center bg-[linear-gradient(135deg,#0a0a0a,#1a1a1a,#2a2a2a)]">
  <Hero />
  <div className="w-96 bg-transparent mt-16 "> {/* Reduced top margin */}
    <div className="flex items-center gap-2 mb-4">
      <i className="ri-github-line text-2xl"></i>
      <Input
        type="url"
        placeholder="GitHub Repository URL"
        value={repoURL}
        onChange={(e) => setRepoURL(e.target.value)}
        disabled={loading}
      />
    </div>
    <div className="flex items-center gap-2 mb-4">
      <i className="ri-attachment-line text-2xl "></i>
      <Input
        type="text"
        placeholder="Sub Domain"
        value={subdomain}
        onChange={(e) => setsubdomain(e.target.value)}
        disabled={loading}
      />
    </div>
    <Button2 onClick={handleDeploy} disabled={!isValidURL || loading} className="w-full mt-4 mb-4"> 
      {/* Added mb-4 */}
      {loading ? "Deploying..." : "Deploy"}
    </Button2>
    {deployURL && (
      <div className="mt-4 p-4 bg-gray-900 rounded-md text-white">
        <p>
          Preview URL:{" "}
          <a
            href={deployURL}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-400 underline"
          >
            {deployURL}
          </a>
        </p>
      </div>
    )}
    {logs.length > 0 && (
      <div
        className={`mt-4 p-4 bg-black text-green-400 rounded-md overflow-y-auto h-48 ${firaCode.className}`}
      >
        {logs.map((log, index) => (
          <div key={index} ref={index === logs.length - 1 ? logContainerRef : null}>
            {log}
          </div>
        ))}
      </div>
    )}
  </div>
</main>

  );
}
