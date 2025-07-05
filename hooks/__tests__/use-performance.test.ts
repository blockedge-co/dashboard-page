import { renderHook, act } from '@testing-library/react'
import { usePerformance, useAnimationProps, useAnimatedCounter, useStaggeredAnimation } from '../use-performance'

// Mock navigator properties
const mockNavigator = {
  hardwareConcurrency: 4,
  deviceMemory: 8,
  connection: {
    effectiveType: '4g'
  }
}

// Mock window.matchMedia
const mockMatchMedia = (matches: boolean) => ({
  matches,
  media: '(prefers-reduced-motion: reduce)',
  onchange: null,
  addEventListener: jest.fn(),
  removeEventListener: jest.fn(),
  addListener: jest.fn(),
  removeListener: jest.fn(),
  dispatchEvent: jest.fn(),
})

// Mock requestAnimationFrame
let rafCallbacks: (() => void)[] = []
const mockRequestAnimationFrame = jest.fn((callback: () => void) => {
  rafCallbacks.push(callback)
  return rafCallbacks.length
})

const flushRAF = () => {
  const callbacks = [...rafCallbacks]
  rafCallbacks = []
  callbacks.forEach(callback => callback())
}

describe('usePerformance', () => {
  beforeEach(() => {
    // Reset navigator mock
    Object.defineProperty(window, 'navigator', {
      value: mockNavigator,
      writable: true
    })

    // Reset matchMedia mock
    Object.defineProperty(window, 'matchMedia', {
      value: jest.fn(() => mockMatchMedia(false)),
      writable: true
    })

    jest.clearAllMocks()
  })

  it('initializes with default values', () => {
    const { result } = renderHook(() => usePerformance())

    expect(result.current.shouldReduceAnimations).toBe(false)
    expect(result.current.hardwareConcurrency).toBe(4)
    expect(result.current.deviceMemory).toBe(8)
    expect(result.current.connectionType).toBe('4g')
  })

  it('reduces animations when user prefers reduced motion', () => {
    window.matchMedia = jest.fn(() => mockMatchMedia(true))

    const { result } = renderHook(() => usePerformance())

    expect(result.current.shouldReduceAnimations).toBe(true)
  })

  it('reduces animations on low memory devices', () => {
    Object.defineProperty(window, 'navigator', {
      value: { ...mockNavigator, deviceMemory: 2 },
      writable: true
    })

    const { result } = renderHook(() => usePerformance())

    expect(result.current.shouldReduceAnimations).toBe(true)
  })

  it('reduces animations on slow connections', () => {
    Object.defineProperty(window, 'navigator', {
      value: { 
        ...mockNavigator, 
        connection: { effectiveType: '2g' }
      },
      writable: true
    })

    const { result } = renderHook(() => usePerformance())

    expect(result.current.shouldReduceAnimations).toBe(true)
  })

  it('reduces animations on low CPU devices', () => {
    Object.defineProperty(window, 'navigator', {
      value: { ...mockNavigator, hardwareConcurrency: 2 },
      writable: true
    })

    const { result } = renderHook(() => usePerformance())

    expect(result.current.shouldReduceAnimations).toBe(true)
  })

  it('handles missing navigator properties gracefully', () => {
    Object.defineProperty(window, 'navigator', {
      value: {},
      writable: true
    })

    const { result } = renderHook(() => usePerformance())

    expect(result.current.hardwareConcurrency).toBe(4) // fallback
    expect(result.current.deviceMemory).toBeUndefined()
    expect(result.current.connectionType).toBeUndefined()
  })

  it('cleans up event listeners on unmount', () => {
    const mockRemoveEventListener = jest.fn()
    window.matchMedia = jest.fn(() => ({
      ...mockMatchMedia(false),
      removeEventListener: mockRemoveEventListener
    }))

    const { unmount } = renderHook(() => usePerformance())

    unmount()

    expect(mockRemoveEventListener).toHaveBeenCalledWith('change', expect.any(Function))
  })
})

describe('useAnimationProps', () => {
  beforeEach(() => {
    Object.defineProperty(window, 'navigator', {
      value: mockNavigator,
      writable: true
    })
    Object.defineProperty(window, 'matchMedia', {
      value: jest.fn(() => mockMatchMedia(false)),
      writable: true
    })
  })

  it('returns animation props when animations are enabled', () => {
    const { result } = renderHook(() => useAnimationProps())

    expect(result.current.animate).toBe(true)
    expect(result.current.initial).toEqual({ opacity: 0, y: 20 })
    expect(result.current.whileHover).toEqual({ y: -5 })
    expect(result.current.transition).toEqual({ duration: 0.3 })
  })

  it('disables animations when shouldAnimate is false', () => {
    const { result } = renderHook(() => useAnimationProps(false))

    expect(result.current.animate).toBe(false)
    expect(result.current.initial).toBe(false)
    expect(result.current.whileHover).toBeUndefined()
    expect(result.current.transition).toEqual({ duration: 0 })
  })

  it('disables animations when performance requires it', () => {
    window.matchMedia = jest.fn(() => mockMatchMedia(true))

    const { result } = renderHook(() => useAnimationProps())

    expect(result.current.animate).toBe(false)
    expect(result.current.initial).toBe(false)
    expect(result.current.whileHover).toBeUndefined()
    expect(result.current.transition).toEqual({ duration: 0 })
  })
})

describe('useAnimatedCounter', () => {
  beforeEach(() => {
    Object.defineProperty(window, 'navigator', {
      value: mockNavigator,
      writable: true
    })
    Object.defineProperty(window, 'matchMedia', {
      value: jest.fn(() => mockMatchMedia(false)),
      writable: true
    })

    global.requestAnimationFrame = mockRequestAnimationFrame
    global.Date.now = jest.fn(() => 0)
    rafCallbacks = []
    jest.clearAllMocks()
  })

  it('starts with initial value of 0', () => {
    const { result } = renderHook(() => useAnimatedCounter(100))

    expect(result.current.value).toBe(0)
    expect(result.current.isAnimating).toBe(false)
  })

  it('immediately sets target value when animations are disabled', () => {
    window.matchMedia = jest.fn(() => mockMatchMedia(true))

    const { result } = renderHook(() => useAnimatedCounter(100))

    expect(result.current.value).toBe(100)
    expect(result.current.isAnimating).toBe(false)
    expect(result.current.shouldReduceAnimations).toBe(true)
  })

  it('immediately sets target value when disabled', () => {
    const { result } = renderHook(() => useAnimatedCounter(100, 2000, false))

    expect(result.current.value).toBe(100)
    expect(result.current.isAnimating).toBe(false)
  })

  it('animates to target value over time', () => {
    const { result } = renderHook(() => useAnimatedCounter(100, 1000))

    expect(result.current.isAnimating).toBe(true)
    expect(mockRequestAnimationFrame).toHaveBeenCalled()

    // Simulate time progression
    global.Date.now = jest.fn(() => 500) // 50% through animation
    flushRAF()

    expect(result.current.value).toBeGreaterThan(0)
    expect(result.current.value).toBeLessThan(100)

    // Complete animation
    global.Date.now = jest.fn(() => 1000)
    flushRAF()

    expect(result.current.value).toBe(100)
    expect(result.current.isAnimating).toBe(false)
  })

  it('handles target value changes during animation', () => {
    const { result, rerender } = renderHook(
      ({ target }) => useAnimatedCounter(target, 1000),
      { initialProps: { target: 100 } }
    )

    expect(result.current.isAnimating).toBe(true)

    // Change target mid-animation
    rerender({ target: 200 })

    expect(result.current.isAnimating).toBe(true)
    expect(mockRequestAnimationFrame).toHaveBeenCalled()
  })
})

describe('useStaggeredAnimation', () => {
  beforeEach(() => {
    Object.defineProperty(window, 'navigator', {
      value: mockNavigator,
      writable: true
    })
    Object.defineProperty(window, 'matchMedia', {
      value: jest.fn(() => mockMatchMedia(false)),
      writable: true
    })
  })

  it('returns staggered animation function', () => {
    const { result } = renderHook(() => useStaggeredAnimation(5, 100))

    const animationProps0 = result.current(0)
    const animationProps2 = result.current(2)

    expect(animationProps0.initial).toEqual({ opacity: 0, y: 20 })
    expect(animationProps0.animate).toEqual({ opacity: 1, y: 0 })
    expect(animationProps0.transition).toEqual({ duration: 0.5, delay: 0 })

    expect(animationProps2.transition).toEqual({ duration: 0.5, delay: 0.2 })
  })

  it('disables animations when performance requires it', () => {
    window.matchMedia = jest.fn(() => mockMatchMedia(true))

    const { result } = renderHook(() => useStaggeredAnimation(5, 100))

    const animationProps = result.current(0)

    expect(animationProps.initial).toBe(false)
    expect(animationProps.animate).toBe(false)
    expect(animationProps.transition).toEqual({ duration: 0 })
  })

  it('calculates correct delays for different indices', () => {
    const { result } = renderHook(() => useStaggeredAnimation(10, 50))

    const props0 = result.current(0)
    const props3 = result.current(3)
    const props7 = result.current(7)

    expect(props0.transition.delay).toBe(0)
    expect(props3.transition.delay).toBe(0.15) // 3 * 50/1000
    expect(props7.transition.delay).toBe(0.35) // 7 * 50/1000
  })

  it('uses default base delay when not provided', () => {
    const { result } = renderHook(() => useStaggeredAnimation(5))

    const animationProps = result.current(1)

    expect(animationProps.transition.delay).toBe(0.1) // 1 * 100/1000
  })
})