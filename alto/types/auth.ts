export interface User { id: string; fullName: string; email: string; phone: string; }
export interface AuthSession { token: string; user: User; }
