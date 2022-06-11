const start = {
  method: 'GET',
  path: '/',
  handler: function(request, response){
    return response.view('start');
  }
}

export default start
