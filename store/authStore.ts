import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface OrderItem {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  size: string;
  color: string;
}

export interface Order {
  id: string;
  date: string;
  total: number;
  status: 'Processing' | 'Shipped' | 'Delivered';
  items: OrderItem[];
}

export interface User {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  orders: Order[];
  login: (user: User) => void;
  logout: () => void;
  addOrder: (order: Order) => void;
}

// Generate some mock orders for a new user to make the profile look realistic
const generateMockOrders = (): Order[] => [
  {
    id: 'ORD-8F92A1',
    date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(), // 3 days ago
    total: 350.00,
    status: 'Shipped',
    items: [
      {
        id: 'mock-item-1',
        name: 'Monochrome Wool Coat',
        price: 250.0,
        image: 'https://images.unsplash.com/photo-1539533113208-f6df8cc8b543?w=800&q=80',
        quantity: 1,
        size: 'M',
        color: 'Black'
      },
      {
        id: 'mock-item-2',
        name: 'Silk Blend Scarf',
        price: 100.0,
        image: 'https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?w=800&q=80',
        quantity: 1,
        size: 'One Size',
        color: 'White'
      }
    ]
  },
  {
    id: 'ORD-44B9E3',
    date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 15).toISOString(), // 15 days ago
    total: 125.00,
    status: 'Delivered',
    items: [
      {
        id: 'mock-item-3',
        name: 'Classic White Sneakers',
        price: 125.0,
        image: 'https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=800&q=80',
        quantity: 1,
        size: '9',
        color: 'White'
      }
    ]
  }
];

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      user: null,
      orders: [],

      login: (userData) => set({
        isAuthenticated: true,
        user: userData,
        // If it's a new login to the mock system, populate fake orders so it's not empty
        orders: generateMockOrders()
      }),

      logout: () => set({
        isAuthenticated: false,
        user: null,
        orders: []
      }),

      addOrder: (order) => set((state) => ({
        orders: [order, ...state.orders]
      })),
    }),
    {
      name: 'aura-auth-storage',
    }
  )
);
