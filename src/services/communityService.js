import api from "./api";

export const getPosts = async (page = 1, search = "") => {
  const response = await api.get("/community/posts", {
    params: {
      page,
      limit: 10,
      search,
    },
  });

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

export const getComments = async (postId) => {
  const response = await api.get(`/community/posts/${postId}/comments`);
  return response.data;
};

export const createComment = async (postId, content) => {
  const response = await api.post(
    `/community/posts/${postId}/comments`,
    { content }
  );

  return response.data;
};

export const updateComment = async (commentId, content) => {
  const response = await api.patch(
    `/community/comments/${commentId}`,
    { content }
  );

  return response.data;
};

export const deleteComment = async (commentId) => {
  const response = await api.delete(
    `/community/comments/${commentId}`
  );

  return response.data;
};