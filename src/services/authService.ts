export const getCurrentUser = async () => {
  const user = localStorage.getItem("user");
  return JSON.parse(user);
};
