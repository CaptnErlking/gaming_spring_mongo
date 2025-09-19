import axios, { AxiosInstance, AxiosResponse } from 'axios';
import toast from 'react-hot-toast';
import {
  Member,
  Game,
  Product,
  Recharge,
  Transaction,
  MemberProfileDto,
  SearchRequestDto,
  RechargeRequest,
  GamePurchaseRequest,
  ProductPurchaseRequest,
  ApiError,
} from '../types';

class ApiService {
  private api: AxiosInstance;
  private useMockApi: boolean;

  constructor() {
    this.useMockApi = import.meta.env.VITE_USE_MOCK_API === 'true';
    const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';
    
    this.api = axios.create({
      baseURL: this.useMockApi ? '/api' : baseURL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    // Request interceptor
    this.api.interceptors.request.use(
      (config) => {
        // Add auth token if available
        const token = localStorage.getItem('auth_token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor
    this.api.interceptors.response.use(
      (response: AxiosResponse) => {
        return response;
      },
      (error) => {
        const apiError: ApiError = {
          message: error.response?.data?.message || error.message || 'An error occurred',
          status: error.response?.status || 500,
          details: error.response?.data,
        };

        // Show error toast
        toast.error(apiError.message);

        return Promise.reject(apiError);
      }
    );
  }

  // Member endpoints
  async getMembers(): Promise<Member[]> {
    const response = await this.api.get('/members');
    return response.data;
  }

  async getMember(id: string): Promise<Member> {
    const response = await this.api.get(`/members/${id}`);
    return response.data;
  }

  async createMember(member: Omit<Member, 'id'>): Promise<Member> {
    const response = await this.api.post('/members', member);
    return response.data;
  }

  async updateMember(id: string, member: Partial<Member>): Promise<Member> {
    const response = await this.api.put(`/members/${id}`, member);
    return response.data;
  }

  async deleteMember(id: string): Promise<void> {
    await this.api.delete(`/members/${id}`);
  }

  async searchMemberByPhone(searchRequest: SearchRequestDto): Promise<MemberProfileDto> {
    const response = await this.api.post('/members/search', searchRequest);
    return response.data;
  }

  // Game endpoints
  async getGames(): Promise<Game[]> {
    const response = await this.api.get('/games');
    return response.data;
  }

  async getGame(id: string): Promise<Game> {
    const response = await this.api.get(`/games/${id}`);
    return response.data;
  }

  async createGame(game: Omit<Game, 'id'>): Promise<Game> {
    const response = await this.api.post('/games', game);
    return response.data;
  }

  async updateGame(id: string, game: Partial<Game>): Promise<Game> {
    const response = await this.api.put(`/games/${id}`, game);
    return response.data;
  }

  async deleteGame(id: string): Promise<void> {
    await this.api.delete(`/games/${id}`);
  }

  // Product endpoints
  async getProducts(): Promise<Product[]> {
    const response = await this.api.get('/products');
    return response.data;
  }

  async getProduct(id: string): Promise<Product> {
    const response = await this.api.get(`/products/${id}`);
    return response.data;
  }

  async createProduct(product: Omit<Product, 'id'>): Promise<Product> {
    const response = await this.api.post('/products', product);
    return response.data;
  }

  async updateProduct(id: string, product: Partial<Product>): Promise<Product> {
    const response = await this.api.put(`/products/${id}`, product);
    return response.data;
  }

  async deleteProduct(id: string): Promise<void> {
    await this.api.delete(`/products/${id}`);
  }

  // Recharge endpoints
  async getRecharges(): Promise<Recharge[]> {
    const response = await this.api.get('/recharges');
    return response.data;
  }

  async getRechargesByMember(memberId: string): Promise<Recharge[]> {
    const response = await this.api.get(`/recharges/member/${memberId}`);
    return response.data;
  }

  async createRecharge(recharge: RechargeRequest): Promise<Recharge> {
    const response = await this.api.post('/recharges', recharge);
    return response.data;
  }

  // Transaction endpoints
  async getTransactions(): Promise<Transaction[]> {
    const response = await this.api.get('/transactions');
    return response.data;
  }

  async getTransactionsByMember(memberId: string): Promise<Transaction[]> {
    const response = await this.api.get(`/transactions/member/${memberId}`);
    return response.data;
  }

  async createTransaction(transaction: Omit<Transaction, 'id'>): Promise<Transaction> {
    const response = await this.api.post('/transactions', transaction);
    return response.data;
  }

  // Business logic methods
  async purchaseGame(purchaseRequest: GamePurchaseRequest): Promise<Transaction> {
    // First create the transaction
    const transaction = await this.createTransaction({
      memberId: purchaseRequest.memberId,
      gameId: purchaseRequest.gameId,
      amount: purchaseRequest.amount,
      date: new Date().toISOString(),
    });

    // Update member balance (this would typically be handled by the backend)
    const member = await this.getMember(purchaseRequest.memberId);
    await this.updateMember(purchaseRequest.memberId, {
      ...member,
      balance: member.balance - purchaseRequest.amount,
    });

    return transaction;
  }

  async purchaseProduct(purchaseRequest: ProductPurchaseRequest): Promise<Transaction> {
    // Create transaction for product purchase
    const transaction = await this.createTransaction({
      memberId: purchaseRequest.memberId,
      gameId: '', // Products don't have gameId, using empty string
      amount: purchaseRequest.amount,
      date: new Date().toISOString(),
    });

    // Update member balance
    const member = await this.getMember(purchaseRequest.memberId);
    await this.updateMember(purchaseRequest.memberId, {
      ...member,
      balance: member.balance - purchaseRequest.amount,
    });

    // Update product stock
    const product = await this.getProduct(purchaseRequest.productId);
    await this.updateProduct(purchaseRequest.productId, {
      ...product,
      stock: product.stock - purchaseRequest.quantity,
    });

    return transaction;
  }
}

// Create singleton instance
export const apiService = new ApiService();
export default apiService;
