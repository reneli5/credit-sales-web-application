const loginRoute = [
	{
		method: 'GET',
		path: '/login',
		handler: {
			view: 'login'
		}
	},
	{
		method: 'POST',
		path: '/login',
		handler: (request, response) => {
			request.yar.set('sessionEmailAddress', request.payload.emailAddress);
			return response.redirect('metric-file-upload', {
				emailAddress: request.payload.emailAddress,
			});
		}
	}
];
export default loginRoute;
