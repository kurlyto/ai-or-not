import React from 'react'

interface BoutonProps {
  children: React.ReactNode
  onClick?: () => void
  disabled?: boolean
  variant?: 'primary' | 'secondary' | 'ghost' | 'ai' | 'not-ai'
  size?: 'sm' | 'md' | 'lg'
  className?: string
  type?: 'button' | 'submit'
}

export function Bouton({
  children,
  onClick,
  disabled = false,
  variant = 'primary',
  size = 'md',
  className = '',
  type = 'button',
}: BoutonProps) {
  const baseClasses =
    'inline-flex items-center justify-center gap-2 font-semibold rounded-xl transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-blue focus-visible:ring-offset-2 focus-visible:ring-offset-dark-primary active:scale-[0.97]'

  const variantClasses = {
    primary: 'bg-accent-blue text-white shadow-glow hover:bg-[#3d68f0]',
    secondary: 'bg-dark-tertiary text-white border border-dark-border hover:bg-[#262631] hover:border-[#3a3a47]',
    ghost: 'bg-transparent text-gray-300 hover:bg-white/5 hover:text-white',
    ai: 'bg-dark-tertiary text-white border-2 border-dark-border hover:border-accent-purple hover:bg-accent-purple/10',
    'not-ai': 'bg-dark-tertiary text-white border-2 border-dark-border hover:border-accent-green hover:bg-accent-green/10',
  }

  const sizeClasses = {
    sm: 'px-3.5 py-2 text-sm min-h-[38px]',
    md: 'px-5 py-2.5 text-base min-h-[44px]',
    lg: 'px-6 py-3.5 text-lg min-h-[52px]',
  }

  const disabledClasses = disabled ? 'opacity-40 cursor-not-allowed active:scale-100' : 'cursor-pointer'

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${disabledClasses} ${className}`}
    >
      {children}
    </button>
  )
}
