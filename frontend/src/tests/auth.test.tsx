import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import Login from '../pages/Login'
import { AuthProvider } from '../context/AuthContext'

vi.mock('../lib/api/auth', () => ({
  login: vi.fn().mockResolvedValue({ access_token: 'fake-token', token_type: 'bearer' }),
  register: vi.fn(),
}))
vi.mock('../lib/api/users', () => ({
  getMe: vi.fn().mockResolvedValue({ id: '1', username: 'testuser', email: 'test@example.com', is_active: true, created_at: '' }),
}))

describe('Login page', () => {
  it('renders login form', () => {
    render(
      <MemoryRouter>
        <AuthProvider>
          <Login />
        </AuthProvider>
      </MemoryRouter>
    )
    expect(screen.getByText(/Sign in/i)).toBeDefined()
  })
})
