import { z } from "zod";

export const createSubmissionType = z.object({
    problemId: z.string({ message: "Problem ID not provided" }).trim(),
    language: z.enum(['rust', 'javascript'], { message: "Language must be 'rust' or 'javascript'" }),
    code: z.string({ message: "Code not provided" }).trim()
});
