import api from "@/shared/config/axios.config";

export const searchService = async (query) => {
  const res = await api.get(`/search?q=${query}`);
  console.log("API CALL:", query);
  return res.data;
};
