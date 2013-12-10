/* global App */

App.TablesIndexRoute = App.AuthenticatedRoute.extend({
	model: function() {
		return App.Tables.find(this.get("credentials"));
	}
});