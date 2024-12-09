import { z } from "zod";

export const signupType = z.object({
    username: z.string({ message: "Username not provided" }).trim().min(6, { message: "Minimum length of username is 6" }).max(20, { message: "Maximum length of username is 20" }).toLowerCase(),
    email: z.string({ message: "Email not provided" }).email({ message: "Invalid email" }),
    password: z.string({ message: "Password not provided" }).min(6, { message: "The minimum length of password is 6" }).max(20, { message: "The maximum length of password if 20" })
})
