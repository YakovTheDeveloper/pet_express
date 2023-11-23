import crypto from "crypto";
import jwt from "jsonwebtoken";

// User.afterCreate(async user => {
//     //@ts-ignore
//     const token = jwt.sign({ userId: user.id }, 'your-secret-key');
//     //@ts-ignore
//     user.token = token;
//     await user.save();
// });
export function generateToken(userId: string) {
  return jwt.sign({ userId }, "ZXCFOODISGOODZXC", { algorithm: "HS256" });
}

export function validateToken(token: string) {
  try {
    jwt.verify(token, "ZXCFOODISGOODZXC");
    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
}

export function validatePassword(password: string, originalPassword: string) {
  // original user password is a string like salt:hash
  const [salt, originalHash] = originalPassword.split(":");

  const hash = crypto
    .pbkdf2Sync(password, salt, 1000, 64, "sha512")
    .toString("hex");

  return hash === originalHash;
}

export function hashPassword(password: string) {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto
    .pbkdf2Sync(password, salt, 1000, 64, "sha512")
    .toString("hex");
  return `${salt}:${hash}`;
}

export function getIdFromToken(token: string): string | null {
  try {
    const decoded = jwt.verify(token, "ZXCFOODISGOODZXC") as { userId: string };
    return decoded.userId;
  } catch (error) {
    return '';
  }
}
