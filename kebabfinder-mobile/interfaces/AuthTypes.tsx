export interface UserRegisterData {
    name: string;
    email: string;
    password: string;
    password_confirmation: string;
  }

  export interface UserLoginData{
    name: string;
    password: string;
  }

  export interface LoginViewProps {
    onLogin: () => void; 
  }


