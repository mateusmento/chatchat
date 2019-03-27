import socketio from 'socket.io';
import express from 'express';
import mongoose, { Schema, Document } from 'mongoose';
import http from 'http';

let dbUrl = 'mongodb://localhost:27017/chatchat';
let app = express();
let server = new http.Server(app);
let io = socketio(server);

let UserOnlineSchema = new Schema({
	username: {type: String, unique: true, required: true},
	socketId: {type: String, required: true},
});

interface IOnlineUser
{
	username: string;
	socketId: string;
}

const OnlineUser = mongoose.model<Document & IOnlineUser>('User', UserOnlineSchema);

async function connectDB()
{
	return new Promise((resolve, reject) => {
		mongoose.connect(dbUrl, {useNewUrlParser: true});
		mongoose.connection.on('connected', resolve);
		mongoose.connection.on('error', reject);
	});
}

async function main()
{
	let users: any = {};

	await connectDB();

	app.use(express.urlencoded({extended: false}));
	app.use(express.static(__dirname + '/../static'));
	
	
	io.on('connection', (socket) => {
	
		socket.on('user connected', (username) => {
			let user = new OnlineUser({username, socketId: socket.id});
			console.log(username);
			user.save();
		});
	
		socket.on('chat message', (data) => {
			socket.broadcast.emit('chat message', `${data.username}: ${data.message}`);
		});
	
		socket.on('private chat message', async (data) => {
			let onlineUser = await OnlineUser.findOne({username: data.friend});
			if (onlineUser)
			{
				let socketId = onlineUser.socketId;
				io.to(socketId).emit('chat message', `${data.username}: ${data.message}`);
			}
		});
	
		socket.on('disconnect', async () => {
			let onlineUser = await OnlineUser.remove({socketId: socket.id});
		});
		
	});

	server.listen(3000);
}

main();