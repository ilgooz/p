var messages = require('./node/api_pb');
var services = require('./node/api_grpc_pb');
var grpc = require('grpc');

var coreClient = new services.CoreClient('localhost:50052', grpc.credentials.createInsecure());

// service list
var request = new messages.ListServicesRequest();
coreClient.listServices(request, {}, function(err, response) {
    console.log(err)
    response.getServicesList().forEach((service) => {
        console.log("list:", service.getHash())
    })
});

// deploy
var request = new messages.DeployServiceRequest();
request.setUrl("https://github.com/mesg-foundation/service-webhook")

var stream = coreClient.deployService();
stream.on('data', (data) => { 
  var id = data.getServiceid()
  if (id) console.log("deployed: ", id)
})
stream.write(request)