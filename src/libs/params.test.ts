import { Request } from 'express';
import params from './params';

describe('Params Library', () => {
  describe('getRestaurantId', () => {
    it('should return a number when restaurantId is a valid numeric string', () => {
      const req = {
        params: { restaurantId: '123' },
      } as unknown as Request;
      expect(params.getRestaurantId(req)).toBe(123);
    });

    it('should return null when restaurantId is not a number', () => {
      const req = {
        params: { restaurantId: 'abc' },
      } as unknown as Request;
      expect(params.getRestaurantId(req)).toBeNull();
    });
  });

  describe('isAuthAdmin', () => {
    it('should return true when userRole is ADMIN and userId is provided', () => {
      const req = {
        userId: 789,
        userRole: 'ADMIN',
      } as unknown as Request;
      expect(params.isAuthAdmin(req)).toBe(true);
    });

    it('should return false when userRole is not ADMIN', () => {
      const req = {
        userId: 789,
        userRole: 'USER',
      } as unknown as Request;
      expect(params.isAuthAdmin(req)).toBe(false);
    });

    it('should return false when userId is missing', () => {
      const req = {
        userRole: 'ADMIN',
      } as unknown as Request;
      expect(params.isAuthAdmin(req)).toBe(false);
    });
  });

  describe('hasRequiredFields', () => {
    it('should return true when all required fields are present and not empty', () => {
      const req = {
        body: {
          name: 'Sample Restaurant',
          address: '123 Main St',
        },
      } as unknown as Request;
      expect(params.hasRequiredFields(req, ['name', 'address'])).toBe(true);
    });

    it('should return false when a required field is missing', () => {
      const req = {
        body: {
          name: 'Sample Restaurant',
        },
      } as unknown as Request;
      expect(params.hasRequiredFields(req, ['name', 'address'])).toBe(false);
    });

    it('should return false when a required field is empty', () => {
      const req = {
        body: {
          name: 'Sample Restaurant',
          address: '',
        },
      } as unknown as Request;
      expect(params.hasRequiredFields(req, ['name', 'address'])).toBe(false);
    });
  });
});
