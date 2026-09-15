import {z} from "zod";

export const changePasswordSchema = z.object({
    oldPassword: z.string(),
    newPassword: z.string(),
    newPasswordConfirmation: z.string(),
}).refine(o => o.newPassword === o.newPasswordConfirmation, {
    message: 'Passwords do not match',
    path: ['newPasswordConfirmation']
})