import { UserRole } from "../User/user.entity";

export const endPointRoles = {
    getAll: [UserRole.ADMIN],
    get: [UserRole.ADMIN, UserRole.AGENT, UserRole.BUYER],
    update: [UserRole.ADMIN, UserRole.AGENT, UserRole.BUYER],
}