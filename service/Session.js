var Exception = require('../core/Exception');

module.exports = {
	ping : function(params, view)
	{
		view.push({
			to : [view.getSession().getId()]
		});
	},
	login : function (params, view)
	{
		var session = view.getSession();
		
		if (params.hasOwnProperty('userId'))
		{
			var sessionManager = require('../core/SessionManager');
			session.setId(params.userId);
			sessionManager.add(session);

			view.push({
				to : [params.userId]				
			});
		}
		else
		{
			session.disconnect();
		}
	}
};