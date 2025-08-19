import axios from "axios";
import { BACKEND_URL } from "../constants";

export const HttpService = axios.create({
  baseURL: BACKEND_URL + "/api/v1",
  headers: {
    "Content-Type": "application/json",
  },
});
