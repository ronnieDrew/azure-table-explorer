/* global Ember, $ */

Ember.onerror = function(error) {
  console.log("Ember.onerror", error);
};

var App = window.App = Ember.Application.create({
	 LOG_TRANSITIONS: true,
   LOG_ACTIVE_GENERATION: true
});

Ember.LOG_BINDING = true;
Ember.ENV.RAISE_ON_DEPRECATION = true;
Ember.LOG_STACKTRACE_ON_DEPRECATION = true;

App.ajax = function(url, options) {
  var self = this;

  self.options = options || {};

	return Ember.RSVP.Promise(function(resolve, reject) {
		
		self.options.success = function(data) {
			Ember.run(null, resolve, data);
		};

		self.options.error = function(jqXHR, status, error) {
			Ember.run(null, reject, arguments);
		};

		$.ajax(url, self.options);
	});
};

/* Order and include as you please. */
require("scripts/routes/*");
require("scripts/controllers/*");
require("scripts/models/*");
require("scripts/views/*");

App.Router.map(function () {

  // application
  // index

  this.resource("tables", function() {
    // tables.index

    this.resource("table", { path: ":table_id" }, function() {
      // table.index

      this.route("page", { path: ":page_id" } );
    });
  });

});
