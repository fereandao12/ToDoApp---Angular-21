export interface AuthResponse {
  token: string;
  expiresInMinutes: number;
}

export interface UserAuth {
  username: string;
  password?: string;
}
