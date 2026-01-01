import Link from 'next/link';
import { APP_NAME } from '@/lib/constants';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showTagline?: boolean;
}

export function Logo({ className = '', size = 'md', showTagline = false }: LogoProps) {
  const sizes = {
    sm: 'text-xl',
    md: 'text-2xl',
    lg: 'text-4xl',
  };

  return (
    <Link href="/" className={`flex items-center gap-2 ${className}`}>
      <div className="flex items-center">
        <span className={`font-bold ${sizes[size]} tracking-tight`}>
          Trade<span className="text-[#00D4AA]">K</span>uant
        </span>
      </div>
      {showTagline && (
        <span className="text-sm text-muted-foreground hidden md:block">
          La K de <span className="text-[#00D4AA]">K</span>uantificable
        </span>
      )}
    </Link>
  );
}
