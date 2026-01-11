'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { 
  LayoutDashboard, 
  FolderKanban, 
  Users, 
  FileText, 
  ClipboardList, 
  UsersRound, 
  PieChart,
  Settings,
  LogOut,
  Building2,
  DollarSign,
  Receipt,
  Calendar
} from 'lucide-react'

interface SidebarProps {
  role: 'ADMIN' | 'CLIENT'
}

export default function Sidebar({ role }: SidebarProps) {
  const pathname = usePathname()
  const router = useRouter()

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    router.push('/login')
  }

  const adminLinks = [
    { href: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/admin/projects', label: 'Projetos', icon: FolderKanban },
    { href: '/admin/clients', label: 'Clientes', icon: Users },
    { href: '/admin/budgets', label: 'Orçamentos', icon: DollarSign },
    { href: '/admin/invoices', label: 'Faturamento', icon: Receipt },
    { href: '/admin/appointments', label: 'Agenda', icon: Calendar },
    { href: '/admin/documents', label: 'Documentos', icon: FileText },
    { href: '/admin/work-diaries', label: 'Diário de Obras', icon: ClipboardList },
    { href: '/admin/team', label: 'Equipe', icon: UsersRound },
    { href: '/admin/reports', label: 'Relatórios', icon: PieChart },
  ]

  const clientLinks = [
    { href: '/client/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/client/projects', label: 'Meus Projetos', icon: FolderKanban },
    { href: '/client/work-diaries', label: 'Atualizações da Obra', icon: ClipboardList },
    { href: '/client/budgets', label: 'Orçamentos', icon: DollarSign },
    { href: '/client/invoices', label: 'Faturas', icon: Receipt },
    { href: '/client/appointments', label: 'Agendamentos', icon: Calendar },
    { href: '/client/documents', label: 'Documentos', icon: FileText },
  ]

  const links = role === 'ADMIN' ? adminLinks : clientLinks

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 border-r border-gray-200 bg-[#2C3E50] text-white">
      <div className="flex h-full flex-col">
        {/* Logo */}
        <div className="flex items-center gap-2 border-b border-gray-700 p-6">
          <Building2 className="h-8 w-8 text-[#C9A574]" />
          <span className="text-xl font-bold text-[#C9A574]">GÊMEAS</span>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 p-4">
          <div className="mb-4 text-xs font-semibold uppercase tracking-wider text-gray-400">
            Principal
          </div>
          {links.map((link) => {
            const Icon = link.icon
            const isActive = pathname === link.href
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-[#C9A574] text-white'
                    : 'text-gray-300 hover:bg-[#34495E] hover:text-white'
                }`}
              >
                <Icon className="h-5 w-5" />
                {link.label}
              </Link>
            )
          })}

          {role === 'ADMIN' && (
            <>
              <div className="my-4 border-t border-gray-700"></div>
              <div className="mb-4 text-xs font-semibold uppercase tracking-wider text-gray-400">
                Conta
              </div>
              <Link
                href="/admin/settings"
                className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-gray-300 transition-colors hover:bg-[#34495E] hover:text-white"
              >
                <Settings className="h-5 w-5" />
                Configurações
              </Link>
            </>
          )}
        </nav>

        {/* Logout */}
        <div className="border-t border-gray-700 p-4">
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-gray-300 transition-colors hover:bg-red-600 hover:text-white"
          >
            <LogOut className="h-5 w-5" />
            Sair
          </button>
        </div>
      </div>
    </aside>
  )
}

