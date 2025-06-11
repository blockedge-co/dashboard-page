// NFT Service for fetching ERC721 metadata and images from CO2e Chain

interface NFTMetadata {
  name?: string
  description?: string
  image?: string
  external_url?: string
  attributes?: Array<{
    trait_type: string
    value: string | number
  }>
}

interface NFTContractInfo {
  tokenId: string
  contractAddress: string
  metadata?: NFTMetadata
  imageUrl?: string
  error?: string
}

class NFTService {
  private readonly CO2E_CHAIN_RPC = 'https://exp.co2e.cc/api'
  private cache = new Map<string, NFTContractInfo>()
  private readonly CACHE_DURATION = 30 * 60 * 1000 // 30 minutes for better performance
  private readonly MAX_CONCURRENT_REQUESTS = 2 // Limit concurrent requests

  // Fetch NFT metadata from CO2e Chain
  async fetchNFTMetadata(contractAddress: string, tokenId: string = "1"): Promise<NFTContractInfo> {
    const cacheKey = `${contractAddress}-${tokenId}`
    
    // Check cache first
    if (this.cache.has(cacheKey)) {
      const cached = this.cache.get(cacheKey)!
      return cached
    }

    const result: NFTContractInfo = {
      tokenId,
      contractAddress
    }

    try {
      console.log(`Fetching NFT metadata for contract: ${contractAddress}`)
      
      // Try to get token info from CO2e Chain API
      const tokenInfo = await this.fetchTokenInfoFromAPI(contractAddress)
      
      if (tokenInfo) {
        result.metadata = {
          name: tokenInfo.name || "Carbon Credit Certificate",
          description: tokenInfo.description || "Verified carbon credit certificate",
          image: tokenInfo.image || this.generateFallbackImage(contractAddress)
        }
        result.imageUrl = tokenInfo.image || this.generateFallbackImage(contractAddress)
      } else {
        // Fallback: Generate placeholder image with contract info
        result.imageUrl = this.generateFallbackImage(contractAddress)
        result.metadata = {
          name: "Carbon Credit Certificate",
          description: "Verified carbon credit certificate",
          image: result.imageUrl
        }
      }

      // Cache the result
      this.cache.set(cacheKey, result)
      
      // Set cache expiration
      setTimeout(() => {
        this.cache.delete(cacheKey)
      }, this.CACHE_DURATION)

      return result

    } catch (error) {
      console.error(`Error fetching NFT metadata for ${contractAddress}:`, error)
      
      result.error = error instanceof Error ? error.message : 'Unknown error'
      result.imageUrl = this.generateFallbackImage(contractAddress)
      result.metadata = {
        name: "Carbon Credit Certificate",
        description: "Verified carbon credit certificate",
        image: result.imageUrl
      }

      return result
    }
  }

  // Fetch token information from CO2e Chain API
  private async fetchTokenInfoFromAPI(contractAddress: string): Promise<any> {
    try {
      // Try different API endpoints to get token information
      const endpoints = [
        `/tokens/${contractAddress}`,
        `/tokens/${contractAddress}/instances/1`,
        `/address/${contractAddress}`
      ]

      for (const endpoint of endpoints) {
        try {
          const response = await fetch(`${this.CO2E_CHAIN_RPC}${endpoint}`)
          if (response.ok) {
            const data = await response.json()
            
            // Extract relevant information
            if (data.metadata) {
              return this.parseMetadata(data.metadata)
            }
            
            if (data.name || data.symbol) {
              return {
                name: data.name,
                description: data.name || data.symbol,
                image: this.extractImageFromData(data)
              }
            }
          }
        } catch (error) {
          continue // Try next endpoint
        }
      }

      return null
    } catch (error) {
      console.warn(`Could not fetch token info from API for ${contractAddress}`)
      return null
    }
  }

  // Parse metadata from various formats
  private parseMetadata(metadata: any): any {
    if (typeof metadata === 'string') {
      try {
        return JSON.parse(metadata)
      } catch {
        return { description: metadata }
      }
    }
    return metadata
  }

  // Extract image URL from token data
  private extractImageFromData(data: any): string | undefined {
    // Look for common image fields
    const imageFields = ['image', 'image_url', 'logo_url', 'icon_url', 'thumbnail']
    
    for (const field of imageFields) {
      if (data[field]) {
        return this.processImageUrl(data[field])
      }
    }
    
    // Check in metadata
    if (data.metadata) {
      const metadata = this.parseMetadata(data.metadata)
      for (const field of imageFields) {
        if (metadata[field]) {
          return this.processImageUrl(metadata[field])
        }
      }
    }
    
    return undefined
  }

  // Process and validate image URLs
  private processImageUrl(url: string): string {
    // Handle IPFS URLs
    if (url.startsWith('ipfs://')) {
      return `https://ipfs.io/ipfs/${url.replace('ipfs://', '')}`
    }
    
    // Handle relative URLs
    if (url.startsWith('/')) {
      return `https://exp.co2e.cc${url}`
    }
    
    // Return as-is if it's already a valid HTTP URL
    if (url.startsWith('http')) {
      return url
    }
    
    return url
  }

  // Generate a fallback image with contract address styling
  private generateFallbackImage(contractAddress: string): string {
    // Create a unique color based on contract address
    const hash = contractAddress.slice(2, 8) // Use first 6 chars after 0x
    const color1 = `#${hash.slice(0, 3)}`
    const color2 = `#${hash.slice(3, 6)}`
    
    // Generate a gradient placeholder using a service like placeholder.pics or create SVG
    const svg = `
      <svg width="400" height="300" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:${color1};stop-opacity:1" />
            <stop offset="100%" style="stop-color:${color2};stop-opacity:1" />
          </linearGradient>
        </defs>
        <rect width="400" height="300" fill="url(#grad)"/>
        <text x="200" y="130" font-family="Arial" font-size="16" fill="white" text-anchor="middle">
          Carbon Credit Certificate
        </text>
        <text x="200" y="160" font-family="Arial" font-size="12" fill="rgba(255,255,255,0.8)" text-anchor="middle">
          ${contractAddress.slice(0, 10)}...${contractAddress.slice(-6)}
        </text>
        <circle cx="200" cy="200" r="30" fill="none" stroke="white" stroke-width="2" opacity="0.6"/>
        <path d="M190 200 L200 210 L210 190" stroke="white" stroke-width="3" fill="none" opacity="0.8"/>
      </svg>
    `
    
    // Convert SVG to data URL
    const dataUrl = `data:image/svg+xml;base64,${btoa(svg)}`
    return dataUrl
  }

  // Batch fetch multiple NFT metadata (optimized for performance)
  async fetchMultipleNFTMetadata(contracts: string[]): Promise<Map<string, NFTContractInfo>> {
    const results = new Map<string, NFTContractInfo>()
    
    // Check cache first for all contracts
    const uncachedContracts = contracts.filter(contract => {
      const cached = this.cache.get(`${contract}-1`)
      if (cached) {
        results.set(contract, cached)
        return false
      }
      return true
    })

    if (uncachedContracts.length === 0) {
      return results
    }
    
    // Process contracts in smaller batches with rate limiting
    const batchSize = this.MAX_CONCURRENT_REQUESTS
    for (let i = 0; i < uncachedContracts.length; i += batchSize) {
      const batch = uncachedContracts.slice(i, i + batchSize)
      
      const batchResults = await Promise.allSettled(
        batch.map(contract => this.fetchNFTMetadata(contract))
      )
      
      batchResults.forEach((result, index) => {
        const contractAddress = batch[index]
        if (result.status === 'fulfilled') {
          results.set(contractAddress, result.value)
        } else {
          const fallbackResult = {
            tokenId: "1",
            contractAddress,
            error: result.reason?.message || 'Failed to fetch',
            imageUrl: this.generateFallbackImage(contractAddress)
          }
          results.set(contractAddress, fallbackResult)
          // Cache the fallback result too
          this.cache.set(`${contractAddress}-1`, fallbackResult)
        }
      })
      
      // Add delay between batches to avoid rate limiting and reduce server load
      if (i + batchSize < uncachedContracts.length) {
        await new Promise(resolve => setTimeout(resolve, 2000))
      }
    }
    
    return results
  }

  // Clear cache
  clearCache(): void {
    this.cache.clear()
  }

  // Get cache size
  getCacheSize(): number {
    return this.cache.size
  }
}

// Export singleton instance
export const nftService = new NFTService()

// Export types
export type { NFTMetadata, NFTContractInfo }