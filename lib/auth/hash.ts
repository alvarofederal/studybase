import bcrypt from "bcryptjs";
import { createHash } from "crypto";

const SALT_ROUNDS = 12;

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS);
}

export async function comparePassword(
  password: string,
  hash: string
): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

// SHA-256 para armazenar tokens no banco (nunca armazenar o raw token)
export function hashToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

// Gera token URL-safe de N bytes (hex)
export function generateToken(bytes = 32): string {
  const { randomBytes } = require("crypto");
  return randomBytes(bytes).toString("hex");
}
