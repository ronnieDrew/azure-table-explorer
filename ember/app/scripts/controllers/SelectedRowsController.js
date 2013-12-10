/* global Ember, App, _ */

App.SelectedRowsController = Ember.ObjectController.extend({
	tablePage: null,
	needs: "tablePage",
	tablePageBinding: "controllers.tablePage",
	currentIndex: 0,

	selectedRows: function() {
		var rows = this.get("tablePage").get("rows"),
			selectedRows = _.where(rows, {isSelected: true});

		if (selectedRows.length <= this.get("currentIndex") && selectedRows.length > 0) {
			this.set("currentIndex", selectedRows.length - 1);
		}

		return selectedRows;
	}.property("tablePage.rows.@each.isSelected"),

	hasSelectedRows: function() {
		return (this.get("selectedRows").length > 0);
	}.property("selectedRows"),

	moveNext: function() {
		var currentIndex = this.get("currentIndex");

		if (currentIndex < (this.get("selectedRows").length - 1)) {
			this.set("currentIndex", currentIndex + 1);
		}
	},

	movePrevious: function() {
		var currentIndex = this.get("currentIndex");

		if (currentIndex > 0) {
			this.set("currentIndex", currentIndex - 1);
		}
	},

	moveNextEnabled: function() {
		return (this.get("currentIndex") < (this.get("selectedRows").length) - 1);
	}.property("currentIndex", "selectedRows"),

	movePreviousEnabled: function() {
		return (this.get("currentIndex") > 0);
	}.property("currentIndex"),

	currentRow: function() {
		return this.get("selectedRows")[this.get("currentIndex")];
	}.property("selectedRows", "currentIndex"),

	currentDisplayIndex: function() {
		return this.get("currentIndex") + 1;
	}.property("currentIndex")

});