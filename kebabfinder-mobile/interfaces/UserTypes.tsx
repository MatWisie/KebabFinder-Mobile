export interface UserData{
    id: number;
    name: string;
    is_admin: number;
  }

export interface UserName{
  name: string;
}

export interface UserPasswordChange{
  current_password: string,
  new_password: string,
  new_password_confirmation: string
}