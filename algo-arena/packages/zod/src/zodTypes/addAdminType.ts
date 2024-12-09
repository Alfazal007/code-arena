import { z } from "zod";

export const addAdminType = z.object({
    username: z.string({ message: "Username not provided" }).trim().toLowerCase(),
});
