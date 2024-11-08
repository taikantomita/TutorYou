import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react'
import TestPage from '@/app/user-landing/page'
import '@testing-library/jest-dom'
import { signOut } from 'next-auth/react'

// Mock the signOut function from next-auth
jest.mock('next-auth/react', () => ({
  signOut: jest.fn(),
}))

describe('UserLandingPage', () => {
  it('renders welcome message and logout button', () => {
    render(<TestPage />)

    // Check for welcome message
    expect(
      screen.getByText(/welcome to the test page - you are logged in!/i),
    ).toBeInTheDocument()

    // Check for logout button
    const logoutButton = screen.getByRole('button', { name: /logout/i })
    expect(logoutButton).toBeInTheDocument()
  })

  it('calls signOut with correct callbackUrl when logout button is clicked', () => {
    render(<TestPage />)
    const logoutButton = screen.getByRole('button', { name: /logout/i })

    // Click the logout button
    fireEvent.click(logoutButton)

    // Verify that signOut was called with the correct callback URL
    expect(signOut).toHaveBeenCalledWith({ callbackUrl: '/login' })
  })
})
