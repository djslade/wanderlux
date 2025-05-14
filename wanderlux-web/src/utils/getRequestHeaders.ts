export const getRequestHeaders = (bearerToken?: string) => {
  const headers = new Headers({
    "Content-Type": "application/json",
  });

  if (bearerToken) {
    headers.set("Authorization", "Bearer " + bearerToken);
  }

  return headers;
};
