var View = require('./View'),
	protocol = require('./Protocol'),
	Exception = require('./Exception');
	
function Dispatcher(session, params)
{
	this._params = params;
	this._view = new View(params, session);
}

Dispatcher.prototype.dispatch = function ()
{
	if (!this._params.hasOwnProperty('op'))
	{
		throw new Exception('no op', this._params);
	}

	if (!protocol.hasOwnProperty(this._params.op))
	{
		throw new Exception('unknown op', this._params);
	}

	var actions = protocol[this._params.op].split('.');
	var service = require('../service/' + actions[0]);

	service[actions[1]](this._params, this._view);

	return this._view;
}

module.exports = Dispatcher;