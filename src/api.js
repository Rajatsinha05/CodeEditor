import axios from "axios";
import { LANGUAGE_VERSIONS } from "./constants";

const API = axios.create({
  baseURL: "http://localhost:8090"
});

export const executeCode = async (language, code, inputData) => {


  console.log({language,code,inputData});
  console.log('language,code,inputData: ', language,code,inputData);
  console.log(JSON.stringify(code));
  try {
    const response = await API.post("/submit",  {language,code,inputData});
    console.log("res",response.data);
    return response.data;
   
  } catch (error) {
    console.error("Error executing code:", error);
    throw error;
  }
};
