// src/components/ui/Layout.tsx
import { useEffect, useState } from "react";
import { Sidebar } from "./sidebar";
import { Navbar } from "./navbar";
import clsx from "clsx";
import { Outlet } from "react-router-dom";
import { getWordListAPI } from "@/api/wordle.api";

export const Layout = () => {
  const [collapsed, setCollapsed] = useState(true);

  useEffect(() => {
    const loadWordList = async () => {
      if (!localStorage.getItem("wordle_word_list")) {
        const { data } = await getWordListAPI();
        localStorage.setItem("wordle_word_list", data);
      }
    };

    loadWordList();
  }, []);

  return (
    <div
      className={clsx(
        "min-h-screen w-screen grid bg-background text-foreground transition-[grid-template-columns] duration-300"
      )}
      style={{
        gridTemplateColumns: collapsed ? "5rem 1fr" : "15rem 1fr",
        gridTemplateRows: "3.8rem 1fr",
      }}
    >
      {/* SIDEBAR */}
      <div className="row-span-2 border-r border-border bg-card/40 backdrop-blur-md">
        <Sidebar
          collapsed={collapsed}
          toggle={() => setCollapsed(!collapsed)}
        />
      </div>

      {/* NAVBAR */}
      <div className="col-start-2 bg-card/60 backdrop-blur-md border-b border-border shadow-sm">
        <Navbar />
      </div>

      {/* MAIN */}
      <main
        className={clsx(
          "col-start-2 overflow-y-auto p-6",
          "bg-background",
          "transition-colors"
        )}
      >
        {/* Render nested routes here */}
        <Outlet />
      </main>
    </div>
  );
};
