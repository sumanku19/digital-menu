import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  // -------------------------
  // SERVER VARIABLES (SECURE)
  // -------------------------
  server: {
    DATABASE_URL: z.string().url(),

    EMAIL_SERVER_HOST: z.string(),
    EMAIL_SERVER_PORT: z.string(),
    EMAIL_SERVER_USER: z.string(),
    EMAIL_SERVER_PASSWORD: z.string(),
    EMAIL_FROM: z.string(),

    NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  },

  // -------------------------
  // CLIENT VARIABLES (PUBLIC)
  // -------------------------
  client: {
    NEXT_PUBLIC_BASE_URL: z.string().url(),
  },

  // -------------------------
  // Runtime values provided by system
  // -------------------------
  runtimeEnv: {
    DATABASE_URL: process.env.DATABASE_URL,

    EMAIL_SERVER_HOST: process.env.EMAIL_SERVER_HOST,
    EMAIL_SERVER_PORT: process.env.EMAIL_SERVER_PORT,
    EMAIL_SERVER_USER: process.env.EMAIL_SERVER_USER,
    EMAIL_SERVER_PASSWORD: process.env.EMAIL_SERVER_PASSWORD,
    EMAIL_FROM: process.env.EMAIL_FROM,

    NEXT_PUBLIC_BASE_URL: process.env.NEXT_PUBLIC_BASE_URL,

    NODE_ENV: process.env.NODE_ENV,
  },

  skipValidation: !!process.env.SKIP_ENV_VALIDATION,
  emptyStringAsUndefined: true,
});
