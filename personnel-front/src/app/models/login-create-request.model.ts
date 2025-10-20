//src/app/model/login-create-request.model.ts
import { Role } from "./role.model";

export interface LoginCreateRequest {
    name: string;
    email: string;
    roles: Role[];
    password: string;
}