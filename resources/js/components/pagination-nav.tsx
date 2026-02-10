import { Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import type { PaginationLink } from '@/types/pizza';

interface PaginationNavProps {
    links: PaginationLink[];
}

export function PaginationNav({ links }: PaginationNavProps) {
    if (links.length <= 3) return null;

    return (
        <nav className="flex items-center justify-center gap-1 mt-6">
            {links.map((link, i) => {
                const label = link.label
                    .replace('&laquo;', '«')
                    .replace('&raquo;', '»');

                if (!link.url) {
                    return (
                        <Button
                            key={i}
                            variant="ghost"
                            size="sm"
                            disabled
                            className="min-w-9 text-xs"
                        >
                            {label}
                        </Button>
                    );
                }

                return (
                    <Button
                        key={i}
                        variant={link.active ? 'default' : 'outline'}
                        size="sm"
                        asChild
                        className="min-w-9 text-xs"
                    >
                        <Link href={link.url} preserveScroll>
                            {label}
                        </Link>
                    </Button>
                );
            })}
        </nav>
    );
}
