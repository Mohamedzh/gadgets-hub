import axios from "axios";

export const searchPhones = async (query: string) => {
  const res = await axios.get(`/api/searchPhones?name=${query}`);
  return res.data;
};

export const getComparePhoneData = async (url: String) => {
  const res = await axios.get(`/api/phone?name=${url}`);
  return res.data.phone;
};
