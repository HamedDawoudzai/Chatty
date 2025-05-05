import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { Sidebar } from '../components/Sidebar'
import { AuthProvider } from '../context/AuthContext'
import { ThemeProvider } from '../context/ThemeContext'

vi.mock('../lib/api/rooms', () => ({
  getMyRooms: vi.fn().mockResolvedValue([
    { id: '1', name: 'general', type: 'public', created_by: 'u1', created_at: '', member_count: 2 },
  ]),
}))
vi.mock('../lib/api/users', () => ({
  getMe: vi.fn().mockResolvedValue({ id: 'u1', username: 'testuser', email: 'test@test.com', is_active: true, created_at: '' }),
}))

describe('Sidebar', () => {
  it('renders without crashing', () => {
    render(
      <ThemeProvider>
        <AuthProvider>
          <MemoryRouter>
            <Sidebar />
          </MemoryRouter>
        </AuthProvider>
      </ThemeProvider>
    )
    expect(screen.getByText('Chatty')).toBeDefined()
  })
})
