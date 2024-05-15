/*global QUnit*/

sap.ui.define([
	"comdemoapp/odata_demo_app/controller/Invoices.controller"
], function (Controller) {
	"use strict";

	QUnit.module("Invoices Controller");

	QUnit.test("I should test the Invoices controller", function (assert) {
		var oAppController = new Controller();
		oAppController.onInit();
		assert.ok(oAppController);
	});

});
