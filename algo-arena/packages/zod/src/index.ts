import { addAdminType } from "./zodTypes/addAdminType";
import { createSubmissionType } from "./zodTypes/createSubmission";
import { signinType } from "./zodTypes/signinUserTypes";
import { signupType } from "./zodTypes/signupUserType";

export const zodTypes = {
    signupType,
    signinType,
    createSubmissionType,
    addAdminType
}

