import type { Config } from 'jest';

const config: Config = {
    projects: [
        {
            displayName: 'type-check',
            runner: 'jest-runner-tsc',
            testMatch: ['<rootDir>/src/**/*.(ts|tsx)'],
        },
        {
            displayName: 'unit-tests',
            preset: 'ts-jest',
            testEnvironment: 'jsdom',
            testMatch: ['<rootDir>/src/**/*.test.(ts|tsx|js)'],
            moduleNameMapper: {
                '\\.(css|less|sass|scss)$': 'identity-obj-proxy',
            },
            setupFilesAfterEnv: ['<rootDir>/jest.setup.ts']
        },
    ],

};

export default config;