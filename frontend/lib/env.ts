// Environment variables configuration
export const env = {
  // Supabase Configuration
  SUPABASE_URL: "https://rhciftnyuwefkckphped.supabase.co",
  SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY!,

  // Database Configuration
  DATABASE_URL:
    "postgresql://postgres.rhciftnyuwefkckphped:08200108dyekrane@aws-0-eu-central-1.pooler.supabase.com:6543/postgres",

  // JWT Configuration
  JWT_SECRET: process.env.JWT_SECRET || "your-jwt-secret-key-change-in-production",

  // Application Configuration
  NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",

  // Email Configuration (for future use)
  SMTP_HOST: process.env.SMTP_HOST,
  SMTP_PORT: process.env.SMTP_PORT,
  SMTP_USER: process.env.SMTP_USER,
  SMTP_PASS: process.env.SMTP_PASS,

  // File Upload Configuration
  MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_FILE_TYPES: ["pdf", "jpg", "jpeg", "png", "doc", "docx"],
}

// Validate required environment variables
export function validateEnv() {
  const required = ["NEXT_PUBLIC_SUPABASE_ANON_KEY", "SUPABASE_SERVICE_ROLE_KEY"]

  const missing = required.filter((key) => !process.env[key])

  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(", ")}`)
  }
}
