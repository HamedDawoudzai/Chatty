import { Outlet } from 'react-router-dom'
import { Sidebar } from '../components/Sidebar'

export function AppLayout() {
  return (
    <div className="flex h-full bg-white dark:bg-gray-900">
      <Sidebar />
      <main className="flex-1 flex flex-col min-w-0">
        <Outlet />
      </main>
    </div>
  )
}
