/* global Ember, App, _ */

App.Page = Ember.Object.extend({
	id: null,
	continuation: null,
	rows: null
});

App.Page.FIRSTPAGE = App.Page.create({id: 1});

App.Page.reopenClass({
	find: function(tableName, credentials, pageId, continuation) {
		var partitionKey,
			requestData = {
			account: credentials.storageKey ? credentials.storageAccount : undefined,
			key: credentials.storageKey,
			top: 10
		};

		if (continuation) {
			requestData.nextPartitionKey = continuation.nextPartitionKey;
			requestData.nextRowKey = continuation.nextRowKey;
		}

		return Ember.RSVP.Promise(function(resolve, reject) {

			App.ajax("/json/table/" + tableName, {data: requestData}).then(function(value) {
				resolve(
					App.Page.create({
						id: pageId,
						continuation: value.table.continuation,
						rows: _.map(value.table.rows, function(item) {
							var row = App.Row.create(item);
							row.set("id", item.PartitionKey + "." + item.RowKey);

							if (!partitionKey || row.get("PartitionKey") !== partitionKey) {
								partitionKey = row.get("PartitionKey");
								row.set("partitionKeyChanged", true);
							}

							return row;
						})
					})
				);
			}, function(error) {
				reject(error);
			});
		
		});
	}
});