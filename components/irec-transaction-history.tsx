"use client"

import { useState, useMemo } from 'react'
import { BasePanel } from '@/components/panels/base-panel'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table'
import { 
  Activity, 
  ArrowUpDown, 
  ArrowUp, 
  ArrowDown, 
  Search, 
  Filter, 
  Download, 
  ExternalLink, 
  CheckCircle, 
  XCircle, 
  Clock, 
  AlertCircle,
  TrendingUp,
  TrendingDown,
  Repeat,
  Zap,
  ShoppingCart,
  Send,
  Trash2
} from 'lucide-react'
import { cn } from '@/lib/utils'
import type { 
  IrecOptimismTransaction, 
  IrecOptimismActivity, 
  OptimismTransactionType 
} from '@/lib/types/irec'

interface IrecTransactionHistoryProps {
  certificateId?: string
  activity: IrecOptimismActivity
  className?: string
}

export function IrecTransactionHistory({ 
  certificateId, 
  activity, 
  className 
}: IrecTransactionHistoryProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedType, setSelectedType] = useState<OptimismTransactionType | 'all'>('all')
  const [sortField, setSortField] = useState<keyof IrecOptimismTransaction>('blockTimestamp')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc')

  // Get transaction type info
  const getTransactionTypeInfo = (type: OptimismTransactionType) => {
    const typeMap = {
      tokenize: {
        icon: Zap,
        label: 'Tokenize',
        color: 'bg-blue-500',
        description: 'Certificate tokenized'
      },
      buy: {
        icon: ShoppingCart,
        label: 'Buy',
        color: 'bg-green-500',
        description: 'Certificate purchased'
      },
      sell: {
        icon: TrendingDown,
        label: 'Sell',
        color: 'bg-red-500',
        description: 'Certificate sold'
      },
      transfer: {
        icon: Send,
        label: 'Transfer',
        color: 'bg-purple-500',
        description: 'Certificate transferred'
      },
      retire: {
        icon: Trash2,
        label: 'Retire',
        color: 'bg-gray-500',
        description: 'Certificate retired'
      },
      redeem: {
        icon: Repeat,
        label: 'Redeem',
        color: 'bg-yellow-500',
        description: 'Certificate redeemed'
      }
    }
    return typeMap[type]
  }

  // Get status info
  const getStatusInfo = (status: string) => {
    const statusMap = {
      confirmed: {
        icon: CheckCircle,
        color: 'text-green-400',
        bgColor: 'bg-green-400/10',
        label: 'Confirmed'
      },
      pending: {
        icon: Clock,
        color: 'text-yellow-400',
        bgColor: 'bg-yellow-400/10',
        label: 'Pending'
      },
      failed: {
        icon: XCircle,
        color: 'text-red-400',
        bgColor: 'bg-red-400/10',
        label: 'Failed'
      },
      reverted: {
        icon: AlertCircle,
        color: 'text-orange-400',
        bgColor: 'bg-orange-400/10',
        label: 'Reverted'
      }
    }
    return statusMap[status as keyof typeof statusMap] || statusMap.pending
  }

  // Filter and sort transactions
  const filteredTransactions = useMemo(() => {
    let filtered = [...activity.recentTransactions]

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(tx => 
        tx.transactionHash.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tx.from.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tx.to.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tx.methodName.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Filter by type
    if (selectedType !== 'all') {
      filtered = filtered.filter(tx => tx.type === selectedType)
    }

    // Sort transactions
    filtered.sort((a, b) => {
      const aValue = a[sortField]
      const bValue = b[sortField]
      
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortDirection === 'asc' 
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue)
      }
      
      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sortDirection === 'asc' ? aValue - bValue : bValue - aValue
      }
      
      return 0
    })

    return filtered
  }, [activity.recentTransactions, searchTerm, selectedType, sortField, sortDirection])

  // Format values
  const formatAmount = (amount: string) => {
    const num = parseFloat(amount)
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`
    return num.toLocaleString()
  }

  const formatValue = (value: string) => {
    return `$${parseFloat(value).toLocaleString()}`
  }

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }

  const formatDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const handleSort = (field: keyof IrecOptimismTransaction) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection('asc')
    }
  }

  const getSortIcon = (field: keyof IrecOptimismTransaction) => {
    if (sortField !== field) return <ArrowUpDown className="h-4 w-4" />
    return sortDirection === 'asc' ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />
  }

  return (
    <BasePanel 
      title="Transaction History"
      description="Complete transaction history for IREC certificates on Optimism"
      size="lg"
      className={cn("bg-gradient-to-br from-[#181B1F] to-[#1A1D23]", className)}
      headerAction={
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-blue-400 border-blue-400">
            <Activity className="h-3 w-3 mr-1" />
            {activity.totalTransactions} Transactions
          </Badge>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      }
    >
      <div className="space-y-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="bg-[#1E2328] border-gray-700">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">Total Volume</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-100">
                {formatAmount(activity.totalVolume)}
              </div>
              <div className="text-xs text-gray-500">MWh Traded</div>
            </CardContent>
          </Card>

          <Card className="bg-[#1E2328] border-gray-700">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">Total Value</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-400">
                {formatValue(activity.totalValue)}
              </div>
              <div className="text-xs text-gray-500">USD Volume</div>
            </CardContent>
          </Card>

          <Card className="bg-[#1E2328] border-gray-700">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">Avg. Price</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-400">
                {formatValue(activity.statistics.averagePrice)}
              </div>
              <div className="text-xs text-gray-500">Per MWh</div>
            </CardContent>
          </Card>

          <Card className="bg-[#1E2328] border-gray-700">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">Avg. Size</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-400">
                {formatAmount(activity.statistics.averageTransactionSize)}
              </div>
              <div className="text-xs text-gray-500">MWh per TX</div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search by hash, address, or method..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-[#1E2328] border-gray-700"
              />
            </div>
          </div>
          <Select value={selectedType} onValueChange={(value) => setSelectedType(value as OptimismTransactionType | 'all')}>
            <SelectTrigger className="w-48 bg-[#1E2328] border-gray-700">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="tokenize">Tokenize</SelectItem>
              <SelectItem value="buy">Buy</SelectItem>
              <SelectItem value="sell">Sell</SelectItem>
              <SelectItem value="transfer">Transfer</SelectItem>
              <SelectItem value="retire">Retire</SelectItem>
              <SelectItem value="redeem">Redeem</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Transaction Table */}
        <Card className="bg-[#1E2328] border-gray-700">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-100">
              Recent Transactions ({filteredTransactions.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-gray-700 hover:bg-gray-800/50">
                    <TableHead className="text-gray-300">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => handleSort('blockTimestamp')}
                        className="h-8 px-2 text-gray-300 hover:text-white"
                      >
                        Time
                        {getSortIcon('blockTimestamp')}
                      </Button>
                    </TableHead>
                    <TableHead className="text-gray-300">Type</TableHead>
                    <TableHead className="text-gray-300">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => handleSort('amount')}
                        className="h-8 px-2 text-gray-300 hover:text-white"
                      >
                        Amount
                        {getSortIcon('amount')}
                      </Button>
                    </TableHead>
                    <TableHead className="text-gray-300">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => handleSort('totalValue')}
                        className="h-8 px-2 text-gray-300 hover:text-white"
                      >
                        Value
                        {getSortIcon('totalValue')}
                      </Button>
                    </TableHead>
                    <TableHead className="text-gray-300">From</TableHead>
                    <TableHead className="text-gray-300">To</TableHead>
                    <TableHead className="text-gray-300">Status</TableHead>
                    <TableHead className="text-gray-300">Hash</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTransactions.map((tx) => {
                    const typeInfo = getTransactionTypeInfo(tx.type)
                    const statusInfo = getStatusInfo(tx.status)
                    const TypeIcon = typeInfo.icon
                    const StatusIcon = statusInfo.icon

                    return (
                      <TableRow key={tx.id} className="border-gray-700 hover:bg-gray-800/50">
                        <TableCell className="text-gray-300">
                          <div className="text-sm">
                            {formatDate(tx.blockTimestamp)}
                          </div>
                          <div className="text-xs text-gray-500">
                            Block {tx.blockNumber}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div className={`w-8 h-8 rounded-full ${typeInfo.color} flex items-center justify-center`}>
                              <TypeIcon className="h-4 w-4 text-white" />
                            </div>
                            <div>
                              <div className="text-sm font-medium text-gray-100">{typeInfo.label}</div>
                              <div className="text-xs text-gray-500">{typeInfo.description}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="text-gray-300">
                          <div className="text-sm font-medium">
                            {formatAmount(tx.amount)} MWh
                          </div>
                          <div className="text-xs text-gray-500">
                            {formatAmount(tx.amountInTokens)} tokens
                          </div>
                        </TableCell>
                        <TableCell className="text-gray-300">
                          <div className="text-sm font-medium">
                            {formatValue(tx.totalValue)}
                          </div>
                          <div className="text-xs text-gray-500">
                            @{formatValue(tx.pricePerToken)}
                          </div>
                        </TableCell>
                        <TableCell className="text-gray-300">
                          <div className="text-sm font-mono">
                            {formatAddress(tx.from)}
                          </div>
                        </TableCell>
                        <TableCell className="text-gray-300">
                          <div className="text-sm font-mono">
                            {formatAddress(tx.to)}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full ${statusInfo.bgColor}`}>
                            <StatusIcon className={`h-3 w-3 ${statusInfo.color}`} />
                            <span className={`text-xs font-medium ${statusInfo.color}`}>
                              {statusInfo.label}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="text-gray-300">
                          <div className="flex items-center gap-1">
                            <span className="text-sm font-mono">
                              {formatAddress(tx.transactionHash)}
                            </span>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => window.open(`https://optimistic.etherscan.io/tx/${tx.transactionHash}`, '_blank')}
                            >
                              <ExternalLink className="h-3 w-3" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Transaction Type Breakdown */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Card className="bg-[#1E2328] border-gray-700">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-gray-100">
                Transaction Types
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {Object.entries(activity.transactionsByType).map(([type, count]) => {
                  const typeInfo = getTransactionTypeInfo(type as OptimismTransactionType)
                  const TypeIcon = typeInfo.icon
                  const percentage = (count / activity.totalTransactions) * 100
                  
                  return (
                    <div key={type} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className={`w-6 h-6 rounded-full ${typeInfo.color} flex items-center justify-center`}>
                          <TypeIcon className="h-3 w-3 text-white" />
                        </div>
                        <span className="text-sm text-gray-300">{typeInfo.label}</span>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium text-gray-100">{count}</div>
                        <div className="text-xs text-gray-500">{percentage.toFixed(1)}%</div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-[#1E2328] border-gray-700">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-gray-100">
                Top Participants
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="buyers" className="w-full">
                <TabsList className="grid w-full grid-cols-2 bg-[#2A2D31]">
                  <TabsTrigger value="buyers">Top Buyers</TabsTrigger>
                  <TabsTrigger value="sellers">Top Sellers</TabsTrigger>
                </TabsList>
                
                <TabsContent value="buyers" className="space-y-3 mt-4">
                  {activity.topBuyers.slice(0, 5).map((buyer, index) => (
                    <div key={buyer.address} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center text-xs font-bold text-white">
                          {index + 1}
                        </div>
                        <span className="text-sm font-mono text-gray-300">
                          {formatAddress(buyer.address)}
                        </span>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium text-gray-100">
                          {formatAmount(buyer.volume)} MWh
                        </div>
                        <div className="text-xs text-gray-500">
                          {formatValue(buyer.value)}
                        </div>
                      </div>
                    </div>
                  ))}
                </TabsContent>
                
                <TabsContent value="sellers" className="space-y-3 mt-4">
                  {activity.topSellers.slice(0, 5).map((seller, index) => (
                    <div key={seller.address} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-red-500 flex items-center justify-center text-xs font-bold text-white">
                          {index + 1}
                        </div>
                        <span className="text-sm font-mono text-gray-300">
                          {formatAddress(seller.address)}
                        </span>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium text-gray-100">
                          {formatAmount(seller.volume)} MWh
                        </div>
                        <div className="text-xs text-gray-500">
                          {formatValue(seller.value)}
                        </div>
                      </div>
                    </div>
                  ))}
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </BasePanel>
  )
}