# Grafana-Style Dashboard System

This document explains the implementation and usage of the new Grafana-style navigation and panel management system for the Blockedge carbon credit dashboard.

## Features

### 🎯 Core Features
- **Multi-tab Dashboard Navigation**: 5 specialized views (Overview, Retirement Analytics, Tokenization Metrics, Real-time Monitoring, Historical Analysis)
- **Panel Management**: Resize, reorder, fullscreen, and remove panels
- **Time Range Controls**: 12 predefined time ranges from 5 minutes to 90 days
- **Auto-refresh System**: Configurable refresh intervals from 5 seconds to 1 hour
- **Real-time Updates**: Live data updates with visual indicators
- **Professional UI**: Grafana-inspired dark theme with smooth animations

### 🔧 Panel Capabilities
- **Fullscreen Mode**: Click the maximize button to expand any panel
- **Individual Refresh**: Refresh specific panels independently
- **Drag & Drop**: Reposition panels using the grip handle
- **Resize**: Drag the bottom-right corner to resize panels
- **Settings Menu**: Panel-specific configuration options
- **Remove Panels**: Clean up your dashboard by removing unnecessary panels

### ⏰ Time Controls
- **Quick Ranges**: Last 5m, 15m, 30m, 1h, 3h, 6h, 12h, 1d, 2d, 7d, 30d, 90d
- **Auto-refresh**: Off, 5s, 10s, 30s, 1m, 5m, 15m, 30m, 1h
- **Manual Refresh**: Force refresh all panels
- **Export**: Download dashboard data

## Dashboard Tabs

### 1. Overview Dashboard
- **KPI Cards**: Revenue, Credits Issued, Active Users, Projects
- **Time Series Chart**: Carbon credits over time
- **Activity Feed**: Recent system activity
- **System Status**: Real-time health monitoring
- **Progress Tracking**: Monthly goals and achievements

### 2. Retirement Analytics
- **Retirement Volume**: Monthly retirement trends
- **Sector Analysis**: Retirements by industry sector
- **Distribution Charts**: Retirement breakdown
- **Trend Analysis**: Historical retirement patterns

### 3. Tokenization Metrics
- **Tokenization Rate**: Daily token creation metrics
- **Token Status**: Distribution of token states
- **Project Analysis**: Tokenization by project type
- **Supply Metrics**: Total supply and burn tracking

### 4. Real-time Monitoring
- **Live Metrics**: Transactions per second, active users, latency
- **Transaction Feed**: Real-time transaction stream
- **Activity Monitor**: Live system activity
- **Health Dashboard**: Real-time system status

### 5. Historical Analysis
- **Long-term Trends**: Historical carbon credit patterns
- **Comparative Analysis**: Year-over-year comparisons
- **Performance Tracking**: Historical system performance
- **Growth Metrics**: Long-term growth indicators

## File Structure

```
components/
├── grafana-dashboard.tsx          # Core dashboard framework
├── dashboard-panels.tsx           # Panel components library
├── enhanced-grafana-dashboard.tsx # Complete dashboard implementation
└── grafana-dashboard-demo.tsx     # Demo/example usage

app/
└── grafana/
    └── page.tsx                   # Standalone Grafana dashboard page
```

## Usage

### Accessing the Dashboard
Navigate to `/grafana` to access the standalone Grafana-style dashboard, or use the "Grafana" link in the main navigation.

### Creating Custom Panels
```typescript
// Example custom panel
export function CustomPanel({ title, data }: { title: string; data: any }) {
  return (
    <Card className="bg-slate-800/50 border-slate-700/50 h-full">
      <CardHeader>
        <CardTitle className="text-lg text-slate-200">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        {/* Your panel content */}
      </CardContent>
    </Card>
  );
}
```

### Adding Panels to Tabs
```typescript
// In enhanced-grafana-dashboard.tsx
const panelConfigurations = {
  overview: [
    {
      id: "custom-panel",
      component: () => <CustomPanel title="My Panel" data={myData} />,
      gridClass: "col-span-6" // Responsive grid classes
    }
  ]
};
```

### Panel Grid System
The dashboard uses a 12-column CSS Grid system:
- `col-span-3`: 25% width (ideal for KPIs)
- `col-span-4`: 33% width
- `col-span-6`: 50% width (ideal for charts)
- `col-span-8`: 67% width
- `col-span-12`: 100% width (full-width panels)

## Panel Types Available

### KPI Panels
- **Purpose**: Display key performance indicators
- **Features**: Trend indicators, color coding, change percentages
- **Best for**: Metrics, counters, status indicators

### Chart Panels
- **Time Series**: Line charts for temporal data
- **Bar Charts**: Categorical comparisons
- **Pie Charts**: Distribution visualization
- **Area Charts**: Cumulative trends

### Information Panels
- **Activity Feed**: Real-time event streams
- **Status Panel**: System health monitoring
- **Progress Panel**: Goal tracking with progress bars

## Customization

### Theming
The dashboard uses Tailwind CSS with a dark theme optimized for monitoring:
- **Background**: Slate-900 gradient
- **Panels**: Semi-transparent slate-800
- **Accents**: Emerald for positive trends, red for alerts
- **Text**: Carefully balanced contrast for readability

### Responsive Design
- **Desktop**: Full grid layout with all features
- **Tablet**: Adaptive column spans
- **Mobile**: Stacked layout (handled by existing responsive system)

### Time Range Customization
Add custom time ranges in `grafana-dashboard.tsx`:
```typescript
const timeRanges: TimeRange[] = [
  // Add your custom ranges
  { from: "now-2h", to: "now", display: "Last 2 hours" },
];
```

## Performance Considerations

### Data Updates
- **Panels refresh independently** based on their update frequency
- **Time range changes** trigger immediate refresh of all panels
- **Auto-refresh** can be disabled for performance on slower devices

### Memory Management
- **Panel data** is cached and reused when possible
- **Chart animations** are optimized for smooth performance
- **Large datasets** are automatically sampled for charts

## Integration with Existing System

The Grafana dashboard integrates seamlessly with the existing Blockedge system:
- **Uses existing data sources** from the carbon credit API
- **Shares authentication** and user permissions
- **Maintains consistent** branding and styling
- **Preserves existing** navigation and layout structure

## Future Enhancements

Planned improvements for the dashboard system:
- **Custom dashboard creation** - Allow users to build personalized dashboards
- **Advanced filtering** - Filter data by project, date range, user
- **Alert system** - Configure alerts for specific thresholds
- **Data export** - Export panel data in various formats
- **Panel templates** - Save and reuse panel configurations
- **Collaborative features** - Share dashboards with team members

## Technical Details

### Dependencies
- **React 18+**: Core framework
- **Framer Motion**: Smooth animations
- **Recharts**: Chart visualization
- **Radix UI**: Accessible components
- **Tailwind CSS**: Styling system

### Browser Support
- **Chrome/Edge**: 90+ (full support)
- **Firefox**: 88+ (full support)
- **Safari**: 14+ (full support)
- **Mobile browsers**: iOS Safari 14+, Chrome Mobile 90+

---

This Grafana-style dashboard provides a professional, feature-rich monitoring interface that enhances the Blockedge carbon credit platform with advanced analytics and real-time monitoring capabilities.