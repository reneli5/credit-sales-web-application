const errorController = {
  method: 'GET',
  path: '/errorController',
  handler: () => {
    throw new Error('test')
  }
}

export default errorController
