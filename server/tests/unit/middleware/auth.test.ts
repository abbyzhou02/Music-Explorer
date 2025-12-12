import { Request, Response, NextFunction } from 'express';
import { authenticateToken, optionalAuth, requireAdmin, requireSelfOrAdmin } from '../../../src/middleware/auth';
import { jwtService } from '../../../src/utils/auth';
import { UserService } from '../../../src/services/userService';
import { User } from '../../../src/types/index';

// Mock dependencies
jest.mock('../../../src/utils/auth');
jest.mock('../../../src/services/userService');

const mockJwtService = jwtService as jest.Mocked<typeof jwtService>;
const mockUserService = UserService as jest.Mocked<typeof UserService>;

describe('Auth Middleware', () => {
  let mockReq: Partial<Request>;
  let mockRes: Partial<Response>;
  let mockNext: NextFunction;

  beforeEach(() => {
    mockReq = {
      headers: {},
      params: {},
    };
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    mockNext = jest.fn();

    jest.clearAllMocks();
  });

  describe('authenticateToken', () => {
    it('should return 401 if no token provided', async () => {
      mockReq.headers = {};

      await authenticateToken(mockReq as Request, mockRes as Response, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(401);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message: 'Missing access token',
        error: {
          code: 'MISSING_TOKEN',
          details: 'Bearer token must be provided in request header'
        }
      });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should return 403 if token is invalid', async () => {
      mockReq.headers = { authorization: 'Bearer invalid-token' };
      mockJwtService.verifyAccessToken.mockReturnValue(null);

      await authenticateToken(mockReq as Request, mockRes as Response, mockNext);

      expect(mockJwtService.verifyAccessToken).toHaveBeenCalledWith('invalid-token');
      expect(mockRes.status).toHaveBeenCalledWith(403);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message: 'Invalid access token',
        error: {
          code: 'INVALID_TOKEN',
          details: 'Token is expired or invalid'
        }
      });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should return 403 if user does not exist', async () => {
      const mockPayload = { userId: 'user123', email: 'user@example.com' };
      mockReq.headers = { authorization: 'Bearer valid-token' };
      mockJwtService.verifyAccessToken.mockReturnValue(mockPayload);
      mockUserService.getUserById.mockResolvedValue(null);

      await authenticateToken(mockReq as Request, mockRes as Response, mockNext);

      expect(mockUserService.getUserById).toHaveBeenCalledWith('user123');
      expect(mockRes.status).toHaveBeenCalledWith(403);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message: 'User does not exist',
        error: {
          code: 'USER_NOT_FOUND',
          details: 'User corresponding to token does not exist'
        }
      });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should return 403 if user is inactive', async () => {
      const mockPayload = { userId: 'user123', email: 'user@example.com' };
      const mockUser = { id: 'user123', isActive: false };
      mockReq.headers = { authorization: 'Bearer valid-token' };
      mockJwtService.verifyAccessToken.mockReturnValue(mockPayload);
      mockUserService.getUserById.mockResolvedValue(mockUser as User);

      await authenticateToken(mockReq as Request, mockRes as Response, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(403);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message: 'User account has been disabled',
        error: {
          code: 'USER_INACTIVE',
          details: 'User account is in inactive state'
        }
      });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should authenticate user successfully and call next', async () => {
      const mockPayload = { userId: 'user123', email: 'test@example.com' };
      const mockUser = { id: 'user123', isActive: true, email: 'test@example.com' };
      mockReq.headers = { authorization: 'Bearer valid-token' };
      mockJwtService.verifyAccessToken.mockReturnValue(mockPayload);
      mockUserService.getUserById.mockResolvedValue(mockUser as User);

      await authenticateToken(mockReq as Request, mockRes as Response, mockNext);

      expect(mockReq.user).toEqual(mockUser);
      expect(mockReq.tokenPayload).toEqual(mockPayload);
      expect(mockNext).toHaveBeenCalled();
      expect(mockRes.status).not.toHaveBeenCalled();
    });
  });

  describe('optionalAuth', () => {
    it('should call next if no token provided', async () => {
      mockReq.headers = {};

      await optionalAuth(mockReq as Request, mockRes as Response, mockNext);

      expect(mockNext).toHaveBeenCalled();
      expect(mockJwtService.verifyAccessToken).not.toHaveBeenCalled();
    });

    it('should authenticate user if valid token provided', async () => {
      const mockPayload = { userId: 'user123', email: 'user@example.com' };
      const mockUser = { id: 'user123', isActive: true, email: 'user@example.com' };
      mockReq.headers = { authorization: 'Bearer valid-token' };
      mockJwtService.verifyAccessToken.mockReturnValue(mockPayload);
      mockUserService.getUserById.mockResolvedValue(mockUser as User);

      await optionalAuth(mockReq as Request, mockRes as Response, mockNext);

      expect(mockReq.user).toEqual(mockUser);
      expect(mockReq.tokenPayload).toEqual(mockPayload);
      expect(mockNext).toHaveBeenCalled();
    });

    it('should call next without auth if token is invalid', async () => {
      mockReq.headers = { authorization: 'Bearer invalid-token' };
      mockJwtService.verifyAccessToken.mockReturnValue(null);

      await optionalAuth(mockReq as Request, mockRes as Response, mockNext);

      expect(mockNext).toHaveBeenCalled();
      expect(mockReq.user).toBeUndefined();
      expect(mockReq.tokenPayload).toBeUndefined();
    });
  });

  describe('requireAdmin', () => {
    it('should return 401 if user is not authenticated', () => {
      mockReq.user = undefined;

      requireAdmin(mockReq as Request, mockRes as Response, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(401);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message: 'Unauthenticated',
        error: {
          code: 'UNAUTHENTICATED',
          details: 'Authentication required to access this resource'
        }
      });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should call next if user is authenticated', () => {
      const mockUser = { id: 'user123', isActive: true };
      mockReq.user = mockUser as User;

      requireAdmin(mockReq as Request, mockRes as Response, mockNext);

      expect(mockNext).toHaveBeenCalled();
      expect(mockRes.status).not.toHaveBeenCalled();
    });
  });

  describe('requireSelfOrAdmin', () => {
    it('should return 401 if user is not authenticated', () => {
      mockReq.user = undefined;
      mockReq.params = {};

      requireSelfOrAdmin(mockReq as Request, mockRes as Response, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(401);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message: 'Unauthenticated',
        error: {
          code: 'UNAUTHENTICATED',
          details: 'Authentication required to access this resource'
        }
      });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should allow access to own resources via userId param', () => {
      const mockUser = { id: 'user123', isActive: true };
      mockReq.user = mockUser as User;
      mockReq.params = { userId: 'user123' };

      requireSelfOrAdmin(mockReq as Request, mockRes as Response, mockNext);

      expect(mockNext).toHaveBeenCalled();
      expect(mockRes.status).not.toHaveBeenCalled();
    });

    it('should allow access to own resources via id param', () => {
      const mockUser = { id: 'user123', isActive: true };
      mockReq.user = mockUser as User;
      mockReq.params = { id: 'user123' };

      requireSelfOrAdmin(mockReq as Request, mockRes as Response, mockNext);

      expect(mockNext).toHaveBeenCalled();
      expect(mockRes.status).not.toHaveBeenCalled();
    });

    it('should deny access to other user resources', () => {
      const mockUser = { id: 'user123', isActive: true };
      mockReq.user = mockUser as User;
      mockReq.params = { userId: 'user456' };

      requireSelfOrAdmin(mockReq as Request, mockRes as Response, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(403);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message: 'Insufficient permissions',
        error: {
          code: 'INSUFFICIENT_PERMISSIONS',
          details: 'Can only access own resources'
        }
      });
      expect(mockNext).not.toHaveBeenCalled();
    });
  });
});
