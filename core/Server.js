var net = require('net');
var Session = require('./Session');

module.exports = {
	run : function(host, port)
	{
		var server = net.createServer(this.connect);
		server.listen(port, host);
	},
	connect : function(socket)
	{
		new Session(socket);
	}
};