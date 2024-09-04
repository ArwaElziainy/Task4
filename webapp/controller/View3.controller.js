sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel",
	"sap/ui/model/odata/v2/ODataModel",
	"sap/ui/core/mvc/XMLView",
	"sap/ui/core/routing/History",
	"Task4/SharedData"
], function(Controller, JSONModel, ODataModel, XMLView, History, SharedData) {
	"use strict";

	return Controller.extend("Task4.controller.View3", {
		onInit: function() {
			// Set up the OData model
			var sServiceUrl = "https://dev.monairy.com/sap/opu/odata/SAP/ZGW_SO_SRV/";
			var oODataModel = new ODataModel(sServiceUrl, {
				json: true,
				defaultBindingMode: "TwoWay"
			});

			// Set the model for the header and items
			var oHeaderData = {
				// header
				Vprgr: "",
				Auart: "",
				Spart: "",
				Vtweg: "",
				Gwldt: "",
				Kunnr: "",
				// sales
				Audat: "",
				Vkorg: "",
				Ernam: "",
				Erdat: "",
				Augru: "",
				Vkbur: "",
				Waerk: "",
				Kalsm: "",
				Bstnk: "",
				Bsark: "",
				// shipping
				Autlf: Boolean(),
				Lifsk: "",
				Vsbed: "",
				Proli: "",
				// Billing Document
				BukrsVf: "",
				Xegdr: Boolean(),
				Faksk: "",
				Taxk1: "",
				Landtx: "",
				// Items
				HeadToItems: [{
					Posnr: "000010",
					Matnr: "",
					Matwa: "",
					Zmeng: "",
					Kwmeng: "",
					Pstyv: "",
					Zieme: "",
					Werks: "",
					Selected: false
				}]
			};

			var oHeaderModel = new JSONModel(oHeaderData);
			this.getView().setModel(oHeaderModel, "headerModel");

			this.oODataModel = oODataModel; // Store the OData model for later use
		},
		onCreate: function() {
			var oModel = this.getView().getModel("headerModel");
			var oData = oModel.getData();
			console.log(oData)

			// Remove the 'Selected' property from each item
			oData.HeadToItems = oData.HeadToItems.map(function(item) {
				// Create a copy of the item without the 'Selected' property
				return {
					Posnr: item.Posnr,
					Matnr: item.Matnr,
					Matwa: item.Matwa,
					Zmeng: item.Zmeng,
					Kwmeng: item.Kwmeng,
					Pstyv: item.Pstyv,
					Zieme: item.Zieme,
					Werks: item.Werks
				};
			});

			console.log(oData);

			// Save the sales order using the OData model
			var that = this;
			this.oODataModel.create("/SOHeadSet", oData, {
				success: function(oData2) {
					console.log(oData2);
					// console.log(oData2);
					sap.m.MessageToast.show("Sales Document  " + oData2.Vbeln + " created");
					SharedData.setData("Vbeln", oData2.Vbeln);
					console.log(that.getView())
					var oApp = that.getView().getParent(); // Get the parent (the app control or the container)
					XMLView.create({
						viewName: "Task4.view.display"
					}).then(function(oDisplayView) {

						// Replace the current content with the new view
						oApp.removeAllPages();
						oApp.addPage(oDisplayView);
						oApp.to(oDisplayView); // Navigate to the new view
					});
				},
				error: function(error) {
					sap.m.MessageToast.show("Error while creating Sales Document.");
					console.error(error)
				}
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

		},
		onAddRow: function() {
			var oModel = this.getView().getModel("headerModel");
			var aItems = oModel.getProperty("/HeadToItems") || [];

			// Generate the next Item ID
			var sNextItemId = this._getNextItemId(aItems);

			// Create a new item
			var oNewItem = {
				Posnr: sNextItemId, // Automatically generated ID
				Matnr: "",
				Matwa: "",
				Zmeng: "",
				Kwmeng: "",
				Pstyv: "",
				Zieme: "",
				Werks: ""
			};

			// Add the new item to the list
			aItems.push(oNewItem);

			// Update the model
			oModel.setProperty("/HeadToItems", aItems);

		},
		_getNextItemId: function(aItems) {
			if (aItems.length === 0) {
				return "000010"; // Start with "000010" if no items exist
			}

			var sLastItemId = aItems[aItems.length - 1].Posnr;
			var iNextItemId = parseInt(sLastItemId, 10) + 10;
			return iNextItemId.toString().padStart(6, "0");
		},
		onSelectAll: function(oEvent) {
			var bSelected = oEvent.getParameter("selected");
			var oModel = this.getView().getModel("headerModel");
			var aItems = oModel.getProperty("/HeadToItems");

			// Update all items to be selected or deselected
			aItems.forEach(function(item) {
				item.Selected = bSelected;
			});

			oModel.refresh(); // Refresh the model to update the view
		},
		onItemSelect: function() {
			var oModel = this.getView().getModel("headerModel");
			var aItems = oModel.getProperty("/HeadToItems");
			var oSelectAllCheckbox = this.byId("selectAllCheckbox");

			// Check if all items are selected
			var bAllSelected = aItems.every(function(item) {
				return item.Selected;
			});

			// If not all items are selected, uncheck the "Select All" checkbox
			oSelectAllCheckbox.setSelected(bAllSelected);
		},
		onDelete: function() {
			var oModel = this.getView().getModel("headerModel");
			var aItems = oModel.getProperty("/HeadToItems");

			// Filter out selected items
			var aItemsToDelete = aItems.filter(function(item) {
				return item.Selected;
			});
			// Check if there are selected items
			if (aItemsToDelete.length === 0) {
				sap.m.MessageToast.show("No items selected for deletion.");
				return;
			}

			// Remove selected items from the model
			var aUpdatedItems = aItems.filter(function(item) {
				return !item.Selected;
			});

			oModel.setProperty("/HeadToItems", aUpdatedItems);
			sap.m.MessageToast.show("Selected items removed successfully.");

		}
	});
});