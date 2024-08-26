sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel",
	"sap/ui/model/odata/v2/ODataModel",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator"
], function(Controller, JSONModel, ODataModel, Filter, FilterOperator) {
	"use strict";

	return Controller.extend("Task4.controller.View1", {
		onInit: function() {
			this.oTable = this.byId("table");
			this.oDeleteButton = this.byId("delete");
			// Create the OData model directly in the controller
			var oModel = new sap.ui.model.odata.v2.ODataModel("/sap/opu/odata/SAP/ZGW_SO_SRV/", {
				useBatch: false, // Optional, disable batch processing if not needed
				defaultBindingMode: "TwoWay",
				defaultCountMode: "Inline"
			});

			// Set the model to the view
			this.getView().setModel(oModel);
		},

		onGo: function() {
			// var oTable = this.getView().byId("table");

			// Manually refresh the model to fetch data from the OData service
			// var oModel = this.getView().getModel();
			// oModel.refresh(true);

			// // Apply filters if needed
			// this.applyTableFilters();

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
			this.getView().setModel(oModel);

			// Fetch data from the OData service
			oModel.read("/SOHeadSet", {
				urlParameters: {
					"$expand": "HeadToItems",
					"$format": "json",
					"sap-client": "110"
				},
				success: function(oData) {

					// Optionally, set the fetched data to a local JSON model for further processing
					var oLocalModel = new sap.ui.model.json.JSONModel(oData.results);
					this.getView().setModel(oLocalModel, "localModel");

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

			var Vbeln = oEvent.getSource().getBindingContext('undefined').getObject().Vbeln;

			oRouter.navTo("View2", {
				Vbeln: Vbeln
			}, false);
		},
		onCreate: function() {
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);

			oRouter.navTo("View3");
		},

		// Handle Select All checkbox behavior
		onSelectAll: function(oEvent) {
			var bSelected = oEvent.getParameter("selected");
			var aItems = this.oTable.getItems();

			// Set the selected state for all checkboxes in the rows
			aItems.forEach(function(oItem) {
				oItem.getCells()[0].setSelected(bSelected); // Assuming the first cell contains the checkbox
			});

			// Enable or disable the Delete button based on selection
			this._updateDeleteButtonState();
		},
		onItemSelect: function() {

			var aItems = this.oTable.getItems();
			var bAllSelected = true;
			var bAnySelected = false;

			// Check if all or any checkboxes are selected
			aItems.forEach(function(oItem) {
				var bSelected = oItem.getCells()[0].getSelected();
				if (!bSelected) {
					bAllSelected = false;
				} else {
					bAnySelected = true;
				}
			});

			// Update the "Select All" checkbox state
			this.byId("selectAllCheckbox").setSelected(bAllSelected);

			// Enable or disable the Delete button based on selection
			this._updateDeleteButtonState(bAnySelected);
		},

		// Update the Delete button state based on checkbox selections
		_updateDeleteButtonState: function() {
			var aItems = this.oTable.getItems();
			var bAnySelected = aItems.some(function(oItem) {
				return oItem.getCells()[0].getSelected();
			});

			this.oDeleteButton.setEnabled(bAnySelected);
		},
		onFilter: function() {
			var sVbelnValue = this.getView().byId("inputVbeln").getValue();
			var aFilters = [];

			if (sVbelnValue) {
				aFilters.push(new Filter("Vbeln", FilterOperator.EQ, sVbelnValue));
			}

			var oTable = this.getView().byId("table");
			var oBinding = oTable.getBinding("items");

			if (oBinding) {
				if (oBinding.filter(aFilters)) {
					oBinding.filter(aFilters);
					console.log("Filters applied: ", aFilters);
				} else {
					console.log("error")
				}

			} else {
				console.error("Table binding not found.");
			}
			console.log(oBinding.filter(aFilters))
		}
	});
});