import dotenv from "dotenv";

dotenv.config();

const { APP_TOKEN, APP_ID, GUILD_ID } = process.env;

if (!APP_TOKEN || !APP_ID || !GUILD_ID) {
  throw new Error("Missing environment variables");
}

export const config = {
  APP_TOKEN,
  APP_ID,
  GUILD_ID,
};
