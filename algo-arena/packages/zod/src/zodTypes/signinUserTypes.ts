import { z } from "zod";

export const signinType = z.object({
    username: z.string({ message: "Username not provided" }).trim().toLowerCase(),
    password: z.string({ message: "Password not provided" }).min(6, { message: "The minimum length of password is 6" }).max(20, { message: "The maximum length of password if 20" })
})
