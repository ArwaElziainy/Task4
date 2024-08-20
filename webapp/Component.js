sap.ui.define([
	"sap/ui/core/UIComponent",
	"sap/ui/Device",
	"Task4/model/models",
	"sap/ui/model/json/JSONModel"
], function(UIComponent, Device, models, JSONModel) {
	"use strict";
	
	return UIComponent.extend("Task4.Component", {
	
		metadata: {
			manifest: "json"
		},

		/**
		 * The component is initialized by UI5 automatically during the startup of the app and calls the init method once.
		 * @public
		 * @override
		 */
		init: function() {
			// call the base component's init function
			UIComponent.prototype.init.apply(this, arguments);
			// Create and set a shared model
			// var oSharedModel = new JSONModel({
			// 	Vbeln: "" // Initialize with default value
			// });
			// this.setModel(oSharedModel, "shared");
			// set the device model
			this.setModel(models.createDeviceModel(), "device");

			this.getRouter().initialize();

		}
	});
});