// frontend/next.config.ts

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    // --- Add the rewrites function here ---
    async rewrites() {
        return [
            {
                // This handles the link from the Landing Page/Setup Page: /interview/setup
                source: '/interview/setup',
                destination: '/setup', 
            },
            {
                // This handles the link from the Setup Page: /interview/room
                source: '/interview/room',
                destination: '/room',      
            },
            {
                // This handles the link from the Room Page: /interview/feedback
                source: '/interview/feedback', 
                destination: '/feedback',    
            },
        ];
    },

    // Optional: Add other Next.js specific config options here
};

export default nextConfig;