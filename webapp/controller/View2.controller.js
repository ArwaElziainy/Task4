sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel",
	"sap/ui/model/odata/v2/ODataModel"
], function(Controller, JSONModel, ODataModel) {
	"use strict";

	return Controller.extend("Task4.controller.View2", {
		onInit: function() {
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.getRoute("View2").attachMatched(this._onRouteMatched, this);
		},
		_onRouteMatched: function(oEvent) {
			var Vbeln = oEvent.getParameter("arguments").Vbeln;

			console.log(oEvent.getParameter("arguments"));

			var sServiceUri = "https://dev.monairy.com/sap/opu/odata/SAP/ZGW_SO_SRV/";
			var oModel = new sap.ui.model.odata.ODataModel(sServiceUri, {
				json: true
			});
			this.getView().byId("ObjectPageLayoutHeaderTitle").setObjectTitle(Vbeln);
			// this.getView().byId("objectAttribute").setText(Vbeln);

			oModel.read("/SOHeadSet('" + Vbeln + "')", {
				urlParameters: {
					"$expand": "HeadToItems"
				},
				success: function(oData) {
					// console.log(oData)
					//   var orderData = oData;

					//               var oViewModel = new JSONModel();
					//               oViewModel.setData(orderData);

					//               this.getView().setModel(oViewModel, "orderData");
					//               console.log(oViewModel)
					// section1
					this.getView().byId("VBELN").setText(oData.Vbeln);
					this.getView().byId("ERDAT").setText(oData.Erdat);
					this.getView().byId("VPRGR").setText(oData.Vprgr);
					this.getView().byId("ERNAM").setText(oData.Ernam);
					this.getView().byId("AUART").setText(oData.Auart);
					this.getView().byId("NETWR").setText(oData.Netwr);
					this.getView().byId("WAERK").setText(oData.Waerk);
					this.getView().byId("VKORG").setText(oData.Vkorg);
					this.getView().byId("GWLDT").setText(oData.Gwldt);
					this.getView().byId("KUNNR").setText(oData.Kunnr);

					// section2
					this.getView().byId("AUDAT").setText(oData.Audat);
					this.getView().byId("VKORG1").setText(oData.Vkorg);
					this.getView().byId("ERNAM1").setText(oData.Ernam);
					this.getView().byId("ERDAT1").setText(oData.Erdat);
					this.getView().byId("WAERK1").setText(oData.Waerk);
					this.getView().byId("KALSM").setText(oData.Kalsm);
					this.getView().byId("BSTNK").setText(oData.Bstnk);

					// Section3
					this.getView().byId("AUTLF").setText(oData.Autlf);

					// Section4
					this.getView().byId("BUKRSVF").setText(oData.BukrsVf);
					this.getView().byId("XEGDR").setText(oData.Xegdr);

					// Section5
					this.getView().byId("NETWR1").setText(oData.Netwr);
					
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