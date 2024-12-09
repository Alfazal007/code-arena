import { z } from "zod";

export const startContestType = z.object({
    contestId: z.string({ message: "Contest Id not provided" }).trim(),
});
