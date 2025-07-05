"use client"

import { StatPanel, ChartPanel, TablePanel, AlertPanel } from './index'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, BarChart, Bar } from 'recharts'

// Sample data for demonstrations
const chartData = [
  { name: 'Jan', value: 400, secondary: 240 },
  { name: 'Feb', value: 300, secondary: 139 },
  { name: 'Mar', value: 200, secondary: 980 },
  { name: 'Apr', value: 278, secondary: 390 },
  { name: 'May', value: 189, secondary: 480 },
  { name: 'Jun', value: 239, secondary: 380 },
]

const tableData = [
  { id: 1, name: 'Project Alpha', status: 'Active', credits: 1250, verified: true },
  { id: 2, name: 'Project Beta', status: 'Pending', credits: 850, verified: false },
  { id: 3, name: 'Project Gamma', status: 'Active', credits: 2100, verified: true },
  { id: 4, name: 'Project Delta', status: 'Completed', credits: 950, verified: true },
]

const tableColumns = [
  { key: 'name', label: 'Project Name', sortable: true },
  { key: 'status', label: 'Status', align: 'center' as const },
  { key: 'credits', label: 'Credits', align: 'right' as const, sortable: true },
  { 
    key: 'verified', 
    label: 'Verified', 
    align: 'center' as const,
    render: (value: boolean) => (
      <span className={value ? 'text-green-500' : 'text-red-500'}>
        {value ? '✓' : '✗'}
      </span>
    )
  }
]

const sampleAlerts = [
  {
    id: '1',
    type: 'error' as const,
    severity: 'high' as const,
    title: 'High Carbon Usage Detected',
    message: 'Project Alpha is exceeding carbon credit limits by 15%',
    timestamp: new Date(Date.now() - 15 * 60000),
    actionLabel: 'Review Project',
    onAction: () => console.log('Review project action'),
    dismissible: true
  },
  {
    id: '2',
    type: 'warning' as const,
    severity: 'medium' as const,
    title: 'Verification Pending',
    message: 'Project Beta requires manual verification',
    timestamp: new Date(Date.now() - 2 * 60 * 60000),
    actionLabel: 'Verify Now',
    onAction: () => console.log('Verify action'),
    dismissible: true
  },
  {
    id: '3',
    type: 'success' as const,
    severity: 'low' as const,
    title: 'Monthly Target Achieved',
    message: 'Carbon reduction goal met 3 days ahead of schedule',
    timestamp: new Date(Date.now() - 4 * 60 * 60000),
    dismissible: true
  }
]

export function PanelDemo() {
  return (
    <div className="min-h-screen bg-[#0F1419] p-6">
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white">Grafana-Style Panel System</h1>
          <p className="mt-2 text-gray-400">
            Reusable dashboard components with dark theme and responsive design
          </p>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-12 gap-4">
          <StatPanel
            title="Total Credits"
            value={5150}
            change={12.5}
            trend="up"
            unit="CO2e"
            size="sm"
          />
          <StatPanel
            title="Active Projects"
            value={23}
            change={-2.1}
            trend="down"
            previousValue={25}
            size="sm"
          />
          <StatPanel
            title="Verified Credits"
            value="4,890"
            change={8.3}
            trend="up"
            unit="tons"
            size="sm"
          />
          <StatPanel
            title="Compliance Rate"
            value={98.7}
            change={0.5}
            trend="neutral"
            unit="%"
            precision={1}
            size="sm"
          />
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-12 gap-4">
          <ChartPanel
            title="Carbon Credit Trends"
            description="Monthly carbon credit generation and consumption"
            timeRange="Last 6 months"
            refreshInterval="5m"
            size="lg"
            onExport={() => console.log('Export chart')}
            onFullscreen={() => console.log('Fullscreen chart')}
          >
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="name" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <Line type="monotone" dataKey="value" stroke="#3B82F6" strokeWidth={2} />
                <Line type="monotone" dataKey="secondary" stroke="#10B981" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </ChartPanel>

          <ChartPanel
            title="Project Distribution"
            description="Credits by project type"
            size="md"
          >
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="name" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <Bar dataKey="value" fill="#3B82F6" />
              </BarChart>
            </ResponsiveContainer>
          </ChartPanel>
        </div>

        {/* Table and Alerts Row */}
        <div className="grid grid-cols-12 gap-4">
          <TablePanel
            title="Recent Projects"
            description="Latest carbon credit projects and their status"
            size="lg"
            columns={tableColumns}
            data={tableData}
            onSearch={(query) => console.log('Search:', query)}
            onFilter={() => console.log('Filter clicked')}
            onExport={() => console.log('Export table')}
            onSort={(column, direction) => console.log('Sort:', column, direction)}
          />

          <AlertPanel
            title="System Alerts"
            description="Important notifications and warnings"
            size="md"
            alerts={sampleAlerts}
            onDismiss={(id) => console.log('Dismiss alert:', id)}
            onActionClick={(id, action) => {
              console.log('Alert action:', id)
              action()
            }}
          />
        </div>

        {/* Loading and Error States */}
        <div className="grid grid-cols-12 gap-4">
          <StatPanel
            title="Loading Example"
            value={0}
            loading={true}
            size="sm"
          />
          <StatPanel
            title="Error Example"
            value={0}
            error="Failed to load data"
            size="sm"
          />
          <ChartPanel
            title="Chart Loading"
            loading={true}
            size="md"
          >
            <div />
          </ChartPanel>
          <AlertPanel
            title="No Alerts"
            alerts={[]}
            size="sm"
          />
        </div>
      </div>
    </div>
  )
}