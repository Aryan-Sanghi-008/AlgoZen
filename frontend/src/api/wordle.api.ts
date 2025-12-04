import axios from "axios";

const WORDLE_API_BASE_URL =
  "https://raw.githubusercontent.com/tabatkins/wordle-list/";
const api = axios.create({ baseURL: WORDLE_API_BASE_URL });

export const getWordListAPI = async () => {
  return api.get("/main/words");
};
