const Container = ({ children }: { children: React.ReactNode }) => {
	return (
		<div className="rounded-xl py-4 px-8 outline-1 outline">{children}</div>
	);
};

export default Container;
