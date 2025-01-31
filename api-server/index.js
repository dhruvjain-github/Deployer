// backend/server.js
const express = require('express');
const { generateSlug } = require('random-word-slugs');
const { ECSClient, RunTaskCommand } = require('@aws-sdk/client-ecs');
const { Server } = require('socket.io');
const Redis = require('ioredis');
require('dotenv').config();




const app = express();
const PORT = process.env.PORT || 9000;


const cors = require('cors');

// Set up Redis connection for logging
const subscriber = new Redis(process.env.REDIS_URL);

// Initialize Socket.io server
const io = new Server({ cors: '*' });


io.on('connection', socket => {
    socket.on('subscribe', channel => {
        socket.join(channel);
        socket.emit('message', { status: 'success', message: `Joined ${channel}` });

    });
});

io.listen(9002, () => console.log('Socket Server 9002'));



// Initialize AWS ECS client
const ecsClient = new ECSClient({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
    }
});

const config = {
    CLUSTER: process.env.ECS_CLUSTER_ARN,
    TASK: process.env.ECS_TASK_ARN
};

app.use(express.json());
app.use(cors({ origin:  process.env.FRONTEND_URL }));

// Endpoint to trigger project deployment
app.post('/project', async (req, res) => {
    console.log("Received request body:", req.body);
    const { gitURL,slug } = req.body;
    const projectSlug = slug ? slug : generateSlug();
    console.log("Using projectSlug:", projectSlug);



    const subnets = process.env.SUBNETS.split(',');
    const securityGroups = process.env.SECURITY_GROUPS.split(',');


    // Spin the ECS container
    const command = new RunTaskCommand({
        cluster: config.CLUSTER,
        taskDefinition: config.TASK,
        launchType: 'FARGATE',
        count: 1,
        networkConfiguration: {
            awsvpcConfiguration: {
                assignPublicIp: 'ENABLED',
                subnets:subnets,
                securityGroups:securityGroups
            }
        },
        overrides: {
            containerOverrides: [
                {
                    name: 'builder-image',
                    environment: [
                        { name: 'GIT_REPOSITORY__URL', value: gitURL },
                        { name: 'PROJECT_ID', value: projectSlug }
                    ]
                }
            ]
        }
    });

    await ecsClient.send(command);

    return res.json({ status: 'queued', data: { projectSlug, url: `http://${projectSlug}.localhost:8000` },message:'Project Deployed Successfully' });
});

// Set up Redis to listen for logs
async function initRedisSubscribe() {
    console.log('Subscribed to logs....');
    subscriber.psubscribe('logs:*');
    subscriber.on("pmessage", (pattern, channel, message) => {
        console.log(`Emitting message to ${channel}:`, message); // Debug log
        io.to(channel).emit("message", JSON.parse(message));
    });
    
}

initRedisSubscribe();

app.listen(PORT, () => console.log(`API Server Running..${PORT}`));
