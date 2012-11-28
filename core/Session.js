var sessionManager = require('./SessionManager');
var Dispatcher = require('./Dispatcher');
var Data = require('./Data');
	
function Session(socket)
{
	this.charset = 'utf8';
	this.socket = socket;
	this.sessionId = null;
	this.crossdomain = '<cross-domain-policy><allow-access-from domain="*" /></cross-domain-policy>';
	this.isconnect = true;
	
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
	this.isconnect = false;
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
	
	try
	{
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
				this.emit(new Data(JSON.stringify(exception)));
			}
			
			offset += lenght;
		}
	}
	catch(exception)
	{
		this.emit(new Data(JSON.stringify(exception)));
		this.disconnect();
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
	if (this.isconnect)
	{
		this.socket.write(buffer);
	}
}

module.exports = Session;