import { UserRole } from "../User/user.entity";

export const endPointRoles = {
    get: [UserRole.ADMIN, UserRole.AGENT, UserRole.BUYER],
    create: [UserRole.ADMIN, UserRole.AGENT],
    update: [UserRole.ADMIN, UserRole.AGENT],
    delete: [UserRole.ADMIN],
}