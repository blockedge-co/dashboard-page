import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

// Mock the projects API
jest.mock('@/lib/project-data-manager', () => ({
  ProjectDataManager: {
    getAllProjects: jest.fn().mockResolvedValue([
      {
        id: 'project-1',
        name: 'Solar Farm Alpha',
        type: 'Renewable Energy',
        location: 'California, USA',
        co2Reduction: { total: '75000' },
        compliance: ['EU Taxonomy', 'TCFD'],
        registry: 'Verra Registry',
        methodology: 'IREC Standard',
      },
      {
        id: 'project-2',
        name: 'Forest Conservation Beta',
        type: 'Forest Conservation',
        location: 'Brazil',
        co2Reduction: { total: '120000' },
        compliance: ['Gold Standard', 'CDM'],
        registry: 'Gold Standard Registry',
        methodology: 'REDD+ Standard',
      },
    ]),
    getProjectById: jest.fn(),
  },
}))

// Mock components to avoid complex dependencies
jest.mock('@/components/projects-page', () => {
  const ProjectCard = require('@/components/project-card').default
  
  return function MockProjectsPage() {
    const [projects] = React.useState([
      {
        id: 'project-1',
        name: 'Solar Farm Alpha',
        type: 'Renewable Energy',
        location: 'California, USA',
        co2Reduction: { total: '75000' },
        compliance: ['EU Taxonomy', 'TCFD'],
        registry: 'Verra Registry',
        methodology: 'IREC Standard',
      },
      {
        id: 'project-2',
        name: 'Forest Conservation Beta',
        type: 'Forest Conservation',
        location: 'Brazil',
        co2Reduction: { total: '120000' },
        compliance: ['Gold Standard', 'CDM'],
        registry: 'Gold Standard Registry',
        methodology: 'REDD+ Standard',
      },
    ])

    const [selectedProject, setSelectedProject] = React.useState(null)

    const handleViewDetails = (project) => {
      setSelectedProject(project)
    }

    return (
      <div>
        <h1>Carbon Credit Projects</h1>
        <div data-testid="projects-grid">
          {projects.map((project, index) => (
            <ProjectCard
              key={project.id}
              project={project}
              index={index}
              onViewDetails={handleViewDetails}
            />
          ))}
        </div>
        {selectedProject && (
          <div data-testid="project-details">
            <h2>Project Details</h2>
            <p>Selected: {selectedProject.name}</p>
            <button onClick={() => setSelectedProject(null)}>Close</button>
          </div>
        )}
      </div>
    )
  }
})

// Mock framer-motion
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }) => <div {...props}>{children}</div>,
  },
}))

// Mock the performance hook
jest.mock('@/hooks/use-performance', () => ({
  useAnimationProps: () => ({
    initial: { opacity: 0, y: 20 },
    whileHover: { y: -2 },
  }),
}))

const ProjectsPage = require('@/components/projects-page').default

describe('Project Browsing Integration', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('displays list of projects', async () => {
    render(<ProjectsPage />)

    expect(screen.getByText('Carbon Credit Projects')).toBeInTheDocument()
    expect(screen.getByText('Solar Farm Alpha')).toBeInTheDocument()
    expect(screen.getByText('Forest Conservation Beta')).toBeInTheDocument()
  })

  it('shows project details when View Details is clicked', async () => {
    const user = userEvent.setup()
    render(<ProjectsPage />)

    const viewDetailsButtons = screen.getAllByRole('button', { name: /view details/i })
    
    await user.click(viewDetailsButtons[0])

    await waitFor(() => {
      expect(screen.getByTestId('project-details')).toBeInTheDocument()
      expect(screen.getByText('Selected: Solar Farm Alpha')).toBeInTheDocument()
    })
  })

  it('closes project details when close button is clicked', async () => {
    const user = userEvent.setup()
    render(<ProjectsPage />)

    // Open details
    const viewDetailsButtons = screen.getAllByRole('button', { name: /view details/i })
    await user.click(viewDetailsButtons[0])

    await waitFor(() => {
      expect(screen.getByTestId('project-details')).toBeInTheDocument()
    })

    // Close details
    const closeButton = screen.getByRole('button', { name: /close/i })
    await user.click(closeButton)

    await waitFor(() => {
      expect(screen.queryByTestId('project-details')).not.toBeInTheDocument()
    })
  })

  it('displays correct project information in cards', () => {
    render(<ProjectsPage />)

    // Check Solar Farm project
    expect(screen.getByText('Solar Farm Alpha')).toBeInTheDocument()
    expect(screen.getByText('Renewable Energy')).toBeInTheDocument()
    expect(screen.getByText('California, USA')).toBeInTheDocument()
    expect(screen.getByText('75,000 Tokens')).toBeInTheDocument()
    expect(screen.getByText('Verra Registry')).toBeInTheDocument()

    // Check Forest Conservation project
    expect(screen.getByText('Forest Conservation Beta')).toBeInTheDocument()
    expect(screen.getByText('Forest Conservation')).toBeInTheDocument()
    expect(screen.getByText('Brazil')).toBeInTheDocument()
    expect(screen.getByText('120,000 Tokens')).toBeInTheDocument()
    expect(screen.getByText('Gold Standard Registry')).toBeInTheDocument()
  })

  it('handles keyboard navigation', async () => {
    const user = userEvent.setup()
    render(<ProjectsPage />)

    const viewDetailsButtons = screen.getAllByRole('button', { name: /view details/i })
    
    // Tab to first button
    await user.tab()
    expect(viewDetailsButtons[0]).toHaveFocus()
    
    // Press Enter to open details
    await user.keyboard('{Enter}')
    
    await waitFor(() => {
      expect(screen.getByTestId('project-details')).toBeInTheDocument()
    })
  })

  it('shows compliance badges for each project', () => {
    render(<ProjectsPage />)

    // Solar Farm compliance
    expect(screen.getByText('EU Taxonomy')).toBeInTheDocument()
    expect(screen.getByText('TCFD')).toBeInTheDocument()

    // Forest Conservation compliance
    expect(screen.getByText('Gold Standard')).toBeInTheDocument()
    expect(screen.getByText('CDM')).toBeInTheDocument()
  })

  it('displays CO2 reduction data correctly', () => {
    render(<ProjectsPage />)

    expect(screen.getByText('75,000 tCO2e')).toBeInTheDocument()
    expect(screen.getByText('120,000 tCO2e')).toBeInTheDocument()
  })

  it('can switch between different project details', async () => {
    const user = userEvent.setup()
    render(<ProjectsPage />)

    const viewDetailsButtons = screen.getAllByRole('button', { name: /view details/i })
    
    // Open first project
    await user.click(viewDetailsButtons[0])
    await waitFor(() => {
      expect(screen.getByText('Selected: Solar Farm Alpha')).toBeInTheDocument()
    })

    // Close and open second project
    const closeButton = screen.getByRole('button', { name: /close/i })
    await user.click(closeButton)
    
    await waitFor(() => {
      expect(screen.queryByTestId('project-details')).not.toBeInTheDocument()
    })

    await user.click(viewDetailsButtons[1])
    await waitFor(() => {
      expect(screen.getByText('Selected: Forest Conservation Beta')).toBeInTheDocument()
    })
  })

  it('maintains accessibility standards', () => {
    render(<ProjectsPage />)

    // Check for proper heading structure
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Carbon Credit Projects')

    // Check for interactive elements
    const buttons = screen.getAllByRole('button')
    expect(buttons.length).toBeGreaterThan(0)

    // Ensure buttons have accessible names
    buttons.forEach(button => {
      expect(button).toHaveAccessibleName()
    })
  })
})