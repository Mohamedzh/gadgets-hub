import axios from "axios";

export const searchPhones = async (query: string) => {
  const res = await axios.get(`/api/searchPhones?name=${query}`);
  return res.data;
};
