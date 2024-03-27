const { Server } = require("socket.io");

const io = new Server({
	cors: {
		origin: "http://localhost:3000",
	},
});

io.on("connection", (socket) => {
	socket.on("message", (data) => {
		console.log({ data });
		io.emit("messageResponse", data);
	});
});

io.listen(4000);
