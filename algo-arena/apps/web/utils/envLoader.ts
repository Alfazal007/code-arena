import { configDotenv } from "dotenv";

configDotenv({
    path: ".env"
})

export const envFiles = {
    accessTokenSecret: process.env.ACCESSTOKENSECRET as string,
    refreshTokenSecret: process.env.REFRESHTOKENSECRET as string,
}

