/* global Ember, App, _ */

App.Tables = Ember.Object.extend({
	id: null,
	storageAccountName: null,
	tables: null
});

App.Tables.reopenClass({
	find: function(credentials) {
		var requestData = {
			account: credentials.storageKey ? credentials.storageAccount : undefined,
			key: credentials.storageKey,
			top: 10
		};

		return Ember.RSVP.Promise(function(resolve, reject) {
				
				App.ajax("/json/table", {data: requestData}).then(function(value) {
					// success
					resolve(
						App.Tables.create({
							id: value.result.name,
							storageAccountName: value.result.name,
							tables: _.map(value.result.tables, function(item) {
								return App.Table.create({id: item});
							})
						})
					);
				}, function(error) {
					// fail
					reject(error);
				});

		});
	}
});