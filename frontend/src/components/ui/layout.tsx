import { useState } from "react";
import { Sidebar } from "./sidebar";
import { Navbar } from "./navbar";

export const Layout = ({ children }: { children: React.ReactNode }) => {
  const [collapsed, setCollapsed] = useState(true);

  return (
    <div
      className="h-screen w-screen grid bg-[#0a0a0c] text-white"
      style={{
        gridTemplateColumns: collapsed ? "5rem 1fr" : "15rem 1fr",
        gridTemplateRows: "3.8rem 1fr",
      }}
    >
      <div className="row-span-2">
        <Sidebar
          collapsed={collapsed}
          toggle={() => setCollapsed(!collapsed)}
        />
      </div>

      <div className="col-start-2 bg-[#111113] border-b border-zinc-800">
        <Navbar />
      </div>

      <main className="col-start-2 overflow-y-auto bg-[#0a0a0c] p-6">
        {children}
      </main>
    </div>
  );
};
