import axios from "axios";
import { LANGUAGE_VERSIONS } from "./constants";
import Cookie from "js-cookie";

const API = axios.create({
  baseURL: "http://localhost:8090",
});

export const executeCode = async (language, code, inputData, token) => {
  try {
    const response = await API.post(
      "/submit",
      { language, code, inputData },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    
    return response.data;
  } catch (error) {
    
    throw error;
  }
};
