# BlockEdge Dashboard - Production Setup

## ✅ Production Data Source Configuration

The BlockEdge Dashboard is now configured to fetch real data from the BlockEdge JSON API instead of using mock data.

### Data Source

- **URL**: `https://asset.blockedge.co/blockedge-co2e-project.json`
- **Format**: BlockEdge carbon credit projects JSON
- **Status**: ✅ Production Ready

### Environment Variables

#### Required

```bash
NEXT_PUBLIC_PROJECTS_DATA_URL=https://asset.blockedge.co/blockedge-co2e-project.json
```

#### Optional

```bash
NEXT_PUBLIC_API_BASE_URL=https://exp.co2e.cc/api/v2
```

### Configuration Changes Made

1. **Disabled Sample Data Fallback**

   - Set `fallbackToSample: false` in config
   - Application now requires real data URL
   - Throws error if no URL configured

2. **Updated JSON Parser**

   - Fixed interface to match actual JSON structure
   - Proper handling of `projects` array within each standard
   - Enhanced error handling for invalid data

3. **Environment Configuration**
   - Created `.env.example` with required variables
   - Added `.env.local` for local development
   - Automatic initialization from environment variables

### Data Structure

The application now correctly parses the BlockEdge JSON format:

```json
{
  "carbonCreditProjects": {
    "VCS": {
      "standardName": "Verified Carbon Standard",
      "standardCode": "VCS",
      "registry": "Verra",
      "projects": [
        {
          "projectId": "VCS1529",
          "projectName": "Inner Mongolia Chao'er Improved Forest Management Project",
          "token": "0x83f1a935008a4e01Cc755d453155572Fdb921cf7",
          "cert": "0x3224304c75C5118af069bA7ce0b290aCd067E46E"
        }
      ]
    }
  }
}
```

### Features

- ✅ Real-time data fetching from BlockEdge API
- ✅ NFT metadata integration for project images
- ✅ Automatic data caching (5 minutes)
- ✅ Error handling and retry logic
- ✅ Production-ready configuration
- ✅ Environment variable support

### Deployment

1. **Set Environment Variables**

   ```bash
   NEXT_PUBLIC_PROJECTS_DATA_URL=https://asset.blockedge.co/blockedge-co2e-project.json
   ```

2. **Build and Deploy**
   ```bash
   npm run build
   npm run start
   ```

### Verification

The dashboard will:

- ✅ Fetch real project data from BlockEdge JSON
- ✅ Display actual carbon credit projects
- ✅ Show real token addresses and certificate contracts
- ✅ Integrate with NFT metadata for project images
- ❌ No longer use mock/sample data

### Error Handling

If the data URL is not configured, the application will:

- Throw a clear error message
- Prevent startup with invalid configuration
- Guide users to set required environment variables
