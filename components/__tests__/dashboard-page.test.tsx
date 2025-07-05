import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import DashboardPage from '../dashboard-page'

// Mock the components
jest.mock('../carbon-dashboard', () => {
  return function MockCarbonDashboard() {
    return <div data-testid="carbon-dashboard">Carbon Dashboard</div>
  }
})

jest.mock('../loading-screen', () => ({
  LoadingScreen: function MockLoadingScreen() {
    return <div data-testid="loading-screen">Loading...</div>
  },
}))

// Mock framer-motion
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }) => <div {...props}>{children}</div>,
  },
  AnimatePresence: ({ children }) => <div>{children}</div>,
}))

// Mock timers
jest.useFakeTimers()

describe('DashboardPage', () => {
  beforeEach(() => {
    jest.clearAllTimers()
  })

  afterEach(() => {
    jest.runOnlyPendingTimers()
    jest.useRealTimers()
    jest.useFakeTimers()
  })

  it('shows loading screen initially', () => {
    render(<DashboardPage />)
    
    expect(screen.getByTestId('loading-screen')).toBeInTheDocument()
    expect(screen.queryByTestId('carbon-dashboard')).not.toBeInTheDocument()
  })

  it('shows dashboard after loading timeout', async () => {
    render(<DashboardPage />)
    
    // Initially shows loading
    expect(screen.getByTestId('loading-screen')).toBeInTheDocument()
    
    // Fast-forward time to trigger the timeout
    jest.advanceTimersByTime(2000)
    
    await waitFor(() => {
      expect(screen.queryByTestId('loading-screen')).not.toBeInTheDocument()
      expect(screen.getByTestId('carbon-dashboard')).toBeInTheDocument()
    })
  })

  it('applies correct background gradient classes', async () => {
    const { container } = render(<DashboardPage />)
    
    // Fast-forward time to show dashboard
    jest.advanceTimersByTime(2000)
    
    await waitFor(() => {
      const dashboardContainer = container.querySelector('.bg-gradient-to-br')
      expect(dashboardContainer).toBeInTheDocument()
      expect(dashboardContainer).toHaveClass('from-slate-900')
      expect(dashboardContainer).toHaveClass('via-slate-800')
      expect(dashboardContainer).toHaveClass('to-emerald-900')
    })
  })

  it('cleans up timer on unmount', () => {
    const { unmount } = render(<DashboardPage />)
    
    // Spy on clearTimeout
    const clearTimeoutSpy = jest.spyOn(global, 'clearTimeout')
    
    unmount()
    
    expect(clearTimeoutSpy).toHaveBeenCalled()
    
    clearTimeoutSpy.mockRestore()
  })

  it('has proper component structure', async () => {
    const { container } = render(<DashboardPage />)
    
    // Check loading state structure
    expect(container.firstChild).toBeInTheDocument()
    
    // Fast-forward time to show dashboard
    jest.advanceTimersByTime(2000)
    
    await waitFor(() => {
      const dashboardContainer = container.querySelector('.min-h-screen')
      expect(dashboardContainer).toBeInTheDocument()
    })
  })

  it('handles rapid component mounting and unmounting', () => {
    const { unmount, rerender } = render(<DashboardPage />)
    
    // Unmount before timer completes
    unmount()
    
    // Remount
    rerender(<DashboardPage />)
    
    expect(screen.getByTestId('loading-screen')).toBeInTheDocument()
  })

  it('loading timeout is exactly 2 seconds', async () => {
    render(<DashboardPage />)
    
    // Should still be loading at 1.9 seconds
    jest.advanceTimersByTime(1900)
    expect(screen.getByTestId('loading-screen')).toBeInTheDocument()
    
    // Should switch to dashboard at 2 seconds
    jest.advanceTimersByTime(100)
    
    await waitFor(() => {
      expect(screen.getByTestId('carbon-dashboard')).toBeInTheDocument()
    })
  })

  it('applies motion animation props correctly', async () => {
    const { container } = render(<DashboardPage />)
    
    // Fast-forward time to show dashboard
    jest.advanceTimersByTime(2000)
    
    await waitFor(() => {
      // The motion.div should be rendered with animation props
      const motionDiv = container.querySelector('[data-testid="carbon-dashboard"]')?.parentElement
      expect(motionDiv).toBeInTheDocument()
    })
  })
})