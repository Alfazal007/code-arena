import { configDotenv } from "dotenv";
configDotenv()

export const envFiles = {
    apiKey: process.env.APIKEY as string,
    apiHost: process.env.APIHOST as string
}
