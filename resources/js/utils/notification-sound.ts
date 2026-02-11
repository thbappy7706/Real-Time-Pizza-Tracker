/**
 * Play a notification sound using Web Audio API
 * This is more reliable than using Audio elements
 */
export function playNotificationSound() {
    try {
        // Create audio context
        const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();

        // Create oscillator (tone generator)
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        // Connect nodes
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        // Configure sound
        oscillator.frequency.value = 800; // Frequency in Hz (higher = higher pitch)
        oscillator.type = 'sine'; // Wave type: 'sine', 'square', 'sawtooth', 'triangle'

        // Set volume envelope (fade in/out to avoid clicks)
        const now = audioContext.currentTime;
        gainNode.gain.setValueAtTime(0, now);
        gainNode.gain.linearRampToValueAtTime(0.3, now + 0.01); // Fade in
        gainNode.gain.linearRampToValueAtTime(0.3, now + 0.1); // Hold
        gainNode.gain.linearRampToValueAtTime(0, now + 0.2); // Fade out

        // Play sound
        oscillator.start(now);
        oscillator.stop(now + 0.2); // Stop after 200ms

        console.log('🔊 Notification sound played');
    } catch (error) {
        console.warn('Failed to play notification sound:', error);
    }
}

/**
 * Play a two-tone notification sound
 */
export function playNotificationSoundDoubleBeep() {
    try {
        const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();

        // First beep
        const oscillator1 = audioContext.createOscillator();
        const gainNode1 = audioContext.createGain();
        oscillator1.connect(gainNode1);
        gainNode1.connect(audioContext.destination);
        oscillator1.frequency.value = 800;
        oscillator1.type = 'sine';

        const now = audioContext.currentTime;
        gainNode1.gain.setValueAtTime(0, now);
        gainNode1.gain.linearRampToValueAtTime(0.3, now + 0.01);
        gainNode1.gain.linearRampToValueAtTime(0.3, now + 0.08);
        gainNode1.gain.linearRampToValueAtTime(0, now + 0.1);

        oscillator1.start(now);
        oscillator1.stop(now + 0.1);

        // Second beep (slightly higher pitch)
        const oscillator2 = audioContext.createOscillator();
        const gainNode2 = audioContext.createGain();
        oscillator2.connect(gainNode2);
        gainNode2.connect(audioContext.destination);
        oscillator2.frequency.value = 1000;
        oscillator2.type = 'sine';

        gainNode2.gain.setValueAtTime(0, now + 0.15);
        gainNode2.gain.linearRampToValueAtTime(0.3, now + 0.16);
        gainNode2.gain.linearRampToValueAtTime(0.3, now + 0.23);
        gainNode2.gain.linearRampToValueAtTime(0, now + 0.25);

        oscillator2.start(now + 0.15);
        oscillator2.stop(now + 0.25);

        console.log('🔊 Double beep notification sound played');
    } catch (error) {
        console.warn('Failed to play notification sound:', error);
    }
}
