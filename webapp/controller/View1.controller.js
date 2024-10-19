sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel",
	"sap/ui/model/odata/v2/ODataModel",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	"sap/ui/export/Spreadsheet",
	"sap/m/MessageToast",
	"sap/ui/core/format/DateFormat"
], function(Controller, JSONModel, ODataModel, Filter, FilterOperator, Spreadsheet, MessageToast, DateFormat) {
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
			this._loadAllRecords();

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
		onFilterItems: function() {

			var table = "table";
			var scannerField = this.getView().byId("salesDocInput").getValue();
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
		onOpenSortDialog: function() {
			if (!this._oSortDialog) {
				this._oSortDialog = this.byId("sortDialog");
			}
			this._oSortDialog.open();
		},

		onCloseSortDialog: function() {
			this._oSortDialog.close();
		},

		onSort: function() {
			var oSelect = this.byId("columnSelect");
			var sSelectedColumn = oSelect.getSelectedKey();

			var oSortOrderGroup = this.byId("sortOrderGroup");
			var bDescending = oSortOrderGroup.getSelectedButton().getText() === "Descending";

			var oTable = this.byId("table");
			var oBinding = oTable.getBinding("items");
			var oSorter = new sap.ui.model.Sorter(sSelectedColumn, bDescending);
			oBinding.sort(oSorter);

			this._oSortDialog.close();
		},
		onExport: function() {
			var oTable = this.byId("table");
			var oBinding = oTable.getBinding("items");
			// var oModel = oBinding.getModel("odataModel");
			var aCols = this.createColumnConfig();
			var oSettings = {
				workbook: {
					columns: aCols
				},
				dataSource: oBinding,
				fileName: "TableExport.xlsx"
			};
			var oSheet = new Spreadsheet(oSettings);
			oSheet.build().finally(function() {
				oSheet.destroy();
			});
		},

		createColumnConfig: function() {
			return [{
					label: 'Sales Document',
					property: 'Vbeln'
				}, {
					label: 'Created on',
					property: 'Erdat'
				}
				// Add more columns as needed
			];
		},
		onOpenFilterDialog: function() {
			if (!this._oDialog) {
				this._oDialog = this.byId("filterDialog");
			}
			this._oDialog.open();
		},
		onFilterDialogConfirm: function() {
			var sSelectedColumn = this.byId("filterColumnSelect").getSelectedKey();
			var sValue = this.byId("filterValueInput").getValue();

			var aFilters = [];
			if (sValue) {
				aFilters.push(new Filter(sSelectedColumn, FilterOperator.Contains, sValue));
			}

			var oTable = this.byId("table");
			var oBinding = oTable.getBinding("items");
			oBinding.filter(aFilters);

			this._oDialog.close();
		},

		onCloseFilterDialog: function() {
			this.byId("filterDialog").close();
		},
		// Update the Delete button state based on checkbox selections
		_updateDeleteButtonState: function() {
			var aItems = this.oTable.getItems();
			var bAnySelected = aItems.some(function(oItem) {
				return oItem.getCells()[0].getSelected();
			});

			this.oDeleteButton.setEnabled(bAnySelected);
		},
		_loadAllRecords: function() {
			var oModel = this.getView().getModel("odataModel");
			var oTable = sap.ui.getCore().byId("salesDocTable");

			oModel.read("/SOHeadSet", {
				success: function(oData) {
					console.log("All records loaded: ", oData);
					var oJSONModel = new sap.ui.model.json.JSONModel();
					oJSONModel.setData({
						SOHeadSet: oData.results
					});
					// oTable.setModel(oJSONModel);
				},
				error: function(oError) {
					console.error("Error loading records: ", oError);
					sap.m.MessageToast.show("Error loading records.");
				}
			});
		},
		onSalesDocumentValueHelp: function(oEvent) {
			if (!this._oValueHelpDialog) {
				this._oValueHelpDialog = sap.ui.xmlfragment("Task4.view.ValueHelpDialog", this);
				this.getView().addDependent(this._oValueHelpDialog);
			}
			this._oInput = oEvent.getSource();
			this._oValueHelpDialog.open();
		},
		// Function to handle search in the Value Help Dialog
		onValueHelpSearch: function(oEvent) {
			var sQuery = oEvent.getParameter("newValue");
			var aFilters = [];

			if (sQuery) {
				aFilters.push(new Filter("Vbeln", FilterOperator.Contains, sQuery));
			}

			var oTable = sap.ui.getCore().byId("salesDocTable");
			var oBinding = oTable.getBinding("items");

			// Error handling when applying filters
			oBinding.filter(aFilters, "Application").attachRequestFailed(function(oError) {
				MessageToast.show("Error retrieving sales documents: " + oError.getParameter("message"));
			});
		},
		// Function to handle selecting an item in the table
		onValueHelpSelect: function(oEvent) {
			var oSelectedItem = oEvent.getParameter("listItem");
			if (oSelectedItem) {
				var sSelectedSalesDoc = oSelectedItem.getCells()[0].getText(); // Get Sales Document
				this._oInput.setValue(sSelectedSalesDoc); // Set value in the input field
				this._oValueHelpDialog.close();
			} else {
				MessageToast.show("Please select a Sales Document.");
			}
		},
		// Function to close the Value Help Dialog
		onValueHelpDialogClose: function() {
			this._oValueHelpDialog.close();
		},
		onApplyFilters: function() {
			var aFilters = [];

			// Get the input values
			var sCreatedOn = sap.ui.getCore().byId("createdOnInput").getDateValue();
			var sCreatedBy = sap.ui.getCore().byId("createdByInput").getValue();
			var sSalesDocType = sap.ui.getCore().byId("salesDocTypeInput").getValue();
			var sCustomer = sap.ui.getCore().byId("customerInput").getValue();

			// Format date to match OData service format (yyyy-MM-dd)
			if (sCreatedOn) {
				var oDateFormat = sap.ui.core.format.DateFormat.getDateInstance({
					pattern: "yyyy-MM-dd"
				});
				var sFormattedDate = oDateFormat.format(sCreatedOn);
				aFilters.push(new Filter("Erdat", FilterOperator.EQ, sFormattedDate));
			}

			// Add Created By filter
			if (sCreatedBy) {
				aFilters.push(new Filter("Ernam", FilterOperator.EQ, sCreatedBy));
			}

			// Add Sales Document Type filter
			if (sSalesDocType) {
				aFilters.push(new Filter("Auart", FilterOperator.EQ, sSalesDocType));
			}

			// Add Customer filter
			if (sCustomer) {
				aFilters.push(new Filter("Kunnr", FilterOperator.EQ, sCustomer));
			}

			console.log("Filters to apply: ", aFilters);

			// Get the OData model from the view
			this.getView().getModel("odataModel");
			// var oTable = sap.ui.getCore().byId("salesDocTable");

			// Apply filters to the table binding

			var oFilter = new Filter({
				filters: [
					//	new Filter("Arktx", FilterOperator.Contains, formalData),
					new Filter("Erdat", FilterOperator.EQ, sFormattedDate),
					new Filter("Ernam", FilterOperator.EQ, sCreatedBy),
					new Filter("Auart", FilterOperator.EQ, sSalesDocType),
					new Filter("Kunnr", FilterOperator.EQ, sCustomer)
				],
				and: false
			});
			//	}
			console.log(oFilter)
			var oTable = sap.ui.getCore().byId("salesDocTable"),
				oBinding = oTable.getBinding("items");
			oBinding.filter(oFilter);
			console.log(oBinding)
			// var oBinding = oTable.getBinding("items");
			// if (oBinding) {
			//     oBinding.filter(aFilters);
			//     console.log(oBinding.filter(aFilters))
			// } else {
			//     console.error("No binding found for the table items.");
			// }

		},
		onDateValidation: function(oEvent) {
			var bValid = oEvent.getParameter("valid");
			if (!bValid) {
				MessageToast.show("Invalid date format. Please enter a valid date.");
				// Optionally, reset the date value if needed
				oEvent.getSource().setValue("");
			}
		}

		// onValueHelpRequest: function() {
		// 	if (!this._oValueHelpDialog) {
		// 		this._oValueHelpDialog = new sap.m.SelectDialog("Dialog", {
		// 			title: "Select Sales Document",
		// 			liveChange: this._onValueHelpSearch.bind(this),
		// 			confirm: this._onValueHelpClose.bind(this),
		// 			cancel: this._onValueHelpClose.bind(this)
		// 		});

		// 		this.getView().addDependent(this._oValueHelpDialog);
		// 	}

		// 	// Bind the data to the dialog
		// 	this._oValueHelpDialog.bindAggregation("items", {
		// 		path: "odataModel>/SOHeadSet",
		// 		template: new sap.m.StandardListItem({
		// 			title: "{odataModel>Vbeln}",
		// 			description: "{odataModel>Auart}"
		// 		},
		// 		{
		// 			title: "{odataModel>Auart}",
		// 			description: "{odataModel>Auart}"
		// 		})

		// 	});

		// 	this._oValueHelpDialog.open();
		// },
		// _onValueHelpSearch: function(oEvent) {
		// 	// debugger;
		// 	var sValue = oEvent.getParameter("value");
		// 	console.log("Search value:", sValue); // Log the search value

		// 	var oFilter = new Filter("Vbeln", FilterOperator.StartsWith, sValue);
		// 	console.log("Filter created:", oFilter); // Log the filter

		// 	var oBinding = oEvent.getSource().getBinding("items");
		// 	console.log("Binding found:", oBinding); // Log the binding

		// 	if (oBinding) {
		// 		oBinding.filter([oFilter]);
		// 		console.log("Filter applied"); // Log filter application
		// 	} else {
		// 		console.error("Binding not found for the items aggregation.");
		// 	}

		// },

		// _onValueHelpClose: function(oEvent) {
		// 	var oSelectedItem = oEvent.getParameter("selectedItem");
		// 	if (oSelectedItem) {
		// 		this.byId("salesDocInput").setValue(oSelectedItem.getTitle());
		// 	}
		// 	oEvent.getSource().getBinding("items").filter([]);
		// }
	});
});