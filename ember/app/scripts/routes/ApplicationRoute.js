/* global Ember, App */

App.ApplicationRoute = Ember.Route.extend({

    events: {
		error: function(error) {
			var errorController = this.router.container.lookup("controller:error");
			
			errorController.set("model", error);

			this.render("errorModal", {
				into: "application",
				outlet: "modalOutlet",
				controller: errorController
			});
		},

		openModal: function(modalName) {
			var modalController = this.router.container.lookup("controller:" + modalName),
				modalTemplate = modalName;

			this.render(modalTemplate, {
				into: "application",
				outlet: "modalOutlet",
				controller: modalController
			});
		},

		closeModal: function() {
			this.render("emptyTemplate", {
				into: "application",
				outlet: "modalOutlet"
			});
		}
	}

});