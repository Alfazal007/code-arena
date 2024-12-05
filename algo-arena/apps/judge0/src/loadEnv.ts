import { configDotenv } from "dotenv";
configDotenv()

export const envFiles = {
    apiKey: process.env.APIKEY,
    apiHost: process.env.APIHOST
}
