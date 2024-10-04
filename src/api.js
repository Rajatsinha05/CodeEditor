import axios from "axios";
import { LANGUAGE_VERSIONS } from "./constants";
import Cookie from "js-cookie";
import axiosInstance from "./config/axiosConfig";


export const executeCode = async (language, code, inputData) => {
  try {
    const response = await axiosInstance.post("/submit", {
      language,
      code,
      inputData,
    });

    return response.data;
  } catch (error) {
    throw error;
  }
};
