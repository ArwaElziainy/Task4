sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel",
	"sap/ui/model/odata/v2/ODataModel",
	"sap/ui/core/mvc/XMLView"
], function(Controller, JSONModel, ODataModel, XMLView) {
	"use strict";

	return Controller.extend("Task4.controller.Edit", {
		onInit: function() {

		},
		onCancel: function() {
			var oApp = this.getView().getParent(); // Get the parent (the app control or the container)

			XMLView.create({
				viewName: "Task4.view.display"
			}).then(function(oDisplayView) {

				// Replace the current content with the new view
				oApp.removeAllPages();
				oApp.addPage(oDisplayView);
				oApp.to(oDisplayView); // Navigate to the new view

			});
		},
		onSave:function(){
				var oApp = this.getView().getParent(); // Get the parent (the app control or the container)

			XMLView.create({
				viewName: "Task4.view.display"
			}).then(function(oDisplayView) {

				// Replace the current content with the new view
				oApp.removeAllPages();
				oApp.addPage(oDisplayView);
				oApp.to(oDisplayView); // Navigate to the new view

			});
		}
	});
});