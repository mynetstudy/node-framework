var sessions = {};

module.exports = {
	getAll : function()
	{
		return sessions;
	},
	getById : function(id)
	{
		return (!sessions[id]) ? null : sessions[id];
	},
	removeById : function(id)
	{
		delete sessions[id];
	},
	add : function(session)
	{
		sessions[session.getId()] = session;
	}
};