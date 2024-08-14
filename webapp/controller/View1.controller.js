sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel",
	"sap/ui/model/odata/v2/ODataModel"
], function(Controller, JSONModel, ODataModel) {
	"use strict";

	return Controller.extend("Task4.controller.View1", {
		onInit: function() {

		},

		onGo: function() {
			// Define the service URL
			var sServiceUrl = "https://dev.monairy.com/sap/opu/odata/SAP/ZGW_SO_SRV/";

			// Create an instance of the OData model
			var oModel = new ODataModel(sServiceUrl, {
				json: true,
				useBatch: false
					// Optional: set to false if you want to disable batch requests
					// other configurations if necessary
			});

			// Set the model to the view
			this.getView().setModel(oModel,"SOHeadSet");

			// Fetch data from the OData service
			oModel.read("/SOHeadSet", {
				urlParameters: {
					"$expand": "HeadToItems",
					"$format": "json",
					"sap-client": "110"
				},
				success: function(oData) {
					// Handle the successful response here
					console.log("Data fetched successfully:", oData.results);
					// Optionally, set the fetched data to a local JSON model for further processing
					var oLocalModel = new sap.ui.model.json.JSONModel(oData.results);
					this.getView().setModel(oLocalModel, "localModel");
					console.log(oLocalModel)
				}.bind(this),
				error: function(oError) {
					// Handle the error response here
					console.error("Error fetching data:", oError);
				}
			});
		},
		onPress: function(oEvent) {
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			// var refNo = oEvent.getSource().getBindingContext('SCHeaderSet2').getObject().ZdateSta;

			var Vbeln = oEvent.getSource().getBindingContext('SOHeadSet').getObject().Vbeln;
			console.log(Vbeln)

			oRouter.navTo("View2", {
				Vbeln: Vbeln
			}, false);
		}
	});
});