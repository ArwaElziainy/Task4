sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel",
	"sap/ui/model/odata/v2/ODataModel",
	"sap/ui/core/mvc/XMLView",
	"Task4/SharedData",
	"sap/m/MessageToast"
], function(Controller, JSONModel, ODataModel, XMLView, SharedData, MessageToast) {
	"use strict";

	return Controller.extend("Task4.controller.display", {
		formatText: function(sValue) {
			return sValue ? sValue : "_";
		},
		onInit: function(oEvent) {

			var sVbeln = SharedData.getData("Vbeln");

			var sServiceUri = "https://dev.monairy.com/sap/opu/odata/SAP/ZGW_SO_SRV/";
			var oModel = new sap.ui.model.odata.ODataModel(sServiceUri, {
				json: true
			});
			this.getView().byId("ObjectPageLayoutHeaderTitle").setObjectTitle(sVbeln);
			// this.getView().byId("objectAttribute").setText(Vbeln);

			oModel.read("/SOHeadSet('" + sVbeln + "')", {
				urlParameters: {
					"$expand": "HeadToItems"
				},
				success: function(oData) {
					var sModel = new sap.ui.model.json.JSONModel();

					// Set the data for the model
					sModel.setData({
						VBELN: oData.Vbeln || "_",
						ERDAT: oData.Erdat || "_",
						VPRGR: oData.Vprgr || "_",
						ERNAM: oData.Ernam || "_",
						AUART: oData.Auart || "_",
						NETWR: oData.Netwr || "_",
						SPART: oData.Spart || "_",
						WAERK: oData.Waerk || "_",
						VKORG: oData.Vkorg || "_",
						VTWEG: oData.Vtweg || "_",
						GWLDT: oData.Gwldt || "_",
						KUNNR: oData.Kunnr || "_",
						// Sales
						AUDAT: oData.Audat || "_",
						VKORG1: oData.Vkorg || "_",
						ERNAM1: oData.Ernam || "_",
						ERDAT1: oData.Erdat || "_",
						AUGRU: oData.Augru || "_",
						VKBUR: oData.Vkbur || "_",
						WAERK1: oData.Waerk || "_",
						KALSM: oData.Kalsm || "_",
						BSTNK: oData.Bstnk || "_",
						BSARK: oData.Bsark || "_",
						//shipping
						AUTLF: oData.Autlf || "_",
						LIFSK: oData.Lifsk || "_",
						VSBED: oData.Vsbed || "_",
						PROLI: oData.Proli || "_",
						// billing
						BUKRSVF: oData.BukrsVf || "_",
						XEGDR: oData.Xegdr || "_",
						FAKSK: oData.Faksk || "_",
						TAXK1: oData.Taxk1 || "_",
						LANDTX: oData.Landtx || "_",
						// Condition
						NETWR1: oData.Netwr || "_"
					});

					// Set the model to the view
					this.getView().setModel(sModel, "myModel");

					var headToItems = oData.HeadToItems.results;

					var oTableModel = new JSONModel();
					oTableModel.setData(headToItems);

					this.getView().setModel(oTableModel);
				}.bind(this),
				erroe: function() {
					console.error("Error fetching HeadToItems: " + error);
				}
			});

		},

		onEdit: function() {
			var oApp = this.getView().getParent(); // Get the parent (the app control or the container)

			XMLView.create({
				viewName: "Task4.view.Edit"
			}).then(function(oEditView) {

				// Replace the current content with the new view
				oApp.removeAllPages();
				oApp.addPage(oEditView);
				oApp.to(oEditView); // Navigate to the new view

			});

		}
	});
});