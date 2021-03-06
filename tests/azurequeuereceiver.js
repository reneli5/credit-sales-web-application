import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const { delay, ServiceBusClient } = require("@azure/service-bus");

// connection string to your Service Bus namespace
const connectionString = "Endpoint=sb://bngcredtisales.servicebus.windows.net/;SharedAccessKeyName=RootManageSharedAccessKey;SharedAccessKey=xA6uda3rGHzt3/PgvaZBpGyvfI41GcQrjsuXGCJ6eZ4="

// name of the queue
const queueName = "creditsales"

async function main() {
	// create a Service Bus client using the connection string to the Service Bus namespace
	const sbClient = new ServiceBusClient(connectionString);
	
	// createReceiver() can also be used to create a receiver for a subscription.
	const receiver = sbClient.createReceiver(queueName);
	
	// function to handle messages
	const myMessageHandler = async (messageReceived) => {
		console.log(`Received message: ${messageReceived.body}`);
	};
	
	// function to handle any errors
	const myErrorHandler = async (error) => {
		console.log(error);
	};
	
	// subscribe and specify the message and errorController handlers
	receiver.subscribe({
		processMessage: myMessageHandler,
		processError: myErrorHandler
	});
	
	// Waiting long enough before closing the sender to send messages
	await delay(20000);
	
	await receiver.close();
	await sbClient.close();
}
// call the main function
main().catch((err) => {
	console.log("Error occurred: ", err);
});
