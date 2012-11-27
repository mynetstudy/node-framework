var sessionManager = require('./SessionManager');

function View(params, session)
{
	this.params = arguments[0] || {};
	this.session = arguments[1] || null;
	this.models = [];
	this.sessionId = this.session.getId();
}

View.prototype.push = function (data)
{
	var data = arguments[0] || {};

	if (!data.hasOwnProperty('to') && this.sessionId != null)
	{
		data.to = [this.sessionId];
	}
	
	if (!data.hasOwnProperty('op'))
	{
		data.op = this.params.op + 1;
	}
	
	if (!data.hasOwnProperty('ret'))
	{
		data.ret = 0;
	}

	this.models.push(data);
}

View.prototype.getSession = function()
{
	return this.session;
}

View.prototype.display = function()
{
	for (var i = 0, max = this.models.length ; i < max ; i++)
	{
		var model = this.models[i];

		if (model.hasOwnProperty('to'))
		{
			this.emit(model.to, this.getBuffer(model));
		}
		else
		{
			this.emits(this.getBuffer(model));
		}
	}
}

View.prototype.getBuffer = function(data)
{
	delete data.to;

	var data = JSON.stringify(data);
	var buffer = new Buffer(data.length + 4);
	buffer.writeInt32BE(data.length, 0);
	buffer.write(data, 4, buffer.length, 'utf8');
	return buffer;
}

View.prototype.emits = function(buffer)
{
	var sessions = sessionManager.getAll();
	
	for(var sessionId in sessions)
	{
	    sessions[sessionId].emit(buffer);
	}
}

View.prototype.emit = function(sessionIds, buffer)
{
	for(var index in sessionIds)
	{
	    var session = sessionManager.getById(sessionIds[index]);
	    
	    if (session) session.emit(buffer);
	}
}

module.exports = View;