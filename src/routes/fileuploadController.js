import * as fs from 'fs';
import {UPLOADED_FILE_DIRECTORY_NAME} from '../utils/config.js';
import processBiodiversityMetrics from '../utils/biodiversityExtractor.js'

const uploadRoute = [
	{
		method: 'GET',
		path: '/metric-file-upload',
		handler: function(request, response){
			return response.view('metric-file-upload');
		}
	},
	{
	method: 'POST',
	path: '/upload-file',
	config: {
		handler: function (request, response) {

			const payload = request.payload;
			const destinationFilePath = UPLOADED_FILE_DIRECTORY_NAME + payload.file.filename;
			
			fs.copyFileSync(payload.file.path, destinationFilePath);
			let biodiversityMetricsData = processBiodiversityMetrics(payload, destinationFilePath);
			request.yar.set('biodiversityMetricsData', biodiversityMetricsData);
			
			return response.view('metric-file-confirm', {
				biodiversityMetricsData : {
					fileName: payload.file.filename,
					fileSize: (payload.file.bytes / 1024 / 1024).toFixed(2)
				}
			});
		},
		payload: {
			maxBytes: 1073741824,
			output: 'file',
			timeout: false,
			parse: true,
			multipart: true,
			allow: 'multipart/form-data'
		}
	}
}]

export default uploadRoute
