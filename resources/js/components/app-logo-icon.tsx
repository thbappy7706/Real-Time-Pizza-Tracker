import React from 'react';

export default function AppLogoIcon({ className = "" }) {
    return (
        <svg
            className={className}
            viewBox="0 0 100 100"
            xmlns="http://www.w3.org/2000/svg"
        >
            <style>
                {`
                    @keyframes spin {
                        from { transform: rotate(0deg); }
                        to { transform: rotate(360deg); }
                    }

                    @keyframes pulse {
                        0%, 100% { transform: scale(1); }
                        50% { transform: scale(1.05); }
                    }

                    @keyframes float {
                        0%, 100% { transform: translateY(0px); }
                        50% { transform: translateY(-3px); }
                    }

                    svg:hover .pizza-base {
                        animation: spin 3s linear infinite;
                    }

                    svg:hover .pepperoni {
                        animation: pulse 0.6s ease-in-out infinite;
                    }

                    svg:hover .cheese-bubble {
                        animation: float 1s ease-in-out infinite;
                    }

                    .pizza-base {
                        transform-origin: center;
                    }

                    .pepperoni {
                        transform-origin: center;
                    }

                    .pepperoni:nth-child(1) { animation-delay: 0s; }
                    .pepperoni:nth-child(2) { animation-delay: 0.1s; }
                    .pepperoni:nth-child(3) { animation-delay: 0.2s; }
                    .pepperoni:nth-child(4) { animation-delay: 0.3s; }
                    .pepperoni:nth-child(5) { animation-delay: 0.4s; }

                    .cheese-bubble:nth-child(1) { animation-delay: 0s; }
                    .cheese-bubble:nth-child(2) { animation-delay: 0.3s; }
                    .cheese-bubble:nth-child(3) { animation-delay: 0.6s; }
                `}
            </style>

            {/* Pizza Base */}
            <g className="pizza-base">
                {/* Crust */}
                <circle cx="50" cy="50" r="45" fill="#E8B862" />
                <circle cx="50" cy="50" r="38" fill="#FFD54F" />

                {/* Sauce */}
                <circle cx="50" cy="50" r="35" fill="#D32F2F" />
            </g>

            {/* Cheese Layer */}
            <g>
                <circle cx="50" cy="50" r="35" fill="#FDD835" opacity="0.8" />

                {/* Cheese Bubbles */}
                <circle className="cheese-bubble" cx="35" cy="40" r="3" fill="#FFE57F" />
                <circle className="cheese-bubble" cx="60" cy="45" r="2.5" fill="#FFE57F" />
                <circle className="cheese-bubble" cx="50" cy="60" r="2" fill="#FFE57F" />
            </g>

            {/* Pepperoni Slices */}
            <g>
                <circle className="pepperoni" cx="50" cy="35" r="6" fill="#C62828" />
                <circle className="pepperoni" cx="38" cy="50" r="6" fill="#B71C1C" />
                <circle className="pepperoni" cx="62" cy="50" r="6" fill="#C62828" />
                <circle className="pepperoni" cx="45" cy="58" r="6" fill="#B71C1C" />
                <circle className="pepperoni" cx="58" cy="62" r="6" fill="#C62828" />

                {/* Pepperoni Details */}
                <circle cx="50" cy="35" r="2" fill="#8B0000" opacity="0.5" />
                <circle cx="38" cy="50" r="2" fill="#8B0000" opacity="0.5" />
                <circle cx="62" cy="50" r="2" fill="#8B0000" opacity="0.5" />
                <circle cx="45" cy="58" r="2" fill="#8B0000" opacity="0.5" />
                <circle cx="58" cy="62" r="2" fill="#8B0000" opacity="0.5" />
            </g>

            {/* Basil Leaves */}
            <g>
                <ellipse cx="42" cy="42" rx="4" ry="6" fill="#2E7D32" opacity="0.9" transform="rotate(-20 42 42)" />
                <ellipse cx="55" cy="55" rx="4" ry="6" fill="#388E3C" opacity="0.9" transform="rotate(30 55 55)" />
            </g>

            {/* Crust Texture */}
            <g opacity="0.3">
                <circle cx="25" cy="20" r="2" fill="#D4A574" />
                <circle cx="75" cy="25" r="1.5" fill="#D4A574" />
                <circle cx="80" cy="50" r="2" fill="#D4A574" />
                <circle cx="75" cy="75" r="1.5" fill="#D4A574" />
                <circle cx="25" cy="80" r="2" fill="#D4A574" />
                <circle cx="20" cy="50" r="1.5" fill="#D4A574" />
            </g>
        </svg>
    );
}
