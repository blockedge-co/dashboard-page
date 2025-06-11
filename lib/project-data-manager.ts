import { co2eApi } from './co2e-api'
import { setProjectsDataUrl, getConfig } from './config'

export class ProjectDataManager {
  private static instance: ProjectDataManager
  private isInitialized = false

  private constructor() {}

  static getInstance(): ProjectDataManager {
    if (!ProjectDataManager.instance) {
      ProjectDataManager.instance = new ProjectDataManager()
    }
    return ProjectDataManager.instance
  }

  // Initialize with R2 URL
  initialize(r2Url: string): void {
    if (this.isInitialized) {
      console.log('ProjectDataManager already initialized')
      return
    }

    try {
      // Validate URL format
      new URL(r2Url)
      
      // Set the URL in config and API service
      setProjectsDataUrl(r2Url)
      co2eApi.setProjectsDataUrl(r2Url)
      
      this.isInitialized = true
      console.log('ProjectDataManager initialized with R2 URL:', r2Url)
    } catch (error) {
      console.error('Invalid R2 URL provided:', error)
      throw new Error(`Invalid R2 URL: ${r2Url}`)
    }
  }

  // Update R2 URL (for when the URL changes)
  updateUrl(newR2Url: string): void {
    try {
      new URL(newR2Url)
      setProjectsDataUrl(newR2Url)
      co2eApi.setProjectsDataUrl(newR2Url)
      console.log('R2 URL updated:', newR2Url)
    } catch (error) {
      console.error('Invalid R2 URL provided:', error)
      throw new Error(`Invalid R2 URL: ${newR2Url}`)
    }
  }

  // Check if initialized
  isReady(): boolean {
    return this.isInitialized && !!getConfig().r2.projectsDataUrl
  }

  // Get current status
  getStatus(): {
    initialized: boolean
    hasUrl: boolean
    url: string | undefined
    fallbackEnabled: boolean
  } {
    const config = getConfig()
    return {
      initialized: this.isInitialized,
      hasUrl: !!config.r2.projectsDataUrl,
      url: config.r2.projectsDataUrl,
      fallbackEnabled: config.r2.fallbackToSample
    }
  }

  // Force refresh data (clears cache)
  async refreshData(): Promise<void> {
    if (!this.isInitialized) {
      throw new Error('ProjectDataManager not initialized')
    }
    
    try {
      const projects = await co2eApi.getProjects()
      console.log(`Refreshed data: ${projects.length} projects loaded`)
    } catch (error) {
      console.error('Error refreshing project data:', error)
      throw error
    }
  }

  // Test connection to R2
  async testConnection(): Promise<{
    success: boolean
    projectCount: number
    error?: string
  }> {
    if (!this.isInitialized) {
      return {
        success: false,
        projectCount: 0,
        error: 'ProjectDataManager not initialized'
      }
    }

    try {
      const projects = await co2eApi.getProjects()
      return {
        success: true,
        projectCount: projects.length
      }
    } catch (error) {
      return {
        success: false,
        projectCount: 0,
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    }
  }
}

// Export singleton instance
export const projectDataManager = ProjectDataManager.getInstance()

// Export convenience functions
export const initializeProjectData = (r2Url: string) => projectDataManager.initialize(r2Url)
export const updateProjectDataUrl = (r2Url: string) => projectDataManager.updateUrl(r2Url)
export const isProjectDataReady = () => projectDataManager.isReady()
export const getProjectDataStatus = () => projectDataManager.getStatus()
export const refreshProjectData = () => projectDataManager.refreshData()
export const testProjectDataConnection = () => projectDataManager.testConnection()