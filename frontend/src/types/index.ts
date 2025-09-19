// Base types matching backend models
export interface Member {
  id: string;
  name: string;
  phoneNumber: string;
  email: string;
  balance: number;
  joiningDate: string;
  isActive: boolean;
}

export interface Game {
  id: string;
  name: string;
  price: number;
  description: string;
  genre: string;
  status: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  category: string;
  tags: string;
  price: number;
  stock: number;
}

export interface Recharge {
  id: string;
  memberId: string;
  amount: number;
  paymentMethod: string;
  date: string;
}

export interface Transaction {
  id: string;
  memberId: string;
  gameId: string;
  amount: number;
  date: string;
}

// DTO types
export interface MemberDto {
  id: string;
  name: string;
  phoneNumber: string;
  email: string;
  balance: number;
  joiningDate: string;
  isActive: boolean;
}

export interface GameDto {
  id: string;
  name: string;
  price: number;
  description: string;
}

export interface RechargeDto {
  id: string;
  amount: number;
  dateTime: string;
}

export interface PlayedHistoryDto {
  id: string;
  date_time: string;
  game_name: string;
  amount: number;
}

export interface MemberProfileDto {
  member: MemberDto;
  recharge_history: RechargeDto[];
  games: GameDto[];
  played_history: PlayedHistoryDto[];
}

export interface SearchRequestDto {
  phone: string;
}

// Frontend specific types
export type UserRole = 'USER' | 'ADMIN';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  phoneNumber: string;
  role: UserRole;
  balance?: number;
}

export interface LoginRequest {
  phoneNumber: string;
  password?: string; // For mock auth
  role: UserRole;
}

export interface RegisterRequest {
  name: string;
  phoneNumber: string;
  email: string;
  role: UserRole;
}

export interface RechargeRequest {
  memberId: string;
  amount: number;
  paymentMethod: string;
}

export interface GamePurchaseRequest {
  memberId: string;
  gameId: string;
  amount: number;
}

export interface ProductPurchaseRequest {
  memberId: string;
  productId: string;
  quantity: number;
  amount: number;
}

// UI State types
export interface Theme {
  mode: 'light' | 'dark';
}

export interface LoadingState {
  isLoading: boolean;
  error?: string;
}

export interface PaginationParams {
  page: number;
  limit: number;
  total?: number;
}

export interface FilterParams {
  search?: string;
  category?: string;
  genre?: string;
  status?: string;
  minPrice?: number;
  maxPrice?: number;
}

// API Response types
export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

export interface ApiError {
  message: string;
  status: number;
  details?: any;
}

// Form types
export interface FormField {
  name: string;
  label: string;
  type: 'text' | 'email' | 'tel' | 'number' | 'password' | 'select' | 'textarea';
  required?: boolean;
  placeholder?: string;
  options?: { value: string; label: string }[];
  validation?: {
    min?: number;
    max?: number;
    pattern?: string;
    message?: string;
  };
}

// Dashboard types
export interface DashboardStats {
  totalUsers: number;
  totalGames: number;
  totalProducts: number;
  totalRevenue: number;
  recentTransactions: Transaction[];
  activeUsers: number;
}

// Chart data types
export interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor?: string | string[];
    borderColor?: string | string[];
  }[];
}
