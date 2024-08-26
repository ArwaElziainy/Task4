
sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel",
	"sap/ui/model/odata/v2/ODataModel",
	"sap/ui/core/mvc/XMLView",
	"Task4/SharedData"
], function(Controller, JSONModel, ODataModel, XMLView, SharedData) {
	"use strict";

	return Controller.extend("Task4.controller.Edit", {
		onInit: function() {
			var sVbeln = SharedData.getData("Vbeln");
			var sServiceUri = "https://dev.monairy.com/sap/opu/odata/SAP/ZGW_SO_SRV/";
			var oModel = new ODataModel(sServiceUri, {
				json: true
			});
			this.getView().byId("ObjectPageLayoutHeaderTitle").setObjectTitle(sVbeln);

			oModel.read("/SOHeadSet('" + sVbeln + "')", {
				urlParameters: {
					"$expand": "HeadToItems"
				},
				success: function(oData) {
					var sModel = new JSONModel({
						VBELN: oData.Vbeln,
						VPRGR: oData.Vprgr,
						AUART: oData.Auart,
						NETWR: oData.Netwr,
						SPART: oData.Spart,
						VTWEG: oData.Vtweg,
						GWLDT: oData.Gwldt,
						KUNNR: oData.Kunnr,
						// Sales
						AUDAT: oData.Audat,
						VKORG: oData.Vkorg,
						ERNAM: oData.Ernam,
						ERDAT: oData.Erdat,
						AUGRU: oData.Augru,
						VKBUR: oData.Vkbur,
						WAERK: oData.Waerk,
						KALSM: oData.Kalsm,
						BSTNK: oData.Bstnk,
						BSARK: oData.Bsark,
						//shipping
						AUTLF: oData.Autlf,
						LIFSK: oData.Lifsk,
						VSBED: oData.Vsbed,
						PROLI: oData.Proli,
						// billing
						BUKRSVF: oData.BukrsVf,
						XEGDR: oData.Xegdr,
						FAKSK: oData.Faksk,
						TAXK1: oData.Taxk1,
						LANDTX: oData.Landtx,
						// Condition
						NETWR1: oData.Netwr,
						HeadToItems: oData.HeadToItems.results
					});

					this.getView().setModel(sModel, "myModel");
				}.bind(this),
				error: function(error) {
					console.error("Error fetching HeadToItems: ", error);
				}
			});
		},

		onAddRow: function() {
			var oModel = this.getView().getModel("myModel");
			var aData = oModel.getProperty("/HeadToItems");

			var sNextItemId = this._getNextItemId(aData);

			// Create a new row with empty values
			var newRow = {
				Selected: false,
				Posnr: sNextItemId,
				Matnr: "",
				Matwa: "",
				Zmeng: "",
				Kwmeng: "",
				Pstyv: "",
				Zieme: "",
				Netwr: "",
				Werks: ""
			};

			aData.push(newRow);
			oModel.setProperty("/HeadToItems", aData);
		},
		_getNextItemId: function(aData) {
			if (aData.length === 0) {
				return "000010"; // Start with "000010" if no items exist
			}

			var sLastItemId = aData[aData.length - 1].Posnr;
			var iNextItemId = parseInt(sLastItemId, 10) + 10;
			return iNextItemId.toString().padStart(6, "0");
		},

		onSelectAll: function(oEvent) {
			var bSelected = oEvent.getParameter("selected");
			var oModel = this.getView().getModel("myModel");
			var aData = oModel.getProperty("/HeadToItems");

			// Update the Selected property for all rows
			aData.forEach(function(oRow) {
				oRow.Selected = bSelected;
			});

			oModel.setProperty("/HeadToItems", aData);
		},

		onItemSelect: function() {
			var oModel = this.getView().getModel("myModel");
			var aData = oModel.getProperty("/HeadToItems");
			var oSelectAllCheckBox = this.getView().byId("selectAllCheckbox");

			// Check if all rows are selected
			var bAllSelected = aData.every(function(oRow) {
				return oRow.Selected;
			});

			oSelectAllCheckBox.setSelected(bAllSelected);
		},

		onDelete: function() {
			var oModel = this.getView().getModel("myModel");
			var aData = oModel.getProperty("/HeadToItems");

			// Filter out the checked rows
			var aNewData = aData.filter(function(oRow) {
				return !oRow.Selected;
			});

			oModel.setProperty("/HeadToItems", aNewData);
		},

		onCancel: function() {
			var oApp = this.getView().getParent();

			XMLView.create({
				viewName: "Task4.view.display"
			}).then(function(oDisplayView) {
				oApp.removeAllPages();
				oApp.addPage(oDisplayView);
				oApp.to(oDisplayView);
			});
		},

		onSave: function() {
			var oApp = this.getView().getParent();

			XMLView.create({
				viewName: "Task4.view.display"
			}).then(function(oDisplayView) {
				oApp.removeAllPages();
				oApp.addPage(oDisplayView);
				oApp.to(oDisplayView);
			});
		}
	});
});