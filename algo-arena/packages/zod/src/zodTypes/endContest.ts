import { z } from "zod";

export const endContestType = z.object({
    contestId: z.string({ message: "Contest Id not provided" }).trim(),
});
