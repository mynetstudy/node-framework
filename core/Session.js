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
	this.msg = '';
	
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
	
	this.msg += msg;
	
	if (msg.lastIndexOf('\\0') != msg.length - 2)
	{
		return;
	}

	try
	{
		var result = this.msg.split("\\0");
		
		for (var i = 0, max = result.length - 1 ; i < max ; i ++)
		{
			//console.log('data', result[i]);
			
			var dispatcher = new Dispatcher(this, JSON.parse(result[i]));
			var view = dispatcher.dispatch();
			view.display();
		}
		
		this.msg = '';
	}
	catch(exception)
	{
		console.log('exception', exception);	
		this.emit(new Data(JSON.stringify(exception)));
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
	//console.log('emit', this.isconnect, this.sessionId, buffer);
	
	if (this.isconnect)
	{
		this.socket.write(buffer);
	}
}

module.exports = Session;