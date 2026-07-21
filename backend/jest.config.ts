import type { Config } from 'jest';

process.env.NODE_ENV = 'test';

const config: Config = {
  testEnvironment: 'node',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'mjs', 'cjs', 'json', 'node'],
  transform: {
    '^.+\\.(ts|tsx|mjs|js)$': [
      '@swc/jest',
      {
        jsc: {
          target: 'es2022',
          parser: {
            syntax: 'typescript',
            decorators: true,
            tsx: true,
          },
          transform: {
            decoratorVersion: '2022-03',
          },
        },
        module: {
          type: 'commonjs',
        },
      },
    ],
  },
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.(js|mjs)$': '$1',
  },
  testPathIgnorePatterns: ['/node_modules/', '/dist/'],
  setupFilesAfterEnv: ['./jest.setup.ts'],
  transformIgnorePatterns: [
    '/node_modules/(?!(.pnpm|@t3-oss))',
  ],
  slowTestThreshold: 15_000,
};

export default config;