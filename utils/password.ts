import {compare, hash} from "bcryptjs";

export async function passwordHash(password: string): Promise<string> {
    return hash(password, 10)
}

export async function passwordVerify(password: string, hash: string): Promise<boolean> {
    return compare(password, hash)
}