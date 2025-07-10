"use client"

import { BasePanel } from '@/components/panels/base-panel'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Progress } from '@/components/ui/progress'
import { 
  Award, 
  Shield, 
  Globe, 
  Zap, 
  Calendar, 
  MapPin, 
  Building2,
  Users,
  Leaf,
  TrendingUp,
  CheckCircle,
  AlertCircle,
  ExternalLink,
  Copy,
  Eye,
  FileText,
  BarChart3
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface IrecCertificateDetailsProps {
  data: any[]
  className?: string
}

export function IrecCertificateDetails({ data = [], className }: IrecCertificateDetailsProps) {
  // Get the first certificate for detailed view (in a real app, this would be selectable)
  const selectedCertificate = data[0] || {
    id: 'irec-001',
    certificateId: 'IREC-DEMO-001',
    projectName: 'Hydropower Plant Demo',
    country: 'Vietnam',
    technology: 'Hydroelectric',
    vintage: { year: 2024 },
    supply: { total: '450000', available: '320000', retired: '130000' },
    verification: { verifiedBy: 'TUV SUD', registry: 'International REC Standard' },
    environmental: { co2Avoided: 100000, co2Unit: 'tCO2e' },
    trading: { currentPrice: 45.50, currency: 'USD' },
    metadata: { status: 'active' }
  }

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`
    return num.toLocaleString()
  }

  const formatCurrency = (num: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(num)
  }

  const getStatusBadge = (status: string) => {
    const variants = {
      active: 'bg-green-900/20 text-green-400 border-green-400',
      retired: 'bg-red-900/20 text-red-400 border-red-400',
      suspended: 'bg-yellow-900/20 text-yellow-400 border-yellow-400',
      cancelled: 'bg-gray-900/20 text-gray-400 border-gray-400'
    }
    
    return (
      <Badge className={cn('text-xs', variants[status as keyof typeof variants] || variants.active)}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    )
  }

  const supplyUtilization = selectedCertificate.supply ? 
    ((parseFloat(selectedCertificate.supply.total) - parseFloat(selectedCertificate.supply.available)) / parseFloat(selectedCertificate.supply.total)) * 100 : 0

  const retirementRate = selectedCertificate.supply ? 
    (parseFloat(selectedCertificate.supply.retired) / parseFloat(selectedCertificate.supply.total)) * 100 : 0

  return (
    <BasePanel 
      title="Certificate Details"
      description="Detailed information about selected IREC certificate"
      size="md"
      className={cn("bg-gradient-to-br from-[#181B1F] to-[#1A1D23]", className)}
      headerAction={
        <div className="flex items-center gap-2">
          <Button size="sm" variant="outline" className="h-8 px-3">
            <Eye className="h-4 w-4 mr-1" />
            View
          </Button>
        </div>
      }
    >
      <div className="space-y-6">
        {/* Certificate Header */}
        <div className="space-y-4">
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Award className="h-5 w-5 text-blue-500" />
                <h3 className="text-lg font-semibold text-gray-100">
                  {selectedCertificate.projectName}
                </h3>
              </div>
              <div className="flex items-center gap-2">
                <code className="text-sm bg-gray-700 px-2 py-1 rounded text-green-400">
                  {selectedCertificate.certificateId}
                </code>
                <Button size="sm" variant="ghost" className="h-6 w-6 p-0">
                  <Copy className="h-3 w-3" />
                </Button>
              </div>
            </div>
            {getStatusBadge(selectedCertificate.metadata.status)}
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-2 gap-4">
            <Card className="bg-[#1E2328] border-gray-700">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm text-gray-400">Total Supply</div>
                    <div className="text-lg font-bold text-gray-100">
                      {formatNumber(parseFloat(selectedCertificate.supply?.total || '0'))}
                    </div>
                  </div>
                  <Zap className="h-5 w-5 text-green-500" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-[#1E2328] border-gray-700">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm text-gray-400">Current Price</div>
                    <div className="text-lg font-bold text-gray-100">
                      {formatCurrency(selectedCertificate.trading?.currentPrice || 0)}
                    </div>
                  </div>
                  <TrendingUp className="h-5 w-5 text-purple-500" />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Detailed Information Tabs */}
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-[#1E2328] border-gray-700">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="technical">Technical</TabsTrigger>
            <TabsTrigger value="compliance">Compliance</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            {/* Supply Information */}
            <Card className="bg-[#1E2328] border-gray-700">
              <CardHeader>
                <CardTitle className="text-sm font-semibold text-gray-100 flex items-center gap-2">
                  <BarChart3 className="h-4 w-4" />
                  Supply Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-400">Available Supply</span>
                      <span className="text-sm font-medium text-green-400">
                        {formatNumber(parseFloat(selectedCertificate.supply?.available || '0'))}
                      </span>
                    </div>
                    <Progress value={100 - supplyUtilization} className="h-2" />
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-400">Retired Supply</span>
                      <span className="text-sm font-medium text-red-400">
                        {formatNumber(parseFloat(selectedCertificate.supply?.retired || '0'))}
                      </span>
                    </div>
                    <Progress value={retirementRate} className="h-2" />
                  </div>

                  <div className="grid grid-cols-2 gap-4 pt-2">
                    <div className="text-center">
                      <div className="text-lg font-bold text-blue-400">{supplyUtilization.toFixed(1)}%</div>
                      <div className="text-xs text-gray-500">Utilization</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-red-400">{retirementRate.toFixed(1)}%</div>
                      <div className="text-xs text-gray-500">Retirement</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Project Information */}
            <Card className="bg-[#1E2328] border-gray-700">
              <CardHeader>
                <CardTitle className="text-sm font-semibold text-gray-100 flex items-center gap-2">
                  <Building2 className="h-4 w-4" />
                  Project Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-400">Location:</span>
                    <span className="text-sm text-gray-300">{selectedCertificate.country}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Zap className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-400">Technology:</span>
                    <span className="text-sm text-gray-300">{selectedCertificate.technology}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-400">Vintage:</span>
                    <span className="text-sm text-gray-300">{selectedCertificate.vintage?.year}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Leaf className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-400">CO2 Avoided:</span>
                    <span className="text-sm text-gray-300">
                      {formatNumber(selectedCertificate.environmental?.co2Avoided || 0)} {selectedCertificate.environmental?.co2Unit}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="technical" className="space-y-4">
            {/* Technical Specifications */}
            <Card className="bg-[#1E2328] border-gray-700">
              <CardHeader>
                <CardTitle className="text-sm font-semibold text-gray-100 flex items-center gap-2">
                  <Zap className="h-4 w-4" />
                  Technical Specifications
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-sm text-gray-400">Energy Source</div>
                      <div className="text-sm font-medium text-gray-100">Renewable</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-400">Capacity</div>
                      <div className="text-sm font-medium text-gray-100">50 MW</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-400">Annual Generation</div>
                      <div className="text-sm font-medium text-gray-100">150 GWh</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-400">Efficiency</div>
                      <div className="text-sm font-medium text-gray-100">85%</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Environmental Impact */}
            <Card className="bg-[#1E2328] border-gray-700">
              <CardHeader>
                <CardTitle className="text-sm font-semibold text-gray-100 flex items-center gap-2">
                  <Leaf className="h-4 w-4" />
                  Environmental Impact
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-400">CO2 Reduction</span>
                    <span className="text-sm font-medium text-green-400">
                      {formatNumber(selectedCertificate.environmental?.co2Avoided || 0)} tCO2e
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-400">Renewable %</span>
                    <span className="text-sm font-medium text-green-400">100%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-400">Grid Emission Factor</span>
                    <span className="text-sm font-medium text-gray-300">0.6 kg CO2/kWh</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="compliance" className="space-y-4">
            {/* Verification Details */}
            <Card className="bg-[#1E2328] border-gray-700">
              <CardHeader>
                <CardTitle className="text-sm font-semibold text-gray-100 flex items-center gap-2">
                  <Shield className="h-4 w-4" />
                  Verification Details
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-sm text-gray-400">Verified by:</span>
                    <span className="text-sm text-gray-300">{selectedCertificate.verification?.verifiedBy}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-sm text-gray-400">Registry:</span>
                    <span className="text-sm text-gray-300">{selectedCertificate.verification?.registry}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-sm text-gray-400">Standard:</span>
                    <span className="text-sm text-gray-300">IREC</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Compliance Status */}
            <Card className="bg-[#1E2328] border-gray-700">
              <CardHeader>
                <CardTitle className="text-sm font-semibold text-gray-100 flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Compliance Status
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-400">EU Taxonomy</span>
                    <div className="flex items-center gap-1">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-sm text-green-400">Compliant</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-400">TCFD</span>
                    <div className="flex items-center gap-1">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-sm text-green-400">Compliant</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-400">SBTi</span>
                    <div className="flex items-center gap-1">
                      <AlertCircle className="h-4 w-4 text-yellow-500" />
                      <span className="text-sm text-yellow-400">Pending</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Action Buttons */}
        <div className="flex flex-col gap-2">
          <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
            <ExternalLink className="h-4 w-4 mr-2" />
            View Full Certificate
          </Button>
          <Button variant="outline" className="w-full bg-[#1E2328] border-gray-700 text-gray-100 hover:bg-gray-700">
            <FileText className="h-4 w-4 mr-2" />
            Download Report
          </Button>
        </div>

        {/* Certificate Selection */}
        {data.length > 1 && (
          <Card className="bg-[#1E2328] border-gray-700">
            <CardHeader>
              <CardTitle className="text-sm font-semibold text-gray-100">Other Certificates</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {data.slice(1, 4).map((cert, index) => (
                  <div key={cert.id} className="flex items-center justify-between p-2 rounded hover:bg-gray-700/50 cursor-pointer">
                    <div>
                      <div className="text-sm font-medium text-gray-300">{cert.projectName}</div>
                      <div className="text-xs text-gray-500">{cert.certificateId}</div>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {cert.metadata.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </BasePanel>
  )
}