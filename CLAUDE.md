# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build Commands

```bash
# Development
npm run dev          # Start development server (http://localhost:3000)

# Production
npm run build        # Build for production
npm run start        # Start production server

# Code Quality
npm run lint         # Run ESLint
npm run type-check   # TypeScript type checking

# Testing & Verification
node test-production-readiness.js    # Verify production configuration
node test-blockchain-integration.js  # Test blockchain features
node test-co2e-integration.js       # Test CO2e Chain integration
node test-real-data.js              # Test real data fetching
npm run verify-production           # Run all verification checks
```

## High-Level Architecture

This is a **Next.js 14 carbon credit dashboard** that connects to the BlockEdge blockchain platform.

### Core Technology Stack
- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **UI**: Radix UI + shadcn/ui components
- **Styling**: Tailwind CSS
- **State**: React Hook Form + Zod validation
- **Charts**: Recharts

### Data Flow Architecture
1. **Primary Data Source**: `https://asset.blockedge.co/blockedge-co2e-project.json`
2. **Data Manager**: `lib/project-data-manager.ts` handles fetching and 5-minute caching
3. **Blockchain API**: `lib/co2e-api.ts` connects to CO2e Chain (`https://exp.co2e.cc/api/v2`)
4. **NFT Integration**: `lib/nft-service.ts` fetches project images from blockchain metadata

### Key Architectural Patterns

**Centralized Data Management**
- All project data flows through `ProjectDataManager` singleton
- Automatic 5-minute cache with background refresh
- Error resilience with retry logic

**Environment-Based Configuration**
```typescript
// lib/config.ts manages all environment configs
NEXT_PUBLIC_PROJECTS_DATA_URL  // Required: Project data URL
NEXT_PUBLIC_API_BASE_URL       // Optional: CO2e Chain API
```

**Page Structure**
- `/dashboard` - Main dashboard with KPIs and charts
- `/projects` - Carbon credit projects listing
- `/analytics` - Detailed analytics
- `/reports` - Reports generation
- `/projects/[projectId]` - Individual project details

### Component Organization
- `components/ui/` - shadcn/ui base components (don't modify directly)
- `components/` - Custom dashboard components
- `app/` - Next.js app router pages and layouts

### Critical Implementation Details

**Real-Time Data Integration**
- Production uses live BlockEdge data (no mocks)
- All timestamps, metrics, and project details come from the API
- NFT metadata provides project images

**Blockchain Features**
- Contract addresses for each project
- Transaction tracking
- Retirement records
- CO2e Chain explorer integration

**Performance Considerations**
- Data cached for 5 minutes to reduce API calls
- Lazy loading for dashboard components
- Image optimization intentionally disabled for flexibility

### Development Workflow

1. **Adding New Features**
   - Check existing patterns in similar components
   - Use shadcn/ui components when possible
   - Follow the data flow through ProjectDataManager

2. **Modifying Data Display**
   - Update types in `types/project.ts`
   - Modify data fetching in `lib/project-data-manager.ts`
   - Update UI components to reflect changes

3. **Testing Changes**
   - Run `npm run dev` and check all pages
   - Run `node test-real-data.js` to verify data fetching
   - Run `npm run verify-production` before deploying

### Production Deployment

The app is configured for production with:
- Environment-based API URLs
- Error boundaries and fallbacks
- Production-ready build optimizations
- Comprehensive error logging

See `PRODUCTION_SETUP.md` and `DEPLOYMENT_CHECKLIST.md` for detailed deployment instructions.