const Container = ({
	children,
	className,
}: { children: React.ReactNode; className?: string }) => {
	return (
		<div className={`${className} rounded-xl outline-1 outline`}>
			{children}
		</div>
	);
};

export default Container;
