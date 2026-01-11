import { describe, it, expect, beforeEach } from 'vitest';
import { act } from '@testing-library/react';
import { useAuth, type Address } from './useAuth';

describe('useAuth', () => {
  beforeEach(() => {
    // Reset store before each test
    act(() => {
      useAuth.getState().logout();
    });
  });

  describe('login', () => {
    it('should login successfully with demo credentials', async () => {
      let result: boolean = false;

      await act(async () => {
        result = await useAuth.getState().login('demo@esonge.com', 'anypassword');
      });

      expect(result).toBe(true);
      expect(useAuth.getState().isAuthenticated).toBe(true);
      expect(useAuth.getState().user).not.toBeNull();
      expect(useAuth.getState().user?.email).toBe('demo@esonge.com');
      expect(useAuth.getState().addresses.length).toBeGreaterThan(0);
    });

    it('should fail login with wrong credentials', async () => {
      let result: boolean = true;

      await act(async () => {
        result = await useAuth.getState().login('wrong@email.com', 'password');
      });

      expect(result).toBe(false);
      expect(useAuth.getState().isAuthenticated).toBe(false);
      expect(useAuth.getState().user).toBeNull();
    });
  });

  describe('logout', () => {
    it('should clear user data on logout', async () => {
      // First login
      await act(async () => {
        await useAuth.getState().login('demo@esonge.com', 'password');
      });

      // Then logout
      act(() => {
        useAuth.getState().logout();
      });

      expect(useAuth.getState().isAuthenticated).toBe(false);
      expect(useAuth.getState().user).toBeNull();
      expect(useAuth.getState().addresses).toHaveLength(0);
    });
  });

  describe('updateProfile', () => {
    beforeEach(async () => {
      await act(async () => {
        await useAuth.getState().login('demo@esonge.com', 'password');
      });
    });

    it('should update user name', () => {
      act(() => {
        useAuth.getState().updateProfile({ name: '김철수' });
      });

      expect(useAuth.getState().user?.name).toBe('김철수');
    });

    it('should update user phone', () => {
      act(() => {
        useAuth.getState().updateProfile({ phone: '010-9999-8888' });
      });

      expect(useAuth.getState().user?.phone).toBe('010-9999-8888');
    });

    it('should update multiple fields at once', () => {
      act(() => {
        useAuth.getState().updateProfile({ name: '이영희', phone: '010-1111-2222' });
      });

      expect(useAuth.getState().user?.name).toBe('이영희');
      expect(useAuth.getState().user?.phone).toBe('010-1111-2222');
    });

    it('should not update profile when user is null', () => {
      act(() => {
        useAuth.getState().logout();
        useAuth.getState().updateProfile({ name: '테스트' });
      });

      expect(useAuth.getState().user).toBeNull();
    });
  });

  describe('addAddress', () => {
    const newAddress: Omit<Address, 'id'> = {
      name: '새 주소',
      recipient: '테스트',
      phone: '010-1111-1111',
      zipCode: '11111',
      address: '서울시 종로구',
      addressDetail: '1층',
      isDefault: false,
    };

    beforeEach(async () => {
      await act(async () => {
        await useAuth.getState().login('demo@esonge.com', 'password');
      });
    });

    it('should add new address', () => {
      const initialCount = useAuth.getState().addresses.length;

      act(() => {
        useAuth.getState().addAddress(newAddress);
      });

      expect(useAuth.getState().addresses.length).toBe(initialCount + 1);
    });

    it('should generate unique id for new address', () => {
      act(() => {
        useAuth.getState().addAddress(newAddress);
      });

      const addedAddress = useAuth.getState().addresses.find((addr) => addr.name === '새 주소');
      expect(addedAddress?.id).toBeDefined();
      expect(addedAddress?.id).toMatch(/^addr-\d+$/);
    });

    it('should set others to non-default when adding default address', () => {
      act(() => {
        useAuth.getState().addAddress({ ...newAddress, isDefault: true });
      });

      const { addresses } = useAuth.getState();
      const defaultAddresses = addresses.filter((addr) => addr.isDefault);
      expect(defaultAddresses).toHaveLength(1);
      expect(defaultAddresses[0].name).toBe('새 주소');
    });
  });

  describe('updateAddress', () => {
    beforeEach(async () => {
      await act(async () => {
        await useAuth.getState().login('demo@esonge.com', 'password');
      });
    });

    it('should update address name', () => {
      const firstAddressId = useAuth.getState().addresses[0].id;

      act(() => {
        useAuth.getState().updateAddress(firstAddressId, { name: '업데이트된 주소' });
      });

      const updatedAddress = useAuth
        .getState()
        .addresses.find((addr) => addr.id === firstAddressId);
      expect(updatedAddress?.name).toBe('업데이트된 주소');
    });

    it('should set others to non-default when updating to default', () => {
      const secondAddressId = useAuth.getState().addresses[1].id;

      act(() => {
        useAuth.getState().updateAddress(secondAddressId, { isDefault: true });
      });

      const { addresses } = useAuth.getState();
      const defaultAddresses = addresses.filter((addr) => addr.isDefault);
      expect(defaultAddresses).toHaveLength(1);
      expect(defaultAddresses[0].id).toBe(secondAddressId);
    });
  });

  describe('removeAddress', () => {
    beforeEach(async () => {
      await act(async () => {
        await useAuth.getState().login('demo@esonge.com', 'password');
      });
    });

    it('should remove address by id', () => {
      const firstAddressId = useAuth.getState().addresses[0].id;
      const initialCount = useAuth.getState().addresses.length;

      act(() => {
        useAuth.getState().removeAddress(firstAddressId);
      });

      expect(useAuth.getState().addresses.length).toBe(initialCount - 1);
      expect(
        useAuth.getState().addresses.find((addr) => addr.id === firstAddressId)
      ).toBeUndefined();
    });

    it('should set first address as default if default was removed', () => {
      // First address is default, remove it
      const defaultAddress = useAuth.getState().addresses.find((addr) => addr.isDefault);

      act(() => {
        useAuth.getState().removeAddress(defaultAddress!.id);
      });

      const newDefaultAddress = useAuth.getState().addresses.find((addr) => addr.isDefault);
      expect(newDefaultAddress).toBeDefined();
    });
  });

  describe('setDefaultAddress', () => {
    beforeEach(async () => {
      await act(async () => {
        await useAuth.getState().login('demo@esonge.com', 'password');
      });
    });

    it('should set specified address as default', () => {
      const secondAddressId = useAuth.getState().addresses[1].id;

      act(() => {
        useAuth.getState().setDefaultAddress(secondAddressId);
      });

      const defaultAddress = useAuth.getState().getDefaultAddress();
      expect(defaultAddress?.id).toBe(secondAddressId);
    });

    it('should ensure only one default address', () => {
      const secondAddressId = useAuth.getState().addresses[1].id;

      act(() => {
        useAuth.getState().setDefaultAddress(secondAddressId);
      });

      const defaultAddresses = useAuth.getState().addresses.filter((addr) => addr.isDefault);
      expect(defaultAddresses).toHaveLength(1);
    });
  });

  describe('getDefaultAddress', () => {
    it('should return undefined when no addresses', () => {
      const defaultAddress = useAuth.getState().getDefaultAddress();
      expect(defaultAddress).toBeUndefined();
    });

    it('should return default address', async () => {
      await act(async () => {
        await useAuth.getState().login('demo@esonge.com', 'password');
      });

      const defaultAddress = useAuth.getState().getDefaultAddress();
      expect(defaultAddress).toBeDefined();
      expect(defaultAddress?.isDefault).toBe(true);
    });
  });
});
