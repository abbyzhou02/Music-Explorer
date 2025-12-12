import { Request, Response, NextFunction } from 'express';
import { 
  createError, 
  errorHandler, 
  notFoundHandler, 
  asyncHandler, 
  requestLogger,
  AppError 
} from '../../../src/middleware/errorHandler';

// Mock console.log
const mockConsoleLog = jest.spyOn(console, 'log').mockImplementation();
const originalEnv = process.env;

describe('Error Handler Middleware', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockNext: jest.MockedFunction<NextFunction>;

  beforeEach(() => {
    jest.clearAllMocks();
    mockRequest = {
      originalUrl: '/test-route',
      method: 'GET',
      ip: '127.0.0.1'
    };
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      setHeader: jest.fn(),
      json: jest.fn()
    };
    mockNext = jest.fn();
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  describe('createError', () => {
    it('should create an error with default status code', () => {
      const error = createError('Test error');
      
      expect(error).toBeInstanceOf(Error);
      expect(error.message).toBe('Test error');
      expect(error.statusCode).toBe(500);
      expect(error.code).toBeUndefined();
      expect(error.details).toBeUndefined();
    });

    it('should create an error with custom status code', () => {
      const error = createError('Not found', 404);
      
      expect(error.message).toBe('Not found');
      expect(error.statusCode).toBe(404);
    });

    it('should create an error with code and details', () => {
      const details = { field: 'email', value: 'invalid' };
      const error = createError('Validation failed', 400, 'VALIDATION_ERROR', details);
      
      expect(error.message).toBe('Validation failed');
      expect(error.statusCode).toBe(400);
      expect(error.code).toBe('VALIDATION_ERROR');
      expect(error.details).toEqual(details);
    });
  });

  describe('errorHandler', () => {
    it('should handle generic error with default values', () => {
      // Set to production to avoid stack trace in response
      process.env.NODE_ENV = 'production';
      const error = new Error('Generic error');
      
      errorHandler(error, mockRequest as Request, mockResponse as Response, mockNext);
      
      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.setHeader).toHaveBeenCalledWith('Content-Type', 'application/json');
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        message: 'Generic error',
        error: {
          code: 'INTERNAL_ERROR'
        }
      });
    });

    it('should handle error with custom status code and message', () => {
      process.env.NODE_ENV = 'production';
      const error = createError('Custom error', 404, 'NOT_FOUND');
      
      errorHandler(error, mockRequest as Request, mockResponse as Response, mockNext);
      
      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        message: 'Custom error',
        error: {
          code: 'NOT_FOUND'
        }
      });
    });

    it('should handle ValidationError', () => {
      process.env.NODE_ENV = 'production';
      const error: AppError = new Error('Validation failed');
      error.name = 'ValidationError';
      error.details = { field: 'name' };
      
      errorHandler(error, mockRequest as Request, mockResponse as Response, mockNext);
      
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        message: 'Request data validation failed',
        error: {
          code: 'VALIDATION_ERROR'
        }
      });
    });

    it('should handle JsonWebTokenError', () => {
      process.env.NODE_ENV = 'production';
      const error: AppError = new Error('Invalid token');
      error.name = 'JsonWebTokenError';
      
      errorHandler(error, mockRequest as Request, mockResponse as Response, mockNext);
      
      expect(mockResponse.status).toHaveBeenCalledWith(401);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        message: 'Invalid token',
        error: {
          code: 'INVALID_TOKEN'
        }
      });
    });

    it('should handle TokenExpiredError', () => {
      process.env.NODE_ENV = 'production';
      const error: AppError = new Error('Token expired');
      error.name = 'TokenExpiredError';
      
      errorHandler(error, mockRequest as Request, mockResponse as Response, mockNext);
      
      expect(mockResponse.status).toHaveBeenCalledWith(401);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        message: 'Token expired',
        error: {
          code: 'TOKEN_EXPIRED'
        }
      });
    });

    it('should handle NotFoundError', () => {
      process.env.NODE_ENV = 'production';
      const error: AppError = new Error('Resource not found');
      error.name = 'NotFoundError';
      
      errorHandler(error, mockRequest as Request, mockResponse as Response, mockNext);
      
      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        message: 'Resource not found',
        error: {
          code: 'NOT_FOUND'
        }
      });
    });

    it('should handle SQLite constraint unique error', () => {
      process.env.NODE_ENV = 'production';
      const error: AppError = new Error('Unique constraint failed');
      error.code = 'SQLITE_CONSTRAINT_UNIQUE';
      
      errorHandler(error, mockRequest as Request, mockResponse as Response, mockNext);
      
      expect(mockResponse.status).toHaveBeenCalledWith(409);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        message: 'Data already exists',
        error: {
          code: 'DUPLICATE_RESOURCE'
        }
      });
    });

    it('should handle PostgreSQL constraint error', () => {
      process.env.NODE_ENV = 'production';
      const error: AppError = new Error('Constraint violation');
      error.code = '23505';
      
      errorHandler(error, mockRequest as Request, mockResponse as Response, mockNext);
      
      expect(mockResponse.status).toHaveBeenCalledWith(409);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        message: 'Data already exists',
        error: {
          code: 'DUPLICATE_RESOURCE'
        }
      });
    });

    it('should handle UnauthorizedError', () => {
      process.env.NODE_ENV = 'production';
      const error: AppError = new Error('Unauthorized');
      error.name = 'UnauthorizedError';
      
      errorHandler(error, mockRequest as Request, mockResponse as Response, mockNext);
      
      expect(mockResponse.status).toHaveBeenCalledWith(403);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        message: 'Insufficient permissions',
        error: {
          code: 'INSUFFICIENT_PERMISSIONS'
        }
      });
    });

    it('should include details and stack in development environment', () => {
      process.env.NODE_ENV = 'development';
      const details = { field: 'email' };
      const error = createError('Dev error', 400, 'DEV_ERROR', details);
      
      errorHandler(error, mockRequest as Request, mockResponse as Response, mockNext);
      
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        message: 'Dev error',
        error: {
          code: 'DEV_ERROR',
          details: details
        },
        stack: expect.any(String)
      });
    });

    it('should not include details and stack in production environment', () => {
      process.env.NODE_ENV = 'production';
      const details = { field: 'email' };
      const error = createError('Prod error', 400, 'PROD_ERROR', details);
      
      errorHandler(error, mockRequest as Request, mockResponse as Response, mockNext);
      
      const mockJsonFn = mockResponse.json as jest.Mock;
      const response = mockJsonFn.mock.calls[0][0];
      expect(response.success).toBe(false);
      expect(response.message).toBe('Prod error');
      expect(response.error.code).toBe('PROD_ERROR');
      expect(response.error.details).toBeUndefined();
      expect(response.stack).toBeUndefined();
    });

    it('should use default error message when message is empty', () => {
      process.env.NODE_ENV = 'production';
      const error = new Error();
      
      errorHandler(error, mockRequest as Request, mockResponse as Response, mockNext);
      
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        message: 'Internal server error',
        error: {
          code: 'INTERNAL_ERROR'
        }
      });
    });
  });

  describe('notFoundHandler', () => {
    it('should create a 404 error for unknown routes', () => {
      notFoundHandler(mockRequest as Request, mockResponse as Response, mockNext);
      
      expect(mockNext).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'Route /test-route not found',
          statusCode: 404,
          code: 'ROUTE_NOT_FOUND'
        })
      );
    });
  });

  describe('asyncHandler', () => {
    it('should handle successful async function', async () => {
      const asyncFn = jest.fn().mockResolvedValue('success');
      const wrappedFn = asyncHandler(asyncFn);
      
      await wrappedFn(mockRequest as Request, mockResponse as Response, mockNext);
      
      expect(asyncFn).toHaveBeenCalledWith(mockRequest, mockResponse, mockNext);
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should handle async function that throws error', async () => {
      const error = new Error('Async error');
      const asyncFn = jest.fn().mockRejectedValue(error);
      const wrappedFn = asyncHandler(asyncFn);
      
      await wrappedFn(mockRequest as Request, mockResponse as Response, mockNext);
      
      expect(asyncFn).toHaveBeenCalledWith(mockRequest, mockResponse, mockNext);
      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });

  describe('requestLogger', () => {
    let mockRequestWithFinish: Partial<Request>;
    let mockResponseWithFinish: Partial<Response>;

    beforeEach(() => {
      mockRequestWithFinish = {
        method: 'GET',
        url: '/api/test',
        ip: '192.168.1.1'
      };
      
      mockResponseWithFinish = {
        statusCode: 200,
        on: jest.fn(function(this: any, event, callback) {
          if (event === 'finish') {
            callback();
          }
          return this;
        }) as any
      };
    });

    it('should log request information on finish', () => {
      const mockNextFunction = jest.fn();
      
      requestLogger(
        mockRequestWithFinish as Request, 
        mockResponseWithFinish as Response, 
        mockNextFunction
      );
      
      expect(mockNextFunction).toHaveBeenCalled();
      expect(mockConsoleLog).toHaveBeenCalledWith(
        expect.stringMatching(/\[\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z\] INFO GET \/api\/test - 200 - \d+ms - IP: 192\.168\.1\.1/)
      );
    });

    it('should log ERROR level for 4xx status codes', () => {
      mockResponseWithFinish.statusCode = 404;
      const mockNextFunction = jest.fn();
      
      requestLogger(
        mockRequestWithFinish as Request, 
        mockResponseWithFinish as Response, 
        mockNextFunction
      );
      
      expect(mockConsoleLog).toHaveBeenCalledWith(
        expect.stringMatching(/ERROR/)
      );
    });

    it('should log WARN level for 3xx status codes', () => {
      mockResponseWithFinish.statusCode = 301;
      const mockNextFunction = jest.fn();
      
      requestLogger(
        mockRequestWithFinish as Request, 
        mockResponseWithFinish as Response, 
        mockNextFunction
      );
      
      expect(mockConsoleLog).toHaveBeenCalledWith(
        expect.stringMatching(/WARN/)
      );
    });

    it('should log INFO level for 2xx status codes', () => {
      mockResponseWithFinish.statusCode = 200;
      const mockNextFunction = jest.fn();
      
      requestLogger(
        mockRequestWithFinish as Request, 
        mockResponseWithFinish as Response, 
        mockNextFunction
      );
      
      expect(mockConsoleLog).toHaveBeenCalledWith(
        expect.stringMatching(/INFO/)
      );
    });

    it('should handle different HTTP methods', () => {
      mockRequestWithFinish.method = 'POST';
      const mockNextFunction = jest.fn();
      
      requestLogger(
        mockRequestWithFinish as Request, 
        mockResponseWithFinish as Response, 
        mockNextFunction
      );
      
      expect(mockConsoleLog).toHaveBeenCalledWith(
        expect.stringMatching(/POST/)
      );
    });

    it('should handle different URLs', () => {
      mockRequestWithFinish.url = '/api/v2/users/123';
      const mockNextFunction = jest.fn();
      
      requestLogger(
        mockRequestWithFinish as Request, 
        mockResponseWithFinish as Response, 
        mockNextFunction
      );
      
      expect(mockConsoleLog).toHaveBeenCalledWith(
        expect.stringMatching(/\/api\/v2\/users\/123/)
      );
    });
  });
});
