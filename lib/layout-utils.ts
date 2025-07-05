import { cn } from "@/lib/utils";

// Layout utility functions for consistent spacing and responsive design

// Spacing scale constants following existing patterns
export const SPACING = {
  none: "0",
  xs: "2", // 8px - gap-2, p-2
  sm: "4", // 16px - gap-4, p-4
  md: "6", // 24px - gap-6, p-6 (existing pattern)
  lg: "8", // 32px - gap-8, p-8
  xl: "12", // 48px - gap-12, p-12
  "2xl": "16", // 64px - gap-16, p-16
} as const;

// Breakpoint constants following existing patterns
export const BREAKPOINTS = {
  sm: "640px",
  md: "768px", // Existing md breakpoint usage
  lg: "1024px", // Existing lg breakpoint usage  
  xl: "1280px",
  "2xl": "1536px",
} as const;

// Grid column configurations following existing patterns
export const GRID_COLS = {
  portfolio: {
    default: 1,
    lg: 3, // Following carbon-dashboard pattern
  },
  analytics: {
    default: 1,
    lg: 2, // Following existing analytics layout
  },
  compliance: {
    default: 1,
    md: 2,
    lg: 4, // Following compliance data pattern
  },
  hero: {
    default: 1,
    md: 2,
    lg: 4, // Following hero metrics pattern
  },
} as const;

// Container width configurations
export const CONTAINER_WIDTHS = {
  sm: "max-w-sm",
  md: "max-w-4xl",
  lg: "max-w-6xl", 
  xl: "max-w-7xl",
  full: "container mx-auto", // Following existing pattern
} as const;

// Spacing utility functions
export const spacing = {
  // Gap utilities following existing gap-6 pattern
  gap: (size: keyof typeof SPACING = "md") => `gap-${SPACING[size]}`,
  
  // Padding utilities following existing p-6 pattern  
  padding: (size: keyof typeof SPACING = "md") => `p-${SPACING[size]}`,
  paddingX: (size: keyof typeof SPACING = "md") => `px-${SPACING[size]}`,
  paddingY: (size: keyof typeof SPACING = "md") => `py-${SPACING[size]}`,
  
  // Margin utilities
  margin: (size: keyof typeof SPACING = "md") => `m-${SPACING[size]}`,
  marginX: (size: keyof typeof SPACING = "md") => `mx-${SPACING[size]}`,
  marginY: (size: keyof typeof SPACING = "md") => `my-${SPACING[size]}`,
  
  // Space between utilities following existing space-y-6 pattern
  spaceY: (size: keyof typeof SPACING = "md") => `space-y-${SPACING[size]}`,
  spaceX: (size: keyof typeof SPACING = "md") => `space-x-${SPACING[size]}`,
};

// Grid utility functions following existing patterns
export const grid = {
  // Basic grid following existing grid-cols-1 md:grid-cols-2 lg:grid-cols-3 pattern
  basic: (config: any) => {
    const classes = [`grid-cols-${config.default}`];
    if (config.sm) classes.push(`sm:grid-cols-${config.sm}`);
    if (config.md) classes.push(`md:grid-cols-${config.md}`);
    if (config.lg) classes.push(`lg:grid-cols-${config.lg}`);
    if (config.xl) classes.push(`xl:grid-cols-${config.xl}`);
    return classes.join(" ");
  },
  
  // Preset configurations
  portfolio: () => grid.basic(GRID_COLS.portfolio),
  analytics: () => grid.basic(GRID_COLS.analytics),
  compliance: () => grid.basic(GRID_COLS.compliance),
  hero: () => grid.basic(GRID_COLS.hero),
  
  // Auto-fit responsive grid
  autoFit: (minWidth: string = "300px") => 
    `grid-cols-[repeat(auto-fit,minmax(${minWidth},1fr))]`,
};

// Container utility functions
export const container = {
  base: (width: keyof typeof CONTAINER_WIDTHS = "full") => 
    CONTAINER_WIDTHS[width],
  
  // Standard container with padding following existing pattern
  standard: (width: keyof typeof CONTAINER_WIDTHS = "full") => 
    cn(CONTAINER_WIDTHS[width], spacing.padding()),
    
  // Page container following carbon-dashboard pattern
  page: () => cn("container mx-auto", spacing.padding(), spacing.spaceY()),
};

// Responsive utilities following existing mobile-first approach
export const responsive = {
  // Hide/show at breakpoints
  hide: {
    sm: "hidden sm:block",
    md: "hidden md:block", // Following existing hidden md:flex pattern
    lg: "hidden lg:block",
  },
  
  show: {
    sm: "block sm:hidden",
    md: "block md:hidden", // Following existing md:hidden pattern
    lg: "block lg:hidden",
  },
  
  // Flex direction changes
  flex: {
    // Following existing flex-col sm:flex-row pattern
    mobileStack: "flex flex-col sm:flex-row",
    desktopStack: "flex flex-row lg:flex-col",
  },
  
  // Text sizing following existing responsive patterns
  text: {
    // Following existing text-3xl pattern but with responsive scaling
    hero: "text-2xl sm:text-3xl lg:text-4xl",
    title: "text-xl sm:text-2xl lg:text-3xl",
    subtitle: "text-lg sm:text-xl lg:text-2xl",
    body: "text-sm sm:text-base",
    caption: "text-xs sm:text-sm",
  },
};

// Mobile touch optimization utilities
export const touch = {
  // Minimum touch targets for mobile (44px recommended)
  target: "min-h-[44px] min-w-[44px]",
  targetSmall: "min-h-[40px] min-w-[40px]", 
  targetLarge: "min-h-[48px] min-w-[48px]",
  
  // Touch manipulation optimization
  optimize: "touch-manipulation",
  
  // Active states for touch feedback
  feedback: "active:scale-95 transition-transform duration-150",
};

// Card styling utilities following existing patterns
export const card = {
  // Base card following existing bg-slate-800/50 backdrop-blur-md pattern
  base: "bg-slate-800/50 backdrop-blur-md border-white/5 shadow-xl rounded-2xl overflow-hidden",
  
  // Hover effects following existing patterns
  hover: "hover:shadow-2xl hover:bg-slate-800/70 transition-all duration-300",
  
  // Gradient backgrounds following existing patterns
  gradient: "relative before:absolute before:inset-0 before:bg-gradient-to-r before:from-emerald-500/20 before:to-teal-500/20 before:rounded-2xl before:blur-xl before:opacity-70",
  
  // Content padding following existing pattern
  content: spacing.padding(),
  
  // Complete card with all styles
  complete: cn(
    "bg-slate-800/50 backdrop-blur-md border-white/5 shadow-xl rounded-2xl overflow-hidden",
    "hover:shadow-2xl hover:bg-slate-800/70 transition-all duration-300"
  ),
};

// Animation utilities following existing motion patterns
export const animation = {
  // Fade in from bottom following existing pattern
  fadeInUp: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 },
  },
  
  // Staggered animation for lists
  stagger: (index: number, delay: number = 0.1) => ({
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5, delay: index * delay },
  }),
  
  // Scale animation for cards
  scale: {
    initial: { opacity: 0, scale: 0.9 },
    animate: { opacity: 1, scale: 1 },
    transition: { duration: 0.5 },
  },
};

// Layout composition utilities
export const layout = {
  // Dashboard page layout following existing structure
  dashboardPage: cn(
    container.page(),
    spacing.spaceY("lg")
  ),
  
  // Hero section layout following existing hero metrics pattern
  heroSection: cn(
    "grid",
    grid.hero(),
    spacing.gap()
  ),
  
  // Content section layout
  contentSection: cn(
    "grid",
    grid.portfolio(),
    spacing.gap()
  ),
  
  // Two column layout following existing analytics pattern
  twoColumn: cn(
    "grid",
    grid.analytics(),
    spacing.gap()
  ),
  
  // Header layout following existing pattern
  pageHeader: cn(
    "flex flex-col sm:flex-row sm:items-center justify-between",
    spacing.gap("sm"),
    "mb-6"
  ),
};

// Utility function to generate consistent component classes
export function createLayoutClasses(config: {
  container?: keyof typeof CONTAINER_WIDTHS;
  spacing?: keyof typeof SPACING;
  grid?: keyof typeof GRID_COLS;
  responsive?: boolean;
}) {
  const classes = [];
  
  if (config.container) {
    classes.push(container.base(config.container));
  }
  
  if (config.spacing) {
    classes.push(spacing.padding(config.spacing));
    classes.push(spacing.spaceY(config.spacing));
  }
  
  if (config.grid) {
    classes.push("grid");
    classes.push(grid.basic(GRID_COLS[config.grid]));
    classes.push(spacing.gap(config.spacing || "md"));
  }
  
  return cn(...classes);
}

// Export common layout patterns for easy reuse
export const layoutPatterns = {
  // Dashboard page following carbon-dashboard.tsx pattern
  dashboard: createLayoutClasses({
    container: "full",
    spacing: "md",
  }),
  
  // Project grid following existing project card layout
  projectGrid: cn(
    "grid",
    grid.portfolio(),
    spacing.gap()
  ),
  
  // Analytics layout following existing analytics tab
  analytics: cn(
    "grid", 
    grid.analytics(),
    spacing.gap()
  ),
  
  // Compliance grid following existing compliance data layout
  compliance: cn(
    "grid",
    grid.compliance(), 
    spacing.gap("sm")
  ),
} as const;