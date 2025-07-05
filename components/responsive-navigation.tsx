"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Menu,
  X,
  Globe,
  BarChart3,
  DollarSign,
  Coins,
  Search,
  Shield,
  ChevronDown,
  Home
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface NavigationItem {
  id: string;
  label: string;
  shortLabel: string;
  icon: React.ComponentType<any>;
  badge?: string;
}

const navigationItems: NavigationItem[] = [
  {
    id: "portfolio",
    label: "Global Portfolio",
    shortLabel: "Portfolio",
    icon: Globe,
  },
  {
    id: "analytics",
    label: "Intelligence Analytics",
    shortLabel: "Analytics",
    icon: BarChart3,
  },
  {
    id: "retirement",
    label: "Retirement",
    shortLabel: "Retirement",
    icon: DollarSign,
  },
  {
    id: "tokenization",
    label: "Tokenization",
    shortLabel: "Tokens",
    icon: Coins,
    badge: "New"
  },
  {
    id: "explorer",
    label: "Institutional Explorer",
    shortLabel: "Explorer",
    icon: Search,
  },
  {
    id: "compliance",
    label: "Compliance & Governance",
    shortLabel: "Compliance",
    icon: Shield,
  },
];

interface ResponsiveNavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  className?: string;
}

export function ResponsiveNavigation({
  activeTab,
  onTabChange,
  className = ""
}: ResponsiveNavigationProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Close mobile menu when tab changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [activeTab]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen]);

  const activeItem = navigationItems.find(item => item.id === activeTab);

  if (isMobile) {
    return (
      <div className={className}>
        {/* Mobile Navigation Header */}
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 to-teal-500/10 rounded-xl blur-xl" />
          <div className="relative bg-slate-800/70 backdrop-blur-md border border-white/5 rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center">
                  {activeItem && <activeItem.icon className="w-4 h-4 text-white" />}
                </div>
                <div>
                  <h2 className="text-white font-medium">
                    {activeItem?.shortLabel || "Dashboard"}
                  </h2>
                  <p className="text-xs text-slate-400">
                    {activeItem?.label || "CO2e Chain Dashboard"}
                  </p>
                </div>
              </div>
              
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="text-slate-300 hover:text-white hover:bg-slate-700/50"
                aria-label="Toggle navigation menu"
              >
                <AnimatePresence mode="wait">
                  {isMobileMenuOpen ? (
                    <motion.div
                      key="close"
                      initial={{ rotate: -90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: 90, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <X className="w-5 h-5" />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="menu"
                      initial={{ rotate: 90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: -90, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Menu className="w-5 h-5" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Menu Overlay */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <>
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
                onClick={() => setIsMobileMenuOpen(false)}
              />
              
              {/* Menu Panel */}
              <motion.div
                initial={{ x: "100%", opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: "100%", opacity: 0 }}
                transition={{ type: "spring", damping: 25, stiffness: 200 }}
                className="fixed top-0 right-0 h-full w-80 max-w-[85vw] bg-slate-900/95 backdrop-blur-xl border-l border-white/10 z-50 overflow-y-auto"
              >
                <div className="p-6">
                  {/* Header */}
                  <div className="flex items-center justify-between mb-8">
                    <div>
                      <h3 className="text-xl font-bold text-white">Navigation</h3>
                      <p className="text-sm text-slate-400">Select a section</p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="text-slate-400 hover:text-white"
                    >
                      <X className="w-5 h-5" />
                    </Button>
                  </div>

                  {/* Navigation Items */}
                  <div className="space-y-2">
                    {navigationItems.map((item, index) => (
                      <motion.button
                        key={item.id}
                        initial={{ x: 50, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: index * 0.05 }}
                        onClick={() => onTabChange(item.id)}
                        className={`w-full flex items-center gap-3 p-4 rounded-xl transition-all duration-200 ${
                          activeTab === item.id
                            ? "bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-lg"
                            : "bg-slate-800/50 text-slate-300 hover:bg-slate-700/50 hover:text-white"
                        }`}
                      >
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                          activeTab === item.id
                            ? "bg-white/20"
                            : "bg-slate-700/50"
                        }`}>
                          <item.icon className="w-5 h-5" />
                        </div>
                        <div className="flex-1 text-left">
                          <div className="font-medium">{item.label}</div>
                          {item.id === "analytics" && (
                            <div className="text-xs opacity-75">ML-powered insights</div>
                          )}
                          {item.id === "compliance" && (
                            <div className="text-xs opacity-75">47 jurisdictions</div>
                          )}
                        </div>
                        {item.badge && (
                          <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-500/30">
                            {item.badge}
                          </Badge>
                        )}
                        {activeTab === item.id && (
                          <motion.div
                            layoutId="activeIndicator"
                            className="w-1 h-8 bg-white rounded-full"
                          />
                        )}
                      </motion.button>
                    ))}
                  </div>

                  {/* Footer */}
                  <div className="mt-8 pt-6 border-t border-slate-700/50">
                    <Button
                      variant="outline"
                      className="w-full border-slate-700 text-slate-300 hover:bg-slate-700/50"
                      onClick={() => window.location.href = '/'}
                    >
                      <Home className="w-4 h-4 mr-2" />
                      Back to Home
                    </Button>
                  </div>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    );
  }

  // Desktop Navigation (existing tabs)
  return (
    <div className={className}>
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 to-teal-500/10 rounded-xl blur-xl" />
        <div className="relative grid grid-cols-6 bg-slate-800/70 backdrop-blur-md border border-white/5 rounded-xl p-1">
          {navigationItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`flex items-center justify-center gap-2 p-3 rounded-lg transition-all duration-200 group relative ${
                activeTab === item.id
                  ? "bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-lg"
                  : "text-slate-300 hover:text-white hover:bg-slate-700/50"
              }`}
            >
              <item.icon className="w-4 h-4" />
              <span className="hidden sm:inline font-medium">
                {item.shortLabel}
              </span>
              <span className="sm:hidden font-medium">
                {item.shortLabel}
              </span>
              {item.badge && (
                <Badge className="absolute -top-1 -right-1 scale-75 bg-emerald-500/20 text-emerald-300 border-emerald-500/30">
                  {item.badge}
                </Badge>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}