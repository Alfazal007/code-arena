import { z } from "zod";

export const contestSubmissionType = z.object({
    contestId: z.string({ message: "Contest ID not provided" }).trim(),
    language: z.enum(['rust', 'javascript'], { message: "Language must be 'rust' or 'javascript'" }),
    code: z.string({ message: "Code not provided" }).trim()
});
