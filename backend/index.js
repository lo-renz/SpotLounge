import { config } from 'dotenv';
import express from "express";
import { mongoDBURL, PORT } from "./config.js";
import mongoose from 'mongoose';
import postRoutes from './routes/posts.js';
import userRoutes from './routes/users.js';
import { WebSocketServer } from 'ws';
import jwt from 'jsonwebtoken';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import Message from './models/message.js';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// to config the env file 
config();
// to connect to the mongoDB database using mongoose import
mongoose.connect(mongoDBURL);

const app = express();

app.get('/test', (req, res) => {
    res.json('test ok');
});

// Middleware for parsing request body
// app.use() is used to mount middleware functions that handle incoming
// HTTP requests before they reach your routes and controllers
app.use(express.json());
app.use(cookieParser());

//app.use(bodyParser.json({ limit: "30mb", extended: true }));
//app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));

// Middleware for handling CORS POLICY
// Allow All Origins with Default of cors(*)
app.use(cors({
    credentials: true,
    origin: process.env.CLIENT_URL,
}));


app.use('/uploads', express.static(__dirname + '/public/Images/'));
app.use('/posts', postRoutes);
app.use('/user', userRoutes);

const server = app.listen(PORT);

const wss = new WebSocketServer({ server });
wss.on('connection', (connection, request) => {

    function notifyAboutOnlinePeople() {
        // notify everyone about online people (when someone connects)
        [...wss.clients].forEach(client => {
            client.send(JSON.stringify({
                online: [...wss.clients].map(c => ({ userId: c.userId, username: c.username }))
            }));
        });
    }

    connection.isAlive = true;

    connection.timer = setInterval(() => {
        connection.ping();
        connection.deathTimer = setTimeout(() => {
            connection.isAlive = false;
            connection.terminate();
            notifyAboutOnlinePeople();
        }, 1000);
    }, 5000);

    connection.on('pong', () => {
        clearTimeout(connection.deathTimer);
    })

    const cookies = request.headers.cookie;

    // read username id from the cookie for this connection
    if (cookies) {
        const tokenCookieString = cookies.split(';').find(str => str.startsWith('token='));
        if (tokenCookieString) {
            const token = tokenCookieString.split('=')[1];
            if (token) {
                jwt.verify(token, process.env.SECRET_KEY, {}, (error, userData) => {
                    if (error) throw error
                    const { userId, username } = userData;
                    connection.userId = userId;
                    connection.username = username;
                })
            }
        }
    }

    connection.on('message', async (message) => {
        const messageData = JSON.parse(message.toString());
        const { recipient, text, file } = messageData;
        let filename = null;
        if (file) {
            const parts = file.name.split('.');
            const ext = parts[parts.length - 1];
            filename = Date.now() + '.'+ext;
            const path = __dirname + '/public/Images/' + filename;
            const bufferData = Buffer.from(file.data.split(',')[1], 'base64');
            fs.writeFile(path, bufferData, () => {
                console.log('file saved:' + path);
            })
        }
        if (recipient && (text || file)) {
            const messageDoc = await Message.create({
                sender: connection.userId,
                recipient,
                text,
                file: file ? filename: null,
            });
            [...wss.clients]
                .filter(c => c.userId === recipient)
                .forEach(c => c.send(JSON.stringify({
                    text,
                    sender: connection.userId,
                    recipient,
                    file: file ? filename: null,
                    _id: messageDoc._id,
                })));
        }
    });

    // notify everyone about online people (when someone connects)
    notifyAboutOnlinePeople();
});