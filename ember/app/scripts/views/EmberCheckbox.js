/* global Ember */

Ember.Checkbox = Ember.View.extend({
  classNames: ["ember-checkbox"],

  tagName: "input",

  attributeBindings: ["type", "checked", "indeterminate", "disabled", "tabindex", "name"],

  type: "checkbox",
  checked: false,
  disabled: false,
  indeterminate: false,
  bubbles: true,

  init: function() {
    this._super();
    this.on("change", this, this._updateElementValue);
  },

  didInsertElement: function() {
    this._super();
    this.get("element").indeterminate = !!this.get("indeterminate");

    if (!this.get("bubbles")) {
      this.$().click(function(e) {
        e.stopPropagation();
      });
    }
  },

  _updateElementValue: function() {
    Ember.set(this, "checked", this.$().prop("checked"));
  }
});