const { Server } = require("socket.io");

const io = new Server({
	cors: {
		origin: "http://localhost:3000",
	},
});

io.on("connection", (socket) => {
	console.log("a user connected");

	socket.on("message", (msg) => {
		console.log(`message: ${msg}`);
	});
});

io.listen(4000);
