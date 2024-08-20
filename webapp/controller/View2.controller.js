sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel",
	"sap/ui/model/odata/v2/ODataModel",
	"sap/ui/core/mvc/XMLView",
	 "Task4/SharedData"
], function(Controller, JSONModel, ODataModel, XMLView, SharedData) {
	"use strict";

	return Controller.extend("Task4.controller.View2", {
		onInit: function() {
		
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.getRoute("View2").attachMatched(this._onRouteMatched, this);
		},
		_onRouteMatched: function(oEvent) {
			var Vbeln = oEvent.getParameter("arguments").Vbeln;
			 SharedData.setData("Vbeln", Vbeln);

		
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
		onEdit: function() {
			// var edit = document.getElementsByClassName("pressEdit");
			// for (var i = 0; i < edit.length; i++) {
			// 	edit[i].style.display = "none";
			// }
			// console.log(edit)
			//var oForm = this.getView().byId("form");
			//     var bEditable = oForm.getEditable();

			//     oForm.setEditable(!bEditable);
		}

	});
});