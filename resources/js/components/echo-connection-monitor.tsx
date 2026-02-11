import { useConnectionStatus } from '@laravel/echo-react';
import { useEffect } from 'react';
import { toast } from 'sonner';

/**
 * Echo Connection Monitor
 * Shows connection status for debugging purposes
 */
export function EchoConnectionMonitor() {
    const connectionStatus = useConnectionStatus();

    useEffect(() => {
        if (connectionStatus === 'connected') {
            console.log('✅ Echo connected to Reverb');
        } else if (connectionStatus === 'connecting') {
            console.log('🔄 Echo connecting to Reverb...');
        } else if (connectionStatus === 'disconnected') {
            console.warn('❌ Echo disconnected from Reverb');
        }
    }, [connectionStatus]);

    // Only show in development
    if (import.meta.env.DEV) {
        return (
            <div className="fixed bottom-4 left-4 z-50 rounded-lg border bg-card px-3 py-2 text-xs shadow-md">
                <div className="flex items-center gap-2">
                    <div
                        className={`size-2 rounded-full ${connectionStatus === 'connected'
                                ? 'bg-green-500'
                                : connectionStatus === 'connecting'
                                    ? 'bg-yellow-500 animate-pulse'
                                    : 'bg-red-500'
                            }`}
                    />
                    <span className="font-medium">
                        Echo: {connectionStatus}
                    </span>
                </div>
            </div>
        );
    }

    return null;
}
