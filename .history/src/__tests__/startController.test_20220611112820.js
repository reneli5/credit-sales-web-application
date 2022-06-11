import { createServer, init } from '../server.js';
import serverOptions from '../__mocks__/server-options.js'
import path from 'path';
import request from 'supertest';

describe('Controller tests', () => {
	let server;
	
	beforeEach(async () => {
		server = await createServer(serverOptions)
		await init(server)
	});
	
	afterEach(async () => {
		await server.stop();
	});
	
	it('tests error controller', async () => {
		
		
		const res = await server.inject({
			method: 'GET',
			url: '/errorController'
		});
		expect(res.statusCode).toEqual(500);
		expect(res.payload).toBeDefined();
		
		
	})
	
	it('tests home page controller', async () => {
		
		const res = await server.inject({
			method: 'GET',
			url: '/'
		});
		expect(res.statusCode).toEqual(200);
		expect(res.payload).toBeDefined();
		
	})
	
	it('test user authentication controller', async function () {
		const options = {
			method: 'POST',
			url: '/login',
			payload: JSON.stringify({ userName: 'satoshi', password: 'pass' })
		};
		const data = await server.inject(options);
		expect(data.statusCode).toBe(302);
	});
	
	// it('test public resource controller get robot text', async function () {
	// 	const options = {
	// 		method: 'GET',
	// 		url: '/public/arobots.txt'
	// 	};
	// 	const data = await server.inject(options);
	// 	expect(data.statusCode).toBe(204);
	// });
	
	it('test public resource controller get stylesheet', async function () {
		const options = {
			method: 'GET',
			url: '/public/application.css'
		};
		const data = await server.inject(options);
		expect(data.statusCode).toBe(200);
	});
	
	it('test start of file upload controller', async function () {
		const options = {
			method: 'GET',
			url: '/metric-file-upload'
		};
		const data = await server.inject(options);
		expect(data.statusCode).toBe(200);
	});
	
	it('test file upload controller', async function () {
		
		const metricsFile = path.resolve( './Metric_3_0.xlsm');
		return request(server.listener)
			.post('/upload-file')
			.set('content-type', 'application/octet-stream')
			.attach('file', metricsFile)
			.expect(200)
	});
	
	it('test confirm file upload', async function () {
		const options = {
			method: 'GET',
			url: '/metric-file-confirm'
		};
		const data = await server.inject(options);
		expect(data.statusCode).toBe(200);
	});
	
	it('test file confirm upload controller', async function () {

		const options = {
			method: 'POST',
			url: '/confirm-upload',
			payload: JSON.stringify({ userName: 'satoshi', password: 'pass' })
		};
		const data = await server.inject(options);
		expect(data.statusCode).toBe(302);

	});
})
