sap.ui.define([], function () {
  "use strict";

  var oSharedData = {};

  return {
    setData: function (key, value) {
      oSharedData[key] = value;
    },
    getData: function (key) {
      return oSharedData[key];
    }
  };
});