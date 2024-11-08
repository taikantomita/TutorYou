import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import LoginPage from '@/app/login/page';
import { useRouter } from 'next/navigation';
import '@testing-library/jest-dom';

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

jest.mock('next-auth/react', () => ({
  signIn: jest.fn(() => Promise.resolve({ ok: true })),
}));

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));


describe('LoginPage', () => {
  it('renders correctly', () => {
    render(<LoginPage />);
    // Ensure the button with "Login" text is present
    expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
    // Ensure the heading with "Login" text is present
    expect(screen.getByRole('heading', { name: /login/i })).toBeInTheDocument();

    expect(
      screen.getByPlaceholderText(/enter your username/i)
    ).toBeInTheDocument();
  });

  it('displays error if username or password is missing', () => {
    render(<LoginPage />);

    fireEvent.click(screen.getByRole('button', { name: /login/i }));

    expect(
      screen.getByText(/username and password are required/i)
    ).toBeInTheDocument();
  });

  it('redirects to user landing page on successful login', async () => {
    const pushMock = jest.fn();
    (useRouter as jest.Mock).mockReturnValue({
      push: pushMock,
    });

    render(<LoginPage />);

    // Simulate user input
    fireEvent.change(screen.getByPlaceholderText(/enter your username/i), {
      target: { value: 'testuser' },
    });
    fireEvent.change(screen.getByPlaceholderText(/enter your password/i), {
      target: { value: 'password123' },
    });

    // Simulate form submission
    fireEvent.click(screen.getByRole('button', { name: /login/i }));

    // Wait for redirection logic
    await waitFor(() => {
      expect(pushMock).toHaveBeenCalledTimes(1);
      expect(pushMock).toHaveBeenCalledWith('/user-landing');
    });
  });

  it('displays error on failed login', async () => {
    jest.mocked(require('next-auth/react').signIn).mockResolvedValue({
      ok: false,
    });

    render(<LoginPage />);

    fireEvent.change(screen.getByPlaceholderText(/enter your username/i), {
      target: { value: 'testuser' },
    });
    fireEvent.change(screen.getByPlaceholderText(/enter your password/i), {
      target: { value: 'wrongpassword' },
    });

    fireEvent.click(screen.getByRole('button', { name: /login/i }));

    // Wait for error message
    expect(
      await screen.findByText(
        /login failed. please check your username and password/i
      )
    ).toBeInTheDocument();
  });
});
