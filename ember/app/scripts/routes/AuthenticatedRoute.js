/* global Ember, App */

App.AuthenticatedRoute = Ember.Route.extend({
	credentials: null,

	_redirectToLogin: function(transition) {
		var indexController = this.controllerFor("index");

		indexController.set("attemptedTransition", transition);
		this.transitionTo("index");
	},

	beforeModel: function(transition) {
		var credentials = this.controllerFor("index").get("credentials");

		if (!credentials) {
			this._redirectToLogin(transition);
		} else {
			this.set("credentials", credentials);
		}
	},

	events: {
		error: function(reason, transition) {
			if (reason.status === 401) {
				this._redirectToLogin(transition);
			} else {
				throw {error: reason, transition: transition};
			}
		}
	}
});