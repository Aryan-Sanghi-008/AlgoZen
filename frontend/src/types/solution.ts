import { Timestamp } from "firebase/firestore";

export interface SolutionType {
  id?: string;
  title: string;
  question_no: number;
  platform: "LeetCode" | "Codeforces" | "AtCoder" | "Codechef";
  contest_name: string;
  description: string;
  photo_urls?: string[];
  submission_url?: string;
  createdAt: Timestamp;
}
