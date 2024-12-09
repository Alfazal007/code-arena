import { z } from "zod";

export const createContestType = z.object({
    problemId: z.string({ message: "Problem Id not provided" }).trim(),
});
