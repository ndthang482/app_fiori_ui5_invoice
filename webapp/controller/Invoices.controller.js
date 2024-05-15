sap.ui.define(
  [
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/m/BusyDialog", // Add this dependency,
    "sap/m/MessageBox",
    "sap/ui/core/Fragment",
    "sap/ui/model/Sorter",
    "sap/ui/model/FilterOperator",
    "sap/ui/model/Filter",

  ],
  function (Controller, JSONModel, BusyDialog, MessageBox, Fragment, 
    Sorter, FilterOperator, Filter ) {
    "use strict";

    return Controller.extend("com.demo.app.odatademoapp.controller.Invoices", {
      onInit: function () {
        this.onReadData();
      },
      onReadData: function () {
        var oDataModel = this.getOwnerComponent().getModel();
        var oJSONModel = new JSONModel(); // Initialize JSONModel

        var oBusyDialog = new BusyDialog({
          title: "Loading Data",
          text: "Please wait...",
          customIcon: "./css/loading.png",
        });

        oBusyDialog.open();
        oDataModel.read("/ztb_invoiceSet", {
          success: function (oResponse) {
            oJSONModel.setProperty("/POData", oResponse.results);
            this.getView().setModel(oJSONModel, "oPOJSONModel"); // Set model with name "oPOJSONModel"
            oBusyDialog.close();
          }.bind(this),
          error: function (oError) {
            oBusyDialog.close();
          }.bind(this),
        });
      },

      onAddButtonPress: function (oEvent) {
        var oListItem = oEvent.getSource();
        var oContext = oListItem.getBindingContext("oPOJSONModel");
        var oRecord = oContext ? oContext.getObject() : null;

        if (!oRecord) {
          // If oRecord is undefined, initialize it with the default structure
          oRecord = {
            Id: "",
            ProductName: "",
            Quantity: "",
            ExtendedPrice: "",
            ShipperName: "",
            ShipperDate: new Date(), // You can set a default date or keep it null
            Status: "",
            __metadata: {
              id: "http://ngsshn.ngs.com.vn:8080/sap/opu/odata/SAP/ZODATA_DEMO01_SRV/ztb_invoiceSet/",
              uri: "http://ngsshn.ngs.com.vn:8080/sap/opu/odata/SAP/ZODATA_DEMO01_SRV/ztb_invoiceSet/",
              type: "ZODATA_DEMO01_SRV.ztb_invoice",
            }, 
          };
        }

        var oPayloadModel = new JSONModel({ oPayload: oRecord });

        this.getView().setModel(oPayloadModel, "oPayloadModel");

        // Open the dialog
        if (!this.oDiaLog) {
          Fragment.load({
            name: "com.demo.app.odatademoapp.fragments.CreateDialog",
            controller: this,
          })
            .then(
              function (oDialog) {
                this.oDiaLog = oDialog;
                this.getView().addDependent(this.oDiaLog);
                this.oDiaLog.open();
              }.bind(this)
            )
            .catch(function (error) {
              MessageBox.error("Error loading fragment.");
            });
        } else {
          this.oDiaLog.open();
        }
      },

      onEditButtonPress: function (oEvent) {
        var oListItem = oEvent.getSource();
        var oContext = oListItem.getBindingContext("oPOJSONModel");

        var oRecord = oContext.getObject();
        if (oRecord) {
          var oPayloadModel = new JSONModel({ oPayload: oRecord });
          this.getView().setModel(oPayloadModel, "oPayloadModel");

          if (!this.oDiaLog) {
            Fragment.load({
              name: "com.demo.app.odatademoapp.fragments.UpdateDialog",
              controller: this,
            })
              .then(
                function (oDialog) {
                  this.oDiaLog = oDialog;
                  this.getView().addDependent(this.oDiaLog);
                  this.oDiaLog.open();
                }.bind(this)
              )
              .catch(function (error) {
                MessageBox.error("Error loading fragment.");
              });
          } else {
            this.oDiaLog.open();
          }
        } else {
          MessageBox.error("Selected record is undefined.");
        }
      },

      onSaveCreateButtonPress: function () {
        var oModel = this.getView().getModel("oPayloadModel");
        if (!oModel) {
          MessageBox.error("No data to save.");
          return;
        }

        var oPayload = oModel.getProperty("/oPayload");
        var oDataModel = this.getOwnerComponent().getModel();
        var oBusyDialog = new BusyDialog({
          title: "Updating Record",
          text: "Please wait...",
          customIcon: "./css/loading.png",
        });

        oBusyDialog.open();
        oDataModel.create("/ztb_invoiceSet", oPayload, {
          success: function () {
            oBusyDialog.close();
            if (this.oDiaLog) {
              this.oDiaLog.close();
            }
            this.onReadData();
          }.bind(this),
          error: function () {
            oBusyDialog.close();
            this.oDiaLog.close();
            this.onReadData();
          }.bind(this),
        });
      },

      onSaveButtonPress: function (oEvent) {
        var oModel = this.getView().getModel("oPayloadModel");
        if (!oModel) {
          MessageBox.error("No data to save.");
          return;
        }

        var oPayload = oModel.getProperty("/oPayload");
        var oDataModel = this.getOwnerComponent().getModel();
        var oBusyDialog = new BusyDialog({
          title: "Updating Record",
          text: "Please wait...",
          customIcon: "./css/loading.png",
        });

        oBusyDialog.open();
        oDataModel.update("/ztb_invoiceSet('" + oPayload.Id + "')", oPayload, {
          success: function () {
            oBusyDialog.close();
            if (this.oDiaLog) {
              this.oDiaLog.close();
            }
            this.onReadData();
          }.bind(this),
          error: function () {
            oBusyDialog.close();
            MessageBox.error("Error updating record.");
          }.bind(this),
        });
      },

      onCancelButtonPress: function (oEvent) {
        this.oDiaLog.close();
        this._resetForm();
      },
      _clearDialog: function () {
    // Assuming you have a model named "dialogModel" bound to the fragment
    var oModel = this.getView().getModel("dialogModel");
    // Reset the model data to initial state
    oModel.setData({
        Id: "",
        ProductName: "",
        Quantity: "",
        ExtendedPrice: "",
        ShipperName: "",
        ShipperDate: "",
        Status: ""
    });
    // Alternatively, you can directly reset the form inputs if not using a model
    // var oDialog = this.byId("idDialog");
    // oDialog.getContent().forEach(function (oControl) {
    //     if (oControl instanceof sap.m.Input) {
    //         oControl.setValue("");
    //     }
    // });
},
      onDeleteButtonPress: function (oEvent) {
        var oListItem = oEvent.getSource(); // Assuming the event source is the list item
        var oContext = oListItem.getBindingContext("oPOJSONModel");

        if (!oContext) {
          return; // Handle invalid context
        }

        var oRecord = oContext.getObject(); // Access the object associated with the context

        MessageBox.confirm("Are you sure you want to delete this record?", {
          title: "Confirm",
          onClose: function (sAction) {
            if (sAction === MessageBox.Action.OK) {
              this.onDeleteSpecificRecord(oRecord); // Ensure correct context here
            }
          }.bind(this), // Ensure 'this' refers to the outer context
          styleClass: "",
          actions: [MessageBox.Action.OK, MessageBox.Action.CANCEL],
          emphasizeAction: MessageBox.Action.OK,
        });
      },

      onDeleteSpecificRecord: function (oRecord) {
        var oDataModel = this.getOwnerComponent().getModel();
        var oBusyDialog = new BusyDialog({
          title: "Deleting Record",
          text: "Please wait...",
          customIcon: "./css/loading.png",
        });

        oBusyDialog.open();
        oDataModel.remove("/ztb_invoiceSet('" + oRecord.Id + "')", {
          success: function (oResponse) {
            oBusyDialog.close();
            this.onReadData();
          }.bind(this),
          error: function (oError) {
            oBusyDialog.close();
          }.bind(this),
        });
      },

      onSortButtonPress: function () {
        var oModel = this.getView().getModel("oPOJSONModel");
        var aData = oModel.getProperty("/POData");

        // Sort the data based on the current sort order
        aData.sort(
          function (a, b) {
            if (this.bSortDescending) {
              return b.Id.localeCompare(a.Id);
            } else {
              return a.Id.localeCompare(b.Id);
            }
          }.bind(this)
        );

        this.bSortDescending = !this.bSortDescending;

        oModel.setProperty("/POData", aData);
      },
      onSearchFieldSearch: function (oEvent) {
        var aFilter = [];
        var sQuery = oEvent.getParameter("query");
        if(sQuery) {
            aFilter.push(new Filter("ProductName", FilterOperator.Contains, sQuery));
        }
        // filter binding
        var oList = this.byId("idPODataTable");
        var oBinding = oList.getBinding("items");
        oBinding.filter(aFilter);
      },
      
      // onLiveChange: function (oEvent) {
      //   var sQuery = oEvent.getParameter("newValue");
      // },
    });
  }
);
