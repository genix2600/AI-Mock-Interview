// frontend/next.config.ts - CORRECTED VERSION

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    
    // 1. Rewrites remain correct
    async rewrites() {
        return [
            {
                source: '/interview/setup',
                destination: '/setup', 
            },
            {
                source: '/interview/room',
                destination: '/room',       
            },
            {
                source: '/interview/feedback', 
                destination: '/feedback',     
            },
        ];
    },
    
    // 2. The experimental block is removed because it caused the error.
    // The alias fix is applied in tsconfig.json below.
};

export default nextConfig;