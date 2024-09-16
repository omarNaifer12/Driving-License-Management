import axios from "axios";
import { BASE_URL } from "./config";
  export const getDataAPI=async(url)=>{
    const  res=await axios.get(`${BASE_URL}/api/${url}`);
    return res;
  };
  export const postDataAPI = async (url, data) => {
    const  res = await axios.post(`${BASE_URL}/api/${url}`, data);
    return res;
  };
  
  export const putDataAPI = async (url, data) => {
    const  res = await axios.put(`${BASE_URL}/api/${url}`, data);
    return res;
  };
  
  export const deleteDataAPI = async (url) => {
    const  res = await axios.delete(`${BASE_URL}/api/${url}`);
    return res;
  };