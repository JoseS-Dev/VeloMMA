import { jest } from '@jest/globals';

// Interceptamos el módulo de 'redis' por completo
jest.mock('redis', () => {
  return {
    createClient: jest.fn(() => ({
      connect: jest.fn().mockImplementation(() => Promise.resolve()),
      disconnect: jest.fn().mockImplementation(() => Promise.resolve()),
      get: jest.fn().mockImplementation(() => Promise.resolve(null)),
      set: jest.fn().mockImplementation(() => Promise.resolve('OK')),
      del: jest.fn().mockImplementation(() => Promise.resolve(1)),
      on: jest.fn(),
    } as any))
  };
});