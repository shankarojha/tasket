import jwt from "jsonwebtoken";

interface UserPayload {
  id: string;
  role: string;
}

const JWT_SECRET = process.env.JWT_SECRET as string;

if (!JWT_SECRET) {
  throw new Error("missing key");
}

// GENERATING NEW TOKEN
export const generateToken = (user: UserPayload): string => {
  return jwt.sign(user, JWT_SECRET, { expiresIn: "6h" });
};

// VERIFYING TOKEN
export const verifyToken = (token: string): UserPayload | null => {
  try {
    return jwt.verify(token, JWT_SECRET) as UserPayload;
  } catch (error) {
    console.error("Invalid token:", error);
    return null;
  }
};
