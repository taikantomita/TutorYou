import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import SignupPage from '@/app/signup/page'
import '@testing-library/jest-dom'

describe('SignupPage', () => {
  it('renders correctly', () => {
    render(<SignupPage />);
    
    // Check that the heading "Sign Up" is present
    expect(screen.getByRole('heading', { name: /sign up/i })).toBeInTheDocument();

    // Check that the button "Sign Up" is present
    expect(screen.getByRole('button', { name: /sign up/i })).toBeInTheDocument();

    // Check that the username input is present
    expect(screen.getByPlaceholderText(/enter your username/i)).toBeInTheDocument();

    // Check that the password input is present
    expect(screen.getByPlaceholderText(/enter your password/i)).toBeInTheDocument();
  })

  it('shows an error when fields are empty and signup is attempted', async () => {
    render(<SignupPage />)

    const signupButton = screen.getByRole('button', { name: /sign up/i })
    fireEvent.click(signupButton)

    await waitFor(() => {
      expect(
        screen.getByText(/username and password are required/i),
      ).toBeInTheDocument()
    })
  })

  it('displays a success message on successful signup', async () => {
    // Mock the fetch function for successful signup
    global.fetch = jest.fn(() => Promise.resolve({ ok: true })) as jest.Mock

    render(<SignupPage />)
    fireEvent.change(screen.getByPlaceholderText(/enter your username/i), {
      target: { value: 'testuser' },
    })
    fireEvent.change(screen.getByPlaceholderText(/enter your password/i), {
      target: { value: 'password123' },
    })

    fireEvent.click(screen.getByRole('button', { name: /sign up/i }))

    await waitFor(() => {
      expect(
        screen.getByText(/signup successful! redirecting to login.../i),
      ).toBeInTheDocument()
    })
  })

  it('displays an error if username is already taken', async () => {
    // Mock the fetch function for username conflict
    global.fetch = jest.fn(() =>
      Promise.resolve({ ok: false, status: 409 }),
    ) as jest.Mock

    render(<SignupPage />)
    fireEvent.change(screen.getByPlaceholderText(/enter your username/i), {
      target: { value: 'existinguser' },
    })
    fireEvent.change(screen.getByPlaceholderText(/enter your password/i), {
      target: { value: 'password123' },
    })

    fireEvent.click(screen.getByRole('button', { name: /sign up/i }))

    await waitFor(() => {
      expect(
        screen.getByText(/username is already taken. please choose another./i),
      ).toBeInTheDocument()
    })
  })
})
