/* global Ember, DS, App, $, _ */

App.Row = Ember.Object.extend({
	id: null,
	PartitionKey: null,
	RowKey: null,
	isSelected: false,
	partitionKeyChanged: false
});

