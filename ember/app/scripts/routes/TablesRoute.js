/* global App */

App.TablesRoute = App.AuthenticatedRoute.extend({
	model: function() {
		return App.Tables.find(this.get("credentials"));
	}
});