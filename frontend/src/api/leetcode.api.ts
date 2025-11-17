import axios from "axios";

const LEETCODE_API_BASE_URL = "/api/leetcode-proxy";
const api = axios.create({ baseURL: LEETCODE_API_BASE_URL });

/* ------------------------ 1. Latest Contests ------------------------ */
export const getLatestContestsAPI = async (page: number, size: number) => {
  return api.get("/contests/", {
    params: {
      skip: (page - 1) * size,
      limit: size,
    },
  });
};

/* ------------------------ 2. Contest Participants ------------------------ */
export const getParticipantsByContestAPI = async (
  contest_name: string,
  page: number,
  size: number
) => {
  return api.get("/contest-records/", {
    params: {
      contest_name,
      archived: false,
      skip: (page - 1) * size,
      limit: size,
    },
  });
};

/* ------------------------ 3. Find user in contest ------------------------ */
export const getUserByContestAPI = async (
  contest_name: string,
  username: string
) => {
  return api.get("/contest-records/", {
    params: {
      contest_name,
      username,
      archived: false,
    },
  });
};

/* ------------------------ 4. Questions solved in contest ------------------------ */
export const getQuestionsSolvedByContestAPI = async (payload: {
  contest_name: string;
}) => {
  return api.post("/questions", payload);
};
