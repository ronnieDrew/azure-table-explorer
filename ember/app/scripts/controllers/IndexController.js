/* global Ember, App */

App.IndexController = Ember.ObjectController.extend({
	storageAccount: "",
	storageKey: "",
	attemptedTransition: null,
	credentials: null,

	loginDisabled: function() {
		var credentials = this.getProperties("storageAccount", "storageKey");

		if (credentials.storageAccount.length > 0 && credentials.storageKey.length > 0 ) {
			return false;
		}

		return true;

	}.property("storageAccount", "storageKey"),

	usingSSL: function() {
		return (document.location.protocol === "https:");
	}.property(),

	login: function() {		
		var self = this,
			credentials = this.getProperties("storageAccount", "storageKey"),
			attemptedTransition = this.get("attemptedTransition"),
			tables = App.Tables.find(credentials);

		tables.then(function(data) {
			// success
			self.set("credentials", credentials);

			if (attemptedTransition) {
				attemptedTransition.retry();
				self.set("attemptedTransition", null);
			} else {
				self.transitionToRoute("tables.index");
			}

		}, function(reason) {
			// failure
			self.set("credentials", null);
			self.send("error", reason);
		});

	}
});