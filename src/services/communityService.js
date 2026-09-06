import api from "./api";

/**
 * Community API Service
 * Handles CRUD operations for learner journey posts
 */

export const getPosts = async (params = {}) => {
  const response = await api.get("/community/posts", { params });
  return response.data;
};

export const getMyPosts = async () => {
  const response = await api.get("/community/posts/me");
  return response.data;
};

export const getPost = async (id) => {
  const response = await api.get(`/community/posts/${id}`);
  return response.data;
};

export const createPost = async (postData) => {
  const response = await api.post("/community/posts", postData);
  return response.data;
};

export const updatePost = async (id, postData) => {
  const response = await api.patch(`/community/posts/${id}`, postData);
  return response.data;
};

export const deletePost = async (id) => {
  const response = await api.delete(`/community/posts/${id}`);
  return response.data;
};
export const toggleReaction = async (postId) => {
   const response = await api.post(`/community/posts/${postId}/reaction`);
  return response.data;
};