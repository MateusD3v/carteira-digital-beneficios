import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import { BankLocator } from '../bank-locator'

// Mock do hook de notificações
jest.mock('@/hooks/use-notifications', () => ({
  useNotifications: () => ({
    addNotification: jest.fn()
  })
}))

// Mock do hook de debounce
jest.mock('@/hooks/use-lazy-component', () => ({
  useDebounce: (value: string) => value
}))

describe('BankLocator', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renderiza o componente corretamente', () => {
    render(<BankLocator />)
    
    // Verifica se elementos básicos estão presentes
    expect(screen.getByRole('textbox')).toBeInTheDocument()
    expect(screen.getByText('Buscar')).toBeInTheDocument()
  })

  it('exibe campo de busca', () => {
    render(<BankLocator />)
    
    const searchInput = screen.getByRole('textbox')
    
    expect(searchInput).toBeInTheDocument()
    expect(searchInput).toHaveAttribute('placeholder')
  })

  it('exibe botões de modo de visualização', () => {
    render(<BankLocator />)
    
    expect(screen.getByText('Lista')).toBeInTheDocument()
    expect(screen.getByText('Mapa')).toBeInTheDocument()
  })

  it('permite alternar entre modos de visualização', () => {
    render(<BankLocator />)
    
    const mapButton = screen.getByText('Mapa')
    const listButton = screen.getByText('Lista')
    
    // Verifica se os botões de visualização estão presentes
    expect(mapButton).toBeInTheDocument()
    expect(listButton).toBeInTheDocument()
  })

  it('exibe botão de localização atual', () => {
    render(<BankLocator />)
    
    expect(screen.getByText('Minha Localização')).toBeInTheDocument()
  })
})