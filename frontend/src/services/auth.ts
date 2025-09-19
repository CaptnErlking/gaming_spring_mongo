import { AuthUser, LoginRequest, RegisterRequest, UserRole } from '../types';
import toast from 'react-hot-toast';

// Mock users database
const mockUsers: AuthUser[] = [
  {
    id: '1',
    name: 'Admin User',
    email: 'admin@gamingclub.com',
    phoneNumber: '1234567890',
    role: 'ADMIN',
    balance: 10000,
  },
  {
    id: '2',
    name: 'John Gamer',
    email: 'john@gamingclub.com',
    phoneNumber: '9876543210',
    role: 'USER',
    balance: 500,
  },
  {
    id: '3',
    name: 'Jane Player',
    email: 'jane@gamingclub.com',
    phoneNumber: '5555555555',
    role: 'USER',
    balance: 250,
  },
];

class AuthService {
  private currentUser: AuthUser | null = null;

  constructor() {
    // Try to restore session from localStorage
    this.restoreSession();
  }

  private restoreSession() {
    const savedUser = localStorage.getItem('current_user');
    const savedToken = localStorage.getItem('auth_token');
    
    if (savedUser && savedToken) {
      try {
        this.currentUser = JSON.parse(savedUser);
      } catch (error) {
        console.error('Failed to restore user session:', error);
        this.clearSession();
      }
    }
  }

  private saveSession(user: AuthUser, token: string) {
    localStorage.setItem('current_user', JSON.stringify(user));
    localStorage.setItem('auth_token', token);
  }

  private clearSession() {
    localStorage.removeItem('current_user');
    localStorage.removeItem('auth_token');
    this.currentUser = null;
  }

  async login(credentials: LoginRequest): Promise<AuthUser> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Find user by phone number and role
        const user = mockUsers.find(
          u => u.phoneNumber === credentials.phoneNumber && u.role === credentials.role
        );

        if (!user) {
          reject(new Error('Invalid phone number or role'));
          return;
        }

        // Generate mock token
        const token = `mock_token_${user.id}_${Date.now()}`;
        
        this.currentUser = user;
        this.saveSession(user, token);
        
        toast.success(`Welcome back, ${user.name}!`);
        resolve(user);
      }, 1000); // Simulate network delay
    });
  }

  async register(userData: RegisterRequest): Promise<AuthUser> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Check if phone number already exists
        const existingUser = mockUsers.find(u => u.phoneNumber === userData.phoneNumber);
        if (existingUser) {
          reject(new Error('Phone number already registered'));
          return;
        }

        // Create new user
        const newUser: AuthUser = {
          id: (mockUsers.length + 1).toString(),
          name: userData.name,
          email: userData.email,
          phoneNumber: userData.phoneNumber,
          role: userData.role,
          balance: 0, // New users start with 0 balance
        };

        mockUsers.push(newUser);
        
        // Generate mock token
        const token = `mock_token_${newUser.id}_${Date.now()}`;
        
        this.currentUser = newUser;
        this.saveSession(newUser, token);
        
        toast.success(`Welcome to Gaming Club, ${newUser.name}!`);
        resolve(newUser);
      }, 1000);
    });
  }

  async logout(): Promise<void> {
    return new Promise((resolve) => {
      setTimeout(() => {
        this.clearSession();
        toast.success('Logged out successfully');
        resolve();
      }, 500);
    });
  }

  getCurrentUser(): AuthUser | null {
    return this.currentUser;
  }

  isAuthenticated(): boolean {
    return this.currentUser !== null;
  }

  hasRole(role: UserRole): boolean {
    return this.currentUser?.role === role;
  }

  isAdmin(): boolean {
    return this.hasRole('ADMIN');
  }

  isUser(): boolean {
    return this.hasRole('USER');
  }

  updateUserBalance(newBalance: number): void {
    if (this.currentUser) {
      this.currentUser.balance = newBalance;
      this.saveSession(this.currentUser, localStorage.getItem('auth_token') || '');
    }
  }

  // Mock password reset (not implemented in backend)
  async resetPassword(phoneNumber: string): Promise<void> {
    return new Promise((resolve) => {
      setTimeout(() => {
        toast.success('Password reset link sent to your phone');
        resolve();
      }, 1000);
    });
  }

  // Mock change password
  async changePassword(oldPassword: string, newPassword: string): Promise<void> {
    return new Promise((resolve) => {
      setTimeout(() => {
        toast.success('Password changed successfully');
        resolve();
      }, 1000);
    });
  }
}

// Create singleton instance
export const authService = new AuthService();
export default authService;
