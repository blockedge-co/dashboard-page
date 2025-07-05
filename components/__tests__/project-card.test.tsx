import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import ProjectCard from '../project-card'

// Mock the performance hook
jest.mock('@/hooks/use-performance', () => ({
  useAnimationProps: () => ({
    initial: { opacity: 0, y: 20 },
    whileHover: { y: -2 },
  }),
}))

// Mock framer-motion for this specific test
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }) => <div {...props}>{children}</div>,
  },
}))

const mockProject = {
  id: 'test-project-1',
  name: 'Test Solar Project',
  type: 'Renewable Energy',
  location: 'California, USA',
  co2Reduction: {
    total: '50000',
  },
  impact: '45,000 tCO2e',
  compliance: ['EU Taxonomy', 'TCFD'],
  registry: 'Verra Registry',
  methodology: 'IREC Standard',
  certificationBody: 'Gold Standard',
  backing: 'CDM Standard',
}

const mockOnViewDetails = jest.fn()

describe('ProjectCard', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders project information correctly', () => {
    render(
      <ProjectCard
        project={mockProject}
        index={0}
        onViewDetails={mockOnViewDetails}
      />
    )

    expect(screen.getByText('Test Solar Project')).toBeInTheDocument()
    expect(screen.getByText('Renewable Energy')).toBeInTheDocument()
    expect(screen.getByText('California, USA')).toBeInTheDocument()
    expect(screen.getByText('50,000 Tokens')).toBeInTheDocument()
    expect(screen.getByText('50,000 tCO2e')).toBeInTheDocument()
    expect(screen.getByText('Verra Registry')).toBeInTheDocument()
    expect(screen.getByText('IREC Standard')).toBeInTheDocument()
  })

  it('handles missing co2Reduction data gracefully', () => {
    const projectWithoutCO2 = {
      ...mockProject,
      co2Reduction: null,
      impact: 'N/A',
    }

    render(
      <ProjectCard
        project={projectWithoutCO2}
        index={0}
        onViewDetails={mockOnViewDetails}
      />
    )

    expect(screen.getAllByText('N/A')).toHaveLength(2)
  })

  it('displays default compliance badges when none provided', () => {
    const projectWithoutCompliance = {
      ...mockProject,
      compliance: undefined,
    }

    render(
      <ProjectCard
        project={projectWithoutCompliance}
        index={0}
        onViewDetails={mockOnViewDetails}
      />
    )

    expect(screen.getByText('EU Taxonomy')).toBeInTheDocument()
    expect(screen.getByText('TCFD')).toBeInTheDocument()
  })

  it('displays custom compliance badges when provided', () => {
    const projectWithCustomCompliance = {
      ...mockProject,
      compliance: ['Gold Standard', 'CDM'],
    }

    render(
      <ProjectCard
        project={projectWithCustomCompliance}
        index={0}
        onViewDetails={mockOnViewDetails}
      />
    )

    expect(screen.getByText('Gold Standard')).toBeInTheDocument()
    expect(screen.getByText('CDM')).toBeInTheDocument()
  })

  it('calls onViewDetails when View Details button is clicked', async () => {
    const user = userEvent.setup()

    render(
      <ProjectCard
        project={mockProject}
        index={0}
        onViewDetails={mockOnViewDetails}
      />
    )

    const viewDetailsButton = screen.getByRole('button', { name: /view details/i })
    await user.click(viewDetailsButton)

    expect(mockOnViewDetails).toHaveBeenCalledWith(mockProject)
    expect(mockOnViewDetails).toHaveBeenCalledTimes(1)
  })

  it('renders Eye icon in the View Details button', () => {
    render(
      <ProjectCard
        project={mockProject}
        index={0}
        onViewDetails={mockOnViewDetails}
      />
    )

    const viewDetailsButton = screen.getByRole('button', { name: /view details/i })
    expect(viewDetailsButton).toBeInTheDocument()
  })

  it('applies correct CSS classes for styling', () => {
    const { container } = render(
      <ProjectCard
        project={mockProject}
        index={0}
        onViewDetails={mockOnViewDetails}
      />
    )

    const card = container.querySelector('.bg-slate-800\\/80')
    expect(card).toBeInTheDocument()
    
    const cardBorder = container.querySelector('.border-slate-700\\/50')
    expect(cardBorder).toBeInTheDocument()
  })

  it('handles project with missing optional fields', () => {
    const minimalProject = {
      id: 'minimal-project',
      name: 'Minimal Project',
      type: 'Solar',
      location: 'Unknown',
    }

    render(
      <ProjectCard
        project={minimalProject}
        index={0}
        onViewDetails={mockOnViewDetails}
      />
    )

    expect(screen.getByText('Minimal Project')).toBeInTheDocument()
    expect(screen.getByText('Solar')).toBeInTheDocument()
    expect(screen.getByText('Unknown')).toBeInTheDocument()
    expect(screen.getByText('Verified Registry')).toBeInTheDocument()
    expect(screen.getByText('IREC Standard')).toBeInTheDocument()
  })

  it('uses fallback values for registry and methodology', () => {
    const projectWithFallbacks = {
      ...mockProject,
      registry: null,
      methodology: null,
      certificationBody: 'Test Body',
      backing: 'Test Backing',
    }

    render(
      <ProjectCard
        project={projectWithFallbacks}
        index={0}
        onViewDetails={mockOnViewDetails}
      />
    )

    expect(screen.getByText('Test Body')).toBeInTheDocument()
    expect(screen.getByText('Test Backing')).toBeInTheDocument()
  })

  it('handles keyboard navigation on View Details button', async () => {
    const user = userEvent.setup()

    render(
      <ProjectCard
        project={mockProject}
        index={0}
        onViewDetails={mockOnViewDetails}
      />
    )

    const viewDetailsButton = screen.getByRole('button', { name: /view details/i })
    
    await user.tab()
    expect(viewDetailsButton).toHaveFocus()
    
    await user.keyboard('{Enter}')
    expect(mockOnViewDetails).toHaveBeenCalledWith(mockProject)
  })

  it('is accessible with proper ARIA attributes', () => {
    render(
      <ProjectCard
        project={mockProject}
        index={0}
        onViewDetails={mockOnViewDetails}
      />
    )

    const viewDetailsButton = screen.getByRole('button', { name: /view details/i })
    expect(viewDetailsButton).toBeInTheDocument()
    expect(viewDetailsButton).toHaveAttribute('type', 'button')
  })

  it('handles large numbers correctly in CO2 reduction display', () => {
    const projectWithLargeNumbers = {
      ...mockProject,
      co2Reduction: {
        total: '1000000',
      },
    }

    render(
      <ProjectCard
        project={projectWithLargeNumbers}
        index={0}
        onViewDetails={mockOnViewDetails}
      />
    )

    expect(screen.getByText('1,000,000 Tokens')).toBeInTheDocument()
    expect(screen.getByText('1,000,000 tCO2e')).toBeInTheDocument()
  })

  it('renders multiple compliance badges correctly', () => {
    const projectWithManyCompliance = {
      ...mockProject,
      compliance: ['EU Taxonomy', 'TCFD', 'Gold Standard', 'CDM', 'IREC'],
    }

    render(
      <ProjectCard
        project={projectWithManyCompliance}
        index={0}
        onViewDetails={mockOnViewDetails}
      />
    )

    expect(screen.getByText('EU Taxonomy')).toBeInTheDocument()
    expect(screen.getByText('TCFD')).toBeInTheDocument()
    expect(screen.getByText('Gold Standard')).toBeInTheDocument()
    expect(screen.getByText('CDM')).toBeInTheDocument()
    expect(screen.getByText('IREC')).toBeInTheDocument()
  })
})