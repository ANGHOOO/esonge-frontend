import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const AUTH_STORAGE_KEY = 'auth';

export interface User {
  id: string;
  email: string;
  name: string;
  phone: string;
  createdAt: string;
}

export interface Address {
  id: string;
  name: string;
  recipient: string;
  phone: string;
  zipCode: string;
  address: string;
  addressDetail: string;
  isDefault: boolean;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  addresses: Address[];

  // Auth Actions
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  updateProfile: (data: Partial<Pick<User, 'name' | 'phone'>>) => void;

  // Address Actions
  addAddress: (address: Omit<Address, 'id'>) => void;
  updateAddress: (id: string, data: Partial<Omit<Address, 'id'>>) => void;
  removeAddress: (id: string) => void;
  setDefaultAddress: (id: string) => void;
  getDefaultAddress: () => Address | undefined;
}

// Mock user for demo purposes
const MOCK_USER: User = {
  id: 'user-1',
  email: 'demo@esonge.com',
  name: '홍길동',
  phone: '010-1234-5678',
  createdAt: '2024-01-15T09:00:00Z',
};

const MOCK_ADDRESSES: Address[] = [
  {
    id: 'addr-1',
    name: '집',
    recipient: '홍길동',
    phone: '010-1234-5678',
    zipCode: '12345',
    address: '강원특별자치도 춘천시 중앙로 1',
    addressDetail: '101동 1001호',
    isDefault: true,
  },
  {
    id: 'addr-2',
    name: '회사',
    recipient: '홍길동',
    phone: '010-1234-5678',
    zipCode: '54321',
    address: '서울특별시 강남구 테헤란로 123',
    addressDetail: '10층',
    isDefault: false,
  },
];

export const useAuth = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      addresses: [],

      login: async (email: string, _password: string) => {
        // Mock login - in real app, this would call an API
        await new Promise((resolve) => setTimeout(resolve, 500));

        // Demo credentials: demo@esonge.com / any password
        if (email === 'demo@esonge.com') {
          set({
            user: MOCK_USER,
            isAuthenticated: true,
            addresses: MOCK_ADDRESSES,
          });
          return true;
        }

        return false;
      },

      logout: () => {
        set({
          user: null,
          isAuthenticated: false,
          addresses: [],
        });
      },

      updateProfile: (data) => {
        set((state) => {
          if (!state.user) return state;
          return {
            user: { ...state.user, ...data },
          };
        });
      },

      addAddress: (addressData) => {
        const newAddress: Address = {
          ...addressData,
          id: `addr-${Date.now()}`,
        };

        set((state) => {
          // If this is the first address or marked as default, update others
          const updatedAddresses = newAddress.isDefault
            ? state.addresses.map((addr) => ({ ...addr, isDefault: false }))
            : state.addresses;

          return {
            addresses: [...updatedAddresses, newAddress],
          };
        });
      },

      updateAddress: (id, data) => {
        set((state) => {
          const addresses = state.addresses.map((addr) => {
            if (addr.id === id) {
              return { ...addr, ...data };
            }
            // If updating to default, remove default from others
            if (data.isDefault && addr.id !== id) {
              return { ...addr, isDefault: false };
            }
            return addr;
          });
          return { addresses };
        });
      },

      removeAddress: (id) => {
        set((state) => {
          const addresses = state.addresses.filter((addr) => addr.id !== id);
          // If removed address was default and there are others, set first as default
          if (addresses.length > 0 && !addresses.some((addr) => addr.isDefault)) {
            addresses[0].isDefault = true;
          }
          return { addresses };
        });
      },

      setDefaultAddress: (id) => {
        set((state) => ({
          addresses: state.addresses.map((addr) => ({
            ...addr,
            isDefault: addr.id === id,
          })),
        }));
      },

      getDefaultAddress: () => {
        return get().addresses.find((addr) => addr.isDefault);
      },
    }),
    {
      name: AUTH_STORAGE_KEY,
    }
  )
);
