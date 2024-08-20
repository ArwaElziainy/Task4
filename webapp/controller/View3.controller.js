sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel",
	"sap/ui/model/odata/v2/ODataModel",
	"sap/ui/core/mvc/XMLView",
	 "sap/ui/core/routing/History"
], function(Controller, JSONModel, ODataModel, XMLView, History) {
	"use strict";

	return Controller.extend("Task4.controller.View3", {
			onInit: function() {

			},
			onCreate: function() {
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
			onCancel: function() {
				var oHistory = History.getInstance();
				var sPreviousHash = oHistory.getPreviousHash();

				if (sPreviousHash !== undefined) {
					// Go back to the previous page in history
					window.history.go(-1);
				} else {
					// If no history, navigate manually
					var oApp = this.getView().getParent();
					oApp.back();
				}
			
		}
	});
});