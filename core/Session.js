var sessionManager = require('./SessionManager');
var Dispatcher = require('./Dispatcher');
	
function Session(socket)
{
	this.charset = 'utf8';
	this.socket = socket;
	this.sessionId = null;
	this.crossdomain = '<cross-domain-policy><allow-access-from domain="*" /></cross-domain-policy>';
	
	socket.setEncoding(this.charset);
	socket.setNoDelay(true);
	socket.setKeepAlive(true);
	
	socket.on("data", this.receiveHandler.bind(this));
	socket.on("end", this.endHandler.bind(this));
	socket.on("error", this.errorHandler.bind(this));
}

Session.prototype.setId = function(sessionId)
{
	this.sessionId = sessionId;
}

Session.prototype.getId = function()
{
	return this.sessionId;
}

Session.prototype.disconnect = function()
{
	var sessionId = this.getId();
	if (sessionId != null) sessionManager.removeById(sessionId);
	this.socket.end();
}

Session.prototype.receiveHandler = function(msg)
{
	if (msg.indexOf("<policy-file-request/>") != -1)
	{
		this.socket.write(this.crossdomain);
		this.disconnect();
		return;
	}
	
	var buffer = new Buffer(msg, this.charset);
	var offset = 0;
	
	while(offset < buffer.length)
	{
		var lenght = buffer.readUInt32BE(offset);
		var dataLength = buffer.readInt16BE(offset + 4);
		var data = buffer.slice(offset + 6 , offset + 6 + dataLength).toString();

		try
		{
			var dispatcher = new Dispatcher(this, JSON.parse(data));
			var view = dispatcher.dispatch();
			view.display();
		}
		catch(exception)
		{
			console.log(exception);
		}
		
		offset += lenght;
	}
}

Session.prototype.endHandler = function()
{
	this.disconnect();
}

Session.prototype.errorHandler = function()
{
	this.disconnect();
}

Session.prototype.emit = function(buffer)
{
	this.socket.write(buffer);
}

module.exports = Session;