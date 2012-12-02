module.exports = {
	points : function (params, view)
	{
		view.push({
			points : params.points,
			op : 1000
		});
			
		view.push({
			to : [view.getSession().getId()]
		});
	}
};