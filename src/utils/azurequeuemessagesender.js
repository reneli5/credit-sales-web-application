import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const { ServiceBusClient } = require("@azure/service-bus");
import {SERVICE_BUS_QUEUE_ENDPOINT, SERVICE_BUS_QUEUE_NAME} from '../utils/config.js';

const connectionString = SERVICE_BUS_QUEUE_ENDPOINT

const queueName = SERVICE_BUS_QUEUE_NAME;

async function sendBiodiversityMessagetToQueue(payload) {
	const sbClient = new ServiceBusClient(connectionString);
	
	const sender = sbClient.createSender(queueName);
	try {
		const messages = [
			{ body: JSON.stringify(payload) }
		];
		await sender.sendMessages(messages);
	}finally {
		await sender.close();
		await sbClient.close();
	}
}
export default sendBiodiversityMessagetToQueue
