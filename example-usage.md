# R2 Project Data System Usage

## How to Use the R2 JSON Data System

### 1. Initialize with your R2 URL

```typescript
import { initializeProjectData } from '@/lib/project-data-manager'

// Initialize with your R2 URL when the app starts
initializeProjectData('https://your-r2-bucket-url.com/projects.json')
```

### 2. Expected JSON Structure

Your JSON file should follow this structure:

```json
{
  "projects": [
    {
      "id": "project-1",
      "name": "Solar Farm Initiative",
      "description": "Large-scale solar power generation project",
      "type": "Renewable Energy",
      "location": "California, USA",
      "country": "United States",
      "coordinates": { "lat": 34.0522, "lng": -118.2437 },
      "tokenAddress": "0x1234567890abcdef...",
      "tokenSymbol": "SOLAR001",
      "tokenName": "Solar Farm Token",
      "totalSupply": "1000000",
      "currentSupply": "750000",
      "retired": "250000",
      "vintage": "2024",
      "methodology": "VCS",
      "certificationBody": "Verra",
      "projectDeveloper": "Green Energy Corp",
      "verificationDate": "2024-01-15T00:00:00Z",
      "co2Reduction": {
        "annual": "500000",
        "total": "2000000",
        "unit": "tCO2e"
      },
      "pricing": {
        "currentPrice": "35.00",
        "currency": "USD"
      },
      "compliance": ["EU Taxonomy", "TCFD"],
      "status": "active",
      "rating": "AA+",
      "liquidity": "high",
      "institutionalBacking": ["BlackRock", "Vanguard"],
      "images": {
        "thumbnail": "https://your-cdn.com/solar-farm-thumb.jpg"
      },
      "metrics": {
        "totalInvestment": "50000000",
        "jobsCreated": "150",
        "communitiesImpacted": "5"
      },
      "holders": 234,
      "transfers": 1500,
      "lastUpdate": "2024-11-06T10:30:00Z",
      "isVerified": true,
      "tags": ["solar", "renewable", "verified", "california"]
    }
  ],
  "metadata": {
    "total": 1,
    "page": 1,
    "pageSize": 50,
    "lastUpdated": "2024-11-06T10:30:00Z",
    "version": "1.0.0"
  }
}
```

### 3. Using in Components

```typescript
import { co2eApi } from '@/lib/co2e-api'
import { useEffect, useState } from 'react'

function MyComponent() {
  const [projects, setProjects] = useState([])
  
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const projectData = await co2eApi.getProjects()
        setProjects(projectData)
      } catch (error) {
        console.error('Failed to fetch projects:', error)
      }
    }
    
    fetchProjects()
  }, [])
  
  return (
    <div>
      {projects.map(project => (
        <div key={project.id}>
          <h3>{project.name}</h3>
          <p>{project.description}</p>
          <p>CO2 Reduction: {project.co2Reduction.total} {project.co2Reduction.unit}</p>
        </div>
      ))}
    </div>
  )
}
```

### 4. Available API Methods

```typescript
// Get all projects
const projects = await co2eApi.getProjects()

// Get project by ID
const project = await co2eApi.getProjectById('project-1')

// Get projects by type
const renewableProjects = await co2eApi.getProjectsByType('Renewable Energy')

// Get projects by country
const usProjects = await co2eApi.getProjectsByCountry('United States')

// Search projects
const searchResults = await co2eApi.searchProjects('solar')

// Get project statistics
const stats = await co2eApi.getProjectStats()
```

### 5. Configuration Options

You can also configure the system through environment variables:

```bash
NEXT_PUBLIC_PROJECTS_DATA_URL=https://your-r2-bucket-url.com/projects.json
```

### 6. Error Handling & Fallbacks

The system includes:
- Automatic retry on failed requests
- Caching to reduce API calls
- Fallback to sample data if R2 is unavailable
- Comprehensive error logging

### 7. Testing the Connection

```typescript
import { testProjectDataConnection } from '@/lib/project-data-manager'

const testResult = await testProjectDataConnection()
if (testResult.success) {
  console.log(`Connected successfully! Found ${testResult.projectCount} projects`)
} else {
  console.error('Connection failed:', testResult.error)
}
```

## Benefits of This System

1. **Flexibility**: Easy to update project data without code changes
2. **Performance**: Built-in caching and error handling
3. **Scalability**: Can handle large datasets efficiently
4. **Reliability**: Fallback mechanisms ensure the app always works
5. **Type Safety**: Full TypeScript support for data structures