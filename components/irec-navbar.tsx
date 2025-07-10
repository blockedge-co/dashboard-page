"use client"

import React, { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { usePathname } from "next/navigation"
import Link from "next/link"
import { 
  Award, 
  Menu, 
  X, 
  Filter, 
  Search, 
  TrendingUp, 
  BarChart3, 
  Globe, 
  Settings, 
  Download,
  Leaf,
  ArrowLeft
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"

interface IrecNavbarProps {
  onSearchChange?: (query: string) => void
  onFiltersOpen?: () => void
  totalCertificates?: number
  activeFilters?: number
}

const navItems = [
  { name: "All Certificates", href: "/irec-certificates", icon: Award },
  { name: "Analytics", href: "/irec-certificates/analytics", icon: BarChart3 },
  { name: "Market Data", href: "/irec-certificates/market", icon: TrendingUp },
  { name: "Global View", href: "/irec-certificates/global", icon: Globe },
]

export function IrecNavbar({ 
  onSearchChange, 
  onFiltersOpen, 
  totalCertificates = 0, 
  activeFilters = 0 
}: IrecNavbarProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const pathname = usePathname()

  const handleSearchChange = (value: string) => {
    setSearchQuery(value)
    onSearchChange?.(value)
  }

  return (
    <div className="bg-black/20 backdrop-blur-md border-b border-white/10 sticky top-16 z-40">
      {/* Main Navigation Bar */}
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Left Section - Back Button & Title */}
          <div className="flex items-center gap-4">
            <Link href="/dashboard">
              <Button variant="ghost" size="sm" className="text-slate-300 hover:text-white hover:bg-white/10">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Dashboard
              </Button>
            </Link>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center shadow-lg shadow-emerald-500/20">
                <Award className="w-4 h-4 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">IREC Certificates</h1>
                <p className="text-sm text-slate-400">
                  {totalCertificates.toLocaleString()} certificates available
                </p>
              </div>
            </div>
          </div>

          {/* Right Section - Search & Actions */}
          <div className="hidden md:flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input
                placeholder="Search certificates..."
                value={searchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="pl-10 w-64 bg-white/10 border-white/20 text-white placeholder:text-slate-400 focus:border-emerald-400 focus:ring-emerald-400"
              />
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onFiltersOpen}
              className="text-slate-300 hover:text-white hover:bg-white/10 relative"
            >
              <Filter className="w-4 h-4 mr-2" />
              Filters
              {activeFilters > 0 && (
                <Badge className="ml-2 bg-emerald-500 text-white px-1 py-0 text-xs">
                  {activeFilters}
                </Badge>
              )}
            </Button>
            <Button variant="ghost" size="sm" className="text-slate-300 hover:text-white hover:bg-white/10">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
            <Button variant="ghost" size="sm" className="text-slate-300 hover:text-white hover:bg-white/10">
              <Settings className="w-4 h-4" />
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Button variant="ghost" size="icon" onClick={() => setIsMobileMenuOpen(true)}>
              <Menu className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Desktop Sub-navigation */}
        <div className="hidden md:flex items-center gap-1 mt-4">
          {navItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link key={item.name} href={item.href}>
                <Button
                  variant="ghost"
                  size="sm"
                  className={`text-slate-300 hover:text-white hover:bg-white/10 relative ${
                    isActive ? "text-emerald-400 bg-white/5" : ""
                  }`}
                >
                  <item.icon className="w-4 h-4 mr-2" />
                  {item.name}
                  {isActive && (
                    <motion.div
                      layoutId="activeIrecTab"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-400"
                      initial={false}
                      transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    />
                  )}
                </Button>
              </Link>
            )
          })}
        </div>

        {/* Mobile Search Bar */}
        <div className="md:hidden mt-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              placeholder="Search certificates..."
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="pl-10 w-full bg-white/10 border-white/20 text-white placeholder:text-slate-400 focus:border-emerald-400 focus:ring-emerald-400"
            />
          </div>
          <div className="flex items-center gap-2 mt-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={onFiltersOpen}
              className="text-slate-300 hover:text-white hover:bg-white/10 relative flex-1"
            >
              <Filter className="w-4 h-4 mr-2" />
              Filters
              {activeFilters > 0 && (
                <Badge className="ml-2 bg-emerald-500 text-white px-1 py-0 text-xs">
                  {activeFilters}
                </Badge>
              )}
            </Button>
            <Button variant="ghost" size="sm" className="text-slate-300 hover:text-white hover:bg-white/10">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed inset-0 z-50 bg-slate-900/95 backdrop-blur-md md:hidden"
          >
            <div className="flex flex-col h-full">
              <div className="flex items-center justify-between p-4 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center">
                    <Award className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-xl font-bold bg-gradient-to-r from-emerald-400 to-teal-300 bg-clip-text text-transparent">
                    IREC Certificates
                  </span>
                </div>
                <Button variant="ghost" size="icon" onClick={() => setIsMobileMenuOpen(false)}>
                  <X className="w-6 h-6" />
                </Button>
              </div>
              <div className="flex-1 overflow-y-auto p-4">
                <nav className="space-y-2">
                  {navItems.map((item) => {
                    const isActive = pathname === item.href
                    return (
                      <Link key={item.name} href={item.href} onClick={() => setIsMobileMenuOpen(false)}>
                        <Button
                          variant="ghost"
                          className={`w-full justify-start text-lg font-medium text-slate-300 hover:text-white hover:bg-white/10 ${
                            isActive ? "text-emerald-400 bg-white/5" : ""
                          }`}
                        >
                          <item.icon className="w-5 h-5 mr-3" />
                          {item.name}
                        </Button>
                      </Link>
                    )
                  })}
                </nav>

                <div className="mt-8 pt-4 border-t border-slate-800">
                  <p className="text-sm text-slate-400 mb-3">Quick Actions</p>
                  <div className="space-y-2">
                    <Button
                      variant="ghost"
                      className="w-full justify-start text-slate-300 hover:text-white hover:bg-white/10"
                      onClick={() => {
                        onFiltersOpen?.()
                        setIsMobileMenuOpen(false)
                      }}
                    >
                      <Filter className="w-5 h-5 mr-3" />
                      Advanced Filters
                      {activeFilters > 0 && (
                        <Badge className="ml-auto bg-emerald-500 text-white px-2 py-0 text-xs">
                          {activeFilters}
                        </Badge>
                      )}
                    </Button>
                    <Button
                      variant="ghost"
                      className="w-full justify-start text-slate-300 hover:text-white hover:bg-white/10"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <Download className="w-5 h-5 mr-3" />
                      Export Data
                    </Button>
                    <Button
                      variant="ghost"
                      className="w-full justify-start text-slate-300 hover:text-white hover:bg-white/10"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <Settings className="w-5 h-5 mr-3" />
                      Settings
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}