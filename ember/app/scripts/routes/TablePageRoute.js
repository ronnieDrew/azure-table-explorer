/* global App */

App.TablePageRoute = App.AuthenticatedRoute.extend({
	renderTemplate: function() {
		var selectedRowsController = this.controllerFor("selectedRows");
		this.render();

		this.render("table/selectedRows", {
			into: "tables",
			outlet: "selectedRowsOutlet",
			controller: selectedRowsController
		});
	},

	setupController: function(controller, model) {
		var self = this,
			pageId = model.id,
			tableId = this.modelFor("table").get("id"),
			credentials = this.get("credentials"),
			continuation = this._getPageContinuationToken(pageId - 1);

		if (!model.rows) {
			model = App.Page.find(tableId, credentials, pageId, continuation);

			model.then(function(value) {
				// success
				self._setPageContinuationToken(value.id, value.continuation);
				controller.set("model", value);
			}, function(error) {
				// failure
				throw error;
			});
		}

	},

	model: function(params) {
		var pageId = parseInt(params.page_id, 10) || 1;

		return App.Page.create({id: pageId});
	},

	_getPageContinuationToken: function(pageId) {
		var continuationToken = null,
			table = this.modelFor("table"),
			continuationTokens = table.get("continuationTokens");

		if (continuationTokens) {
			continuationToken =  continuationTokens[pageId];
		}

		return continuationToken;
	},

	_setPageContinuationToken: function(pageId, continuationToken) {
		var table = this.modelFor("table"),
			continuationTokens = table.get("continuationTokens");

		if (!continuationTokens) {
			continuationTokens = {};
			table.set("continuationTokens", continuationTokens);
		}

		continuationTokens[pageId] = continuationToken;
	}
});