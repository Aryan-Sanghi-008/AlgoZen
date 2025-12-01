import axios from "axios";

const LEETCODE_API_BASE_URL = "/api/leetcode-proxy";
const api = axios.create({ baseURL: LEETCODE_API_BASE_URL });

/* ------------------------ 1. Latest Contests ------------------------ */
export const getLatestContestsAPI = async ({
  page,
  limit,
}: {
  page: number;
  limit: number;
}) => {
  return api.get("/contests/", {
    params: {
      skip: (page - 1) * limit,
      limit,
    },
  });
};

/* ------------------------ 2. Contest Participants ------------------------ */
export const getParticipantsByContestAPI = async ({
  contest,
  page,
  limit,
}: {
  contest: string;
  page: number;
  limit: number;
}) => {
  return api.get("/contest-records/", {
    params: {
      contest_name: contest,
      archived: false,
      skip: (page - 1) * limit,
      limit,
    },
  });
};

/* ------------------------ 3. Find user in contest ------------------------ */
export const getUserByContestAPI = async ({
  contest,
  username,
}: {
  contest: string;
  username: string;
}) => {
  return api.get("/contest-records/", {
    params: {
      contest_name: contest,
      username,
      archived: false,
    },
  });
};

/* ------------------------ 4. Questions solved in contest ------------------------ */
export const getQuestionsSolvedByContestAPI = async ({
  contest,
}: {
  contest: string;
}) => {
  return api.post("/questions", { contest_name: contest });
};

/* ------------------------ 5. Contest Users Count ------------------------ */
export const getContestUsersCount = async ({
  contest,
}: {
  contest: string;
}) => {
  return api.get("/contest-records/count", {
    params: {
      contest_name: contest,
      archived: false,
    },
  });
};

/* ------------------------ 6. Contest Count ------------------------ */
export const getContestsCount = async () => {
  return api.get("/contests/count");
};
