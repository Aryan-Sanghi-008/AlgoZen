// src/App.tsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Solutions from "@/pages/Solutions";
import UpcomingContests from "@/pages/UpcomingContests";
import { RankChecker } from "@/pages/RankChecker";
import { Layout } from "./components/ui";
import { LeetCodePage } from "./pages/LeetCode";

export default function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<LeetCodePage />} />
          <Route path="/solutions" element={<Solutions />} />
          <Route path="/upcoming-contests" element={<UpcomingContests />} />
          <Route path="/rank-checker" element={<RankChecker />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}
