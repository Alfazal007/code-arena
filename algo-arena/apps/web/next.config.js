/** @type {import('next').NextConfig} */
const nextConfig = {
    async headers() {
        return [
            {
                source: '/api/(.*)',  // Applies to all API routes
                headers: [
                    {
                        key: 'Access-Control-Allow-Origin',
                        value: 'http://localhost:5173', // Or '*' to allow all origins
                    },
                    {
                        key: 'Access-Control-Allow-Methods',
                        value: 'GET, POST, PUT, DELETE, OPTIONS',  // Add OPTIONS method
                    },
                    {
                        key: 'Access-Control-Allow-Headers',
                        value: 'Content-Type, Authorization', // Allow necessary headers
                    },
                    {
                        key: 'Access-Control-Allow-Credentials',
                        value: 'true', // Allow credentials (cookies, Authorization)
                    },
                ],
            },
        ];
    },
};

export default nextConfig;

