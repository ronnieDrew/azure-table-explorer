/* global App */

App.TableIndexRoute = App.AuthenticatedRoute.extend({
	model: function(params, data) {

		return App.Table.create({id: data.params.table_id});
	}
	
});