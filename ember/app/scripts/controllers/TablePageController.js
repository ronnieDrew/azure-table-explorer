/* global Ember, App, _ */

App.TablePageController = Ember.ObjectController.extend({
	toggleRowSelection: function(row) {
		var isSelected = row.get("isSelected") || false;

		row.set("isSelected", !isSelected);
	},

	columns: function() {
		var columns = [],
			excludedColumns = {
				id: true,
				PartitionKey: true,
				RowKey: true,
				isSelected: true,
				partitionKeyChanged: true,
				_: true
			};

		_.each(this.get("rows"), function(element) {
			for(var column in element) {
				if (!element.hasOwnProperty(column)) {
					break;
				}

				if (!excludedColumns[column] && _.contains(columns, column) !== true) {
					columns.push(column);
				}
			}
		});

		return columns;

	}.property("rows.@each"),

	columnHeaders: function() {
		var columnHeaders = _.clone(this.get("columns"));

		// blank header for "isSelected" column
		columnHeaders.unshift(" ");

		return columnHeaders;
	}.property("columns"),

	paginationLinks: function() {
		var links = [],
			currentPage = this.get("id"),
			startPage = (currentPage > 5) ? (currentPage - 5) : 1,
			endPage = currentPage;

		endPage += this.get("continuation") ? 2 : 1;

		links.push(App.Page.create({
			id: currentPage - 1,
			displayText: "&larr;",
			disabled: (currentPage === 1),
			isActive: false
		}));

		if (startPage > 1) {
			links.push(App.Page.create({
				id: 1,
				displayText: "1",
				disabled: false,
				isActive: (currentPage === 1)
			}));

			if (startPage > 2) {
				links.push(App.Page.create({
					id: 2,
					displayText: "...",
					disabled: true,
					isActive: false
				}));
			}
		}

		for (var i = startPage; i < endPage; i++) {
			links.push(App.Page.create({
				id: i,
				displayText: i,
				disabled: false,
				isActive: (i === currentPage)
			}));
		}

		links.push(App.Page.create({
			id: currentPage + 1,
			displayText: "&rarr;",
			disabled: this.get("continuation") ? false : true, // Check continuation
			isActive: false
		}));

		return links;
	}.property("id"),

	firstPartitionKey: function() {
		var partitionKey = "",
			rows = this.get("rows");

		if (rows && rows.length > 0) {
			partitionKey = rows[0].PartitionKey;
		}

		return partitionKey;
	}.property("rows.@each"),

	rowInfo: function(value) {
		return value;
	}
});