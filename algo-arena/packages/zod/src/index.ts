import { addAdminType } from "./zodTypes/addAdminType";
import { createContestType } from "./zodTypes/createContest";
import { createSubmissionType } from "./zodTypes/createSubmission";
import { signinType } from "./zodTypes/signinUserTypes";
import { signupType } from "./zodTypes/signupUserType";
import { startContestType } from "./zodTypes/startContest";
import { contestSubmissionType } from "./zodTypes/submitContestSolution";

export const zodTypes = {
    signupType,
    signinType,
    createSubmissionType,
    addAdminType,
    createContestType,
    startContestType,
    contestSubmissionType
}

