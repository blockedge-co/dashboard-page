import { cn } from '../utils'

describe('utils', () => {
  describe('cn (className merger)', () => {
    it('merges class names correctly', () => {
      const result = cn('base-class', 'additional-class')
      expect(result).toBe('base-class additional-class')
    })

    it('handles conditional classes', () => {
      const isActive = true
      const isDisabled = false
      
      const result = cn(
        'base-class',
        isActive && 'active-class',
        isDisabled && 'disabled-class'
      )
      
      expect(result).toBe('base-class active-class')
    })

    it('handles empty and undefined values', () => {
      const result = cn('base-class', undefined, '', null, 'valid-class')
      expect(result).toBe('base-class valid-class')
    })

    it('deduplicates conflicting Tailwind classes', () => {
      const result = cn('px-4', 'px-6')
      expect(result).toBe('px-6')
    })

    it('handles complex conditional logic', () => {
      const variant = 'primary'
      const size = 'large'
      const disabled = false
      
      const result = cn(
        'base-button',
        variant === 'primary' && 'bg-blue-500 text-white',
        variant === 'secondary' && 'bg-gray-500 text-gray-900',
        size === 'large' && 'px-6 py-3 text-lg',
        size === 'small' && 'px-2 py-1 text-sm',
        disabled && 'opacity-50 cursor-not-allowed'
      )
      
      expect(result).toBe('base-button bg-blue-500 text-white px-6 py-3 text-lg')
    })

    it('handles arrays of class names', () => {
      const classes = ['class1', 'class2']
      const result = cn(classes, 'class3')
      expect(result).toBe('class1 class2 class3')
    })

    it('handles objects with boolean values', () => {
      const result = cn({
        'always-present': true,
        'conditionally-present': true,
        'never-present': false,
      })
      expect(result).toBe('always-present conditionally-present')
    })

    it('preserves important modifier precedence', () => {
      const result = cn('text-red-500', 'text-blue-500 !text-green-500')
      expect(result).toBe('text-blue-500 !text-green-500')
    })

    it('handles responsive prefixes correctly', () => {
      const result = cn('text-sm', 'md:text-base', 'lg:text-lg')
      expect(result).toBe('text-sm md:text-base lg:text-lg')
    })

    it('handles state prefixes correctly', () => {
      const result = cn('bg-blue-500', 'hover:bg-blue-600', 'focus:bg-blue-700')
      expect(result).toBe('bg-blue-500 hover:bg-blue-600 focus:bg-blue-700')
    })

    it('merges conflicting utilities within same variant', () => {
      const result = cn('p-4', 'px-6') // px should override p for x-axis
      expect(result).toBe('p-4 px-6')
    })

    it('handles dark mode prefixes', () => {
      const result = cn('bg-white', 'dark:bg-gray-900', 'text-black', 'dark:text-white')
      expect(result).toBe('bg-white dark:bg-gray-900 text-black dark:text-white')
    })
  })
})