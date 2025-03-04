import { UserRole } from "../User/user.entity";

export const endPointRoles = {
    get: [UserRole.ADMIN, UserRole.AGENT, UserRole.BUYER],
    create: [UserRole.AGENT],
    update: [UserRole.ADMIN, UserRole.AGENT],
    delete: [UserRole.ADMIN, UserRole.AGENT],
    favorite: [UserRole.BUYER]
}