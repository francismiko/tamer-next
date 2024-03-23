/** @type {import('next').NextConfig} */
const nextConfig = {
	transpilePackages: [
		"@douyinfe/semi-ui",
		"@douyinfe/semi-icons",
		"@douyinfe/semi-illustrations",
	],
	env: {
		openAIApiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
		proxyUrl: process.env.NEXT_PUBLIC_OPENAI_PROXY_URL,
	},
	async redirects() {
		return [
			{
				source: "/signin",
				destination: "/",
				permanent: true,
			},
		];
	},
	images: {
		domains: ["img.clerk.com"],
	},
};

export default nextConfig;
