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
    console.log("response: " + response.data);

    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getCodeResult = async (requestId) => {
  try {
    const response = await axiosInstance.get(`/result/${requestId}`);
    console.log("Fetched result: ", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching result: ", error.response?.data || error.message);
    throw error;
  }
};