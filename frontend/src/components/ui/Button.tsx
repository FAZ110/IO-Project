import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react';

type Variant = 'primary' | 'secondary' | 'ghost' | 'icon' | 'danger-ghost';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  fullWidth?: boolean;
  children: ReactNode;
}

const variantClasses: Record<Variant, string> = {
  primary:      'px-4 py-2 font-medium text-sm text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:bg-blue-400',
  secondary:    'px-4 py-2 font-medium text-sm text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50',
  ghost:        'px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-40',
  icon:         'p-1.5 rounded-md text-gray-400 hover:text-gray-700 hover:bg-gray-100',
  'danger-ghost': 'flex items-center gap-2.5 w-full px-3 py-2 text-sm text-red-600 hover:bg-red-50 disabled:opacity-50',
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', fullWidth, className = '', children, ...props }, ref) => (
    <button
      ref={ref}
      className={`${variantClasses[variant]} ${fullWidth ? 'w-full' : ''} disabled:cursor-not-allowed ${className}`}
      {...props}
    >
      {children}
    </button>
  ),
);

Button.displayName = 'Button';
