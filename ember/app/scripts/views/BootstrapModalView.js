/* global App, Ember, $ */

App.BootstrapModalView = Ember.View.extend({
	layoutName: "modal_layout",

	backdrop: true,
	keyboard: true,
	backdropClass: "",
	positionSelector: null,
	position: "bottom",

	didInsertElement: function() {
		var controller = this.get("controller"),
			pos, tp, actualWidth, actualHeight;

		this.$(".modal").modal({
			dynamic: true,
			keyboard: this.get("keyboard"),
			backdropClass: this.get("backdropClass")
		});

		this.$(".modal").one("hidden", function() {
			if (controller) {
				controller.send("closeModal");
			}
		});

		if (this.get("positionSelector")) {
	        pos = this._getPosition(this.get("positionSelector"));

	        actualWidth = this.$(".modal").offsetWidth;
	        actualHeight = this.$(".modal").offsetHeight;

	        tp = {
				top: pos.top + pos.height,
				left: pos.left + pos.width / 2 - actualWidth / 2
	        };
	        
	        this._applyPlacement(tp, this.get("position"));
		}
	},

	_applyPlacement: function(offset, placement){
		var $modal = this.$(".modal"),
			actualWidth = $modal[0].offsetWidth,
			actualHeight = $modal[0].offsetHeight,
			delta;

		$modal
		.offset(offset)
		.addClass(placement);

		if (placement === "bottom" || placement === "top") {
			delta = 0;

			if (offset.left < 0) {
				delta = offset.left * -2;
				offset.left = 0;
				$modal.offset(offset);
				actualWidth = $modal[0].offsetWidth;
				actualHeight = $modal[0].offsetHeight;
			}

		}
	},

	_getPosition: function (selector) {
		var el = $(selector);

		return $.extend({},
				(typeof el.getBoundingClientRect === "function") ? el.getBoundingClientRect():
				{
					width: el.offsetWidth,
					height: el.offsetHeight
				},
			el.offset());
    },

	close: function() {
		this.$(".modal").modal("hide");

		this.get("controller").send("closeModal");
	}
});