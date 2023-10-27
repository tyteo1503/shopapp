import { Role } from "src/app/model/role";

export interface UserResponse{
    id: string,
    fullname: string,
    phone_number: string,
    address: string,
    date_of_birth: Date,
    facebook_account_id: number,
    google_account_id: number,
    role: Role,
    is_active: boolean
}