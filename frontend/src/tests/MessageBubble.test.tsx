import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MessageBubble } from '../components/MessageBubble'

const msg = {
  id: '1', room_id: 'r1', author_id: 'u1', content: 'Hello world',
  is_pinned: false, is_edited: false, is_deleted: false,
  created_at: new Date().toISOString(), updated_at: new Date().toISOString(),
  author_username: 'alice', reply_count: 0,
}

describe('MessageBubble', () => {
  it('renders message content', () => {
    render(<MessageBubble message={msg} isOwn={false} />)
    expect(screen.getByText('Hello world')).toBeDefined()
  })

  it('shows deleted placeholder', () => {
    render(<MessageBubble message={{ ...msg, is_deleted: true }} isOwn={false} />)
    expect(screen.getByText('[deleted]')).toBeDefined()
  })
})
