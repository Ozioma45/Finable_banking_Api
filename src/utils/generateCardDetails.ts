export const generateCardNumber = (): string => {
  return Array(4)
    .fill(null)
    .map(() => Math.floor(1000 + Math.random() * 9000))
    .join(""); // 16-digit card
};

export const generateCVV = (): string => {
  return Math.floor(100 + Math.random() * 900).toString(); // 3-digit CVV
};

export const getExpiryDate = (): string => {
  const now = new Date();
  const expiry = new Date(now.setFullYear(now.getFullYear() + 3));
  return `${expiry.getMonth() + 1}/${expiry.getFullYear()}`; // MM/YYYY
};
