/* global Ember, Handlebars, moment */

Ember.Handlebars.helper("tableCell", function(row, column) {
	var value = "",
		columnName = column.data.keywords.column;

	if (row[columnName]) {
		value = row[columnName];
	}

  if (moment(value).isValid()) {
    value = moment(value).calendar();
  }

	return value;
});

Ember.Handlebars.helper("safeString", function(value) {
	return new Handlebars.SafeString(value);
});