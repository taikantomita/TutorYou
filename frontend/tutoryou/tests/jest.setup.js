require('@testing-library/jest-dom');

jest.mock('next/navigation', () => ({
    useRouter: () => ({
      push: jest.fn(), // Mock the `push` method
    }),
  }));
  
  jest.mock('next-auth/react', () => ({
    signIn: jest.fn(() => Promise.resolve({ ok: true })),
  }));
  