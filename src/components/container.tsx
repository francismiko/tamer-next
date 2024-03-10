const Container = ({
	children,
	className,
}: { children: React.ReactNode; className?: string }) => {
	return (
		<div className={`rounded-xl py-4 px-8 outline-1 outline ${className}`}>
			{children}
		</div>
	);
};

export default Container;
