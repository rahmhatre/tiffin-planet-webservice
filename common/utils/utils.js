export const errorHandler = (response, statusCode, message) => {
  return response.status(statusCode).json({ message });
};
