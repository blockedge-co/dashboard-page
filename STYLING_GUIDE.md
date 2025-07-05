# BlockEdge Dashboard - AI Styling Modification Guide

This comprehensive guide provides everything an AI needs to understand, modify, and enhance the styling of the BlockEdge Dashboard. The guide is based on multi-agent analysis of the codebase and provides practical, actionable instructions.

## Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [Color System Modifications](#color-system-modifications)
3. [Typography Modifications](#typography-modifications)
4. [Layout and Spacing](#layout-and-spacing)
5. [Component Styling Patterns](#component-styling-patterns)
6. [Animation System](#animation-system)
7. [Responsive Design](#responsive-design)
8. [Styling Examples and Templates](#styling-examples-and-templates)
9. [Best Practices and Conventions](#best-practices-and-conventions)
10. [Troubleshooting Guide](#troubleshooting-guide)
11. [Quick Reference](#quick-reference)

## Architecture Overview

### Technology Stack
- **Framework**: Next.js 14 with App Router
- **Styling**: Tailwind CSS v3.4.17 with utility-first approach
- **Components**: shadcn/ui built on Radix UI primitives
- **Theming**: CSS Custom Properties (CSS Variables) with HSL color space
- **Animations**: Framer Motion with performance optimizations
- **Icons**: Lucide React
- **Theme Management**: next-themes for dark/light mode switching

### File Structure
```
/app/
├── globals.css                 # Global styles and CSS variables
├── layout.tsx                  # Root layout with theme provider
├── page.tsx                    # Homepage (redirects to dashboard)
└── dashboard/
    └── page.tsx               # Main dashboard page

/components/
├── ui/                        # shadcn/ui base components
│   ├── button.tsx            # Button variants and styling
│   ├── card.tsx              # Card component system
│   ├── badge.tsx             # Status badges
│   └── ...                   # Other UI primitives
├── carbon-dashboard.tsx       # Main dashboard component
├── project-card.tsx          # Project display cards
└── loading-skeleton.tsx      # Loading states

/lib/
├── utils.ts                   # Utility functions (cn() for class merging)
└── ...

/styles/
└── globals.css               # Duplicate of app/globals.css

Configuration Files:
├── tailwind.config.ts         # Tailwind customizations
├── postcss.config.mjs        # PostCSS configuration
└── components.json           # shadcn/ui configuration
```

## Color System Modifications

### Understanding the Color Architecture

The dashboard uses a sophisticated HSL-based color system with CSS custom properties for comprehensive theming:

```css
/* Base structure: HSL without hsl() wrapper for flexibility */
:root {
  --background: 0 0% 100%;        /* Pure white */
  --foreground: 0 0% 3.9%;        /* Near black text */
  --primary: 0 0% 9%;             /* Dark primary */
  --primary-foreground: 0 0% 98%; /* Light text on primary */
}

.dark {
  --background: 0 0% 3.9%;        /* Dark background */
  --foreground: 0 0% 98%;         /* Light text */
  --primary: 0 0% 98%;            /* Light primary */
  --primary-foreground: 0 0% 9%;  /* Dark text on primary */
}
```

### How to Modify Colors

#### 1. Change Primary Brand Colors

**Location**: `app/globals.css`

**Example: Change from neutral gray to blue brand**:
```css
:root {
  /* Replace these values */
  --primary: 217 91% 60%;              /* Blue primary */
  --primary-foreground: 0 0% 100%;     /* White text */
  --ring: 217 91% 60%;                 /* Focus ring matches primary */
}

.dark {
  --primary: 217 91% 60%;              /* Same blue in dark mode */
  --primary-foreground: 0 0% 100%;     /* White text */
  --ring: 217 91% 60%;                 /* Consistent focus ring */
}
```

#### 2. Add Custom Brand Colors

**Add to tailwind.config.ts**:
```typescript
theme: {
  extend: {
    colors: {
      // Add custom brand colors
      brand: {
        50: 'hsl(217 100% 97%)',
        100: 'hsl(217 96% 91%)',
        200: 'hsl(217 92% 83%)',
        300: 'hsl(217 89% 74%)',
        400: 'hsl(217 91% 65%)',
        500: 'hsl(217 91% 60%)',  // Primary brand color
        600: 'hsl(217 91% 55%)',
        700: 'hsl(217 91% 50%)',
        800: 'hsl(217 91% 45%)',
        900: 'hsl(217 91% 40%)',
      },
      // Custom dashboard colors
      dashboard: {
        primary: 'hsl(var(--dashboard-primary))',
        secondary: 'hsl(var(--dashboard-secondary))',
        accent: 'hsl(var(--dashboard-accent))',
      }
    }
  }
}
```

**Add corresponding CSS variables**:
```css
:root {
  --dashboard-primary: 217 91% 60%;
  --dashboard-secondary: 173 58% 39%;
  --dashboard-accent: 27 87% 67%;
}
```

#### 3. Update Chart Colors

**Location**: `app/globals.css`

```css
:root {
  /* Chart colors for data visualization */
  --chart-1: 217 91% 60%;    /* Blue */
  --chart-2: 173 58% 39%;    /* Teal */
  --chart-3: 142 71% 45%;    /* Green */
  --chart-4: 38 92% 50%;     /* Orange */
  --chart-5: 350 89% 60%;    /* Red */
}

.dark {
  /* Darker variants for dark mode */
  --chart-1: 217 91% 55%;
  --chart-2: 173 58% 34%;
  --chart-3: 142 71% 40%;
  --chart-4: 38 92% 45%;
  --chart-5: 350 89% 55%;
}
```

#### 4. Dashboard-Specific Color Overrides

Some components use hard-coded colors. To modify the dark dashboard theme:

**Location**: `components/carbon-dashboard.tsx`

**Find and replace these patterns**:
```typescript
// Current dark theme
className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-900"

// Change to blue theme
className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-blue-900"

// Or create a more dynamic approach
className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-brand-900"
```

**Update card styling**:
```typescript
// Current
className="bg-slate-800/80 border-slate-700/50"

// Change to use CSS variables
className="bg-dashboard-card border-dashboard-border"
```

**Add corresponding CSS variables**:
```css
:root {
  --dashboard-card: 217 33% 12% / 0.8;      /* Blue-tinted dark card */
  --dashboard-border: 217 33% 17% / 0.5;    /* Blue-tinted border */
}
```

## Typography Modifications

### Current Typography System

The dashboard uses **Inter** font from Google Fonts with the following hierarchy:

```typescript
// Font configuration in app/layout.tsx
import { Inter } from 'next/font/google'

const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap' 
})
```

### How to Change Font Family

#### 1. Change Primary Font

**Location**: `app/layout.tsx`

```typescript
// Replace Inter with your chosen font
import { Roboto, Open_Sans, Poppins } from 'next/font/google'

const roboto = Roboto({ 
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  display: 'swap' 
})

// Apply to body
<body className={roboto.className}>
```

#### 2. Add Custom Font Stack

**Update tailwind.config.ts**:
```typescript
theme: {
  extend: {
    fontFamily: {
      sans: ['Inter', 'system-ui', 'sans-serif'],
      display: ['Poppins', 'Inter', 'system-ui', 'sans-serif'],
      mono: ['Fira Code', 'monospace'],
    }
  }
}
```

### Typography Scale Customization

#### Current Scale
- **H1**: `text-2xl font-semibold` (24px, 600 weight)
- **Body**: `text-sm` (14px)
- **Small**: `text-xs` (12px)
- **Muted**: `text-muted-foreground`

#### Custom Typography Scale

**Add to tailwind.config.ts**:
```typescript
theme: {
  extend: {
    fontSize: {
      'display': ['3.5rem', { lineHeight: '1.1', fontWeight: '700' }],
      'h1': ['2.5rem', { lineHeight: '1.2', fontWeight: '600' }],
      'h2': ['2rem', { lineHeight: '1.3', fontWeight: '600' }],
      'h3': ['1.5rem', { lineHeight: '1.4', fontWeight: '500' }],
      'body-lg': ['1.125rem', { lineHeight: '1.6', fontWeight: '400' }],
      'body': ['1rem', { lineHeight: '1.6', fontWeight: '400' }],
      'body-sm': ['0.875rem', { lineHeight: '1.5', fontWeight: '400' }],
      'caption': ['0.75rem', { lineHeight: '1.4', fontWeight: '400' }],
    }
  }
}
```

**Usage in components**:
```typescript
// Update component typography
<CardTitle className="text-h2">Project Overview</CardTitle>
<CardDescription className="text-body-sm text-muted-foreground">
  Carbon credit projects summary
</CardDescription>
```

## Layout and Spacing

### Current Spacing System

The dashboard uses Tailwind's default spacing scale (4px base unit):
- **xs**: 4px (`space-x-1`)
- **sm**: 8px (`space-x-2`)
- **md**: 12px (`space-x-3`)
- **lg**: 16px (`space-x-4`)
- **xl**: 24px (`space-x-6`)
- **2xl**: 32px (`space-x-8`)

### Grid System Patterns

#### 1. Responsive Metric Cards Grid

**Pattern**:
```typescript
<div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
  {/* Metrics cards */}
</div>
```

**Customization**:
```typescript
// For different breakpoint behavior
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-5 gap-4 md:gap-6">

// For equal-height cards
<div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 auto-rows-fr">
```

#### 2. Project Cards Grid

**Current pattern**:
```typescript
<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
  {/* Project cards */}
</div>
```

**Alternative layouts**:
```typescript
// Denser grid for more projects
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">

// Masonry-style layout
<div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
```

### Container and Spacing Modifications

#### 1. Change Container Width

**Current**: Uses Tailwind's default container
**Location**: `components/carbon-dashboard.tsx`

```typescript
// Current
<main className="container mx-auto px-4 py-8">

// Custom max-width
<main className="max-w-7xl mx-auto px-4 py-8">

// Full-width with custom padding
<main className="w-full px-6 py-8">
```

#### 2. Custom Spacing Scale

**Add to tailwind.config.ts**:
```typescript
theme: {
  extend: {
    spacing: {
      '18': '4.5rem',   // 72px
      '88': '22rem',    // 352px
      '128': '32rem',   // 512px
    }
  }
}
```

## Component Styling Patterns

### shadcn/ui Component Customization

#### 1. Button Variants

**Location**: `components/ui/button.tsx`

**Add custom variants**:
```typescript
const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        // Add custom variants
        gradient: "bg-gradient-to-r from-brand-500 to-brand-600 text-white hover:from-brand-600 hover:to-brand-700",
        glass: "bg-white/10 text-white border border-white/20 backdrop-blur-sm hover:bg-white/20",
        success: "bg-green-600 text-white hover:bg-green-700",
        warning: "bg-yellow-600 text-white hover:bg-yellow-700",
      },
      size: {
        default: "h-10 px-4 py-2",
        // Add custom sizes
        xs: "h-8 px-2 text-xs",
        xl: "h-12 px-6 text-base",
      },
    }
  }
)
```

#### 2. Card Variants

**Create custom card variants**:
```typescript
// components/ui/card.tsx
const cardVariants = cva(
  "rounded-lg border bg-card text-card-foreground shadow-sm",
  {
    variants: {
      variant: {
        default: "bg-card border-border",
        glass: "bg-white/10 border-white/20 backdrop-blur-sm",
        gradient: "bg-gradient-to-br from-card to-card/50",
        elevated: "shadow-lg border-0",
      }
    },
    defaultVariants: {
      variant: "default"
    }
  }
)
```

**Usage**:
```typescript
<Card variant="glass">
  <CardHeader>
    <CardTitle>Glass Card</CardTitle>
  </CardHeader>
</Card>
```

### Dashboard-Specific Patterns

#### 1. Metric Card Pattern

**Template**:
```typescript
const MetricCard = ({ title, value, change, icon: Icon, trend }) => (
  <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
    <CardContent className="p-6">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <p className="text-sm text-white/70">{title}</p>
          <p className="text-2xl font-bold text-white">{value}</p>
          <div className="flex items-center space-x-1">
            <span className={`text-sm ${trend === 'up' ? 'text-green-400' : 'text-red-400'}`}>
              {change}
            </span>
          </div>
        </div>
        <div className="p-3 bg-white/10 rounded-lg">
          <Icon className="h-6 w-6 text-white" />
        </div>
      </div>
    </CardContent>
  </Card>
)
```

#### 2. Status Badge Pattern

**Template**:
```typescript
const StatusBadge = ({ status, children }) => {
  const variants = {
    active: "bg-green-500/20 text-green-400 border-green-500/30",
    pending: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
    completed: "bg-blue-500/20 text-blue-400 border-blue-500/30",
    retired: "bg-gray-500/20 text-gray-400 border-gray-500/30"
  }
  
  return (
    <Badge className={`${variants[status]} border`}>
      {children}
    </Badge>
  )
}
```

## Animation System

### Framer Motion Integration

The dashboard uses Framer Motion with performance optimizations. Here's how to modify and extend animations:

#### 1. Basic Animation Patterns

**Standard page transitions**:
```typescript
const pageTransition = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
  transition: { duration: 0.3, ease: "easeInOut" }
}

<motion.div {...pageTransition}>
  {/* Content */}
</motion.div>
```

**Staggered animations**:
```typescript
const containerAnimation = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
}

const itemAnimation = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
}

<motion.div variants={containerAnimation} initial="hidden" animate="show">
  {items.map((item, index) => (
    <motion.div key={item.id} variants={itemAnimation}>
      {/* Item content */}
    </motion.div>
  ))}
</motion.div>
```

#### 2. Hover and Interaction Animations

**Card hover effects**:
```typescript
<motion.div
  whileHover={{ 
    y: -5, 
    boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" 
  }}
  whileTap={{ scale: 0.98 }}
  transition={{ type: "spring", stiffness: 300, damping: 20 }}
>
```

**Button interactions**:
```typescript
<motion.button
  whileHover={{ scale: 1.05 }}
  whileTap={{ scale: 0.95 }}
  transition={{ type: "spring", stiffness: 400, damping: 10 }}
>
```

#### 3. Custom CSS Animations

**Add to tailwind.config.ts**:
```typescript
theme: {
  extend: {
    keyframes: {
      'fade-up': {
        '0%': { opacity: '0', transform: 'translateY(30px)' },
        '100%': { opacity: '1', transform: 'translateY(0)' }
      },
      'slide-in-right': {
        '0%': { transform: 'translateX(100%)' },
        '100%': { transform: 'translateX(0)' }
      },
      'pulse-scale': {
        '0%, 100%': { transform: 'scale(1)' },
        '50%': { transform: 'scale(1.05)' }
      }
    },
    animation: {
      'fade-up': 'fade-up 0.5s ease-out',
      'slide-in-right': 'slide-in-right 0.3s ease-out',
      'pulse-scale': 'pulse-scale 2s ease-in-out infinite'
    }
  }
}
```

#### 4. Performance-Aware Animations

The dashboard includes performance monitoring:

```typescript
// hooks/use-performance.ts (built into the system)
const { shouldReduceAnimations } = usePerformance()

// Use conditional animations
const animationProps = shouldReduceAnimations ? {} : {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.3 }
}

<motion.div {...animationProps}>
```

## Responsive Design

### Breakpoint System

Tailwind CSS breakpoints used throughout the dashboard:
- **sm**: 640px (mobile landscape)
- **md**: 768px (tablet)
- **lg**: 1024px (desktop)
- **xl**: 1280px (large desktop)
- **2xl**: 1536px (extra large)

### Mobile-First Patterns

#### 1. Navigation Pattern

**Desktop navigation**:
```typescript
<nav className="hidden md:flex items-center space-x-1">
  {/* Desktop nav items */}
</nav>
```

**Mobile navigation**:
```typescript
<nav className="md:hidden">
  <button onClick={() => setMobileMenuOpen(true)}>
    <Menu className="h-6 w-6" />
  </button>
</nav>
```

#### 2. Grid Responsiveness

**Responsive grid patterns**:
```typescript
// Metrics: 1 column mobile, 2 columns tablet, 4 columns desktop
<div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 md:gap-6">

// Content: Stack mobile, side-by-side desktop
<div className="flex flex-col lg:flex-row gap-6">

// Cards: Dense mobile, spaced desktop
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
```

#### 3. Typography Responsiveness

**Responsive text sizing**:
```typescript
// Larger text on desktop
<h1 className="text-2xl md:text-3xl lg:text-4xl font-bold">

// Responsive line height
<p className="text-sm md:text-base leading-relaxed md:leading-loose">

// Mobile-optimized input text
<input className="text-base md:text-sm" />
```

### Touch-Friendly Design

**Minimum touch targets** (44px):
```typescript
<button className="h-11 w-11 md:h-10 md:w-10">
```

**Touch-friendly spacing**:
```typescript
<div className="space-y-4 md:space-y-3">
```

## Styling Examples and Templates

### 1. Dashboard Grid Layout

```typescript
const DashboardLayout = () => (
  <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-brand-900">
    {/* Header */}
    <header className="border-b border-white/10 bg-black/30 backdrop-blur-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <nav className="flex items-center justify-between">
          {/* Navigation content */}
        </nav>
      </div>
    </header>
    
    {/* Main Content */}
    <main className="container mx-auto px-4 py-8">
      {/* Hero Metrics */}
      <section className="mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          {metrics.map((metric, index) => (
            <MetricCard key={metric.id} {...metric} index={index} />
          ))}
        </div>
      </section>
      
      {/* Content Areas */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <section className="lg:col-span-2">
          {/* Main content */}
        </section>
        <aside className="lg:col-span-1">
          {/* Sidebar content */}
        </aside>
      </div>
    </main>
  </div>
)
```

### 2. Metric Card Template

```typescript
const MetricCard = ({ title, value, change, trend, icon: Icon, index }) => {
  const [animatedValue, setAnimatedValue] = useState(0)
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedValue(value)
    }, index * 100)
    return () => clearTimeout(timer)
  }, [value, index])
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <Card className="bg-white/5 border-white/10 backdrop-blur-sm overflow-hidden group hover:bg-white/10 transition-colors">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="space-y-3">
              <p className="text-sm text-white/70 font-medium">{title}</p>
              <div className="flex items-baseline space-x-2">
                <AnimatedCounter 
                  value={animatedValue} 
                  className="text-3xl font-bold text-white"
                />
                {change && (
                  <motion.span 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className={`text-sm font-medium ${
                      trend === 'up' ? 'text-green-400' : 'text-red-400'
                    }`}
                  >
                    {trend === 'up' ? '↗' : '↘'} {Math.abs(change)}%
                  </motion.span>
                )}
              </div>
            </div>
            <div className="p-3 bg-white/10 rounded-xl group-hover:bg-white/20 transition-colors">
              <Icon className="h-6 w-6 text-white" />
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
```

### 3. Chart Container Template

```typescript
const ChartContainer = ({ title, description, children, fullWidth = false }) => (
  <Card className={`bg-white/5 border-white/10 backdrop-blur-sm ${fullWidth ? 'col-span-full' : ''}`}>
    <CardHeader className="pb-4">
      <div className="flex items-center justify-between">
        <div>
          <CardTitle className="text-xl text-white">{title}</CardTitle>
          {description && (
            <CardDescription className="text-white/70 mt-1">
              {description}
            </CardDescription>
          )}
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="sm" className="text-white/70 hover:text-white">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </CardHeader>
    <CardContent className="pt-0">
      <div className="h-80">
        {children}
      </div>
    </CardContent>
  </Card>
)
```

### 4. Status Badge Component

```typescript
const StatusBadge = ({ status, size = 'default', children }) => {
  const statusConfig = {
    active: {
      bg: 'bg-green-500/20',
      text: 'text-green-400',
      border: 'border-green-500/30',
      dot: 'bg-green-400'
    },
    pending: {
      bg: 'bg-yellow-500/20',
      text: 'text-yellow-400',
      border: 'border-yellow-500/30',
      dot: 'bg-yellow-400'
    },
    completed: {
      bg: 'bg-blue-500/20',
      text: 'text-blue-400',
      border: 'border-blue-500/30',
      dot: 'bg-blue-400'
    },
    retired: {
      bg: 'bg-gray-500/20',
      text: 'text-gray-400',
      border: 'border-gray-500/30',
      dot: 'bg-gray-400'
    }
  }
  
  const config = statusConfig[status] || statusConfig.active
  const sizeClasses = size === 'sm' ? 'px-2 py-1 text-xs' : 'px-3 py-1.5 text-sm'
  
  return (
    <Badge 
      className={`
        ${config.bg} ${config.text} ${config.border} 
        ${sizeClasses} border rounded-full font-medium
        inline-flex items-center space-x-1.5
      `}
    >
      <div className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
      <span>{children}</span>
    </Badge>
  )
}
```

### 5. Form Component Template

```typescript
const FilterForm = () => (
  <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
    <CardContent className="p-6">
      <form className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-white">Project Type</label>
            <Select>
              <SelectTrigger className="bg-white/10 border-white/20 text-white">
                <SelectValue placeholder="All Types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="renewable">Renewable Energy</SelectItem>
                <SelectItem value="forestry">Forest Conservation</SelectItem>
                <SelectItem value="waste">Waste Management</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium text-white">Registry</label>
            <Select>
              <SelectTrigger className="bg-white/10 border-white/20 text-white">
                <SelectValue placeholder="All Registries" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="verra">Verra</SelectItem>
                <SelectItem value="gold-standard">Gold Standard</SelectItem>
                <SelectItem value="car">Climate Action Reserve</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium text-white">Status</label>
            <Select>
              <SelectTrigger className="bg-white/10 border-white/20 text-white">
                <SelectValue placeholder="All Statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="retired">Retired</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className="flex justify-end space-x-3 pt-4 border-t border-white/10">
          <Button variant="ghost" className="text-white/70 hover:text-white">
            Reset
          </Button>
          <Button className="bg-brand-600 hover:bg-brand-700 text-white">
            Apply Filters
          </Button>
        </div>
      </form>
    </CardContent>
  </Card>
)
```

## Best Practices and Conventions

### 1. Styling Organization

#### File Structure Guidelines
```
/components/
├── ui/                    # Base components (don't modify directly)
├── dashboard/            # Dashboard-specific components
├── forms/               # Form components
├── charts/              # Chart components
└── layout/              # Layout components

/styles/
├── globals.css          # Global styles and CSS variables
├── components.css       # Component-specific styles (if needed)
└── utilities.css        # Custom utility classes
```

#### CSS Variable Naming Conventions
```css
/* Semantic naming */
--color-primary          /* Main brand color */
--color-secondary        /* Secondary brand color */
--color-success          /* Success states */
--color-error            /* Error states */
--color-warning          /* Warning states */

/* Component-specific */
--dashboard-bg           /* Dashboard background */
--card-bg               /* Card background */
--nav-bg                /* Navigation background */

/* State-specific */
--hover-opacity         /* Hover state opacity */
--focus-ring           /* Focus ring color */
--disabled-opacity     /* Disabled state opacity */
```

### 2. Component Design Patterns

#### Component Structure Convention
```typescript
const ComponentName = ({ 
  variant = 'default', 
  size = 'medium', 
  className, 
  children, 
  ...props 
}) => {
  // 1. Hooks and state
  const [isHovered, setIsHovered] = useState(false)
  
  // 2. Computed values
  const baseClasses = "base-component-classes"
  const variantClasses = variants[variant]
  const sizeClasses = sizes[size]
  
  // 3. Event handlers
  const handleHover = () => setIsHovered(true)
  
  // 4. Render
  return (
    <div 
      className={cn(baseClasses, variantClasses, sizeClasses, className)}
      onMouseEnter={handleHover}
      {...props}
    >
      {children}
    </div>
  )
}
```

#### Prop-Based Styling
```typescript
// Good: Use props for variants
<Button variant="primary" size="large">Click me</Button>

// Avoid: Inline className for variants
<Button className="bg-blue-500 px-8 py-4">Click me</Button>

// Good: className for layout/positioning
<Button variant="primary" className="w-full mt-4">Click me</Button>
```

### 3. Responsive Design Best Practices

#### Mobile-First Approach
```css
/* Base styles for mobile */
.component {
  @apply text-sm p-4;
}

/* Tablet and up */
.component {
  @apply md:text-base md:p-6;
}

/* Desktop and up */
.component {
  @apply lg:text-lg lg:p-8;
}
```

#### Responsive Utilities
```typescript
// Screen size hooks
const { isMobile, isTablet, isDesktop } = useScreenSize()

// Conditional rendering
{isMobile ? <MobileComponent /> : <DesktopComponent />}

// Responsive classes
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
```

### 4. Accessibility Guidelines

#### Color Contrast
```css
/* Ensure sufficient contrast ratios */
--text-primary: 0 0% 9%;         /* 4.5:1 contrast minimum */
--text-secondary: 0 0% 45%;      /* 3:1 contrast minimum */
--bg-primary: 0 0% 100%;         /* High contrast background */
```

#### Focus States
```typescript
// Always include focus states
<button className="focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2">

// Use semantic colors for focus
<input className="focus:ring-blue-500 focus:border-blue-500">
```

#### Semantic HTML
```typescript
// Use proper HTML structure
<main>
  <section aria-labelledby="metrics-heading">
    <h2 id="metrics-heading">Key Metrics</h2>
    {/* Metrics content */}
  </section>
</main>

// Include ARIA labels
<button aria-label="Close modal" className="...">
  <X className="h-4 w-4" />
</button>
```

### 5. Performance Optimization

#### CSS Bundle Optimization
```javascript
// tailwind.config.ts
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  // Tailwind will purge unused styles
}
```

#### Animation Performance
```typescript
// Use transform and opacity for animations (GPU-accelerated)
const animationProps = {
  initial: { opacity: 0, transform: 'translateY(20px)' },
  animate: { opacity: 1, transform: 'translateY(0)' },
}

// Avoid animating layout properties
// Bad: { height: 0 } to { height: 'auto' }
// Good: { scaleY: 0 } to { scaleY: 1 }
```

#### Conditional Styling
```typescript
// Use CSS-in-JS conditionally for performance
const dynamicStyles = useMemo(() => ({
  backgroundColor: `hsl(${hue} 50% 50%)`,
  transform: `scale(${scale})`,
}), [hue, scale])

// Prefer CSS classes over inline styles
<div 
  className={cn('base-class', isActive && 'active-class')}
  style={dynamicStyles}
>
```

### 6. Code Quality Standards

#### Linting and Formatting
```json
// .eslintrc.json
{
  "extends": ["next/core-web-vitals"],
  "rules": {
    "no-unused-vars": "error",
    "prefer-const": "error"
  }
}
```

#### TypeScript Integration
```typescript
// Define prop types
interface ComponentProps {
  variant?: 'primary' | 'secondary' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  className?: string
  children: React.ReactNode
}

// Use strict typing for styling
type ColorVariant = 'blue' | 'green' | 'red' | 'yellow'
const getColorClasses = (color: ColorVariant): string => {
  const colorMap: Record<ColorVariant, string> = {
    blue: 'bg-blue-500 text-blue-50',
    green: 'bg-green-500 text-green-50',
    red: 'bg-red-500 text-red-50',
    yellow: 'bg-yellow-500 text-yellow-50'
  }
  return colorMap[color]
}
```

## Troubleshooting Guide

### Common Styling Issues

#### 1. CSS Variables Not Working

**Problem**: CSS variables showing as fallback values
**Solution**:
```css
/* Ensure variables are properly defined */
:root {
  --primary: 217 91% 60%;  /* Don't include hsl() wrapper */
}

/* Use with hsl() in Tailwind */
.text-primary { color: hsl(var(--primary)); }
```

#### 2. Dark Mode Not Switching

**Problem**: Dark mode styles not applying
**Solution**:
```typescript
// Ensure ThemeProvider is properly configured
import { ThemeProvider } from 'next-themes'

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
```

#### 3. Responsive Breakpoints Not Working

**Problem**: Responsive classes not applying at correct screen sizes
**Debug**:
```typescript
// Add debug component to check breakpoints
const BreakpointIndicator = () => (
  <div className="fixed top-4 right-4 bg-red-500 text-white p-2 text-xs">
    <div className="block sm:hidden">XS</div>
    <div className="hidden sm:block md:hidden">SM</div>
    <div className="hidden md:block lg:hidden">MD</div>
    <div className="hidden lg:block xl:hidden">LG</div>
    <div className="hidden xl:block 2xl:hidden">XL</div>
    <div className="hidden 2xl:block">2XL</div>
  </div>
)
```

#### 4. Animation Performance Issues

**Problem**: Choppy animations or poor performance
**Solutions**:
```typescript
// 1. Use will-change sparingly
<div className="will-change-transform hover:scale-105">

// 2. Prefer transform over layout properties
// Good
initial={{ opacity: 0, y: 20 }}
animate={{ opacity: 1, y: 0 }}

// Bad
initial={{ opacity: 0, height: 0 }}
animate={{ opacity: 1, height: 'auto' }}

// 3. Use the performance hook
const { shouldReduceAnimations } = usePerformance()
```

#### 5. Z-Index Conflicts

**Problem**: Elements appearing behind others unexpectedly
**Solution**: Use Tailwind's z-index scale consistently
```typescript
// Create a z-index scale
const zIndexes = {
  dropdown: 'z-10',
  sticky: 'z-20',
  modal: 'z-30',
  popover: 'z-40',
  tooltip: 'z-50',
  notification: 'z-60'
}

// Use consistently
<div className={zIndexes.modal}>Modal content</div>
<div className={zIndexes.popover}>Popover content</div>
```

### Performance Debugging

#### 1. Bundle Size Analysis

```bash
# Analyze bundle size
npm run build
npm install -g @next/bundle-analyzer
ANALYZE=true npm run build
```

#### 2. CSS Size Optimization

```typescript
// Check if unused Tailwind classes are being purged
// tailwind.config.ts
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  safelist: [
    // Add classes that should never be purged
    'bg-red-500',
    'text-green-400',
  ]
}
```

#### 3. Animation Performance Monitoring

```typescript
// Add performance monitoring to animations
const AnimatedComponent = motion.div.withConfig({
  onAnimationStart: () => console.time('animation'),
  onAnimationComplete: () => console.timeEnd('animation'),
})
```

### Development Tools

#### 1. Tailwind CSS IntelliSense

Install VS Code extension for autocomplete and class suggestions.

#### 2. Browser DevTools

```css
/* Add to globals.css for development */
@media (prefers-reduced-motion: no-preference) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

#### 3. Design Token Inspector

```typescript
// Add to development environment
const TokenInspector = () => {
  const [showTokens, setShowTokens] = useState(false)
  
  if (process.env.NODE_ENV !== 'development') return null
  
  return (
    <div className="fixed bottom-4 right-4 z-50">
      <button onClick={() => setShowTokens(!showTokens)}>
        Design Tokens
      </button>
      {showTokens && (
        <div className="bg-white p-4 border rounded shadow-lg">
          <h3>Current Theme</h3>
          <div>Primary: hsl(var(--primary))</div>
          <div>Background: hsl(var(--background))</div>
          {/* Display other tokens */}
        </div>
      )}
    </div>
  )
}
```

## Quick Reference

### Essential Commands

```bash
# Development
npm run dev              # Start development server
npm run build           # Build for production
npm run start           # Start production server

# Code Quality
npm run lint            # Run ESLint
npm run type-check      # TypeScript type checking

# Styling Development
npx tailwindcss -i ./app/globals.css -o ./dist/output.css --watch
```

### Key File Locations

```
Configuration:
├── tailwind.config.ts           # Tailwind configuration
├── postcss.config.mjs          # PostCSS configuration
├── components.json             # shadcn/ui configuration
└── next.config.mjs             # Next.js configuration

Styling:
├── app/globals.css             # Global styles and CSS variables
├── components/ui/              # Base UI components
└── components/                 # Custom components

Theme Management:
├── app/layout.tsx              # Theme provider setup
└── components/theme-provider.tsx # Theme switching logic
```

### CSS Variable Reference

```css
/* Color System */
--background: 0 0% 100%;
--foreground: 0 0% 3.9%;
--primary: 0 0% 9%;
--secondary: 0 0% 96.1%;
--muted: 0 0% 96.1%;
--accent: 0 0% 96.1%;
--destructive: 0 84.2% 60.2%;
--border: 0 0% 89.8%;
--input: 0 0% 89.8%;
--ring: 0 0% 3.9%;

/* Card System */
--card: 0 0% 100%;
--card-foreground: 0 0% 3.9%;
--popover: 0 0% 100%;
--popover-foreground: 0 0% 3.9%;

/* Chart Colors */
--chart-1: 12 76% 61%;
--chart-2: 173 58% 39%;
--chart-3: 197 37% 24%;
--chart-4: 43 74% 66%;
--chart-5: 27 87% 67%;

/* Spacing */
--radius: 0.5rem;
```

### Common Class Patterns

```typescript
// Layout
"container mx-auto px-4 py-8"                    // Main container
"grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6" // Responsive grid
"flex items-center justify-between"              // Flex layout

// Cards
"bg-card border border-border rounded-lg shadow-sm" // Basic card
"bg-white/5 border-white/10 backdrop-blur-sm"    // Glass card
"hover:shadow-lg transition-shadow duration-300"  // Hover effects

// Typography
"text-2xl font-semibold leading-none tracking-tight" // Card title
"text-sm text-muted-foreground"                   // Description text
"text-3xl font-bold"                               // Large metrics

// Interactive Elements
"bg-primary text-primary-foreground hover:bg-primary/90" // Primary button
"focus:outline-none focus:ring-2 focus:ring-ring"        // Focus states
"transition-colors duration-200"                          // Smooth transitions
```

### Framer Motion Presets

```typescript
// Page transitions
const pageTransition = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
  transition: { duration: 0.3 }
}

// Stagger animations
const staggerContainer = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
}

// Hover effects
const hoverScale = {
  whileHover: { scale: 1.05 },
  whileTap: { scale: 0.95 }
}

// Loading states
const fadeInUp = {
  initial: { opacity: 0, y: 60 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: [0.6, -0.05, 0.01, 0.99] }
}
```

This comprehensive guide provides everything needed for AI-assisted styling modifications to the BlockEdge Dashboard. The guide emphasizes practical, implementable examples while maintaining the existing architecture and performance optimizations.

---

*This guide serves as the definitive reference for AI systems working with BlockEdge Dashboard styling, ensuring consistent, maintainable, and high-quality styling modifications.*