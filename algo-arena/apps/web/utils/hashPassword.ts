import bcryptjs from "bcryptjs"

export async function hashPassword(password: string): Promise<string> {
    const salt = await bcryptjs.genSalt(12);
    const hashedPassword = await bcryptjs.hash(password, salt);
    return hashedPassword;
}

export async function compareHashPassword(password: string, hashedPassword: string): Promise<boolean> {
    const isVerified = await bcryptjs.compare(password, hashedPassword);
    return isVerified;
}
