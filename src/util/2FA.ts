import * as crypto from "node:crypto";
import { encode } from "hi-base32";
import { authenticator } from "otplib";
import QRCode from "qrcode";
import {User} from "discord.js";
import {BackupCode} from "@prisma/client";
import {prisma} from "../Bot";

const MASTER_KEY: string = process.env.OTP_MASTER_KEY!;
if (!MASTER_KEY) throw new Error("MASTER_KEY env var required");

authenticator.options = {
    step: 30,
    digits: 6,
    window: 2 /* Accept +/-2 time step to combat small clock drift */
};

/**
 * Derive a 20-byte secret based on user ID and return a Base32 secret (no padding)
 * @param userId Discord User ID
 * @param version Master key version
 */
export const deriveSecretFromUser = (userId: string, version: string = "v1"): string => {
   const h = crypto.createHmac("sha256", Buffer.from(MASTER_KEY, "utf-8"));
    h.update(`${userId}::${version}`);
    const secretBytes: Buffer = h.digest().subarray(0, 20);
    return encode(secretBytes).replace(/=+$/g, "");
};

/**
 * Verify a 6-digit TOTP token against a Base32 secret for the current epoch time.
 * @param token TOTP Token
 * @param secret TOTP Secret
 */
export const verifyTOTP = async (token: string, secret: string): Promise<boolean> => {
    const cleaned = token.trim().replace(/\s+/g, "");
    //
    if (!/^\d{6}$/.test(cleaned)) return false;
    return authenticator.verify({ token: cleaned, secret });
};

/**
 * Generate a cryptographically secure pseudorandom 12-character backup key.
 * @returns string
 */
export const generateBackupKey = (): string => {
    return crypto.randomBytes(6).toString("hex"); // ~12 hex chars
};

/**
 * Generate OTP authenticator URI to be used by 2FA apps like Authy, Google Authenticator, etc.
 * @param secret TOTP Secret
 * @param username Username
 * @param issuer Issuer
 */
export const generateOTPAuthURI = (secret: string, username: string, issuer = 'CMTZ'): string => {
    return authenticator.keyuri(`[2016FordExplorer]: ${username}`, issuer, secret);
}

/**
 * Generate a QR Code image returned as a Buffer (.png format only).
 * @param text Data to be encoded
 * @returns Promise<Buffer>
 */
export const generateQRCode = (text: string): Promise<Buffer> => {
    return QRCode.toBuffer(text);
}

/**
 * Get a user's hashed backup code
 * @param user User
 * @returns {Promise<BackupCode | null>}
 */
export const getBackupCode = async (user: User): Promise<BackupCode | null> => {
    return prisma.backupCode.findUnique({
        where: {
            userId: user.id
        }
    })
}

