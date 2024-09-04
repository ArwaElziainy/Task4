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
			var oModel = new sap.ui.model.odata.v2.ODataModel("https://dev.monairy.com/sap/opu/odata/SAP/ZGW_SO_SRV/", {
				useBatch: false, // Optional, disable batch processing if not needed
				defaultBindingMode: "TwoWay"
			});

			// Set the model to the view
			this.getView().setModel(oModel, "odataModel");

		},

		onGo: function() {
			var oModel = this.getView().getModel("odataModel");

			// Fetch data from the OData service
			oModel.read("/SOHeadSet", {
				urlParameters: {
					"$expand": "HeadToItems",
					"$format": "json",
					"sap-client": "110"
				},
				success: function(oData) {
					// Set the fetched data to a local model
					var oLocalModel = new JSONModel(oData);
					this.getView().setModel(oLocalModel, "localModel");

					// Bind the table to the local model
					var oTable = this.byId("table");
					oTable.setModel(oLocalModel, "localModel");
					oTable.bindItems({
						path: "localModel>/results",
						template: new sap.m.ColumnListItem({
							cells: [
								new sap.m.CheckBox({
									selected: "{localModel>Selected}",
									select: this.onItemSelect.bind(this)
								}),
								new sap.m.ObjectIdentifier({
									title: "{localModel>Vbeln}"
								}),
								new sap.m.Text({
									text: "{localModel>Erdat}"
								}),
								new sap.m.Text({
									text: "{localModel>Vprgr}"
								}),
								new sap.m.Text({
									text: "{localModel>Ernam}"
								}),
								new sap.m.Text({
									text: "{localModel>Auart}"
								}),
								new sap.m.Text({
									text: "{localModel>Netwr}"
								}),
								new sap.m.Text({
									text: "{localModel>Waerk}"
								}),
								new sap.m.Text({
									text: "{localModel>Vkorg}"
								}),
								new sap.m.Text({
									text: "{localModel>Gwldt}"
								}),
								new sap.m.Text({
									text: "{localModel>Kunnr}"
								})
							],
							type: "Navigation",
							press: this.onPress.bind(this)
						})
					});
				}.bind(this),
				error: function(oError) {
					console.error("Error fetching data:", oError);
				}
			});

			// var sServiceUrl = "https://dev.monairy.com/sap/opu/odata/SAP/ZGW_SO_SRV/";
			// var oModel = new ODataModel(sServiceUrl, {
			// 	json: true,
			// 	useBatch: false
			// });
			// this.getView().setModel(oModel);

			// // Fetch data from the OData service
			// oModel.read("/SOHeadSet", {
			// 	urlParameters: {
			// 		"$expand": "HeadToItems",
			// 		"$format": "json",
			// 		"sap-client": "110"
			// 	},
			// 	success: function(oData) {
			// 		var oLocalModel = new JSONModel(oData.results);
			// 		this.getView().setModel(oLocalModel, "localModel");
			// 		// Bind the table to the local model
			// 		this.byId("table").setModel(oLocalModel, "localModel");
			// 	}.bind(this),
			// 	error: function(oError) {
			// 		console.error("Error fetching data:", oError);
			// 	}
			// });

		},
		onFilterItems:function(){
			
			var table = "table";
			var scannerField = this.getView().byId("idScannerInput").getValue();
			this.filter(scannerField, table);
		},
		filter: function(formalData, table) {
			// var sQuery = this.byId("inputVbeln").getValue();
			
			//	if (formalData.length > 0) {
			var oFilter = new Filter({
				filters: [
					//	new Filter("Arktx", FilterOperator.Contains, formalData),
					new Filter("Vbeln", FilterOperator.StartsWith, formalData)
				],
				and: false
			});
			//	}
			var oTable = this.byId(table),
				oBinding = oTable.getBinding("items");
			oBinding.filter(oFilter);
			
			
			
			// var sQuery = this.byId("inputVbeln").getValue();

			// if (sQuery) {
			// 	var sPath = "/SOHeadSet('" + sQuery + "')";
			// 	var oModel = this.getView().getModel("odataModel");
			// 	if (!oModel) {
			// 		console.error("OData model not found");
			// 		return;
			// 	}
			// 	var oTable = this.byId("table");

			// 	// Unbind previous items
			// 	oTable.unbindItems();

			// 	// Fetch specific entry based on sQuery
			// 	oModel.read(sPath, {
					
			// 		success: function(oData) {
			// 			var aData = [oData];
			// 			var oLocalModel = new JSONModel({
			// 				results: aData
			// 			});
			// 			oTable.setModel(oLocalModel, "localModel");

			// 			oTable.bindItems({
			// 				path: "localModel>/results",
			// 				template: new sap.m.ColumnListItem({
			// 					cells: [
			// 					new sap.m.CheckBox({
			// 						selected: "{localModel>Selected}",
			// 						select: this.onItemSelect.bind(this)
			// 					}),
			// 					new sap.m.ObjectIdentifier({
			// 						title: "{localModel>Vbeln}"
			// 					}),
			// 					new sap.m.Text({
			// 						text: "{localModel>Erdat}"
			// 					}),
			// 					new sap.m.Text({
			// 						text: "{localModel>Vprgr}"
			// 					}),
			// 					new sap.m.Text({
			// 						text: "{localModel>Ernam}"
			// 					}),
			// 					new sap.m.Text({
			// 						text: "{localModel>Auart}"
			// 					}),
			// 					new sap.m.Text({
			// 						text: "{localModel>Netwr}"
			// 					}),
			// 					new sap.m.Text({
			// 						text: "{localModel>Waerk}"
			// 					}),
			// 					new sap.m.Text({
			// 						text: "{localModel>Vkorg}"
			// 					}),
			// 					new sap.m.Text({
			// 						text: "{localModel>Gwldt}"
			// 					}),
			// 					new sap.m.Text({
			// 						text: "{localModel>Kunnr}"
			// 					})
			// 				],
			// 					type: "Navigation",
			// 					press: this.onPress.bind(this)
			// 				})
			// 			});
			// 		}.bind(this),
			// 		error: function(oError) {
			// 			console.error("Error occurred: ", oError);
			// 		}
			// 	});

			// } else {
			// 	oTable.unbindItems();
			// }

		},
		onPress: function(oEvent) {
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			// var refNo = oEvent.getSource().getBindingContext('SCHeaderSet2').getObject().ZdateSta;

			var Vbeln = oEvent.getSource().getBindingContext('localModel').getObject().Vbeln;

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
		}
	});
});