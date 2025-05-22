import crypto from "crypto";

if (!process.env.ALGORITHM) {
  throw new Error("Missing required environment variable: ALGORITHM");
}
const algorithm = process.env.ALGORITHM;
const secretKey = process.env.ENCRYPTION_SECRET_KEY!;
const iv = crypto.randomBytes(16); // Initialization vector

export const encrypt = (text: string) => {
  const cipher = crypto.createCipheriv(
    algorithm,
    Buffer.from(secretKey, "hex"),
    iv
  );
  let encrypted = cipher.update(text, "utf8", "hex");
  encrypted += cipher.final("hex");

  return {
    iv: iv.toString("hex"),
    content: encrypted,
  };
};

export const decrypt = (hash: { iv: string; content: string }) => {
  const decipher = crypto.createDecipheriv(
    algorithm,
    Buffer.from(secretKey, "hex"),
    Buffer.from(hash.iv, "hex")
  );

  let decrypted = decipher.update(hash.content, "hex", "utf8");
  decrypted += decipher.final("utf8");

  return decrypted;
};
