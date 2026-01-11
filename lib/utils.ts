import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value)
}

export function formatDate(date: Date | string): string {
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  }).format(new Date(date))
}

export function formatDateTime(date: Date | string): string {
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(new Date(date))
}

export function getProjectStatusLabel(status: string): string {
  const labels: Record<string, string> = {
    ORCAMENTO: 'Orçamento',
    EM_ANDAMENTO: 'Em Andamento',
    PAUSADO: 'Pausado',
    CONCLUIDO: 'Concluído',
    CANCELADO: 'Cancelado'
  }
  return labels[status] || status
}

export function getProjectPhaseLabel(phase: string): string {
  const labels: Record<string, string> = {
    PLANEJAMENTO: 'Planejamento',
    FUNDACAO: 'Fundação',
    ESTRUTURA: 'Estrutura',
    ALVENARIA: 'Alvenaria',
    INSTALACOES: 'Instalações',
    ACABAMENTO: 'Acabamento',
    FINALIZACAO: 'Finalização'
  }
  return labels[phase] || phase
}

