import sendBiodiversityMessagetToQueue from '../utils/azurequeuemessagesender.js'
import {UPLOADED_FILE_DIRECTORY_NAME} from '../utils/config.js';
import processBiodiversityMetrics from '../utils/biodiversityExtractor.js'

const confirmuploadController = [{
		method: 'GET',
		path: '/metric-file-confirm',
		config: {
			handler: function (request, response) {
				return response.view('metric-file-confirm');
			}
		}
	},
	{
		method: 'POST',
		path: '/confirm-upload',
		config: {
			handler: async function (request, response) {
				const habitatDetails = [];
				if(request.yar.get('biodiversityMetricsData') != undefined) {
					request.yar.get('biodiversityMetricsData').habitatBaseline.forEach((baseline) => {
						
						habitatDetails.push([
							{
								text: baseline.habitatType
							},
							{
								text: baseline.area
							},
							{
								text: baseline.condition
							},
							{
								text: baseline.bioDiversityNeeded
							}
						])
					})
					await sendBiodiversityMessagetToQueue(request.yar.get('biodiversityMetricsData'));
					return response.view('metric-file-calculation', {
						habitatData: habitatDetails
					});
				}else{
					return response.redirect('start');
				}
			}
		}
	}];

export default confirmuploadController;
