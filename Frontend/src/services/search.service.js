import api from "../configs/axios.config";

export const searchService = async (query) => {
  const res = await api.get(`/search?q=${query}`);
  console.log("API CALL:", query);
  return res.data;
};
