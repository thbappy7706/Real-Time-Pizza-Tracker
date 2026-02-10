import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

const statusColors: Record<string, string> = {
    pending: 'bg-gray-500/15 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600',
    placed: 'bg-blue-500/15 text-blue-700 dark:text-blue-300 border-blue-300 dark:border-blue-600',
    accepted: 'bg-indigo-500/15 text-indigo-700 dark:text-indigo-300 border-indigo-300 dark:border-indigo-600',
    preparing: 'bg-yellow-500/15 text-yellow-700 dark:text-yellow-300 border-yellow-300 dark:border-yellow-600',
    baking: 'bg-orange-500/15 text-orange-700 dark:text-orange-300 border-orange-300 dark:border-orange-600',
    out_for_delivery: 'bg-purple-500/15 text-purple-700 dark:text-purple-300 border-purple-300 dark:border-purple-600',
    delivered: 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-300 dark:border-emerald-600',
    cancelled: 'bg-red-500/15 text-red-700 dark:text-red-300 border-red-300 dark:border-red-600',
    rejected: 'bg-red-500/15 text-red-700 dark:text-red-300 border-red-300 dark:border-red-600',
};

interface OrderStatusBadgeProps {
    status: string;
    label: string;
    className?: string;
}

export function OrderStatusBadge({ status, label, className }: OrderStatusBadgeProps) {
    return (
        <Badge
            variant="outline"
            className={cn(
                'font-semibold text-xs px-2.5 py-0.5',
                statusColors[status] || statusColors.pending,
                className,
            )}
        >
            {label}
        </Badge>
    );
}
