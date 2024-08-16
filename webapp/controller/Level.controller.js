sap.ui.define([
	'jquery.sap.global',
	'sap/m/TablePersoController',
	'sap/ui/core/Fragment',
	'sap/ui/core/mvc/Controller',
	'./DemoPersoService',
	'sap/ui/model/Filter',
	'sap/ui/model/Sorter',
	'sap/ui/model/json/JSONModel',
	'sap/ui/export/Spreadsheet',
], function(jQuery, TablePersoController, Fragment, Controller, DemoPersoService, Filter, Sorter, JSONModel, Spreadsheet) {
	// "use strict";

	return Controller.extend("usageresult.controller.Level", {
		onInit: async function() {
			if(sap.ushell.Container) {
				var userInfo = sap.ushell.Container.getService("UserInfo");
				var email = userInfo.getEmail();
			}
		},
		
		_oDialog: null,
		handleLinkEmail: function(evt){
			
			var bContext = evt.getSource().getBindingContext().getObject();
			
			var target = evt.getSource().data("target");
			this.textLog = new sap.m.Text({
				text:(bContext.log).slice(1, -1)
			});
			
			this.textLog = (bContext.log).slice(1, -1);
			this.upgradeName = bContext.upgrade;
			this.custName = bContext.company;
			this.date = bContext.puretimestamp;
			this.rsn = bContext.rsn;
			this.sol = bContext.sol;
			
			if(this.rsn.split("\n").length>5){
				this.rsn = this.rsn.split("\n")[0]+this.rsn.split("\n")[2]+this.rsn.split("\n")[2]+this.rsn.split("\n")[3];
			}
			
			this.emailLog = bContext.email;
			// this.emailLog = evt.getSource().getParent().getItems()[2].getText();
			if (!this._oDialogConfirm) {
				this._oDialogConfirm = sap.ui.xmlfragment("usageresult.view.DialogConfirm", this);
			}
			this._oDialogConfirm.openBy(evt.getSource());
		},
		internalShare: function(evt){
			var tempAuthorModel = sap.ui.getCore().getModel("tempAuthorModel");
			
			var email = tempAuthorModel.getProperty('/EMAIL');
			var subject = 'Log Details';
			
			// var subject = 'Best Practices Upgrade Action Failure: '+ this.upgradeName +' - '+ this.custName;
			var subject = 'Best Practices Upgrade Action Failure: '+ this.upgradeName +' - '+ this.custName;
			
			
			var greetMsg = "Dear ,\nThe action failed. Please refer the below details.\n\n";
			var endMsg = "\n\nThanks";
			
			
			var emailBodyTemp = this.textLog;
			var tempEmail1 = emailBodyTemp.split("Error")[0].split("\n");
			var tempEmail2 = tempEmail1[tempEmail1.length-3] + "\n" +tempEmail1[tempEmail1.length-2];
			
			
			if(emailBodyTemp.split("Error").length==1){
				var tempBody = tempEmail1[tempEmail1.length-3] + "\n" +tempEmail1[tempEmail1.length-2]+"\n" +tempEmail1[tempEmail1.length-1];
				
				var emailBody = greetMsg+tempEmail1[tempEmail1.length-3] + "\n" +tempEmail1[tempEmail1.length-2]+"\n" +tempEmail1[tempEmail1.length-1]+endMsg;
			}else{
				var tempBody = tempEmail1[tempEmail1.length-3] + "\n" +tempEmail1[tempEmail1.length-2]+"\nError" +emailBodyTemp.split("Error")[1].split("\n")[0];
				
				var emailBody = greetMsg+tempEmail1[tempEmail1.length-3] + "\n" +tempEmail1[tempEmail1.length-2]+"\nError" +emailBodyTemp.split("Error")[1].split("\n")[0]+endMsg;
			}
			
			var emailBodyTest = greetMsg+emailBodyTemp.split("Error")[0]+ "\nError" +emailBodyTemp.split("Error")[1]+endMsg;


			// var valueBody =
				// "<table border='0' cellpadding='0' cellspacing='0' style='font-family:Calibri(Body);font-size:15;width:650px;border:1px solid black'>";

			/*Demo Access Email Content*/
			// var valueBody = "Dear " + tempAuthorModel.getProperty('/FNAME') + ",\n\n";
			var valueBody = "Hi,\n\n";
			valueBody +=
				"The upgrade action "+ this.upgradeName+" failed on "+this.date+".\n";

			valueBody += "Please see details below\n\n";
			valueBody += "Error:\n";
			valueBody += this.rsn+".\n";
			valueBody += tempBody.replace(/undefined\n/g, "")+"\n\n";
			
				
			valueBody += "Proposed Solution:\n";
			valueBody += this.sol+"\n\n";
			
			valueBody +=
				"Please analyze this error and raise a JIRA ticket if it is an error with code or content files.\n\n";
			valueBody +=
				"More details can be found on the dashboard\nhttps://flpnwc-sakp.dispatcher.us1.hana.ondemand.com/sites?siteId=146d771f-cf10-4920-9a7d-b31972423c89#Shell-home\n\n";
			valueBody +=
				"Best Regards,\n";
			valueBody +=
				"Best Practices Support Team";


			// var tempStr = "<tr><td colspan=2>&nbsp;<td>";
			// valueBody = valueBody.replace(/<tr>,/g, tempStr);
			
			
			
			
			
			
			sap.m.URLHelper.triggerEmail("", subject,valueBody);
		},
		externalShare: function(evt){
			var tempAuthorModel = sap.ui.getCore().getModel("tempAuthorModel");
			
			var email = tempAuthorModel.getProperty('/EMAIL');
			var subject = 'Log Details';
			
			// var subject = 'Best Practices Upgrade Action: '+ this.upgradeName +' - '+ this.custName;
			var subject = 'Best Practices Upgrade Action: '+ this.upgradeName;
			
			
			var greetMsg = "Dear ,\nThe action failed. Please refer the below details.\n\n";
			var endMsg = "\n\nThanks";
			
			
			var emailBodyTemp = this.textLog;
			var tempEmail1 = emailBodyTemp.split("Error")[0].split("\n");
			var tempEmail2 = tempEmail1[tempEmail1.length-3] + "\n" +tempEmail1[tempEmail1.length-2];
			
			
			if(emailBodyTemp.split("Error").length==1){
				var tempBody = tempEmail1[tempEmail1.length-3] + "\n" +tempEmail1[tempEmail1.length-2]+"\n" +tempEmail1[tempEmail1.length-1];
				
				var emailBody = greetMsg+tempEmail1[tempEmail1.length-3] + "\n" +tempEmail1[tempEmail1.length-2]+"\n" +tempEmail1[tempEmail1.length-1]+endMsg;
			}else{
				var tempBody = tempEmail1[tempEmail1.length-3] + "\n" +tempEmail1[tempEmail1.length-2]+"\nError" +emailBodyTemp.split("Error")[1].split("\n")[0];
				
				var emailBody = greetMsg+tempEmail1[tempEmail1.length-3] + "\n" +tempEmail1[tempEmail1.length-2]+"\nError" +emailBodyTemp.split("Error")[1].split("\n")[0]+endMsg;
			}
			
			var emailBodyTest = greetMsg+emailBodyTemp.split("Error")[0]+ "\nError" +emailBodyTemp.split("Error")[1]+endMsg;



			// var valueBody =
				// "<table border='0' cellpadding='0' cellspacing='0' style='font-family:Calibri(Body);font-size:15;width:650px;border:1px solid black'>";

			/*Demo Access Email Content*/
			var valueBody = "Dear Customer,\n\n";
			valueBody +=
				"Thank you for using SAP SuccessFactors Best Practices Content.\n\n";
			valueBody +=
				"We noticed that the upgrade action "+ this.upgradeName+" failed on "+this.date+". We have performed an error analysis and proposed possible solutions for you.\n";

			valueBody += "Please see details below\n\n";
			valueBody += "Error:\n";
			valueBody += this.rsn+".\n";
			valueBody += tempBody.replace(/undefined\n/g, "")+"\n\n";
			
				
			valueBody += "Proposed Solution:\n";
			valueBody += this.sol+"\n\n";
			
			valueBody +=
				"Hope this resolves your error.\n\n";
			valueBody +=
				"Thanks again!\n\n";
			valueBody +=
				"Best Regards,\n";
			valueBody +=
				"Best Practices Support Team";


			// var tempStr = "<tr><td colspan=2>&nbsp;<td>";
			// valueBody = valueBody.replace(/<tr>,/g, tempStr);
			
			
			
			
			
			
			sap.m.URLHelper.triggerEmail("", subject,valueBody);
		},
		setCustomEnableForSolution(_class){
			if(_class=="Yes"){
				return true;
			}else  if(_class=="No"){
				return false;
			}	
		},
		setCustomClassForSolution(_class) {
			var addClassGreen= "greenTableLink";
			var addClassRed= "whiteerror";
			
			if(_class=="Yes"){
				if(this.oView.hasStyleClass(addClassRed)){
					this.oView.removeStyleClass(addClassRed);
				}
				this.oView.addStyleClass(addClassGreen);
				return true;
			}else  if(_class=="No"){
				
				if(this.oView.hasStyleClass(addClassGreen)){
					this.oView.removeStyleClass(addClassGreen);
				}
				this.oView.addStyleClass(addClassRed);
				return true;
			}
		},
		setCustomClassForSAPUI5ImageControlVisibility(_class) {
			if(_class=="Success"){
				var falseVar = false;
				return falseVar;
			}else if(_class=="Failure"){
				var trueVar = true;
				return trueVar;
			}
		},
		setCustomClassForSAPUI5ImageControl(_class) {
			var addClassGreen= "greenTable";
			var addClassRed= "redTable";
			
			if(_class=="Success"){
				if(this.oView.hasStyleClass(addClassRed)){
					this.oView.removeStyleClass(addClassRed);
				}
				this.oView.addStyleClass(addClassGreen);
				return true;
			}else if(_class=="Failure"){
				
				if(this.oView.hasStyleClass(addClassGreen)){
					this.oView.removeStyleClass(addClassGreen);
				}
				this.oView.addStyleClass(addClassRed);
				return true;
			}
				
		},
		handleLinkView:function(evt){
			var reason = evt.getSource().getParent().getItems()[0].getText();
			var solution = evt.getSource().getParent().getItems()[1].getText();
			
			if (!this._oDialogConfirmView) {
				this._oDialogConfirmView = sap.ui.xmlfragment("usageresult.view.DialogConfirmView", this);
			}
			
			var target = evt.getSource().data("target");
			
			var contHBox = new sap.m.HBox();
			
			var contVBox = new sap.m.VBox();
			
			var smlHBoxTop = new sap.m.HBox();
			var smlHBoxBtm = new sap.m.HBox();
			
			var textTop = new sap.m.Text({
				text:"Hint"
			}).addStyleClass("");
			
			
			var textReasonLabel = new sap.m.Text({
				text:"Possible Reason: "
			}).addStyleClass(" labelError");
			
			var textReasonVal = new sap.m.Text({
				text:reason
			}).addStyleClass("marginLeft red marginRight");
			    
			var textSolLabel = new sap.m.Text({
				text:"Solution:"
			}).addStyleClass(" labelError");
			
			var textSolVal = new sap.m.Text({
				text:solution
			}).addStyleClass("marginLeft green marginRight");
			
			var textLog = new sap.m.Text({
				text:target.slice(1, -1)
			}).addStyleClass("logTextColor");
			textLog.setText(target.slice(1, -1));
			textLog.setMaxLines(5000);
			smlHBoxTop.addItem(textReasonLabel);
			smlHBoxTop.addItem(textReasonVal);
			
			smlHBoxBtm.addItem(textSolLabel);
			smlHBoxBtm.addItem(textSolVal);
			
			// contVBox.addItem(textTop);
			contVBox.addItem(smlHBoxTop);
			contVBox.addItem(smlHBoxBtm);
			
			
			
			
			if(reason==""&&solution==""){
				contHBox.addItem(textLog);
				contHBox.addStyleClass("logHbox");
			}else{
				contHBox.addItem(textLog);
				contHBox.addItem(contVBox);
				contHBox.addStyleClass("logHbox");
			}
			
			this._oDialogConfirmView.removeAllContent();
			this._oDialogConfirmView.addContent(contHBox);
			this._oDialogConfirmView.open();
			
			var str = $(".logTextColor")[0].innerHTML;
			// var res = str.replace(/Successful/g, "<span class='green'>Successful</span>").replace(/successful/g, "<span class='green'>successful</span>").replace(/successfully/g, "<span class='green'>successfully</span>").replace(/Successfully/g, "<span class='green'>Successfully</span>").replace(/fail/g, "<span class='red'>fail</span>").replace(/Fail/g, "<span class='red'>Fail</span>").replace(/failed/g, "<span class='red'>failed</span>").replace(/Failed/g, "<span class='red'>Failed</span>").replace(/Error/g, "<span class='red'>Error</span>");
			var res = str.replace(/Successfully/g, "<span class='green'>Successfully</span>").replace(/successfully/g, "<span class='green'>successfully</span>").replace(/successful/g, "<span class='green'>successful</span>").replace(/Successful/g, "<span class='green'>Successful</span>").replace(/BPMsg/g, "<span class='red'>BPMsg</span>").replace(/BPError/g, "<span class='red'>BPError</span>").replace(/failed/g, "<span class='red'>failed</span>").replace(/Failed/g, "<span class='red'>Failed</span>").replace(/fail/g, "<span class='red'>fail</span>").replace(/Fail/g, "<span class='red'>Fail</span>").replace(/Error/g, "<span class='red'>Error</span>").replace(/Begins/g, "<span class='critical'>Begins</span>");
		    $(".logTextColor")[0].innerHTML = res;
		    
			// this._oDialogConfirm.close();
		},
		showErrorLogDetails:function(evt){
			var me = this;
			var bContext = evt.getSource().getBindingContext().getObject();
			var target = evt.getSource().data("target");
			var target2 = JSON.parse(target).content[0].value;
			if (!this._oDialogConfirmViewError) {
				this._oDialogConfirmViewError = sap.ui.xmlfragment("usageresult.view.DialogConfirmViewError", this);
			}
			var target3 = JSON.parse(target).personalizations[0].to[0].email;
			
			// var textLog = new sap.m.Text({
			// 	text:target2
			// }).addStyleClass("logTextColor");
			// textLog.setText(target2);
			// textLog.setMaxLines(5000);
			
			target2 = target2.replace(/b>/g, 'strong>');
			target2 = target2.replace(/<strong>/g, '<strong class="whiteerror">');
			target2 = target2.replace(/mark>/g, 'span>');
			target2 = target2.replace(/<span>/g, '<span class="whiteerror">');
			// target2 = target2.replace(/\brederror\b(?!.*?\brederror\b)/, "golderror"); 
			
			var emailAdd = new sap.m.Text({
				text:"Email sent to: "+target3
			}).addStyleClass("errorTextColor padtop");
			
			var textLog = new sap.m.FormattedText({
				htmlText:target2
			}).addStyleClass("errorTextColor");
			textLog.setHtmlText(target2);
			
			this._oDialogConfirmViewError.removeAllContent();
			this._oDialogConfirmViewError.addContent(emailAdd);
			this._oDialogConfirmViewError.addContent(textLog);
			this._oDialogConfirmViewError.open();
		},
		onOkPressDialogConfirmViewError:function(){
			this._oDialogConfirmViewError.close();
		},
		onOkPressDialogConfirmView:function(){
			this._oDialogConfirmView.close();
		},
		
		// onClosePressDialogConfirm: function(){
		// 	this._oDialogConfirm.close();
		// },
		// onOkPressDialogConfirm: function(){
		// 	var tempAuthorModel = sap.ui.getCore().getModel("tempAuthorModel");
			
		// 	//send email
		// 	var oMail = {
		// 		MailFrom: {
		// 			address: "upgradecenter@sap.com"
		// 		},
		// 		MailTo: [{
		// 			address: tempAuthorModel.getProperty('/EMAIL')
		// 		}],
		// 		Subject: "test",
		// 		MailBody: this.textLog
		// 	};

		// 	$.ajax({
		// 		url: "/utils/mailattach.xsjs",
		// 		type: "POST",
		// 		contentType: "application/json",
		// 		data: JSON.stringify(oMail),
		// 		success: function(data) {
		// 		},
		// 		fail: function(data) {
		// 		}
		// 	});
			
			
			
		// 	this._oDialogConfirm.close();
		// },
		
		handleViewSettingsDialogButtonPressed: function (oEvent) {
			if (!this._oDialog) {
				this._oDialog = sap.ui.xmlfragment("usageresult.view.Dialog", this);
			}
			// toggle compact style
			jQuery.sap.syncStyleClass("sapUiSizeCompact", this.getView(), this._oDialog);
			this._oDialog.open();
		},
		handleConfirm: function(oEvent) {

			var oView = this.getView();
			var oTable = oView.byId("listTableBtm");

			var mParams = oEvent.getParameters();
			var oBinding = oTable.getBinding("items");

			// apply sorter to binding
			// (grouping comes before sorting)
			var sPath;
			var bDescending;
			var vGroup;
			var aSorters = [];
			if (mParams.groupItem) {
				sPath = mParams.groupItem.getKey();
				bDescending = mParams.groupDescending;
				vGroup = this.mGroupFunctions[sPath];
				aSorters.push(new Sorter(sPath, bDescending, vGroup));
			}
			sPath = mParams.sortItem.getKey();
			bDescending = mParams.sortDescending;
			aSorters.push(new Sorter(sPath, bDescending));
			oBinding.sort(aSorters);

			// apply filters to binding
			var aFilters = [];
			jQuery.each(mParams.filterItems, function (i, oItem) {
				var aSplit = oItem.getKey().split("___");
				var sPath = aSplit[0];
				var sOperator = aSplit[1];
				var sValue1 = aSplit[2];
				var sValue2 = aSplit[3];
				var oFilter = new Filter(sPath, sOperator, sValue1, sValue2);
				aFilters.push(oFilter);
			});
			oBinding.filter(aFilters);

			// // update filter bar
			// oView.byId("vsdFilterBar").setVisible(aFilters.length > 0);
			// oView.byId("vsdFilterLabel").setText(mParams.filterString);
		},
		
		onPersoButtonPressed: function (oEvent) {
			this._oTPC.openDialog();
		},

		onTablePersoRefresh : function() {
			DemoPersoService.resetPersData();
			this._oTPC.refresh();
		},

		onTableGrouping : function(oEvent) {
			this._oTPC.setHasGrouping(oEvent.getSource().getSelected());
		},
		
		boldName: function(sName) {
			if (sName != null) {
				return sName.toString().replace(/,/g, '\n');
			}
		},
		defaultname:function(sName){
			if(sName!=null){
				var modelAdmin = sap.ui.getCore().getModel("superadmin").getData();
				if (modelAdmin=="superadmin") {
					return sName;
				}else{
					var res = sName.slice(0, 2);
					return res+"***";
				}
			}
		},
		// defaultColumnChk:function(sName){
		// 		var tempAuthorModel = sap.ui.getCore().getModel("tempAuthorModel");
		// 		var email = tempAuthorModel.getProperty('/EMAIL');
		// 		if (email=="ankit.vashisht@sap.com" || email=="abishek.suvarna@sap.com"  || email=="vinod.srinivasan@sap.com" || email=="neelesh.kamath@sap.com") {
		// 			return true;
		// 		}else{
		// 			return false;
		// 		}
		// },
		onAfterRendering: function() {
			var superadmin = new sap.ui.model.json.JSONModel();
			sap.ui.getCore().setModel(superadmin, "superadmin");
			superadmin.setData("");
			
            if (sap.ushell && sap.ushell.cpv2 && sap.ushell.cpv2.services && sap.ushell.cpv2.services.cloudServices && sap.ushell.cpv2.services.cloudServices.SiteService) {

                var oLocalSiteService = sap.ushell.cpv2.services.cloudServices.SiteService();
                var oRoles = oLocalSiteService.siteModel.getProperty("/roles");
                var oProperty;


                for (oProperty in oRoles) {

                    if (oRoles.hasOwnProperty(oProperty)) {
                        if (oProperty.toString() === "SiteAdmin"){
				/// Some action based on the Test_Role
							superadmin.setData("superadmin");
                        }
                    }
                }
            }
			
			document.title = "Best Practices Dashboard";
			
			/**
			 * default date range selection  
			 * */
			var Datetoday = new Date();
			var tDate = Datetoday.YYYYMMDD();
			var fDate = new Date();
			
			
			fDate.setDate((fDate.getDate() - 30) + 1);
			if(fDate.getDate()!=1){
				fDate.setDate(1);
			}
			
			// fDate.setMonth((fDate.getMonth() - 3));
			// fDate.setDate(fDate.getDate() + 1);
			// if(fDate.getDate()!=1){
			// 	fDate.setDate(1);
			// }
			
			fDate = fDate.YYYYMMDD();

			/** 
			 * date range functionality
			 * */
			var oModel = new sap.ui.model.json.JSONModel();
			oModel.setData({
				delimiterDRS1: "~",
				dateValueDRS1: stringToDate(fDate),
				secondDateValueDRS1: stringToDate(tDate),
				dateFormatDRS1: "yyyy-MM-dd"
			});
			// sap.ui.getCore().setModel(oModel, 'dateModel');

			this.getView().byId("dateviewrange").setDateValue(stringToDate(fDate));
			this.getView().byId("dateviewrange").setSecondDateValue(stringToDate(tDate));

			var tempDateBtn = this.getView().byId("dateview").getSelectedButton().split("--")[1];
			if (tempDateBtn == "btn1Day") {
				
				var Datetoday = new Date();
				var toDate = new Date();
				toDate = toDate.YYYYMMDD();

				var fromDate = new Date();
				fromDate.setDate((fromDate.getDate() - 1) );
				// if(fromDate.getDate()!=1){
				// 	fromDate.setDate(1);
				// }
				var fromDateDay = fromDate.YYYYMMDD();

				var fromCompDate = fromDate.toISOString();
				var toCompDateTemp = Datetoday.toISOString();
			} else if (tempDateBtn == "btn1Month") {
				var Datetoday = new Date();
				var fromDate = new Date();
				fromDate.setDate((fromDate.getDate() - 30) + 1);
				if(fromDate.getDate()!=1){
					fromDate.setDate(1);
				}
				// fromDate = fromDate.YYYYMMDD();

				var fromCompDate = fromDate.toISOString();
				var toCompDateTemp = Datetoday.toISOString();
			} else if (tempDateBtn == "btn3Month") {
				var Datetoday = new Date();
				var fromDate = new Date();
				fromDate.setMonth((fromDate.getMonth() - 3));
				fromDate.setDate(fromDate.getDate() + 1);
				if(fromDate.getDate()!=1){
					fromDate.setDate(1);
				}

				var fromCompDate = fromDate.toISOString();
				var toCompDateTemp = Datetoday.toISOString();
			} else if (tempDateBtn == "btn6Month") {
				var Datetoday = new Date();
				var fromDate = new Date();
				fromDate.setMonth((fromDate.getMonth() - 6));
				fromDate.setDate(fromDate.getDate() + 1);
				// fromDate = fromDate.YYYYMMDD();
				if(fromDate.getDate()!=1){
					fromDate.setDate(1);
				}

				var fromCompDate = fromDate.toISOString();
				var toCompDateTemp = Datetoday.toISOString();
			} else if (tempDateBtn == "btn1Year") {
				var Datetoday = new Date();
				var fromDate = new Date();
				fromDate.setMonth((fromDate.getMonth() - 12));
				fromDate.setDate(fromDate.getDate() + 1);
				// fromDate = fromDate.YYYYMMDD();
				if(fromDate.getDate()!=1){
					fromDate.setDate(1);
				}

				var fromCompDate = fromDate.toISOString();
				var toCompDateTemp = Datetoday.toISOString();
			} else if (tempDateBtn == "btn2Year") {
				var Datetoday = new Date();
				var fromDate = new Date();
				fromDate.setMonth((fromDate.getMonth() - 24));
				fromDate.setDate(fromDate.getDate() + 1);
				// fromDate = fromDate.YYYYMMDD();
				if(fromDate.getDate()!=1){
					fromDate.setDate(1);
				}

				var fromCompDate = fromDate.toISOString();
				var toCompDateTemp = Datetoday.toISOString();
			}
			
			var oModelUpgradeRecruitEC = new sap.ui.model.json.JSONModel(sap.ui.require.toUrl("usageresult/model/EC.json"));
			oModelUpgradeRecruitEC.setSizeLimit(50000);
			sap.ui.getCore().setModel(oModelUpgradeRecruitEC, "oModelUpgradeRecruitEC");

			var oModelUpgradeRecruitSM = new sap.ui.model.json.JSONModel(sap.ui.require.toUrl("usageresult/model/SM.json"));
			oModelUpgradeRecruitSM.setSizeLimit(50000);
			sap.ui.getCore().setModel(oModelUpgradeRecruitSM, "oModelUpgradeRecruitSM");

			var oModelUpgradeRecruitPG = new sap.ui.model.json.JSONModel(sap.ui.require.toUrl("usageresult/model/PG.json"));
			oModelUpgradeRecruitPG.setSizeLimit(50000);
			sap.ui.getCore().setModel(oModelUpgradeRecruitPG, "oModelUpgradeRecruitPG");

			var oModelUpgradeRecruitCO = new sap.ui.model.json.JSONModel(sap.ui.require.toUrl("usageresult/model/CO.json"));
			oModelUpgradeRecruitCO.setSizeLimit(50000);
			sap.ui.getCore().setModel(oModelUpgradeRecruitCO, "oModelUpgradeRecruitCO");

			var oModelUpgradeRecruitON = new sap.ui.model.json.JSONModel(sap.ui.require.toUrl("usageresult/model/ON.json"));
			oModelUpgradeRecruitON.setSizeLimit(50000);
			sap.ui.getCore().setModel(oModelUpgradeRecruitON, "oModelUpgradeRecruitON");

			var oModelUpgradeRecruitREC = new sap.ui.model.json.JSONModel(sap.ui.require.toUrl("usageresult/model/REC.json"));
			oModelUpgradeRecruitREC.setSizeLimit(50000);
			sap.ui.getCore().setModel(oModelUpgradeRecruitREC, "oModelUpgradeRecruitREC");
			
			let sURL = this.getOwnerComponent().getManifestObject().resolveUri("sap/sfsf_repo/service/services.xsodata/");
			var ODataModel = new sap.ui.model.odata.ODataModel(sURL, true);
			ODataModel.setDefaultCountMode(false);
			ODataModel.setDefaultBindingMode(sap.ui.model.BindingMode.TwoWay);
			this.getView().setModel(ODataModel);
			
			fromCompDate = fromCompDate.split("T")[0]+"T00:00";
			toCompDateTemp = toCompDateTemp.split("T")[0]+"T24:00";
			var tempDateTo = (new Date(toCompDateTemp)).getDate();
			var d = new Date(toCompDateTemp);
			d.setDate(tempDateTo);
			var toCompDate = d.toISOString();
			toCompDate = toCompDate.split("T")[0]+"T24:00";
			
			var oModelUpgradeRefData = new sap.ui.model.json.JSONModel();
			oModelUpgradeRefData.setSizeLimit(50000);
			sap.ui.getCore().setModel(oModelUpgradeRefData, "oModelUpgradeRefData");
			
			
			var oModelUpgradeRefDataUpgrade = new sap.ui.model.json.JSONModel();
			oModelUpgradeRefDataUpgrade.setSizeLimit(50000);
			sap.ui.getCore().setModel(oModelUpgradeRefDataUpgrade, "oModelUpgradeRefDataUpgrade");

			this.CallCustomerData(ODataModel, "", fromCompDate, toCompDate, "");
			this.loadDDlVersion(ODataModel, fromCompDate, toCompDate);
			this.loadSuccessChartSub(ODataModel, "", fromCompDate, toCompDate, "");
			this.loadLineChart(ODataModel, "", fromCompDate, toCompDate, "");
			
			
			$(".tableVBox").css('height',$(window).height() - 160 + "px");
			this.getView().byId("tableScBtm").setHeight($(window).height() - 340 + "px");
			var objAuthJSON = {
				"AUTH_NAME": "",
				"FNAME": "",
				"LNAME": "",
				"EMAIL": "",
				"DPNAME": "",
				"ID": ""

			};
			var tempAuthorModel = new sap.ui.model.json.JSONModel();
			tempAuthorModel.setData(objAuthJSON);
			sap.ui.getCore().setModel(tempAuthorModel, "tempAuthorModel");

			$.ajax({
				url: "/services/userapi/currentUser",
				method: "GET",
				dataType: 'json',
				async: false,
				success: function(data) {

					var tempAuthorModel = sap.ui.getCore().getModel("tempAuthorModel");
					tempAuthorModel.setProperty('/FNAME', data.firstName);
					tempAuthorModel.setProperty('/LNAME', data.lastName);
					tempAuthorModel.setProperty('/EMAIL', data.email);
					tempAuthorModel.setProperty('/DPNAME', data.displayName);
					tempAuthorModel.setProperty('/ID', data.name);
					tempAuthorModel.setProperty('/AUTH_NAME', data.firstName + " " + data.lastName);

				},
				fail: function() {}
			});
		},
		chkPnlExpand:function(oEvt){
			if(oEvt.getParameters().expand==true){
				this.getView().byId("tableScBtm").setHeight($(window).height() - 520 + "px");
			}else{
				this.getView().byId("tableScBtm").setHeight($(window).height() - 340 + "px");
			}
		},
		ddlProductChanged:function(oEvt){
			var self = this;
			self.stat = true;
			self.state = false;

			if (self.stat == true) {
				var tempDateBtn = this.getView().byId("dateview").getSelectedButton().split("--")[1];
				if (tempDateBtn == "btn1Day") {
				
				var Datetoday = new Date();
				var toDate = new Date();
				toDate = toDate.YYYYMMDD();

				var fromDate = new Date();
				fromDate.setDate((fromDate.getDate() - 1) );
				// if(fromDate.getDate()!=1){
				// 	fromDate.setDate(1);
				// }
				var fromDateDay = fromDate.YYYYMMDD();

				var fromCompDate = fromDate.toISOString();
				var toCompDateTemp = Datetoday.toISOString();
			} else if (tempDateBtn == "btn1Month") {
					var Datetoday = new Date();
					var fromDate = new Date();
					fromDate.setDate((fromDate.getDate() - 30) + 1);
					// fromDate = fromDate.YYYYMMDD();
					if(fromDate.getDate()!=1){
						fromDate.setDate(1);
					}

					var fromCompDate = fromDate.toISOString();
					var toCompDateTemp = Datetoday.toISOString();
				} else if (tempDateBtn == "btn3Month") {
					var Datetoday = new Date();
					var fromDate = new Date();
					fromDate.setMonth((fromDate.getMonth() - 3));
					fromDate.setDate(fromDate.getDate() + 1);
					if(fromDate.getDate()!=1){
						fromDate.setDate(1);
					}

					var fromCompDate = fromDate.toISOString();
					var toCompDateTemp = Datetoday.toISOString();
				} else if (tempDateBtn == "btn6Month") {
					var Datetoday = new Date();
					var fromDate = new Date();
					fromDate.setMonth((fromDate.getMonth() - 6));
					fromDate.setDate(fromDate.getDate() + 1);
					if(fromDate.getDate()!=1){
						fromDate.setDate(1);
					}
					// fromDate = fromDate.YYYYMMDD();

					var fromCompDate = fromDate.toISOString();
					var toCompDateTemp = Datetoday.toISOString();
				} else if (tempDateBtn == "btn1Year") {
					var Datetoday = new Date();
					var fromDate = new Date();
					fromDate.setMonth((fromDate.getMonth() - 12));
					fromDate.setDate(fromDate.getDate() + 1);
					if(fromDate.getDate()!=1){
						fromDate.setDate(1);
					}
					// fromDate = fromDate.YYYYMMDD();

					var fromCompDate = fromDate.toISOString();
					var toCompDateTemp = Datetoday.toISOString();
				} else if (tempDateBtn == "btn2Year") {
					var Datetoday = new Date();
					var fromDate = new Date();
					fromDate.setMonth((fromDate.getMonth() - 24));
					fromDate.setDate(fromDate.getDate() + 1);
					if(fromDate.getDate()!=1){
						fromDate.setDate(1);
					}
					// fromDate = fromDate.YYYYMMDD();

					var fromCompDate = fromDate.toISOString();
					var toCompDateTemp = Datetoday.toISOString();
				} else {
					var fromDateVal = this.getView().byId("dateviewrange").getDateValue();
					var toDateVal = this.getView().byId("dateviewrange").getSecondDateValue();
	
					var fromCompDate = fromDateVal.toISOString();
					var toCompDateTemp = toDateVal.toISOString();
				}
			} else {
				var fromDateVal = this.getView().byId("dateviewrange").getDateValue();
				var toDateVal = this.getView().byId("dateviewrange").getSecondDateValue();

				var fromCompDate = fromDateVal.toISOString();
				var toCompDateTemp = toDateVal.toISOString();
			}

			var mdl = this.getView().getModel();

			// var groups = this.getView().byId("ddlVersion").getValue();
			// if (groups == "") {
			// 	this.getView().byId("ddlVersion").setValue("Build Version");
			// 	this.getView().byId("ddlVersion").setSelectedKey("Build Version");
			// }
			
			var tempKey = this.getView().byId("ddlVersion").getSelectedKey();
			if (tempKey == "Version") {
				tempKey = "";
			}

			fromCompDate = fromCompDate.split("T")[0]+"T00:00";
			toCompDateTemp = toCompDateTemp.split("T")[0]+"T24:00";
			var tempDateTo = (new Date(toCompDateTemp)).getDate();
			var d = new Date(toCompDateTemp);
			d.setDate(tempDateTo);
			var toCompDate = d.toISOString();
			toCompDate = toCompDate.split("T")[0]+"T24:00";

this.showBusyIndicator(10000, 0);
			this.CallCustomerData(mdl, tempKey, fromCompDate, toCompDate, "");
			this.loadSuccessChartSub(mdl, tempKey, fromCompDate, toCompDate, "");
			this.loadLineChart(mdl, tempKey, fromCompDate, toCompDate, "");
		
		},
		
		ddlDeployChanged:function(oEvt){
			var self = this;
			self.stat = true;
			self.state = false;

			if (self.stat == true) {
				var tempDateBtn = this.getView().byId("dateview").getSelectedButton().split("--")[1];
				if (tempDateBtn == "btn1Day") {
				
				var Datetoday = new Date();
				var toDate = new Date();
				toDate = toDate.YYYYMMDD();

				var fromDate = new Date();
				fromDate.setDate((fromDate.getDate() - 1) );
				// if(fromDate.getDate()!=1){
				// 	fromDate.setDate(1);
				// }
				var fromDateDay = fromDate.YYYYMMDD();

				var fromCompDate = fromDate.toISOString();
				var toCompDateTemp = Datetoday.toISOString();
			} else if (tempDateBtn == "btn1Month") {
					var Datetoday = new Date();
					var fromDate = new Date();
					fromDate.setDate((fromDate.getDate() - 30) + 1);
					// fromDate = fromDate.YYYYMMDD();
					if(fromDate.getDate()!=1){
						fromDate.setDate(1);
					}

					var fromCompDate = fromDate.toISOString();
					var toCompDateTemp = Datetoday.toISOString();
				} else if (tempDateBtn == "btn3Month") {
					var Datetoday = new Date();
					var fromDate = new Date();
					fromDate.setMonth((fromDate.getMonth() - 3));
					fromDate.setDate(fromDate.getDate() + 1);
					if(fromDate.getDate()!=1){
						fromDate.setDate(1);
					}

					var fromCompDate = fromDate.toISOString();
					var toCompDateTemp = Datetoday.toISOString();
				} else if (tempDateBtn == "btn6Month") {
					var Datetoday = new Date();
					var fromDate = new Date();
					fromDate.setMonth((fromDate.getMonth() - 6));
					fromDate.setDate(fromDate.getDate() + 1);
					if(fromDate.getDate()!=1){
						fromDate.setDate(1);
					}
					// fromDate = fromDate.YYYYMMDD();

					var fromCompDate = fromDate.toISOString();
					var toCompDateTemp = Datetoday.toISOString();
				} else if (tempDateBtn == "btn1Year") {
					var Datetoday = new Date();
					var fromDate = new Date();
					fromDate.setMonth((fromDate.getMonth() - 12));
					fromDate.setDate(fromDate.getDate() + 1);
					if(fromDate.getDate()!=1){
						fromDate.setDate(1);
					}
					// fromDate = fromDate.YYYYMMDD();

					var fromCompDate = fromDate.toISOString();
					var toCompDateTemp = Datetoday.toISOString();
				} else if (tempDateBtn == "btn2Year") {
					var Datetoday = new Date();
					var fromDate = new Date();
					fromDate.setMonth((fromDate.getMonth() - 24));
					fromDate.setDate(fromDate.getDate() + 1);
					if(fromDate.getDate()!=1){
						fromDate.setDate(1);
					}
					// fromDate = fromDate.YYYYMMDD();

					var fromCompDate = fromDate.toISOString();
					var toCompDateTemp = Datetoday.toISOString();
				} else {
					var fromDateVal = this.getView().byId("dateviewrange").getDateValue();
					var toDateVal = this.getView().byId("dateviewrange").getSecondDateValue();
	
					var fromCompDate = fromDateVal.toISOString();
					var toCompDateTemp = toDateVal.toISOString();
				}
			} else {
				var fromDateVal = this.getView().byId("dateviewrange").getDateValue();
				var toDateVal = this.getView().byId("dateviewrange").getSecondDateValue();

				var fromCompDate = fromDateVal.toISOString();
				var toCompDateTemp = toDateVal.toISOString();
			}

			var mdl = this.getView().getModel();

			// var groups = this.getView().byId("ddlVersion").getValue();
			// if (groups == "") {
			// 	this.getView().byId("ddlVersion").setValue("Build Version");
			// 	this.getView().byId("ddlVersion").setSelectedKey("Build Version");
			// }
			
			var tempKey = this.getView().byId("ddlVersion").getSelectedKey();
			if (tempKey == "Version") {
				tempKey = "";
			}

			fromCompDate = fromCompDate.split("T")[0]+"T00:00";
			toCompDateTemp = toCompDateTemp.split("T")[0]+"T24:00";
			var tempDateTo = (new Date(toCompDateTemp)).getDate();
			var d = new Date(toCompDateTemp);
			d.setDate(tempDateTo);
			var toCompDate = d.toISOString();
			toCompDate = toCompDate.split("T")[0]+"T24:00";
			
			
			var oModelUpgradeRefData = new sap.ui.model.json.JSONModel();
			oModelUpgradeRefData.setSizeLimit(50000);
			sap.ui.getCore().setModel(oModelUpgradeRefData, "oModelUpgradeRefData");
			
			
			var oModelUpgradeRefDataUpgrade = new sap.ui.model.json.JSONModel();
			oModelUpgradeRefDataUpgrade.setSizeLimit(50000);
			sap.ui.getCore().setModel(oModelUpgradeRefDataUpgrade, "oModelUpgradeRefDataUpgrade");

this.showBusyIndicator(10000, 0);
			this.CallCustomerData(mdl, tempKey, fromCompDate, toCompDate, "");
			this.loadSuccessChartSub(mdl, tempKey, fromCompDate, toCompDate, "");
			this.loadLineChart(mdl, tempKey, fromCompDate, toCompDate, "");
		
		},

		ddlVersionChanged: function() {
			var self = this;
			self.stat = true;
			self.state = false;

			if (self.stat == true) {
				var tempDateBtn = this.getView().byId("dateview").getSelectedButton().split("--")[1];
				if (tempDateBtn == "btn1Day") {
				
				var Datetoday = new Date();
				var toDate = new Date();
				toDate = toDate.YYYYMMDD();

				var fromDate = new Date();
				fromDate.setDate((fromDate.getDate() - 1) );
				// if(fromDate.getDate()!=1){
				// 	fromDate.setDate(1);
				// }
				var fromDateDay = fromDate.YYYYMMDD();

				var fromCompDate = fromDate.toISOString();
				var toCompDateTemp = Datetoday.toISOString();
			} else if (tempDateBtn == "btn1Month") {
					var Datetoday = new Date();
					var fromDate = new Date();
					fromDate.setDate((fromDate.getDate() - 30) + 1);
					// fromDate = fromDate.YYYYMMDD();
					if(fromDate.getDate()!=1){
						fromDate.setDate(1);
					}

					var fromCompDate = fromDate.toISOString();
					var toCompDateTemp = Datetoday.toISOString();
				} else if (tempDateBtn == "btn3Month") {
					var Datetoday = new Date();
					var fromDate = new Date();
					fromDate.setMonth((fromDate.getMonth() - 3));
					fromDate.setDate(fromDate.getDate() + 1);
					if(fromDate.getDate()!=1){
						fromDate.setDate(1);
					}

					var fromCompDate = fromDate.toISOString();
					var toCompDateTemp = Datetoday.toISOString();
				} else if (tempDateBtn == "btn6Month") {
					var Datetoday = new Date();
					var fromDate = new Date();
					fromDate.setMonth((fromDate.getMonth() - 6));
					fromDate.setDate(fromDate.getDate() + 1);
					if(fromDate.getDate()!=1){
						fromDate.setDate(1);
					}
					// fromDate = fromDate.YYYYMMDD();

					var fromCompDate = fromDate.toISOString();
					var toCompDateTemp = Datetoday.toISOString();
				} else if (tempDateBtn == "btn1Year") {
					var Datetoday = new Date();
					var fromDate = new Date();
					fromDate.setMonth((fromDate.getMonth() - 12));
					fromDate.setDate(fromDate.getDate() + 1);
					if(fromDate.getDate()!=1){
						fromDate.setDate(1);
					}
					// fromDate = fromDate.YYYYMMDD();

					var fromCompDate = fromDate.toISOString();
					var toCompDateTemp = Datetoday.toISOString();
				} else if (tempDateBtn == "btn2Year") {
					var Datetoday = new Date();
					var fromDate = new Date();
					fromDate.setMonth((fromDate.getMonth() - 24));
					fromDate.setDate(fromDate.getDate() + 1);
					if(fromDate.getDate()!=1){
						fromDate.setDate(1);
					}
					// fromDate = fromDate.YYYYMMDD();

					var fromCompDate = fromDate.toISOString();
					var toCompDateTemp = Datetoday.toISOString();
				} else {
				var fromDateVal = this.getView().byId("dateviewrange").getDateValue();
				var toDateVal = this.getView().byId("dateviewrange").getSecondDateValue();

				var fromCompDate = fromDateVal.toISOString();
				var toCompDateTemp = toDateVal.toISOString();
			}
			} else {
				var fromDateVal = this.getView().byId("dateviewrange").getDateValue();
				var toDateVal = this.getView().byId("dateviewrange").getSecondDateValue();

				var fromCompDate = fromDateVal.toISOString();
				var toCompDateTemp = toDateVal.toISOString();
			}

			var mdl = this.getView().getModel();

			// var groups = this.getView().byId("ddlVersion").getValue();
			// if (groups == "") {
			// 	this.getView().byId("ddlVersion").setValue("Build Version");
			// 	this.getView().byId("ddlVersion").setSelectedKey("Build Version");
			// }
			var tempKey = this.getView().byId("ddlVersion").getSelectedKey();
			if(tempKey!="Version"&&tempKey!="b1808/"&&tempKey!="b1811/"&&tempKey!="b1902/"&&tempKey!="b1905/"&&tempKey!="b1908/"&&tempKey!="b1911/"&&tempKey!="b2002/"&&tempKey!="b2005/"&&tempKey!="b2008/"&&tempKey!="b2011/"&&tempKey!=""){
				this.getView().byId("ddlProd").setSelectedKey("EC");
				this.getView().byId("ddlProd").setEnabled(false);
			}else{
				this.getView().byId("ddlProd").setSelectedKey("All");
				this.getView().byId("ddlProd").setEnabled(true);
			}
			if (tempKey == "Version") {
				tempKey = "";
			}

			// this.getView().byId("ddlUpgrade").setSelectedKey("All");
			// this.ddlUpgradeChanged();
			// this.getView().byId("searchfield").setValue("");
			
			
			fromCompDate = fromCompDate.split("T")[0]+"T00:00";
			toCompDateTemp = toCompDateTemp.split("T")[0]+"T24:00";
			var tempDateTo = (new Date(toCompDateTemp)).getDate();
			var d = new Date(toCompDateTemp);
			d.setDate(tempDateTo);
			var toCompDate = d.toISOString();
			toCompDate = toCompDate.split("T")[0]+"T24:00";

this.showBusyIndicator(10000, 0);
			this.CallCustomerData(mdl, tempKey, fromCompDate, toCompDate, "");
			this.loadSuccessChartSub(mdl, tempKey, fromCompDate, toCompDate, "");
			this.loadLineChart(mdl, tempKey, fromCompDate, toCompDate, "");
		},
		createColumnConfig: function() {
			var aCols = [];

			// aCols.push({
			// 	label: 'ID',
			// 	type: 'number',
			// 	property: 'UserID',
			// 	scale: 0
			// });
			
			var modelAdmin = sap.ui.getCore().getModel("superadmin").getData();
			if (modelAdmin=="superadmin") {
				aCols.push({
					property: 'company',
					label: 'Company',
					type: 'string',
					width: '30'
				});
			}else{
				aCols.push({
					property: 'Default',
					label: 'Company',
					type: 'string',
					width: '30'
				});
			}
			
			
			// aCols.push({
			// 	property:'company',
			// 	label: 'Customer Name',
			// 	type: 'string',
			// 	width: '30'
			// });

			aCols.push({
				property:'upgrade',
				label: 'Upgrade Element',
				type: 'string',
				width: '30'
			});

		
			
			aCols.push({
				property:'env',
				label: 'Enviornment',
				type: 'string',
				width: '30'
			});
			
			aCols.push({
				label:'Time Stamp',
				property: 'puretimestamp',
				type: 'string'
			});
			
			aCols.push({
				property:'result',
				label: 'Result',
				type: 'string',
				width: '30'
			});
			
			aCols.push({
				property:'mig',
				label: 'Migration',
				type: 'string',
				width: '30'
			});
			
			aCols.push({
				property:'fversion',
				label: 'Release Version',
				type: 'string',
				width: '30'
			});
			
			aCols.push({
				property:'user',
				label: 'User',
				type: 'string',
				width: '30'
			});
			
			aCols.push({
				property:'email',
				label: 'Email',
				type: 'string',
				width: '30'
			});
			
			aCols.push({
				property:'id',
				label: 'CompanyID',
				type: 'string',
				width: '30'
			});
			
			aCols.push({
				property:'catg',
				label: 'Error Categorization',
				type: 'string',
				width: '30'
			});
			
			aCols.push({
				property:'log',
				label: 'Log',
				type: 'string',
				width: '30'
			});
			
			return aCols;
		},
		
		onExport: function() {
			var me = this;
			var aCols, aProducts, oSettings, oRowBinding;
			
			if (!this._oTable) {
				this._oTable = this.byId("listTableBtm");
			}

			oRowBinding = this._oTable.getBinding("items");
			
			var oModel = oRowBinding.getModel();
			// var oModelInterface = oModel.getInterface();

			aCols = this.createColumnConfig();
			aProducts = oModel.getProperty("/stlistUser");

			oSettings = {
				workbook: { columns: aCols },
				dataSource: aProducts,
				fileName : "Upgrade Report.xlsx",
				showProgress : false
			};

			var spreadsheet = new Spreadsheet(oSettings)
				.build()
				.then( function() {
					new sap.m.MessageToast.show("Upgrade Report export has finished");
				
			});
		},
		
		UpdateGUIGraphsdate: function(oEvent) {
			var self = this;
			self.stat = true;
			self.state = false;
			var tempDateBtn = (oEvent.getParameters().id).split("--")[1];
			// var tempDateBtn = this.getView().byId("dateview").getSelectedButton().split("--")[1];
			if (tempDateBtn == "btn1Day") {
				
				var Datetoday = new Date();
				var toDate = new Date();
				toDate = toDate.YYYYMMDD();

				var fromDate = new Date();
				fromDate.setDate((fromDate.getDate() - 1) );
				// if(fromDate.getDate()!=1){
				// 	fromDate.setDate(1);
				// }
				var fromDateDay = fromDate.YYYYMMDD();

				var fromCompDate = fromDate.toISOString();
				var toCompDateTemp = Datetoday.toISOString();
			} else if (tempDateBtn == "btn1Month") {
				var Datetoday = new Date();
				var toDate = new Date();
				toDate = toDate.YYYYMMDD();

				var fromDate = new Date();
				fromDate.setDate((fromDate.getDate() - 30) + 1);
				if(fromDate.getDate()!=1){
					fromDate.setDate(1);
				}
				var fromDateDay = fromDate.YYYYMMDD();

				var fromCompDate = fromDate.toISOString();
				var toCompDateTemp = Datetoday.toISOString();
			} else if (tempDateBtn == "btn3Month") {
				var Datetoday = new Date();
				var toDate = new Date();
				toDate = toDate.YYYYMMDD();

				var fromDate = new Date();
				fromDate.setMonth((fromDate.getMonth() - 3));
				fromDate.setDate(fromDate.getDate() + 1);
				if(fromDate.getDate()!=1){
					fromDate.setDate(1);
				}
				var fromDateDay = fromDate.YYYYMMDD();

				var fromCompDate = fromDate.toISOString();
				var toCompDateTemp = Datetoday.toISOString();
			} else if (tempDateBtn == "btn6Month") {
				var Datetoday = new Date();
				var toDate = new Date();
				toDate = toDate.YYYYMMDD();

				var fromDate = new Date();
				fromDate.setMonth((fromDate.getMonth() - 6));
				fromDate.setDate(fromDate.getDate() + 1);
				if(fromDate.getDate()!=1){
					fromDate.setDate(1);
				}
				var fromDateDay = fromDate.YYYYMMDD();

				var fromCompDate = fromDate.toISOString();
				var toCompDateTemp = Datetoday.toISOString();
			} else if (tempDateBtn == "btn1Year") {
				var Datetoday = new Date();
				var toDate = new Date();
				toDate = toDate.YYYYMMDD();

				var fromDate = new Date();
				fromDate.setMonth((fromDate.getMonth() - 12));
				fromDate.setDate(fromDate.getDate() + 1);
				if(fromDate.getDate()!=1){
					fromDate.setDate(1);
				}
				var fromDateDay = fromDate.YYYYMMDD();

				var fromCompDate = fromDate.toISOString();
				var toCompDateTemp = Datetoday.toISOString();
			} else if (tempDateBtn == "btn2Year") {
				var Datetoday = new Date();
				var toDate = new Date();
				toDate = toDate.YYYYMMDD();

				var fromDate = new Date();
				fromDate.setMonth((fromDate.getMonth() - 24));
				fromDate.setDate(fromDate.getDate() + 1);
				if(fromDate.getDate()!=1){
					fromDate.setDate(1);
				}
				var fromDateDay = fromDate.YYYYMMDD();

				var fromCompDate = fromDate.toISOString();
				var toCompDateTemp = Datetoday.toISOString();
			}
			this.getView().byId("dateviewrange").setDateValue(stringToDate(fromDateDay));
			this.getView().byId("dateviewrange").setSecondDateValue(stringToDate(toDate));

			var mdl = this.getView().getModel();
			var tempKey = this.getView().byId("ddlVersion").getSelectedKey();
			if (tempKey == "Version") {
				tempKey = "";
			}

			// this.getView().byId("ddlUpgrade").setSelectedKey("All");
			// this.ddlUpgradeChanged();
			// this.getView().byId("searchfield").setValue("");
			
			
			fromCompDate = fromCompDate.split("T")[0]+"T00:00";
			if(tempDateBtn == "btn1Day"){
				fromCompDate = fromCompDate.split("T")[0]+"T00:00";
			}
			toCompDateTemp = toCompDateTemp.split("T")[0]+"T24:00";
			var tempDateTo = (new Date(toCompDateTemp)).getDate();
			var d = new Date(toCompDateTemp);
			d.setDate(tempDateTo);
			var toCompDate = d.toISOString();
			toCompDate = toCompDate.split("T")[0]+"T24:00";
			
			this.showBusyIndicator(10000, 0);
			this.CallCustomerData(mdl, tempKey, fromCompDate, toCompDate, "");
			this.loadSuccessChartSub(mdl, tempKey, fromCompDate, toCompDate, "");
			this.loadLineChart(mdl, tempKey, fromCompDate, toCompDate, "");

		},
		UpdateDateRange: function(oEvent) {
			var self = this;
			self.stat = false;
			self.state = true;

			this.getView().byId("dateview").setSelectedButton("0");
			// var d = this.getView().byId("dateview").getSelectedButton();
			var fromDateVal = this.getView().byId("dateviewrange").getDateValue();
			var fromDate = fromDateVal.YYYYMMDD();
			var toDateVal = this.getView().byId("dateviewrange").getSecondDateValue();
			var toDate = toDateVal.YYYYMMDD();
			var tempDateToday = new Date();
			var tempDateToday = tempDateToday.YYYYMMDD();
			if (fromDate > tempDateToday) {
				oEvent.oSource.setValueState(sap.ui.core.ValueState.Error);
			} else if (toDate > tempDateToday) {
				oEvent.oSource.setValueState(sap.ui.core.ValueState.Error);
			} else {
				oEvent.oSource.setValueState(sap.ui.core.ValueState.None);
			}

			this.getView().byId("dateviewrange").setDateValue(stringToDate(fromDate));
			this.getView().byId("dateviewrange").setSecondDateValue(stringToDate(toDate));

			var fromCompDate = fromDateVal.toISOString();
			var toCompDateTemp = toDateVal.toISOString();
			fromCompDate = fromCompDate.split("T")[0]+"T00:00";
			// toCompDateTemp = toCompDateTemp.split("T")[0]+"T24:00";
			var tempDateTo = (new Date(toCompDateTemp)).getDate()+1;
			var d = new Date(toCompDateTemp);
			d.setDate(tempDateTo);
			var toCompDate = d.toISOString();
			toCompDate = toCompDate.split("T")[0]+"T24:00";

			var mdl = this.getView().getModel();
			var tempKey = this.getView().byId("ddlVersion").getSelectedKey();
			if (tempKey == "Version") {
				tempKey = "";
			}

			// this.getView().byId("ddlUpgrade").setSelectedKey("All");
			// this.ddlUpgradeChanged();
			// this.getView().byId("searchfield").setValue("");

this.showBusyIndicator(10000, 0);
			this.CallCustomerData(mdl, tempKey, fromCompDate, toCompDate, "");
			this.loadSuccessChartSub(mdl, tempKey, fromCompDate, toCompDate, "");
			this.loadLineChart(mdl, tempKey, fromCompDate, toCompDate, "");

		},
		
			hideBusyIndicator: function () {
			sap.ui.core.BusyIndicator.hide();
		},

		showBusyIndicator: function (iDuration, iDelay) {
			sap.ui.core.BusyIndicator.show(iDelay);

			if (iDuration && iDuration > 0) {
				if (this._sTimeoutId) {
					jQuery.sap.clearDelayedCall(this._sTimeoutId);
					this._sTimeoutId = null;
				}

				this._sTimeoutId = jQuery.sap.delayedCall(iDuration, this, function () {
					this.hideBusyIndicator();
				});
			}
		},
		
		loadDDlVersion: function(mdl) {

			var me = this;
			var url =
				"/UpgradeCenterResult?$select=COMPANYSCHEMA,COMPANY,TIME_STAMP,FILEVERSION&$orderby=TIME_STAMP desc&$filter=(substringof('sfv4',COMPANYSCHEMA) or substringof('SFV4',COMPANYSCHEMA) or substringof('STOCKPM',COMPANYSCHEMA) or substringof('GLOBUSER_DVLHCM20S',COMPANYSCHEMA) or substringof('globuser_dvlhcm20s',COMPANYSCHEMA) or substringof('stockpm',COMPANYSCHEMA) or substringof('GLOBUSER_DVLHCM20S',COMPANYSCHEMA) or substringof('globuser_dvlhcm20s',COMPANYSCHEMA)   or substringof('DC',COMPANYSCHEMA) or substringof('dc',COMPANYSCHEMA) or substringof('STG',COMPANYSCHEMA) or substringof('stg',COMPANYSCHEMA) or substringof('HANAPM',COMPANYSCHEMA) or substringof('hanapm',COMPANYSCHEMA)) and COMPANYSCHEMA ne '' and COMPANYID ne 'PAYNGPPRL' and COMPANYID ne 'USBASEIAS22V1' and COMPANYID ne 'SAPSDCHXM0001' and COMPANYID ne 'PAYNGPPRLE' and COMPANY ne '' and COMPANY ne 'SAP SF Cloud Engineering'";

			// mdl.read(
			// 	url,
			// 	null, null, true,
			// 	function(oData, oResponse) {
			// 		if (oData.results.length > 0) {

			// 			var oModelVersion = new sap.ui.model.json.JSONModel();
			// 			oModelVersion.setSizeLimit(1000);
			// 			sap.ui.getCore().setModel(oModelVersion, "oModelVersion");

			// 			var tempData = [];
			// 			for (var q = 0; q < oData.results.length; q++) {
			// 				// if(oData.results[q].COMPANY=="CRUZ ROJA ESPAÑOLA"){
			// 				// 	oData.results[q].COMPANY="CRUZ ROJA ESPAÑOLA DESARROLLO";
			// 				// }
			// 				// if(oData.results[q].COMPANY=="Release"){
			// 				// 	oData.results[q].COMPANY="Stericycle Inc (de)";
			// 				// }
							
			// 				// var majorBlk = oData.results[q].UPGRADE_ELEMENT.split("_");
			// 				// var lastItem = majorBlk[majorBlk.length-1];
			// 				// if(lastItem.length!=32){
								
			// 				if(oData.results[q].COMPANY!="BPMCINSTANCE4" && oData.results[q].COMPANY!="BPMCINSTANCE1"){
			// 					if (oData.results[q].COMPANYSCHEMA != null && oData.results[q].COMPANYSCHEMA.toLowerCase().indexOf("sfsales")==-1) {
			// 						// if (oData.results[q].COMPANYSCHEMA.toLowerCase().indexOf("sfv4") > -1 || oData.results[q].COMPANYSCHEMA.toLowerCase().indexOf("hanapm") > -1 || oData.results[q].COMPANYSCHEMA.toLowerCase().indexOf(
			// 						// 		"stg") > -1 || oData.results[q].COMPANYSCHEMA.toLowerCase().indexOf("dc") > -1 || oData.results[q].COMPANYSCHEMA.toLowerCase().indexOf("stockpm172200_ref2") > -1) {
			// 							if (oData.results[q].FILEVERSION != "") {
			// 								if (oData.results[q].FILEVERSION != null) {
			// 									tempData.push({
			// 										version: oData.results[q].FILEVERSION.split("b")[1].split("/")[0],
			// 										versionPara: oData.results[q].FILEVERSION
			// 									});
			// 								}
			// 							}
			// 						// }
			// 					}
			// 				}
							
								
			// 				//}
			// 			}

			// 			var uniqueVersion = tempData.reduce(function(item, e1) {
			// 				var matches = item.filter(function(e2) {
			// 					return e1.version == e2.version;
			// 				});
			// 				if (matches.length == 0) {
			// 					item.push(e1);
			// 				}
			// 				return item;
			// 			}, []);
						
			// 			uniqueVersion.sort(function(a, b) {
			// 				return (a.version > b.version) ? 1 : ((b.version > a.version) ? -1 : 0);
			// 			});
			// 			uniqueVersion = uniqueVersion.reverse();
						
			// 			uniqueVersion.unshift({
			// 				version: "Build Version",
			// 				versionPara: "Version"
			// 			});

			// 			var oDataGrp = {
			// 				"stlist": uniqueVersion
			// 			};

			// 			oModelVersion.setData(oDataGrp);
			// 			me.getView().byId("ddlVersion").setModel(oModelVersion);

			// 		}else{
			// 			var oModelVersion = new sap.ui.model.json.JSONModel();
			// 			oModelVersion.setSizeLimit(1000);
			// 			sap.ui.getCore().setModel(oModelVersion, "oModelVersion");

			// 			var oDataGrp = {
			// 				"stlist": []
			// 			};

			// 			oModelVersion.setData(oDataGrp);
			// 			me.getView().byId("ddlVersion").setModel(oModelVersion);
			// 		}
			// 	},
			// 	function(oError) {
			// 		console.log("Error 127");
			// 	});
var oModelVersion = new sap.ui.model.json.JSONModel();
						oModelVersion.setSizeLimit(1000);
						sap.ui.getCore().setModel(oModelVersion, "oModelVersion");
						var uniqueVersion = [{
							version: "Build Version",
							versionPara: "Version"
						},{
							version: "2111",
							versionPara: "b2111/"
						},{
							version: "2105",
							versionPara: "b2105/"
						},{
							version: "2011",
							versionPara: "b2011/"
						},{
							version: "2005",
							versionPara: "b2005/"
						},{
							version: "1911",
							versionPara: "b1911"
						},{
							version: "1908",
							versionPara: "b1908/"
						},{
							version: "1905",
							versionPara: "b1905/"
						},{
							version: "1902",
							versionPara: "b1902/"
						},{
							version: "1811",
							versionPara: "b1811/"
						},{
							version: "1808",
							versionPara: "b1808/"
						},{
							version: "1805",
							versionPara: "b1805/"
						},{
							version: "1802",
							versionPara: "b1802/"
						},{
							version: "1711",
							versionPara: "b1711/"
						},{
							version: "1708",
							versionPara: "b1708/"
						},{
							version: "1705",
							versionPara: "b1705/"
						}];
						

						var oDataGrp = {
							"stlist": uniqueVersion
						};

						oModelVersion.setData(oDataGrp);
						me.getView().byId("ddlVersion").setModel(oModelVersion);
		},
		
		callRefChart:function(mdl, para,output){
			var tempODATAPreCheck = [];
			var tempODATAPreCheckFilter = [];
			// var oModelUpgradeRecruitData = sap.ui.getCore().getModel("oModelUpgradeRecruit").getData();
			var datatempoModelUpgradeRecruitON = sap.ui.getCore().getModel("oModelUpgradeRecruitON").getData();
			var datatempoModelUpgradeRecruitREC = sap.ui.getCore().getModel("oModelUpgradeRecruitREC").getData();
			var datatempoModelUpgradeRecruitSM = sap.ui.getCore().getModel("oModelUpgradeRecruitSM").getData();
			var datatempoModelUpgradeRecruitPG = sap.ui.getCore().getModel("oModelUpgradeRecruitPG").getData();
			var datatempoModelUpgradeRecruitCO = sap.ui.getCore().getModel("oModelUpgradeRecruitCO").getData();
			var datatempoModelUpgradeRecruitEC = sap.ui.getCore().getModel("oModelUpgradeRecruitEC").getData();
			
			
			var oModelDetailOutput = new sap.ui.model.json.JSONModel();
			oModelDetailOutput.setData(output);
			sap.ui.getCore().setModel(oModelDetailOutput, "oModelDetailOutput");
			
			var Datetoday = new Date();
			var fromDate = new Date();
			fromDate.setMonth((fromDate.getMonth() - 60));
			fromDate.setDate(fromDate.getDate() + 1);

			var fromCompDateAll = fromDate.toISOString();
			var toCompDateTemp = Datetoday.toISOString();
			
			fromCompDateAll = fromCompDateAll.split("T")[0]+"T00:00";
			toCompDateTemp = toCompDateTemp.split("T")[0]+"T24:00";
			var tempDateTo = (new Date(toCompDateTemp)).getDate();
			var d = new Date(toCompDateTemp);
			d.setDate(tempDateTo);
			var toCompDateAll = d.toISOString();
			toCompDateAll = toCompDateAll.split("T")[0]+"T24:00";
					
					
			var tempDateRef = [];
			var oDataCHSTLineRef = {};
			var inputFeedArryRef = [];
			var oModelLineChartSVAccDetailRef = new sap.ui.model.json.JSONModel();
			sap.ui.getCore().setModel(oModelLineChartSVAccDetailRef, "oModelLineChartSVAccDetailRef");
			var me = this;
			
			var oModelUpgradeRefDataData = sap.ui.getCore().getModel("oModelUpgradeRefData").getData();
			
			if(oModelUpgradeRefDataData.length>0){
				
				
				tempODATAPreCheck = oModelUpgradeRefDataData;
					for (var q = 0; q < tempODATAPreCheck.length; q++) {
						
						var majorBlk = tempODATAPreCheck[q].UPGRADE_ELEMENT.split("_");
							var lastItem = majorBlk[majorBlk.length-1];
							// if(lastItem.length!=32){
								
								
							if(me.getView().byId("ddlProd").getSelectedKey()=="All"){
							
								
									tempODATAPreCheckFilter.push(tempODATAPreCheck[q]);
								}  else if(me.getView().byId("ddlProd").getSelectedKey()=="RM"){
			
									for(var a2=0;a2<datatempoModelUpgradeRecruitREC.length;a2++){
										
										if(tempODATAPreCheck[q].UPGRADE_ELEMENT.indexOf("_")==-1){
											
										
											if(tempODATAPreCheck[q].UPGRADE_ELEMENT==datatempoModelUpgradeRecruitREC[a2].UPGRADE_ELEMENT){
													// if(datatempoModelUpgradeRecruitREC[a2].PRODUCT=="Recruiting"){
														tempODATAPreCheckFilter.push(tempODATAPreCheck[q]);
														break;	
													// }
												}
											
										}else{
											var majorBlk = tempODATAPreCheck[q].UPGRADE_ELEMENT.split("_");
											var lastItem = majorBlk[majorBlk.length-1];
											if(lastItem.length==32){
												majorBlk.pop();
												var CompmajorBlk = majorBlk.join("_");
												if(CompmajorBlk==datatempoModelUpgradeRecruitREC[a2].UPGRADE_ELEMENT){
													// if(datatempoModelUpgradeRecruitREC[a2].PRODUCT=="Recruiting"){
														tempODATAPreCheckFilter.push(tempODATAPreCheck[q]);
														break;	
													// }
												}
											}else{
												majorBlk.pop();
												majorBlk.pop();
												var CompmajorBlk = majorBlk.join("_");
												if(CompmajorBlk==datatempoModelUpgradeRecruitREC[a2].UPGRADE_ELEMENT){
													// if(datatempoModelUpgradeRecruitREC[a2].PRODUCT=="Recruiting"){
														tempODATAPreCheckFilter.push(tempODATAPreCheck[q]);
														break;	
													// }
												}
											}
										}
										
										
										
										
										
									}
								}  else if(me.getView().byId("ddlProd").getSelectedKey()=="SM"){
									for(var a2=0;a2<datatempoModelUpgradeRecruitSM.length;a2++){
										
			// 							
										
										
											if(tempODATAPreCheck[q].UPGRADE_ELEMENT.indexOf("_")==-1){
												
										
											if(tempODATAPreCheck[q].UPGRADE_ELEMENT==datatempoModelUpgradeRecruitSM[a2].UPGRADE_ELEMENT){
													// if(oModelUpgradeRecruitData[a2].PRODUCT=="Succession Management"){
														tempODATAPreCheckFilter.push(tempODATAPreCheck[q]);
														break;	
													// }
												}
											
										}else{
											var majorBlk = tempODATAPreCheck[q].UPGRADE_ELEMENT.split("_");
											var lastItem = majorBlk[majorBlk.length-1];
											if(lastItem.length==32){
												majorBlk.pop();
												var CompmajorBlk = majorBlk.join("_");
												if(CompmajorBlk==datatempoModelUpgradeRecruitSM[a2].UPGRADE_ELEMENT){
													// if(oModelUpgradeRecruitData[a2].PRODUCT=="Succession Management"){
														tempODATAPreCheckFilter.push(tempODATAPreCheck[q]);
														break;	
													// }
												}
											}else{
												majorBlk.pop();
												majorBlk.pop();
												var CompmajorBlk = majorBlk.join("_");
												if(CompmajorBlk==datatempoModelUpgradeRecruitSM[a2].UPGRADE_ELEMENT){
													// if(oModelUpgradeRecruitData[a2].PRODUCT=="Succession Management"){
														tempODATAPreCheckFilter.push(tempODATAPreCheck[q]);
														break;	
													// }
												}
											}
										}
										
										
										
										
									}
								}  else if(me.getView().byId("ddlProd").getSelectedKey()=="PG"){
									for(var a2=0;a2<datatempoModelUpgradeRecruitPG.length;a2++){
										
										
									
										
										
										if(tempODATAPreCheck[q].UPGRADE_ELEMENT.indexOf("_")==-1){
										
												if(tempODATAPreCheck[q].UPGRADE_ELEMENT==datatempoModelUpgradeRecruitPG[a2].UPGRADE_ELEMENT){
													// if(oModelUpgradeRecruitData[a2].PRODUCT=="Performance and Goals"){
														tempODATAPreCheckFilter.push(tempODATAPreCheck[q]);
														break;	
													// }
												}
											
										}else{
											var majorBlk = tempODATAPreCheck[q].UPGRADE_ELEMENT.split("_");
											var lastItem = majorBlk[majorBlk.length-1];
											if(lastItem.length==32){
												majorBlk.pop();
												var CompmajorBlk = majorBlk.join("_");
												if(CompmajorBlk==datatempoModelUpgradeRecruitPG[a2].UPGRADE_ELEMENT){
													// if(oModelUpgradeRecruitData[a2].PRODUCT=="Performance and Goals"){
														tempODATAPreCheckFilter.push(tempODATAPreCheck[q]);
														break;	
													// }
												}
											}else{
												majorBlk.pop();
												majorBlk.pop();
												var CompmajorBlk = majorBlk.join("_");
												if(CompmajorBlk==datatempoModelUpgradeRecruitPG[a2].UPGRADE_ELEMENT){
													// if(oModelUpgradeRecruitData[a2].PRODUCT=="Performance and Goals"){
														tempODATAPreCheckFilter.push(tempODATAPreCheck[q]);
														break;	
													// }
												}
											}
										}
										
										
										
										
									}
								}  else if(me.getView().byId("ddlProd").getSelectedKey()=="CO"){
									for(var a2=0;a2<datatempoModelUpgradeRecruitCO.length;a2++){
										
									
			
										if(tempODATAPreCheck[q].UPGRADE_ELEMENT.indexOf("_")==-1){
											
										if(tempODATAPreCheck[q].UPGRADE_ELEMENT==datatempoModelUpgradeRecruitCO[a2].UPGRADE_ELEMENT){
											// if(oModelUpgradeRecruitData[a2].PRODUCT=="Compensation"){
												tempODATAPreCheckFilter.push(tempODATAPreCheck[q]);
												break;
											
											// }
											}
										
										}else{
											var majorBlk = tempODATAPreCheck[q].UPGRADE_ELEMENT.split("_");
											var lastItem = majorBlk[majorBlk.length-1];
											if(lastItem.length==32){
												majorBlk.pop();
												var CompmajorBlk = majorBlk.join("_");
												if(CompmajorBlk==datatempoModelUpgradeRecruitCO[a2].UPGRADE_ELEMENT){
													// if(oModelUpgradeRecruitData[a2].PRODUCT=="Compensation"){
														tempODATAPreCheckFilter.push(tempODATAPreCheck[q]);
														break;	
													// }
												}
											}else{
												majorBlk.pop();
												majorBlk.pop();
												var CompmajorBlk = majorBlk.join("_");
												if(CompmajorBlk==datatempoModelUpgradeRecruitCO[a2].UPGRADE_ELEMENT){
													// if(oModelUpgradeRecruitData[a2].PRODUCT=="Compensation"){
														tempODATAPreCheckFilter.push(tempODATAPreCheck[q]);
														break;	
													// }
												}
											}
										}
										
										
										
										
									}
								}  else if(me.getView().byId("ddlProd").getSelectedKey()=="ON"){
									for(var a2=0;a2<datatempoModelUpgradeRecruitON.length;a2++){
										
									
										
			
										if(tempODATAPreCheck[q].UPGRADE_ELEMENT.indexOf("_")==-1){
											
											if(tempODATAPreCheck[q].UPGRADE_ELEMENT==datatempoModelUpgradeRecruitON[a2].UPGRADE_ELEMENT){
											// if(oModelUpgradeRecruitData[a2].PRODUCT=="Onboarding" || oModelUpgradeRecruitData[a2].PRODUCT=="Onboarding 2.0"){
												tempODATAPreCheckFilter.push(tempODATAPreCheck[q]);
												break;
											// }
										}
										
											
										}else{
											var majorBlk = tempODATAPreCheck[q].UPGRADE_ELEMENT.split("_");
											var lastItem = majorBlk[majorBlk.length-1];
											if(lastItem.length==32){
												majorBlk.pop();
												var CompmajorBlk = majorBlk.join("_");
												if(CompmajorBlk==datatempoModelUpgradeRecruitON[a2].UPGRADE_ELEMENT){
													// if(oModelUpgradeRecruitData[a2].PRODUCT=="Onboarding" || oModelUpgradeRecruitData[a2].PRODUCT=="Onboarding 2.0"){
														tempODATAPreCheckFilter.push(tempODATAPreCheck[q]);
														break;	
													// }
												}
											}else{
												majorBlk.pop();
												majorBlk.pop();
												var CompmajorBlk = majorBlk.join("_");
												if(CompmajorBlk==datatempoModelUpgradeRecruitON[a2].UPGRADE_ELEMENT){
													// if(oModelUpgradeRecruitData[a2].PRODUCT=="Onboarding" || oModelUpgradeRecruitData[a2].PRODUCT=="Onboarding 2.0"){
														tempODATAPreCheckFilter.push(tempODATAPreCheck[q]);
														break;	
													// }
												}
											}
										}
										
										
										
									}
								}  else if(me.getView().byId("ddlProd").getSelectedKey()=="EC"){
									for(var a2=0; a2<datatempoModelUpgradeRecruitEC.length; a2++){
										
									// var datatempoModelUpgradeRecruitON = sap.ui.getCore().getModel("oModelUpgradeRecruitON").getData();
			// var datatempoModelUpgradeRecruitREC = sap.ui.getCore().getModel("oModelUpgradeRecruitREC").getData();
			// var datatempoModelUpgradeRecruitSM = sap.ui.getCore().getModel("oModelUpgradeRecruitSM").getData();
			// var datatempoModelUpgradeRecruitPG = sap.ui.getCore().getModel("oModelUpgradeRecruitPG").getData();
			// var datatempoModelUpgradeRecruitCO = sap.ui.getCore().getModel("oModelUpgradeRecruitCO").getData();
			// var datatempoModelUpgradeRecruitEC = sap.ui.getCore().getModel("oModelUpgradeRecruitEC").getData();
										
										
										if(tempODATAPreCheck[q].UPGRADE_ELEMENT.indexOf("_")==-1){
											
										
												if(tempODATAPreCheck[q].UPGRADE_ELEMENT==datatempoModelUpgradeRecruitEC[a2].UPGRADE_ELEMENT){
													// if(oModelUpgradeRecruitData[a2].PRODUCT=="Employee Central"){
														tempODATAPreCheckFilter.push(tempODATAPreCheck[q]);
														break;	
													// }
												}
											
										 
											
										}else{
											var majorBlk = tempODATAPreCheck[q].UPGRADE_ELEMENT.split("_");
											var lastItem = majorBlk[majorBlk.length-1];
											if(lastItem.length==32){
												majorBlk.pop();
												var CompmajorBlk = majorBlk.join("_");
												if(CompmajorBlk==datatempoModelUpgradeRecruitEC[a2].UPGRADE_ELEMENT){
													// if(datatempoModelUpgradeRecruitEC[a2].PRODUCT=="Employee Central"){
														tempODATAPreCheckFilter.push(tempODATAPreCheck[q]);
														break;	
													// }
												}
											}else{
												majorBlk.pop();
												majorBlk.pop();
												var CompmajorBlk = majorBlk.join("_");
												if(CompmajorBlk==datatempoModelUpgradeRecruitEC[a2].UPGRADE_ELEMENT){
													// if(oModelUpgradeRecruitData[a2].PRODUCT=="Employee Central"){
														tempODATAPreCheckFilter.push(tempODATAPreCheck[q]);
														break;	
													// }
												}
											}
										}
									}
								}
							
							// }
							
							
							
							
							
							// if(me.getView().byId("ddlProd").getSelectedKey()=="All"){
							// 	tempODATAPreCheckFilter.push(tempODATAPreCheck[q]);
							// } else if(me.getView().byId("ddlProd").getSelectedKey()=="RM"){
							// 	for(var a2=0;a2<oModelUpgradeRecruitData.length;a2++){
							// 		if(tempODATAPreCheck[q].UPGRADE_ELEMENT==oModelUpgradeRecruitData[a2].UPGRADE_ELEMENT){
							// 			if(oModelUpgradeRecruitData[a2].PRODUCT=="Recruiting"){
							// 				tempODATAPreCheckFilter.push(tempODATAPreCheck[q]);
							// 				break;	
							// 			}
							// 		}
							// 	}
							// }  else if(me.getView().byId("ddlProd").getSelectedKey()=="SM"){
							// 	for(var a2=0;a2<oModelUpgradeRecruitData.length;a2++){
							// 		if(tempODATAPreCheck[q].UPGRADE_ELEMENT==oModelUpgradeRecruitData[a2].UPGRADE_ELEMENT){
							// 			if(oModelUpgradeRecruitData[a2].PRODUCT=="Succession Management"){
							// 				tempODATAPreCheckFilter.push(tempODATAPreCheck[q]);
							// 				break;
							// 			}
							// 		}
							// 	}
							// }  else if(me.getView().byId("ddlProd").getSelectedKey()=="PG"){
							// 	for(var a2=0;a2<oModelUpgradeRecruitData.length;a2++){
							// 		if(tempODATAPreCheck[q].UPGRADE_ELEMENT==oModelUpgradeRecruitData[a2].UPGRADE_ELEMENT){
							// 			if(oModelUpgradeRecruitData[a2].PRODUCT=="Performance and Goals"){
							// 				tempODATAPreCheckFilter.push(tempODATAPreCheck[q]);
							// 				break;
							// 			}
							// 		}
							// 	}
							// } else if(me.getView().byId("ddlProd").getSelectedKey()=="CO"){
							// 	for(var a2=0;a2<oModelUpgradeRecruitData.length;a2++){
							// 		if(tempODATAPreCheck[q].UPGRADE_ELEMENT==oModelUpgradeRecruitData[a2].UPGRADE_ELEMENT){
							// 			if(oModelUpgradeRecruitData[a2].PRODUCT=="Compensation"){
							// 				tempODATAPreCheckFilter.push(tempODATAPreCheck[q]);
							// 				break;
							// 			}
							// 		}
							// 	}
							// }else if(me.getView().byId("ddlProd").getSelectedKey()=="ON"){
							// 	for(var a2=0;a2<oModelUpgradeRecruitData.length;a2++){
							// 		if(tempODATAPreCheck[q].UPGRADE_ELEMENT==oModelUpgradeRecruitData[a2].UPGRADE_ELEMENT){
							// 			if(oModelUpgradeRecruitData[a2].PRODUCT=="Onboarding"){
							// 				tempODATAPreCheckFilter.push(tempODATAPreCheck[q]);
							// 				break;
							// 			}
							// 		}
							// 	}
							// }else if(me.getView().byId("ddlProd").getSelectedKey()=="EC"){
							// 	for(var a2=0; a2<oModelUpgradeRecruitData.length; a2++){
							// 		if(tempODATAPreCheck[q].UPGRADE_ELEMENT!=oModelUpgradeRecruitData[a2].UPGRADE_ELEMENT){
							// 			tempODATAPreCheckFilter.push(tempODATAPreCheck[q]);
							// 			break;
							// 		}
									
							// 	}
							// }
							
							
						}
					
					if (tempODATAPreCheckFilter.length > 0) {
						
						for (var w = 0; w < tempODATAPreCheckFilter.length; w++) {
							// if(tempODATAPreCheckFilter[w].COMPANY=="CRUZ ROJA ESPAÑOLA"){
							// 	tempODATAPreCheckFilter[w].COMPANY="CRUZ ROJA ESPAÑOLA DESARROLLO";
							// }
							// if(tempODATAPreCheckFilter[w].COMPANY=="Release"){
							// 	tempODATAPreCheckFilter[w].COMPANY="Stericycle Inc (de)";
							// }
							if(tempODATAPreCheckFilter[w].COMPANY!="BPMCINSTANCE4" && tempODATAPreCheckFilter[w].COMPANY!="BPMCINSTANCE1" ){
								if (tempODATAPreCheckFilter[w].COMPANYSCHEMA != null && tempODATAPreCheckFilter[w].COMPANYSCHEMA.toLowerCase().indexOf("sfsales")==-1) {
								// if (tempODATAPreCheckFilter[w].COMPANYSCHEMA.toLowerCase().indexOf("sfv4") > -1 || tempODATAPreCheckFilter[w].COMPANYSCHEMA.toLowerCase().indexOf("hanapm") > -1 ||tempODATAPreCheckFilter[w].COMPANYSCHEMA.toLowerCase().indexOf(
								// 		"stg") > -1 || tempODATAPreCheckFilter[w].COMPANYSCHEMA.toLowerCase().indexOf("dc") > -1 || tempODATAPreCheckFilter[w].COMPANYSCHEMA.toLowerCase().indexOf("stockpm172200_ref2") > -1) {
									tempDateRef.push({
										comp: tempODATAPreCheckFilter[w].COMPANY + GetDDMMYY(new Date(tempODATAPreCheckFilter[w].TIME_STAMP.toUTCString())),
										cmpny: tempODATAPreCheckFilter[w].COMPANY,
										time: GetDDMMYY(new Date(tempODATAPreCheckFilter[w].TIME_STAMP.toUTCString())),
										timeComp: GetDDMM(new Date(tempODATAPreCheckFilter[w].TIME_STAMP.toUTCString())),
										pertimestamp: tempODATAPreCheckFilter[w].TIME_STAMP.toUTCString()
									});
								// }
							}
							}
						}

						var tempDatetempDateRef = tempDateRef.reduce(function(item, e1) {
							var matchesRef = item.filter(function(e2) {
								if (e1.cmpny == e2.cmpny && e1.timeComp == e2.timeComp) {
									return e1.cmpny == e2.cmpny;
								}
							});
							if (matchesRef.length == 0) {
								item.push(e1);
							}
							return item;
						}, []);

						var uniqueArrayRef = me.removeDuplicates(tempDatetempDateRef, "cmpny");

						var outputRef = [];

						uniqueArrayRef.forEach(function(value) {
							var existing = outputRef.filter(function(v, i) {
								return v.timeComp == value.timeComp;
							});

							if (existing.length) {
								var existingIndex = outputRef.indexOf(existing[0]);
								outputRef[existingIndex].cmpny = outputRef[existingIndex].cmpny.concat(value.cmpny);
								outputRef[existingIndex].time = outputRef[existingIndex].time.concat(value.time);
							} else {
								if (typeof value.cmpny == 'string') {
									value.cmpny = [value.cmpny];
								}
								if (typeof value.time == 'string') {
									value.time = [value.time];
								}
								outputRef.push(value);
							}
						});

						outputRef.sort(function(a, b) {
							return (new Date(a.timeComp) > new Date(b.timeComp)) ? 1 : ((new Date(b.timeComp) > new Date(a.timeComp)) ? -1 : 0);
						});

						var oModelLineChartSVAccDetail = sap.ui.getCore().getModel("oModelLineChartSVAccDetail");
						var oModelDetailOutput = sap.ui.getCore().getModel("oModelDetailOutput").getData();
						
						for(var x=0;x<outputRef.length;x++){
							for(var y=0;y<oModelDetailOutput.length;y++){
								if(outputRef[x].timeComp==oModelDetailOutput[y].timeComp){
									
									if(oModelDetailOutput[y].cmpny.length>outputRef[x].cmpny.length){
										oModelDetailOutput[y].cmpny = outputRef[x].cmpny;
									}
									
									// var array1 = oModelDetailOutput[y].cmpny; //17
									// var array2 = outputRef[x].cmpny; //15
									
									// var distAry = [];
									
									// if(array1.length>array2.length){
									// 	array1.length = array2.length;
									// }else{
										
									// }
								}
							}
						}
						
						
						for (var w = 0; w < oModelDetailOutput.length; w++) {
							if(w==0){
								inputFeedArryRef.push({
									time: oModelDetailOutput[w].timeComp,
									cmpny: oModelDetailOutput[w].cmpny.length,
									commu: oModelDetailOutput[w].cmpny.length,
								});
							}else{
								inputFeedArryRef.push({
									time: oModelDetailOutput[w].timeComp,
									cmpny: oModelDetailOutput[w].cmpny.length,
									commu: inputFeedArryRef[w-1].commu+oModelDetailOutput[w].cmpny.length,
								});
							}
						}
						
						oDataCHSTLineRef = {
							data: inputFeedArryRef
						};

						var oModelLineChartSVAccDetailRef = sap.ui.getCore().getModel("oModelLineChartSVAccDetailRef");
						oModelLineChartSVAccDetailRef.setData(oDataCHSTLineRef);
						
						var timeInputRef = [];
						var cmpnyInputRef = [];
						var commuInputRef = [];
						
						for(var t=0;t<inputFeedArryRef.length;t++){
							 timeInputRef.push(inputFeedArryRef[t].time);
							 cmpnyInputRef.push(inputFeedArryRef[t].cmpny);
							 commuInputRef.push(inputFeedArryRef[t].commu);
						}
						
						var totalUnique=0;
						for(var i in cmpnyInputRef) { totalUnique += cmpnyInputRef[i]; }	
						var oModelTotalDetailData = sap.ui.getCore().getModel("oModelTotalDetail").getData();
						
						var totalRecords = oModelTotalDetailData;
						var percent = ((totalUnique / totalRecords) * 100).toFixed(1);
						// if (parseFloat(percent) >= 50) {
						// 	me.getView().byId("radialMicroChartCust").setValueColor("Good");
						// } else {
						// 	me.getView().byId("radialMicroChartCust").setValueColor("Error");
						// }
						// me.getView().byId("radialMicroChartCust").setPercentage(parseFloat(percent));
						
						
						
						me.getView().byId("noCustValSubNUique").setValue(parseFloat(totalUnique));
						me.getView().byId("noCustValSubExist").setValue(parseFloat(parseInt(oModelTotalDetailData)-totalUnique));
						me.getView().byId("noCustValSub").setValue(parseFloat(oModelTotalDetailData));
						
						me.getView().byId("totalCustCount").setText(parseFloat(oModelTotalDetailData));
						

						me.getView().byId("noCustValSubNUique").setDisplayValue((totalUnique).toString());
						me.getView().byId("noCustValSubExist").setDisplayValue((parseInt(oModelTotalDetailData)-totalUnique).toString());
						me.getView().byId("noCustValSub").setDisplayValue((oModelTotalDetailData).toString());
						
						
					}
				
				
			}else{
				
			

			if (para != "") {
				var url =
					"/UpgradeCenterResult?$select=UPGRADE_ELEMENT,COMPANY,COMPANYSCHEMA,TIME_STAMP&$orderby=TIME_STAMP desc&$filter=(substringof('sfv4',COMPANYSCHEMA) or substringof('SFV4',COMPANYSCHEMA) or substringof('STOCKPM',COMPANYSCHEMA) or substringof('GLOBUSER_DVLHCM20S',COMPANYSCHEMA) or substringof('globuser_dvlhcm20s',COMPANYSCHEMA) or substringof('stockpm',COMPANYSCHEMA) or substringof('GLOBUSER_DVLHCM20S',COMPANYSCHEMA) or substringof('globuser_dvlhcm20s',COMPANYSCHEMA)   or substringof('DC',COMPANYSCHEMA) or substringof('dc',COMPANYSCHEMA) or substringof('STG',COMPANYSCHEMA) or substringof('stg',COMPANYSCHEMA) or substringof('HANAPM',COMPANYSCHEMA) or substringof('hanapm',COMPANYSCHEMA)) and COMPANYSCHEMA ne '' and COMPANYID ne 'PAYNGPPRL' and COMPANYID ne 'USBASEIAS22V1' and COMPANYID ne 'SAPSDCHXM0001' and COMPANYID ne 'PAYNGPPRLE' and COMPANY ne '' and COMPANY ne 'SAP SF Cloud Engineering' and FILEVERSION eq '" +
					para + "' and TIME_STAMP ge datetime'" + fromCompDateAll + "' and TIME_STAMP le datetime'" + toCompDateAll + "'";
			} else {
				var url =
					"/UpgradeCenterResult?$select=UPGRADE_ELEMENT,COMPANY,COMPANYSCHEMA,TIME_STAMP&$orderby=TIME_STAMP desc&$filter=(substringof('sfv4',COMPANYSCHEMA) or substringof('SFV4',COMPANYSCHEMA) or substringof('STOCKPM',COMPANYSCHEMA) or substringof('GLOBUSER_DVLHCM20S',COMPANYSCHEMA) or substringof('globuser_dvlhcm20s',COMPANYSCHEMA) or substringof('stockpm',COMPANYSCHEMA) or substringof('GLOBUSER_DVLHCM20S',COMPANYSCHEMA) or substringof('globuser_dvlhcm20s',COMPANYSCHEMA)   or substringof('DC',COMPANYSCHEMA) or substringof('dc',COMPANYSCHEMA) or substringof('STG',COMPANYSCHEMA) or substringof('stg',COMPANYSCHEMA) or substringof('HANAPM',COMPANYSCHEMA) or substringof('hanapm',COMPANYSCHEMA)) and COMPANYSCHEMA ne '' and COMPANYID ne 'PAYNGPPRL' and COMPANYID ne 'USBASEIAS22V1' and COMPANYID ne 'SAPSDCHXM0001' and COMPANYID ne 'PAYNGPPRLE' and COMPANY ne '' and COMPANY ne 'SAP SF Cloud Engineering' and TIME_STAMP ge datetime'" +
					fromCompDateAll + "' and TIME_STAMP le datetime'" + toCompDateAll + "'";
			}

			mdl.read(
				url,
				null, null, true,
				function(oData, oResponse) {
					if(oData.results.length>0){
						
					var datatemp = oData.results;
					
					sap.ui.getCore().getModel("oModelUpgradeRefData").setData(datatemp);
					
					
					tempODATAPreCheck = oData.results;
					for (var q = 0; q < tempODATAPreCheck.length; q++) {
						
						var majorBlk = tempODATAPreCheck[q].UPGRADE_ELEMENT.split("_");
							var lastItem = majorBlk[majorBlk.length-1];
							// if(lastItem.length!=32){
								
								
							if(me.getView().byId("ddlProd").getSelectedKey()=="All"){
							
								
									tempODATAPreCheckFilter.push(tempODATAPreCheck[q]);
								}  else if(me.getView().byId("ddlProd").getSelectedKey()=="RM"){
			
									for(var a2=0;a2<datatempoModelUpgradeRecruitREC.length;a2++){
										
										if(tempODATAPreCheck[q].UPGRADE_ELEMENT.indexOf("_")==-1){
											
										
											if(tempODATAPreCheck[q].UPGRADE_ELEMENT==datatempoModelUpgradeRecruitREC[a2].UPGRADE_ELEMENT){
													// if(datatempoModelUpgradeRecruitREC[a2].PRODUCT=="Recruiting"){
														tempODATAPreCheckFilter.push(tempODATAPreCheck[q]);
														break;	
													// }
												}
											
										}else{
											var majorBlk = tempODATAPreCheck[q].UPGRADE_ELEMENT.split("_");
											var lastItem = majorBlk[majorBlk.length-1];
											if(lastItem.length==32){
												majorBlk.pop();
												var CompmajorBlk = majorBlk.join("_");
												if(CompmajorBlk==datatempoModelUpgradeRecruitREC[a2].UPGRADE_ELEMENT){
													// if(datatempoModelUpgradeRecruitREC[a2].PRODUCT=="Recruiting"){
														tempODATAPreCheckFilter.push(tempODATAPreCheck[q]);
														break;	
													// }
												}
											}else{
												majorBlk.pop();
												majorBlk.pop();
												var CompmajorBlk = majorBlk.join("_");
												if(CompmajorBlk==datatempoModelUpgradeRecruitREC[a2].UPGRADE_ELEMENT){
													// if(datatempoModelUpgradeRecruitREC[a2].PRODUCT=="Recruiting"){
														tempODATAPreCheckFilter.push(tempODATAPreCheck[q]);
														break;	
													// }
												}
											}
										}
										
										
										
										
										
									}
								}  else if(me.getView().byId("ddlProd").getSelectedKey()=="SM"){
									for(var a2=0;a2<datatempoModelUpgradeRecruitSM.length;a2++){
										
			// 							
										
										
											if(tempODATAPreCheck[q].UPGRADE_ELEMENT.indexOf("_")==-1){
												
										
											if(tempODATAPreCheck[q].UPGRADE_ELEMENT==datatempoModelUpgradeRecruitSM[a2].UPGRADE_ELEMENT){
													// if(oModelUpgradeRecruitData[a2].PRODUCT=="Succession Management"){
														tempODATAPreCheckFilter.push(tempODATAPreCheck[q]);
														break;	
													// }
												}
											
										}else{
											var majorBlk = tempODATAPreCheck[q].UPGRADE_ELEMENT.split("_");
											var lastItem = majorBlk[majorBlk.length-1];
											if(lastItem.length==32){
												majorBlk.pop();
												var CompmajorBlk = majorBlk.join("_");
												if(CompmajorBlk==datatempoModelUpgradeRecruitSM[a2].UPGRADE_ELEMENT){
													// if(oModelUpgradeRecruitData[a2].PRODUCT=="Succession Management"){
														tempODATAPreCheckFilter.push(tempODATAPreCheck[q]);
														break;	
													// }
												}
											}else{
												majorBlk.pop();
												majorBlk.pop();
												var CompmajorBlk = majorBlk.join("_");
												if(CompmajorBlk==datatempoModelUpgradeRecruitSM[a2].UPGRADE_ELEMENT){
													// if(oModelUpgradeRecruitData[a2].PRODUCT=="Succession Management"){
														tempODATAPreCheckFilter.push(tempODATAPreCheck[q]);
														break;	
													// }
												}
											}
										}
										
										
										
										
									}
								}  else if(me.getView().byId("ddlProd").getSelectedKey()=="PG"){
									for(var a2=0;a2<datatempoModelUpgradeRecruitPG.length;a2++){
										
										
									
										
										
										if(tempODATAPreCheck[q].UPGRADE_ELEMENT.indexOf("_")==-1){
										
												if(tempODATAPreCheck[q].UPGRADE_ELEMENT==datatempoModelUpgradeRecruitPG[a2].UPGRADE_ELEMENT){
													// if(oModelUpgradeRecruitData[a2].PRODUCT=="Performance and Goals"){
														tempODATAPreCheckFilter.push(tempODATAPreCheck[q]);
														break;	
													// }
												}
											
										}else{
											var majorBlk = tempODATAPreCheck[q].UPGRADE_ELEMENT.split("_");
											var lastItem = majorBlk[majorBlk.length-1];
											if(lastItem.length==32){
												majorBlk.pop();
												var CompmajorBlk = majorBlk.join("_");
												if(CompmajorBlk==datatempoModelUpgradeRecruitPG[a2].UPGRADE_ELEMENT){
													// if(oModelUpgradeRecruitData[a2].PRODUCT=="Performance and Goals"){
														tempODATAPreCheckFilter.push(tempODATAPreCheck[q]);
														break;	
													// }
												}
											}else{
												majorBlk.pop();
												majorBlk.pop();
												var CompmajorBlk = majorBlk.join("_");
												if(CompmajorBlk==datatempoModelUpgradeRecruitPG[a2].UPGRADE_ELEMENT){
													// if(oModelUpgradeRecruitData[a2].PRODUCT=="Performance and Goals"){
														tempODATAPreCheckFilter.push(tempODATAPreCheck[q]);
														break;	
													// }
												}
											}
										}
										
										
										
										
									}
								}  else if(me.getView().byId("ddlProd").getSelectedKey()=="CO"){
									for(var a2=0;a2<datatempoModelUpgradeRecruitCO.length;a2++){
										
									
			
										if(tempODATAPreCheck[q].UPGRADE_ELEMENT.indexOf("_")==-1){
											
										if(tempODATAPreCheck[q].UPGRADE_ELEMENT==datatempoModelUpgradeRecruitCO[a2].UPGRADE_ELEMENT){
											// if(oModelUpgradeRecruitData[a2].PRODUCT=="Compensation"){
												tempODATAPreCheckFilter.push(tempODATAPreCheck[q]);
												break;
											
											// }
											}
										
										}else{
											var majorBlk = tempODATAPreCheck[q].UPGRADE_ELEMENT.split("_");
											var lastItem = majorBlk[majorBlk.length-1];
											if(lastItem.length==32){
												majorBlk.pop();
												var CompmajorBlk = majorBlk.join("_");
												if(CompmajorBlk==datatempoModelUpgradeRecruitCO[a2].UPGRADE_ELEMENT){
													// if(oModelUpgradeRecruitData[a2].PRODUCT=="Compensation"){
														tempODATAPreCheckFilter.push(tempODATAPreCheck[q]);
														break;	
													// }
												}
											}else{
												majorBlk.pop();
												majorBlk.pop();
												var CompmajorBlk = majorBlk.join("_");
												if(CompmajorBlk==datatempoModelUpgradeRecruitCO[a2].UPGRADE_ELEMENT){
													// if(oModelUpgradeRecruitData[a2].PRODUCT=="Compensation"){
														tempODATAPreCheckFilter.push(tempODATAPreCheck[q]);
														break;	
													// }
												}
											}
										}
										
										
										
										
									}
								}  else if(me.getView().byId("ddlProd").getSelectedKey()=="ON"){
									for(var a2=0;a2<datatempoModelUpgradeRecruitON.length;a2++){
										
									
										
			
										if(tempODATAPreCheck[q].UPGRADE_ELEMENT.indexOf("_")==-1){
											
											if(tempODATAPreCheck[q].UPGRADE_ELEMENT==datatempoModelUpgradeRecruitON[a2].UPGRADE_ELEMENT){
											// if(oModelUpgradeRecruitData[a2].PRODUCT=="Onboarding" || oModelUpgradeRecruitData[a2].PRODUCT=="Onboarding 2.0"){
												tempODATAPreCheckFilter.push(tempODATAPreCheck[q]);
												break;
											// }
										}
										
											
										}else{
											var majorBlk = tempODATAPreCheck[q].UPGRADE_ELEMENT.split("_");
											var lastItem = majorBlk[majorBlk.length-1];
											if(lastItem.length==32){
												majorBlk.pop();
												var CompmajorBlk = majorBlk.join("_");
												if(CompmajorBlk==datatempoModelUpgradeRecruitON[a2].UPGRADE_ELEMENT){
													// if(oModelUpgradeRecruitData[a2].PRODUCT=="Onboarding" || oModelUpgradeRecruitData[a2].PRODUCT=="Onboarding 2.0"){
														tempODATAPreCheckFilter.push(tempODATAPreCheck[q]);
														break;	
													// }
												}
											}else{
												majorBlk.pop();
												majorBlk.pop();
												var CompmajorBlk = majorBlk.join("_");
												if(CompmajorBlk==datatempoModelUpgradeRecruitON[a2].UPGRADE_ELEMENT){
													// if(oModelUpgradeRecruitData[a2].PRODUCT=="Onboarding" || oModelUpgradeRecruitData[a2].PRODUCT=="Onboarding 2.0"){
														tempODATAPreCheckFilter.push(tempODATAPreCheck[q]);
														break;	
													// }
												}
											}
										}
										
										
										
									}
								}  else if(me.getView().byId("ddlProd").getSelectedKey()=="EC"){
									for(var a2=0; a2<datatempoModelUpgradeRecruitEC.length; a2++){
										
									// var datatempoModelUpgradeRecruitON = sap.ui.getCore().getModel("oModelUpgradeRecruitON").getData();
			// var datatempoModelUpgradeRecruitREC = sap.ui.getCore().getModel("oModelUpgradeRecruitREC").getData();
			// var datatempoModelUpgradeRecruitSM = sap.ui.getCore().getModel("oModelUpgradeRecruitSM").getData();
			// var datatempoModelUpgradeRecruitPG = sap.ui.getCore().getModel("oModelUpgradeRecruitPG").getData();
			// var datatempoModelUpgradeRecruitCO = sap.ui.getCore().getModel("oModelUpgradeRecruitCO").getData();
			// var datatempoModelUpgradeRecruitEC = sap.ui.getCore().getModel("oModelUpgradeRecruitEC").getData();
										
										
										if(tempODATAPreCheck[q].UPGRADE_ELEMENT.indexOf("_")==-1){
											
										
												if(tempODATAPreCheck[q].UPGRADE_ELEMENT==datatempoModelUpgradeRecruitEC[a2].UPGRADE_ELEMENT){
													// if(oModelUpgradeRecruitData[a2].PRODUCT=="Employee Central"){
														tempODATAPreCheckFilter.push(tempODATAPreCheck[q]);
														break;	
													// }
												}
											
										 
											
										}else{
											var majorBlk = tempODATAPreCheck[q].UPGRADE_ELEMENT.split("_");
											var lastItem = majorBlk[majorBlk.length-1];
											if(lastItem.length==32){
												majorBlk.pop();
												var CompmajorBlk = majorBlk.join("_");
												if(CompmajorBlk==datatempoModelUpgradeRecruitEC[a2].UPGRADE_ELEMENT){
													// if(datatempoModelUpgradeRecruitEC[a2].PRODUCT=="Employee Central"){
														tempODATAPreCheckFilter.push(tempODATAPreCheck[q]);
														break;	
													// }
												}
											}else{
												majorBlk.pop();
												majorBlk.pop();
												var CompmajorBlk = majorBlk.join("_");
												if(CompmajorBlk==datatempoModelUpgradeRecruitEC[a2].UPGRADE_ELEMENT){
													// if(oModelUpgradeRecruitData[a2].PRODUCT=="Employee Central"){
														tempODATAPreCheckFilter.push(tempODATAPreCheck[q]);
														break;	
													// }
												}
											}
										}
									}
								}
							
							// }
							
							
							
							
							
							// if(me.getView().byId("ddlProd").getSelectedKey()=="All"){
							// 	tempODATAPreCheckFilter.push(tempODATAPreCheck[q]);
							// } else if(me.getView().byId("ddlProd").getSelectedKey()=="RM"){
							// 	for(var a2=0;a2<oModelUpgradeRecruitData.length;a2++){
							// 		if(tempODATAPreCheck[q].UPGRADE_ELEMENT==oModelUpgradeRecruitData[a2].UPGRADE_ELEMENT){
							// 			if(oModelUpgradeRecruitData[a2].PRODUCT=="Recruiting"){
							// 				tempODATAPreCheckFilter.push(tempODATAPreCheck[q]);
							// 				break;	
							// 			}
							// 		}
							// 	}
							// }  else if(me.getView().byId("ddlProd").getSelectedKey()=="SM"){
							// 	for(var a2=0;a2<oModelUpgradeRecruitData.length;a2++){
							// 		if(tempODATAPreCheck[q].UPGRADE_ELEMENT==oModelUpgradeRecruitData[a2].UPGRADE_ELEMENT){
							// 			if(oModelUpgradeRecruitData[a2].PRODUCT=="Succession Management"){
							// 				tempODATAPreCheckFilter.push(tempODATAPreCheck[q]);
							// 				break;
							// 			}
							// 		}
							// 	}
							// }  else if(me.getView().byId("ddlProd").getSelectedKey()=="PG"){
							// 	for(var a2=0;a2<oModelUpgradeRecruitData.length;a2++){
							// 		if(tempODATAPreCheck[q].UPGRADE_ELEMENT==oModelUpgradeRecruitData[a2].UPGRADE_ELEMENT){
							// 			if(oModelUpgradeRecruitData[a2].PRODUCT=="Performance and Goals"){
							// 				tempODATAPreCheckFilter.push(tempODATAPreCheck[q]);
							// 				break;
							// 			}
							// 		}
							// 	}
							// } else if(me.getView().byId("ddlProd").getSelectedKey()=="CO"){
							// 	for(var a2=0;a2<oModelUpgradeRecruitData.length;a2++){
							// 		if(tempODATAPreCheck[q].UPGRADE_ELEMENT==oModelUpgradeRecruitData[a2].UPGRADE_ELEMENT){
							// 			if(oModelUpgradeRecruitData[a2].PRODUCT=="Compensation"){
							// 				tempODATAPreCheckFilter.push(tempODATAPreCheck[q]);
							// 				break;
							// 			}
							// 		}
							// 	}
							// }else if(me.getView().byId("ddlProd").getSelectedKey()=="ON"){
							// 	for(var a2=0;a2<oModelUpgradeRecruitData.length;a2++){
							// 		if(tempODATAPreCheck[q].UPGRADE_ELEMENT==oModelUpgradeRecruitData[a2].UPGRADE_ELEMENT){
							// 			if(oModelUpgradeRecruitData[a2].PRODUCT=="Onboarding"){
							// 				tempODATAPreCheckFilter.push(tempODATAPreCheck[q]);
							// 				break;
							// 			}
							// 		}
							// 	}
							// }else if(me.getView().byId("ddlProd").getSelectedKey()=="EC"){
							// 	for(var a2=0; a2<oModelUpgradeRecruitData.length; a2++){
							// 		if(tempODATAPreCheck[q].UPGRADE_ELEMENT!=oModelUpgradeRecruitData[a2].UPGRADE_ELEMENT){
							// 			tempODATAPreCheckFilter.push(tempODATAPreCheck[q]);
							// 			break;
							// 		}
									
							// 	}
							// }
							
							
						}
					
					if (tempODATAPreCheckFilter.length > 0) {
						
						for (var w = 0; w < tempODATAPreCheckFilter.length; w++) {
							// if(tempODATAPreCheckFilter[w].COMPANY=="CRUZ ROJA ESPAÑOLA"){
							// 	tempODATAPreCheckFilter[w].COMPANY="CRUZ ROJA ESPAÑOLA DESARROLLO";
							// }
							// if(tempODATAPreCheckFilter[w].COMPANY=="Release"){
							// 	tempODATAPreCheckFilter[w].COMPANY="Stericycle Inc (de)";
							// }
							if(tempODATAPreCheckFilter[w].COMPANY!="BPMCINSTANCE4" && tempODATAPreCheckFilter[w].COMPANY!="BPMCINSTANCE1" ){
								if (tempODATAPreCheckFilter[w].COMPANYSCHEMA != null && tempODATAPreCheckFilter[w].COMPANYSCHEMA.toLowerCase().indexOf("sfsales")==-1) {
								// if (tempODATAPreCheckFilter[w].COMPANYSCHEMA.toLowerCase().indexOf("sfv4") > -1 || tempODATAPreCheckFilter[w].COMPANYSCHEMA.toLowerCase().indexOf("hanapm") > -1 ||tempODATAPreCheckFilter[w].COMPANYSCHEMA.toLowerCase().indexOf(
								// 		"stg") > -1 || tempODATAPreCheckFilter[w].COMPANYSCHEMA.toLowerCase().indexOf("dc") > -1 || tempODATAPreCheckFilter[w].COMPANYSCHEMA.toLowerCase().indexOf("stockpm172200_ref2") > -1) {
									tempDateRef.push({
										comp: tempODATAPreCheckFilter[w].COMPANY + GetDDMMYY(new Date(tempODATAPreCheckFilter[w].TIME_STAMP.toUTCString())),
										cmpny: tempODATAPreCheckFilter[w].COMPANY,
										time: GetDDMMYY(new Date(tempODATAPreCheckFilter[w].TIME_STAMP.toUTCString())),
										timeComp: GetDDMM(new Date(tempODATAPreCheckFilter[w].TIME_STAMP.toUTCString())),
										pertimestamp: tempODATAPreCheckFilter[w].TIME_STAMP.toUTCString()
									});
								// }
							}
							}
						}

						var tempDatetempDateRef = tempDateRef.reduce(function(item, e1) {
							var matchesRef = item.filter(function(e2) {
								if (e1.cmpny == e2.cmpny && e1.timeComp == e2.timeComp) {
									return e1.cmpny == e2.cmpny;
								}
							});
							if (matchesRef.length == 0) {
								item.push(e1);
							}
							return item;
						}, []);

						var uniqueArrayRef = me.removeDuplicates(tempDatetempDateRef, "cmpny");

						var outputRef = [];

						uniqueArrayRef.forEach(function(value) {
							var existing = outputRef.filter(function(v, i) {
								return v.timeComp == value.timeComp;
							});

							if (existing.length) {
								var existingIndex = outputRef.indexOf(existing[0]);
								outputRef[existingIndex].cmpny = outputRef[existingIndex].cmpny.concat(value.cmpny);
								outputRef[existingIndex].time = outputRef[existingIndex].time.concat(value.time);
							} else {
								if (typeof value.cmpny == 'string') {
									value.cmpny = [value.cmpny];
								}
								if (typeof value.time == 'string') {
									value.time = [value.time];
								}
								outputRef.push(value);
							}
						});

						outputRef.sort(function(a, b) {
							return (new Date(a.timeComp) > new Date(b.timeComp)) ? 1 : ((new Date(b.timeComp) > new Date(a.timeComp)) ? -1 : 0);
						});

						var oModelLineChartSVAccDetail = sap.ui.getCore().getModel("oModelLineChartSVAccDetail");
						var oModelDetailOutput = sap.ui.getCore().getModel("oModelDetailOutput").getData();
						
						for(var x=0;x<outputRef.length;x++){
							for(var y=0;y<oModelDetailOutput.length;y++){
								if(outputRef[x].timeComp==oModelDetailOutput[y].timeComp){
									
									if(oModelDetailOutput[y].cmpny.length>outputRef[x].cmpny.length){
										oModelDetailOutput[y].cmpny = outputRef[x].cmpny;
									}
									
									// var array1 = oModelDetailOutput[y].cmpny; //17
									// var array2 = outputRef[x].cmpny; //15
									
									// var distAry = [];
									
									// if(array1.length>array2.length){
									// 	array1.length = array2.length;
									// }else{
										
									// }
								}
							}
						}
						
						
						for (var w = 0; w < oModelDetailOutput.length; w++) {
							if(w==0){
								inputFeedArryRef.push({
									time: oModelDetailOutput[w].timeComp,
									cmpny: oModelDetailOutput[w].cmpny.length,
									commu: oModelDetailOutput[w].cmpny.length,
								});
							}else{
								inputFeedArryRef.push({
									time: oModelDetailOutput[w].timeComp,
									cmpny: oModelDetailOutput[w].cmpny.length,
									commu: inputFeedArryRef[w-1].commu+oModelDetailOutput[w].cmpny.length,
								});
							}
						}
						
						oDataCHSTLineRef = {
							data: inputFeedArryRef
						};

						var oModelLineChartSVAccDetailRef = sap.ui.getCore().getModel("oModelLineChartSVAccDetailRef");
						oModelLineChartSVAccDetailRef.setData(oDataCHSTLineRef);
						
						var timeInputRef = [];
						var cmpnyInputRef = [];
						var commuInputRef = [];
						
						for(var t=0;t<inputFeedArryRef.length;t++){
							 timeInputRef.push(inputFeedArryRef[t].time);
							 cmpnyInputRef.push(inputFeedArryRef[t].cmpny);
							 commuInputRef.push(inputFeedArryRef[t].commu);
						}
						
						var totalUnique=0;
						for(var i in cmpnyInputRef) { totalUnique += cmpnyInputRef[i]; }	
						var oModelTotalDetailData = sap.ui.getCore().getModel("oModelTotalDetail").getData();
						
						var totalRecords = oModelTotalDetailData;
						var percent = ((totalUnique / totalRecords) * 100).toFixed(1);
						// if (parseFloat(percent) >= 50) {
						// 	me.getView().byId("radialMicroChartCust").setValueColor("Good");
						// } else {
						// 	me.getView().byId("radialMicroChartCust").setValueColor("Error");
						// }
						// me.getView().byId("radialMicroChartCust").setPercentage(parseFloat(percent));
						
						
						
						me.getView().byId("noCustValSubNUique").setValue(parseFloat(totalUnique));
						me.getView().byId("noCustValSubExist").setValue(parseFloat(parseInt(oModelTotalDetailData)-totalUnique));
						me.getView().byId("noCustValSub").setValue(parseFloat(oModelTotalDetailData));
						
						me.getView().byId("totalCustCount").setText(parseFloat(oModelTotalDetailData));
						

						me.getView().byId("noCustValSubNUique").setDisplayValue((totalUnique).toString());
						me.getView().byId("noCustValSubExist").setDisplayValue((parseInt(oModelTotalDetailData)-totalUnique).toString());
						me.getView().byId("noCustValSub").setDisplayValue((oModelTotalDetailData).toString());
						
						
					}else{
						var oDataCHSTLineRef = {
							data: []
						};

						var oModelLineChartSVAccDetailRef = sap.ui.getCore().getModel("oModelLineChartSVAccDetailRef");
						oModelLineChartSVAccDetailRef.setData(oDataCHSTLineRef);
						
						me.getView().byId("noCustValSubNUique").setValue(0);
						me.getView().byId("noCustValSubExist").setValue(0);
						me.getView().byId("noCustValSub").setValue(0);
						
						me.getView().byId("totalCustCount").setText("");
						

						me.getView().byId("noCustValSubNUique").setDisplayValue("");
						me.getView().byId("noCustValSubExist").setDisplayValue("");
						me.getView().byId("noCustValSub").setDisplayValue("");
					}
					}else{
						var oDataCHSTLineRef = {
							data: []
						};

						var oModelLineChartSVAccDetailRef = sap.ui.getCore().getModel("oModelLineChartSVAccDetailRef");
						oModelLineChartSVAccDetailRef.setData(oDataCHSTLineRef);
						
						me.getView().byId("noCustValSubNUique").setValue(0);
						me.getView().byId("noCustValSubExist").setValue(0);
						me.getView().byId("noCustValSub").setValue(0);
						
						me.getView().byId("totalCustCount").setText("");
						

						me.getView().byId("noCustValSubNUique").setDisplayValue("");
						me.getView().byId("noCustValSubExist").setDisplayValue("");
						me.getView().byId("noCustValSub").setDisplayValue("");
					}
				},
				function(oError) {
					console.log("Error 127");
				});
				
			}
		
		},
		loadLineChart: function(mdl, para, fromCompDate, toCompDate,fillBP) {
			var tempODATAPreCheck = [];
			var tempODATAPreCheckFilter = [];
			// var oModelUpgradeRecruitData = sap.ui.getCore().getModel("oModelUpgradeRecruit").getData();
			var datatempoModelUpgradeRecruitON = sap.ui.getCore().getModel("oModelUpgradeRecruitON").getData();
			var datatempoModelUpgradeRecruitREC = sap.ui.getCore().getModel("oModelUpgradeRecruitREC").getData();
			var datatempoModelUpgradeRecruitSM = sap.ui.getCore().getModel("oModelUpgradeRecruitSM").getData();
			var datatempoModelUpgradeRecruitPG = sap.ui.getCore().getModel("oModelUpgradeRecruitPG").getData();
			var datatempoModelUpgradeRecruitCO = sap.ui.getCore().getModel("oModelUpgradeRecruitCO").getData();
			var datatempoModelUpgradeRecruitEC = sap.ui.getCore().getModel("oModelUpgradeRecruitEC").getData();
			
			
			
			var tempDate = [];
			var oDataCHSTLine = {};
			var inputFeedArry = [];
			var tempODATATotalCust = [];
			var count = 0;
			var oModelLineChartSVAccDetail = new sap.ui.model.json.JSONModel();
			sap.ui.getCore().setModel(oModelLineChartSVAccDetail, "oModelLineChartSVAccDetail");
			
			var oModelTotalDetail = new sap.ui.model.json.JSONModel();
			sap.ui.getCore().setModel(oModelTotalDetail, "oModelTotalDetail");
			
			var me = this;
			var deployKey = me.getView().byId("ddlDeploy").getSelectedKey();

			if (para != "") {
				if(deployKey=="All"){
					var url =
					"/UpgradeCenterResult?$select=UPGRADE_ELEMENT,COMPANY,COMPANYSCHEMA,TIME_STAMP&$orderby=TIME_STAMP desc&$filter=(substringof('sfv4',COMPANYSCHEMA) or substringof('SFV4',COMPANYSCHEMA) or substringof('STOCKPM',COMPANYSCHEMA) or substringof('GLOBUSER_DVLHCM20S',COMPANYSCHEMA) or substringof('globuser_dvlhcm20s',COMPANYSCHEMA) or substringof('stockpm',COMPANYSCHEMA) or substringof('GLOBUSER_DVLHCM20S',COMPANYSCHEMA) or substringof('globuser_dvlhcm20s',COMPANYSCHEMA)   or substringof('DC',COMPANYSCHEMA) or substringof('dc',COMPANYSCHEMA) or substringof('STG',COMPANYSCHEMA) or substringof('stg',COMPANYSCHEMA) or substringof('HANAPM',COMPANYSCHEMA) or substringof('hanapm',COMPANYSCHEMA)) and COMPANYSCHEMA ne '' and COMPANYID ne 'PAYNGPPRL' and COMPANYID ne 'USBASEIAS22V1' and COMPANYID ne 'SAPSDCHXM0001' and COMPANYID ne 'PAYNGPPRLE' and COMPANY ne '' and COMPANY ne 'SAP SF Cloud Engineering' and FILEVERSION eq '" +
					para + "' and TIME_STAMP ge datetime'" + fromCompDate + "' and TIME_STAMP le datetime'" + toCompDate + "'";
				}else if(deployKey=="CUST"){
					var url =
					"/UpgradeCenterResult?$select=UPGRADE_ELEMENT,COMPANY,COMPANYSCHEMA,TIME_STAMP&$orderby=TIME_STAMP desc&$filter=(substringof('sfv4',COMPANYSCHEMA) or substringof('SFV4',COMPANYSCHEMA) or substringof('STOCKPM',COMPANYSCHEMA) or substringof('GLOBUSER_DVLHCM20S',COMPANYSCHEMA) or substringof('globuser_dvlhcm20s',COMPANYSCHEMA) or substringof('stockpm',COMPANYSCHEMA) or substringof('GLOBUSER_DVLHCM20S',COMPANYSCHEMA) or substringof('globuser_dvlhcm20s',COMPANYSCHEMA)   or substringof('DC',COMPANYSCHEMA) or substringof('dc',COMPANYSCHEMA) or substringof('STG',COMPANYSCHEMA) or substringof('stg',COMPANYSCHEMA) or substringof('HANAPM',COMPANYSCHEMA) or substringof('hanapm',COMPANYSCHEMA))  and substringof('_',UPGRADE_ELEMENT) and COMPANYSCHEMA ne '' and COMPANYID ne 'PAYNGPPRL' and COMPANYID ne 'USBASEIAS22V1' and COMPANYID ne 'SAPSDCHXM0001' and COMPANYID ne 'PAYNGPPRLE' and COMPANY ne '' and COMPANY ne 'SAP SF Cloud Engineering' and FILEVERSION eq '" +
					para + "' and TIME_STAMP ge datetime'" + fromCompDate + "' and TIME_STAMP le datetime'" + toCompDate + "'";
				}else{
					var url =
					"/UpgradeCenterResult?$select=UPGRADE_ELEMENT,COMPANY,COMPANYSCHEMA,TIME_STAMP&$orderby=TIME_STAMP desc&$filter=(substringof('sfv4',COMPANYSCHEMA) or substringof('SFV4',COMPANYSCHEMA) or substringof('STOCKPM',COMPANYSCHEMA) or substringof('GLOBUSER_DVLHCM20S',COMPANYSCHEMA) or substringof('globuser_dvlhcm20s',COMPANYSCHEMA) or substringof('stockpm',COMPANYSCHEMA) or substringof('GLOBUSER_DVLHCM20S',COMPANYSCHEMA) or substringof('globuser_dvlhcm20s',COMPANYSCHEMA)   or substringof('DC',COMPANYSCHEMA) or substringof('dc',COMPANYSCHEMA) or substringof('STG',COMPANYSCHEMA) or substringof('stg',COMPANYSCHEMA) or substringof('HANAPM',COMPANYSCHEMA) or substringof('hanapm',COMPANYSCHEMA))  and indexof(UPGRADE_ELEMENT,'_') eq -1  and COMPANYSCHEMA ne '' and COMPANYID ne 'PAYNGPPRL' and COMPANYID ne 'USBASEIAS22V1' and COMPANYID ne 'SAPSDCHXM0001' and COMPANYID ne 'PAYNGPPRLE' and COMPANY ne '' and COMPANY ne 'SAP SF Cloud Engineering' and FILEVERSION eq '" +
					para + "' and TIME_STAMP ge datetime'" + fromCompDate + "' and TIME_STAMP le datetime'" + toCompDate + "'";
				}
				
			} else {
				if(deployKey=="All"){
					var url =
					"/UpgradeCenterResult?$select=UPGRADE_ELEMENT,COMPANY,COMPANYSCHEMA,TIME_STAMP&$orderby=TIME_STAMP desc&$filter=(substringof('sfv4',COMPANYSCHEMA) or substringof('SFV4',COMPANYSCHEMA) or substringof('STOCKPM',COMPANYSCHEMA) or substringof('GLOBUSER_DVLHCM20S',COMPANYSCHEMA) or substringof('globuser_dvlhcm20s',COMPANYSCHEMA) or substringof('stockpm',COMPANYSCHEMA) or substringof('GLOBUSER_DVLHCM20S',COMPANYSCHEMA) or substringof('globuser_dvlhcm20s',COMPANYSCHEMA)   or substringof('DC',COMPANYSCHEMA) or substringof('dc',COMPANYSCHEMA) or substringof('STG',COMPANYSCHEMA) or substringof('stg',COMPANYSCHEMA) or substringof('HANAPM',COMPANYSCHEMA) or substringof('hanapm',COMPANYSCHEMA)) and COMPANYSCHEMA ne '' and COMPANYID ne 'PAYNGPPRL' and COMPANYID ne 'USBASEIAS22V1' and COMPANYID ne 'SAPSDCHXM0001' and COMPANYID ne 'PAYNGPPRLE' and COMPANY ne '' and COMPANY ne 'SAP SF Cloud Engineering' and TIME_STAMP ge datetime'" +
					fromCompDate + "' and TIME_STAMP le datetime'" + toCompDate + "'";
				}else if(deployKey=="CUST"){
					var url =
					"/UpgradeCenterResult?$select=UPGRADE_ELEMENT,COMPANY,COMPANYSCHEMA,TIME_STAMP&$orderby=TIME_STAMP desc&$filter=(substringof('sfv4',COMPANYSCHEMA) or substringof('SFV4',COMPANYSCHEMA) or substringof('STOCKPM',COMPANYSCHEMA) or substringof('GLOBUSER_DVLHCM20S',COMPANYSCHEMA) or substringof('globuser_dvlhcm20s',COMPANYSCHEMA) or substringof('stockpm',COMPANYSCHEMA) or substringof('GLOBUSER_DVLHCM20S',COMPANYSCHEMA) or substringof('globuser_dvlhcm20s',COMPANYSCHEMA)   or substringof('DC',COMPANYSCHEMA) or substringof('dc',COMPANYSCHEMA) or substringof('STG',COMPANYSCHEMA) or substringof('stg',COMPANYSCHEMA) or substringof('HANAPM',COMPANYSCHEMA) or substringof('hanapm',COMPANYSCHEMA))  and substringof('_',UPGRADE_ELEMENT) and COMPANYSCHEMA ne '' and COMPANYID ne 'PAYNGPPRL' and COMPANYID ne 'USBASEIAS22V1' and COMPANYID ne 'SAPSDCHXM0001' and COMPANYID ne 'PAYNGPPRLE' and COMPANY ne '' and COMPANY ne 'SAP SF Cloud Engineering' and TIME_STAMP ge datetime'" +
					fromCompDate + "' and TIME_STAMP le datetime'" + toCompDate + "'";
				}else{
					var url =
					"/UpgradeCenterResult?$select=UPGRADE_ELEMENT,COMPANY,COMPANYSCHEMA,TIME_STAMP&$orderby=TIME_STAMP desc&$filter=(substringof('sfv4',COMPANYSCHEMA) or substringof('SFV4',COMPANYSCHEMA) or substringof('STOCKPM',COMPANYSCHEMA) or substringof('GLOBUSER_DVLHCM20S',COMPANYSCHEMA) or substringof('globuser_dvlhcm20s',COMPANYSCHEMA) or substringof('stockpm',COMPANYSCHEMA) or substringof('GLOBUSER_DVLHCM20S',COMPANYSCHEMA) or substringof('globuser_dvlhcm20s',COMPANYSCHEMA)   or substringof('DC',COMPANYSCHEMA) or substringof('dc',COMPANYSCHEMA) or substringof('STG',COMPANYSCHEMA) or substringof('stg',COMPANYSCHEMA) or substringof('HANAPM',COMPANYSCHEMA) or substringof('hanapm',COMPANYSCHEMA))  and indexof(UPGRADE_ELEMENT,'_') eq -1  and COMPANYSCHEMA ne '' and COMPANYID ne 'PAYNGPPRL' and COMPANYID ne 'USBASEIAS22V1' and COMPANYID ne 'SAPSDCHXM0001' and COMPANYID ne 'PAYNGPPRLE' and COMPANY ne '' and COMPANY ne 'SAP SF Cloud Engineering' and TIME_STAMP ge datetime'" +
					fromCompDate + "' and TIME_STAMP le datetime'" + toCompDate + "'";
				}
				
			}

			mdl.read(
				url,
				null, null, true,
				function(oData, oResponse) {
					if(oData.results.length>0){
						tempODATAPreCheck = oData.results;
						for (var q = 0; q < tempODATAPreCheck.length; q++) {
							
							
							var majorBlk = tempODATAPreCheck[q].UPGRADE_ELEMENT.split("_");
							var lastItem = majorBlk[majorBlk.length-1];
							// if(lastItem.length!=32){
								
								if(me.getView().byId("ddlProd").getSelectedKey()=="All"){
							
								
									tempODATAPreCheckFilter.push(tempODATAPreCheck[q]);
								}  else if(me.getView().byId("ddlProd").getSelectedKey()=="RM"){
			
									for(var a2=0;a2<datatempoModelUpgradeRecruitREC.length;a2++){
										
										if(tempODATAPreCheck[q].UPGRADE_ELEMENT.indexOf("_")==-1){
											
										
											if(tempODATAPreCheck[q].UPGRADE_ELEMENT==datatempoModelUpgradeRecruitREC[a2].UPGRADE_ELEMENT){
													// if(datatempoModelUpgradeRecruitREC[a2].PRODUCT=="Recruiting"){
														tempODATAPreCheckFilter.push(tempODATAPreCheck[q]);
														break;	
													// }
												}
											
										}else{
											var majorBlk = tempODATAPreCheck[q].UPGRADE_ELEMENT.split("_");
											var lastItem = majorBlk[majorBlk.length-1];
											if(lastItem.length==32){
												majorBlk.pop();
												var CompmajorBlk = majorBlk.join("_");
												if(CompmajorBlk==datatempoModelUpgradeRecruitREC[a2].UPGRADE_ELEMENT){
													// if(datatempoModelUpgradeRecruitREC[a2].PRODUCT=="Recruiting"){
														tempODATAPreCheckFilter.push(tempODATAPreCheck[q]);
														break;	
													// }
												}
											}else{
												majorBlk.pop();
												majorBlk.pop();
												var CompmajorBlk = majorBlk.join("_");
												if(CompmajorBlk==datatempoModelUpgradeRecruitREC[a2].UPGRADE_ELEMENT){
													// if(datatempoModelUpgradeRecruitREC[a2].PRODUCT=="Recruiting"){
														tempODATAPreCheckFilter.push(tempODATAPreCheck[q]);
														break;	
													// }
												}
											}
										}
										
										
										
										
										
									}
								}  else if(me.getView().byId("ddlProd").getSelectedKey()=="SM"){
									for(var a2=0;a2<datatempoModelUpgradeRecruitSM.length;a2++){
										
			// 							
										
										
											if(tempODATAPreCheck[q].UPGRADE_ELEMENT.indexOf("_")==-1){
												
										
											if(tempODATAPreCheck[q].UPGRADE_ELEMENT==datatempoModelUpgradeRecruitSM[a2].UPGRADE_ELEMENT){
													// if(oModelUpgradeRecruitData[a2].PRODUCT=="Succession Management"){
														tempODATAPreCheckFilter.push(tempODATAPreCheck[q]);
														break;	
													// }
												}
											
										}else{
											var majorBlk = tempODATAPreCheck[q].UPGRADE_ELEMENT.split("_");
											var lastItem = majorBlk[majorBlk.length-1];
											if(lastItem.length==32){
												majorBlk.pop();
												var CompmajorBlk = majorBlk.join("_");
												if(CompmajorBlk==datatempoModelUpgradeRecruitSM[a2].UPGRADE_ELEMENT){
													// if(oModelUpgradeRecruitData[a2].PRODUCT=="Succession Management"){
														tempODATAPreCheckFilter.push(tempODATAPreCheck[q]);
														break;	
													// }
												}
											}else{
												majorBlk.pop();
												majorBlk.pop();
												var CompmajorBlk = majorBlk.join("_");
												if(CompmajorBlk==datatempoModelUpgradeRecruitSM[a2].UPGRADE_ELEMENT){
													// if(oModelUpgradeRecruitData[a2].PRODUCT=="Succession Management"){
														tempODATAPreCheckFilter.push(tempODATAPreCheck[q]);
														break;	
													// }
												}
											}
										}
										
										
										
										
									}
								}  else if(me.getView().byId("ddlProd").getSelectedKey()=="PG"){
									for(var a2=0;a2<datatempoModelUpgradeRecruitPG.length;a2++){
										
										
									
										
										
										if(tempODATAPreCheck[q].UPGRADE_ELEMENT.indexOf("_")==-1){
										
												if(tempODATAPreCheck[q].UPGRADE_ELEMENT==datatempoModelUpgradeRecruitPG[a2].UPGRADE_ELEMENT){
													// if(oModelUpgradeRecruitData[a2].PRODUCT=="Performance and Goals"){
														tempODATAPreCheckFilter.push(tempODATAPreCheck[q]);
														break;	
													// }
												}
											
										}else{
											var majorBlk = tempODATAPreCheck[q].UPGRADE_ELEMENT.split("_");
											var lastItem = majorBlk[majorBlk.length-1];
											if(lastItem.length==32){
												majorBlk.pop();
												var CompmajorBlk = majorBlk.join("_");
												if(CompmajorBlk==datatempoModelUpgradeRecruitPG[a2].UPGRADE_ELEMENT){
													// if(oModelUpgradeRecruitData[a2].PRODUCT=="Performance and Goals"){
														tempODATAPreCheckFilter.push(tempODATAPreCheck[q]);
														break;	
													// }
												}
											}else{
												majorBlk.pop();
												majorBlk.pop();
												var CompmajorBlk = majorBlk.join("_");
												if(CompmajorBlk==datatempoModelUpgradeRecruitPG[a2].UPGRADE_ELEMENT){
													// if(oModelUpgradeRecruitData[a2].PRODUCT=="Performance and Goals"){
														tempODATAPreCheckFilter.push(tempODATAPreCheck[q]);
														break;	
													// }
												}
											}
										}
										
										
										
										
									}
								}  else if(me.getView().byId("ddlProd").getSelectedKey()=="CO"){
									for(var a2=0;a2<datatempoModelUpgradeRecruitCO.length;a2++){
										
									
			
										if(tempODATAPreCheck[q].UPGRADE_ELEMENT.indexOf("_")==-1){
											
										if(tempODATAPreCheck[q].UPGRADE_ELEMENT==datatempoModelUpgradeRecruitCO[a2].UPGRADE_ELEMENT){
											// if(oModelUpgradeRecruitData[a2].PRODUCT=="Compensation"){
												tempODATAPreCheckFilter.push(tempODATAPreCheck[q]);
												break;
											
											// }
											}
										
										}else{
											var majorBlk = tempODATAPreCheck[q].UPGRADE_ELEMENT.split("_");
											var lastItem = majorBlk[majorBlk.length-1];
											if(lastItem.length==32){
												majorBlk.pop();
												var CompmajorBlk = majorBlk.join("_");
												if(CompmajorBlk==datatempoModelUpgradeRecruitCO[a2].UPGRADE_ELEMENT){
													// if(oModelUpgradeRecruitData[a2].PRODUCT=="Compensation"){
														tempODATAPreCheckFilter.push(tempODATAPreCheck[q]);
														break;	
													// }
												}
											}else{
												majorBlk.pop();
												majorBlk.pop();
												var CompmajorBlk = majorBlk.join("_");
												if(CompmajorBlk==datatempoModelUpgradeRecruitCO[a2].UPGRADE_ELEMENT){
													// if(oModelUpgradeRecruitData[a2].PRODUCT=="Compensation"){
														tempODATAPreCheckFilter.push(tempODATAPreCheck[q]);
														break;	
													// }
												}
											}
										}
										
										
										
										
									}
								}  else if(me.getView().byId("ddlProd").getSelectedKey()=="ON"){
									for(var a2=0;a2<datatempoModelUpgradeRecruitON.length;a2++){
										
									
										
			
										if(tempODATAPreCheck[q].UPGRADE_ELEMENT.indexOf("_")==-1){
											
											if(tempODATAPreCheck[q].UPGRADE_ELEMENT==datatempoModelUpgradeRecruitON[a2].UPGRADE_ELEMENT){
											// if(oModelUpgradeRecruitData[a2].PRODUCT=="Onboarding" || oModelUpgradeRecruitData[a2].PRODUCT=="Onboarding 2.0"){
												tempODATAPreCheckFilter.push(tempODATAPreCheck[q]);
												break;
											// }
										}
										
											
										}else{
											var majorBlk = tempODATAPreCheck[q].UPGRADE_ELEMENT.split("_");
											var lastItem = majorBlk[majorBlk.length-1];
											if(lastItem.length==32){
												majorBlk.pop();
												var CompmajorBlk = majorBlk.join("_");
												if(CompmajorBlk==datatempoModelUpgradeRecruitON[a2].UPGRADE_ELEMENT){
													// if(oModelUpgradeRecruitData[a2].PRODUCT=="Onboarding" || oModelUpgradeRecruitData[a2].PRODUCT=="Onboarding 2.0"){
														tempODATAPreCheckFilter.push(tempODATAPreCheck[q]);
														break;	
													// }
												}
											}else{
												majorBlk.pop();
												majorBlk.pop();
												var CompmajorBlk = majorBlk.join("_");
												if(CompmajorBlk==datatempoModelUpgradeRecruitON[a2].UPGRADE_ELEMENT){
													// if(oModelUpgradeRecruitData[a2].PRODUCT=="Onboarding" || oModelUpgradeRecruitData[a2].PRODUCT=="Onboarding 2.0"){
														tempODATAPreCheckFilter.push(tempODATAPreCheck[q]);
														break;	
													// }
												}
											}
										}
										
										
										
									}
								}  else if(me.getView().byId("ddlProd").getSelectedKey()=="EC"){
									for(var a2=0; a2<datatempoModelUpgradeRecruitEC.length; a2++){
										
									// var datatempoModelUpgradeRecruitON = sap.ui.getCore().getModel("oModelUpgradeRecruitON").getData();
			// var datatempoModelUpgradeRecruitREC = sap.ui.getCore().getModel("oModelUpgradeRecruitREC").getData();
			// var datatempoModelUpgradeRecruitSM = sap.ui.getCore().getModel("oModelUpgradeRecruitSM").getData();
			// var datatempoModelUpgradeRecruitPG = sap.ui.getCore().getModel("oModelUpgradeRecruitPG").getData();
			// var datatempoModelUpgradeRecruitCO = sap.ui.getCore().getModel("oModelUpgradeRecruitCO").getData();
			// var datatempoModelUpgradeRecruitEC = sap.ui.getCore().getModel("oModelUpgradeRecruitEC").getData();
										
										
										if(tempODATAPreCheck[q].UPGRADE_ELEMENT.indexOf("_")==-1){
											
										
												if(tempODATAPreCheck[q].UPGRADE_ELEMENT==datatempoModelUpgradeRecruitEC[a2].UPGRADE_ELEMENT){
													// if(oModelUpgradeRecruitData[a2].PRODUCT=="Employee Central"){
														tempODATAPreCheckFilter.push(tempODATAPreCheck[q]);
														break;	
													// }
												}
											
										 
											
										}else{
											var majorBlk = tempODATAPreCheck[q].UPGRADE_ELEMENT.split("_");
											var lastItem = majorBlk[majorBlk.length-1];
											if(lastItem.length==32){
												majorBlk.pop();
												var CompmajorBlk = majorBlk.join("_");
												if(CompmajorBlk==datatempoModelUpgradeRecruitEC[a2].UPGRADE_ELEMENT){
													// if(datatempoModelUpgradeRecruitEC[a2].PRODUCT=="Employee Central"){
														tempODATAPreCheckFilter.push(tempODATAPreCheck[q]);
														break;	
													// }
												}
											}else{
												majorBlk.pop();
												majorBlk.pop();
												var CompmajorBlk = majorBlk.join("_");
												if(CompmajorBlk==datatempoModelUpgradeRecruitEC[a2].UPGRADE_ELEMENT){
													// if(oModelUpgradeRecruitData[a2].PRODUCT=="Employee Central"){
														tempODATAPreCheckFilter.push(tempODATAPreCheck[q]);
														break;	
													// }
												}
											}
										}
									}
								}
							
							// }
							// if(me.getView().byId("ddlProd").getSelectedKey()=="All"){
							// 	tempODATAPreCheckFilter.push(tempODATAPreCheck[q]);
							// } else if(me.getView().byId("ddlProd").getSelectedKey()=="RM"){
							// 	for(var a2=0;a2<oModelUpgradeRecruitData.length;a2++){
							// 		if(tempODATAPreCheck[q].UPGRADE_ELEMENT==oModelUpgradeRecruitData[a2].UPGRADE_ELEMENT){
							// 			if(oModelUpgradeRecruitData[a2].PRODUCT=="Recruiting"){
							// 				tempODATAPreCheckFilter.push(tempODATAPreCheck[q]);
							// 				break;	
							// 			}
							// 		}
							// 	}
							// }  else if(me.getView().byId("ddlProd").getSelectedKey()=="SM"){
							// 	for(var a2=0;a2<oModelUpgradeRecruitData.length;a2++){
							// 		if(tempODATAPreCheck[q].UPGRADE_ELEMENT==oModelUpgradeRecruitData[a2].UPGRADE_ELEMENT){
							// 			if(oModelUpgradeRecruitData[a2].PRODUCT=="Succession Management"){
							// 				tempODATAPreCheckFilter.push(tempODATAPreCheck[q]);
							// 				break;
							// 			}
							// 		}
							// 	}
							// }  else if(me.getView().byId("ddlProd").getSelectedKey()=="PG"){
							// 	for(var a2=0;a2<oModelUpgradeRecruitData.length;a2++){
							// 		if(tempODATAPreCheck[q].UPGRADE_ELEMENT==oModelUpgradeRecruitData[a2].UPGRADE_ELEMENT){
							// 			if(oModelUpgradeRecruitData[a2].PRODUCT=="Performance and Goals"){
							// 				tempODATAPreCheckFilter.push(tempODATAPreCheck[q]);
							// 				break;
							// 			}
							// 		}
							// 	}
							// } else if(me.getView().byId("ddlProd").getSelectedKey()=="CO"){
							// 	for(var a2=0;a2<oModelUpgradeRecruitData.length;a2++){
							// 		if(tempODATAPreCheck[q].UPGRADE_ELEMENT==oModelUpgradeRecruitData[a2].UPGRADE_ELEMENT){
							// 			if(oModelUpgradeRecruitData[a2].PRODUCT=="Compensation"){
							// 				tempODATAPreCheckFilter.push(tempODATAPreCheck[q]);
							// 				break;
							// 			}
							// 		}
							// 	}
							// }else if(me.getView().byId("ddlProd").getSelectedKey()=="ON"){
							// 	for(var a2=0;a2<oModelUpgradeRecruitData.length;a2++){
							// 		if(tempODATAPreCheck[q].UPGRADE_ELEMENT==oModelUpgradeRecruitData[a2].UPGRADE_ELEMENT){
							// 			if(oModelUpgradeRecruitData[a2].PRODUCT=="Onboarding"){
							// 				tempODATAPreCheckFilter.push(tempODATAPreCheck[q]);
							// 				break;
							// 			}
							// 		}
							// 	}
							// }else if(me.getView().byId("ddlProd").getSelectedKey()=="EC"){
							// 	for(var a2=0; a2<oModelUpgradeRecruitData.length; a2++){
							// 		if(tempODATAPreCheck[q].UPGRADE_ELEMENT!=oModelUpgradeRecruitData[a2].UPGRADE_ELEMENT){
							// 			tempODATAPreCheckFilter.push(tempODATAPreCheck[q]);
							// 			break;
							// 		}
									
							// 	}
							// }
							
							
						}
						
						if (tempODATAPreCheckFilter.length > 0) {
							for (var w = 0; w < tempODATAPreCheckFilter.length; w++) {
								// if(tempODATAPreCheckFilter[w].COMPANY=="CRUZ ROJA ESPAÑOLA"){
								// 	tempODATAPreCheckFilter[w].COMPANY="CRUZ ROJA ESPAÑOLA DESARROLLO";
								// }
								// if(tempODATAPreCheckFilter[w].COMPANY=="Release"){
								// 	tempODATAPreCheckFilter[w].COMPANY="Stericycle Inc (de)";
								// }
								if(tempODATAPreCheckFilter[w].COMPANY!="BPMCINSTANCE4" && tempODATAPreCheckFilter[w].COMPANY!="BPMCINSTANCE1"){
									if (tempODATAPreCheckFilter[w].COMPANYSCHEMA != null && tempODATAPreCheckFilter[w].COMPANYSCHEMA.toLowerCase().indexOf("sfsales")==-1) {
										// if (tempODATAPreCheckFilter[w].COMPANYSCHEMA.toLowerCase().indexOf("sfv4") > -1 || tempODATAPreCheckFilter[w].COMPANYSCHEMA.toLowerCase().indexOf("hanapm") > -1 || tempODATAPreCheckFilter[w].COMPANYSCHEMA.toLowerCase().indexOf(
										// 		"stg") > -1 || tempODATAPreCheckFilter[w].COMPANYSCHEMA.toLowerCase().indexOf("dc") > -1 || tempODATAPreCheckFilter[w].COMPANYSCHEMA.toLowerCase().indexOf("stockpm172200_ref2") > -1) {
											tempDate.push({
												comp: tempODATAPreCheckFilter[w].COMPANY + GetDDMMYY(new Date(tempODATAPreCheckFilter[w].TIME_STAMP.toUTCString())),
												cmpny: tempODATAPreCheckFilter[w].COMPANY,
												time: GetDDMMYY(new Date(tempODATAPreCheckFilter[w].TIME_STAMP.toUTCString())),
												timeComp: GetDDMM(new Date(tempODATAPreCheckFilter[w].TIME_STAMP.toUTCString())),
												pertimestamp: tempODATAPreCheckFilter[w].TIME_STAMP.toUTCString()
											});
											tempODATATotalCust.push(
												tempODATAPreCheckFilter[w].COMPANY
											);
										// }
									}
								}
							}
							
							var uniqueTotalCust = tempODATATotalCust.filter(function(itm, i, tempODATA) {
							    return i == tempODATATotalCust.indexOf(itm);
							});
							
							count = me.NumberFormat(Math.round(uniqueTotalCust.length));
							
							var oModelTotalDetail = sap.ui.getCore().getModel("oModelTotalDetail");
							oModelTotalDetail.setData(count["value"]);
							
	
							var tempDatetempDate = tempDate.reduce(function(item, e1) {
								var matches = item.filter(function(e2) {
									if (e1.cmpny == e2.cmpny && e1.timeComp == e2.timeComp) {
										return e1.cmpny == e2.cmpny;
									}
								});
								if (matches.length == 0) {
									item.push(e1);
								}
								return item;
							}, []);
	
							var uniqueArray = me.removeDuplicates(tempDatetempDate, "cmpny");
	
							var output = [];
	
							uniqueArray.forEach(function(value) {
								var existing = output.filter(function(v, i) {
									return v.timeComp == value.timeComp;
								});
	
								if (existing.length) {
									var existingIndex = output.indexOf(existing[0]);
									output[existingIndex].cmpny = output[existingIndex].cmpny.concat(value.cmpny);
									output[existingIndex].time = output[existingIndex].time.concat(value.time);
								} else {
									if (typeof value.cmpny == 'string') {
										value.cmpny = [value.cmpny];
									}
									if (typeof value.time == 'string') {
										value.time = [value.time];
									}
									output.push(value);
								}
							});
	
							output.sort(function(a, b) {
								return (new Date(a.timeComp) > new Date(b.timeComp)) ? 1 : ((new Date(b.timeComp) > new Date(a.timeComp)) ? -1 : 0);
							});
	
							for (var w = 0; w < output.length; w++) {
								if(w==0){
									inputFeedArry.push({
										time: output[w].timeComp,
										cmpny: output[w].cmpny.length,
										commu: output[w].cmpny.length,
									});
								}else{
									inputFeedArry.push({
										time: output[w].timeComp,
										cmpny: output[w].cmpny.length,
										commu: inputFeedArry[w-1].commu+output[w].cmpny.length,
									});
								}
							}
	
							oDataCHSTLine = {
								data: inputFeedArry
							};
	
							var oModelLineChartSVAccDetail = sap.ui.getCore().getModel("oModelLineChartSVAccDetail");
							oModelLineChartSVAccDetail.setData(oDataCHSTLine);
							
							me.callRefChart(mdl, para,output);
	
						}
					}else{
						var oDataCHSTLine = {
							data: []
						};

						var oModelLineChartSVAccDetail = sap.ui.getCore().getModel("oModelLineChartSVAccDetail");
						oModelLineChartSVAccDetail.setData(oDataCHSTLine);
						me.callRefChart(mdl, para,"");
					}
				},
				function(oError) {
					console.log("Error 127");
				});
		},
		loadErrorChart: function(){
			var catgAry = [];
			var feedAry = [];
			var oModelTableData = sap.ui.getCore().getModel("oModelTable").getData();
			for(var q=0;q<oModelTableData.stlistUser.length;q++){
				if(oModelTableData.stlistUser[q].catg!="No Error"){
					catgAry.push(oModelTableData.stlistUser[q].catg);	
				}
				// }
			}
			var counts = {};
			catgAry.forEach(function(x) { counts[x] = (counts[x] || 0)+1; });
			
			for(var i in counts){
			  feedAry.push({name:i,y:counts[i]});
			}
			
			feedAry.sort(function(a, b) {
							return (new Date(a.y) > new Date(b.y)) ? 1 : ((new Date(b.y) > new Date(a.y)) ? -1 : 0);
						});
			
			$("#repoContainerReviewError").find("svg").remove();

			// Radialize the colors
			Highcharts.setOptions({
				colors: Highcharts.map(['#5EBB4B', '#6586AD','#7eeedd',"#724c55","#cf85d1","#9d85d1", "#d3c158"], function(color) {
					return {
						radialGradient: {
							cx: 0.5,
							cy: 0.3,
							r: 0.7
						},
						stops: [
							[0, color] // darken
						]
					};
				})
			});

			Highcharts.SVGRenderer.prototype.symbols.download = function(x, y, w, h) {
				var path = [
					// Arrow stem
					'M', x + w * 0.5, y,
					'L', x + w * 0.5, y + h * 0.7,
					// Arrow head
					'M', x + w * 0.3, y + h * 0.5,
					'L', x + w * 0.5, y + h * 0.7,
					'L', x + w * 0.7, y + h * 0.5,
					// Box
					'M', x, y + h * 0.9,
					'L', x, y + h,
					'L', x + w, y + h,
					'L', x + w, y + h * 0.9
				];
				return path;
			};

			Highcharts.chart('repoContainerReviewError', {
							chart: {
								plotBackgroundColor: "transparent",
								plotBorderWidth: null,
								plotShadow: false,
								type: 'pie',
								options3d: {
						            enabled: true,
						            alpha: 45
						        },
								height: '160',
								// width: '450'
							},
							// colors:['#90EE7E','#6586AD'],
							title: {
								text: ''
							},
							tooltip: {
								pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
							},
							plotOptions: {
								pie: {
									allowPointSelect: true,
									cursor: 'pointer',
									depth: 25,
									dataLabels: {
										enabled: true,
										format: '<b>{point.name}</b>:<br> {point.percentage:.1f} %',
										style: {
											color: ['#ddd'],
											fontSize:"9.5px"
										},
							            distance: 20
									}
								},
								series: {
									states: {
										select: {
											color: '#63e5e4'
										}
									}
								}
							},
							series: [{
								name: 'Error Categorization',
								// colorByPoint: true,
								size: '100%',
								innerSize: '50%',
								data: feedAry,
								point: {
									events: {
										click: function(event) {}
									}
								}
							}],
							navigation: {
								buttonOptions: {
									verticalAlign: 'top',
									x: 0,
									y: -10
								},
								menuStyle: {
									background: '#555'
								},
								menuItemStyle: {
									color: '#ddd'
								}
							},
							credits: {
								enabled: false
							},
							exporting: {
								chartOptions: {
									chart: {
										backgroundColor: '#555'
									}
								},
								buttons: {
									contextButton: {
										symbol: 'download',
										symbolFill: '#ddd'
									}
								},
								filename: 'Error Categorization Chart'
							}

						});

		},
		loadSuccessChartSub: function(mdl, para, fromCompDate, toCompDate, fillBP) {
			var tempODATAPreCheck = [];
			var tempODATAPreCheckFilter = [];
			// var oModelUpgradeRecruitData = sap.ui.getCore().getModel("oModelUpgradeRecruit").getData();
			var datatempoModelUpgradeRecruitON = sap.ui.getCore().getModel("oModelUpgradeRecruitON").getData();
			var datatempoModelUpgradeRecruitREC = sap.ui.getCore().getModel("oModelUpgradeRecruitREC").getData();
			var datatempoModelUpgradeRecruitSM = sap.ui.getCore().getModel("oModelUpgradeRecruitSM").getData();
			var datatempoModelUpgradeRecruitPG = sap.ui.getCore().getModel("oModelUpgradeRecruitPG").getData();
			var datatempoModelUpgradeRecruitCO = sap.ui.getCore().getModel("oModelUpgradeRecruitCO").getData();
			var datatempoModelUpgradeRecruitEC = sap.ui.getCore().getModel("oModelUpgradeRecruitEC").getData();
			
			
			var tempDateResultTrue = [];
			var tempDateResultFalse = [];
			var me = this;
			var percent = 0;
			var totalRecords = 0;

			var me = this;
			var deployKey = me.getView().byId("ddlDeploy").getSelectedKey();
			
			if (fillBP == "") {
				if (para != "") {
					if(deployKey=="All"){
						var url =
						"/UpgradeCenterResult?$select=UPGRADE_ELEMENT,COMPANY,RESULT,COMPANYSCHEMA,TIME_STAMP&$orderby=TIME_STAMP desc&$filter=(substringof('sfv4',COMPANYSCHEMA) or substringof('SFV4',COMPANYSCHEMA) or substringof('STOCKPM',COMPANYSCHEMA) or substringof('GLOBUSER_DVLHCM20S',COMPANYSCHEMA) or substringof('globuser_dvlhcm20s',COMPANYSCHEMA) or substringof('stockpm',COMPANYSCHEMA) or substringof('GLOBUSER_DVLHCM20S',COMPANYSCHEMA) or substringof('globuser_dvlhcm20s',COMPANYSCHEMA)   or substringof('DC',COMPANYSCHEMA) or substringof('dc',COMPANYSCHEMA) or substringof('STG',COMPANYSCHEMA) or substringof('stg',COMPANYSCHEMA) or substringof('HANAPM',COMPANYSCHEMA) or substringof('hanapm',COMPANYSCHEMA)) and COMPANYSCHEMA ne '' and COMPANYID ne 'PAYNGPPRL' and COMPANYID ne 'USBASEIAS22V1' and COMPANYID ne 'SAPSDCHXM0001' and COMPANYID ne 'PAYNGPPRLE' and COMPANY ne '' and COMPANY ne 'SAP SF Cloud Engineering' and FILEVERSION eq '" +
						para + "' and TIME_STAMP ge datetime'" + fromCompDate + "' and TIME_STAMP le datetime'" + toCompDate + "'";
					}else if(deployKey=="CUST"){
						var url =
						"/UpgradeCenterResult?$select=UPGRADE_ELEMENT,COMPANY,RESULT,COMPANYSCHEMA,TIME_STAMP&$orderby=TIME_STAMP desc&$filter=(substringof('sfv4',COMPANYSCHEMA) or substringof('SFV4',COMPANYSCHEMA) or substringof('STOCKPM',COMPANYSCHEMA) or substringof('GLOBUSER_DVLHCM20S',COMPANYSCHEMA) or substringof('globuser_dvlhcm20s',COMPANYSCHEMA) or substringof('stockpm',COMPANYSCHEMA) or substringof('GLOBUSER_DVLHCM20S',COMPANYSCHEMA) or substringof('globuser_dvlhcm20s',COMPANYSCHEMA)   or substringof('DC',COMPANYSCHEMA) or substringof('dc',COMPANYSCHEMA) or substringof('STG',COMPANYSCHEMA) or substringof('stg',COMPANYSCHEMA) or substringof('HANAPM',COMPANYSCHEMA) or substringof('hanapm',COMPANYSCHEMA)) and substringof('_',UPGRADE_ELEMENT)  and COMPANYSCHEMA ne '' and COMPANYID ne 'PAYNGPPRL' and COMPANYID ne 'USBASEIAS22V1' and COMPANYID ne 'SAPSDCHXM0001' and COMPANYID ne 'PAYNGPPRLE' and COMPANY ne '' and COMPANY ne 'SAP SF Cloud Engineering' and FILEVERSION eq '" +
						para + "' and TIME_STAMP ge datetime'" + fromCompDate + "' and TIME_STAMP le datetime'" + toCompDate + "'";
					}else{
						var url =
						"/UpgradeCenterResult?$select=UPGRADE_ELEMENT,COMPANY,RESULT,COMPANYSCHEMA,TIME_STAMP&$orderby=TIME_STAMP desc&$filter=(substringof('sfv4',COMPANYSCHEMA) or substringof('SFV4',COMPANYSCHEMA) or substringof('STOCKPM',COMPANYSCHEMA) or substringof('GLOBUSER_DVLHCM20S',COMPANYSCHEMA) or substringof('globuser_dvlhcm20s',COMPANYSCHEMA) or substringof('stockpm',COMPANYSCHEMA) or substringof('GLOBUSER_DVLHCM20S',COMPANYSCHEMA) or substringof('globuser_dvlhcm20s',COMPANYSCHEMA)   or substringof('DC',COMPANYSCHEMA) or substringof('dc',COMPANYSCHEMA) or substringof('STG',COMPANYSCHEMA) or substringof('stg',COMPANYSCHEMA) or substringof('HANAPM',COMPANYSCHEMA) or substringof('hanapm',COMPANYSCHEMA)) and indexof(UPGRADE_ELEMENT,'_') eq -1  and COMPANYSCHEMA ne '' and COMPANYID ne 'PAYNGPPRL' and COMPANYID ne 'USBASEIAS22V1' and COMPANYID ne 'SAPSDCHXM0001' and COMPANYID ne 'PAYNGPPRLE' and COMPANY ne '' and COMPANY ne 'SAP SF Cloud Engineering' and FILEVERSION eq '" +
						para + "' and TIME_STAMP ge datetime'" + fromCompDate + "' and TIME_STAMP le datetime'" + toCompDate + "'";
					}
					
				} else {
					if(deployKey=="All"){
						var url =
						"/UpgradeCenterResult?$select=UPGRADE_ELEMENT,COMPANY,RESULT,COMPANYSCHEMA,TIME_STAMP&$orderby=TIME_STAMP desc&$filter=(substringof('sfv4',COMPANYSCHEMA) or substringof('SFV4',COMPANYSCHEMA) or substringof('STOCKPM',COMPANYSCHEMA) or substringof('GLOBUSER_DVLHCM20S',COMPANYSCHEMA) or substringof('globuser_dvlhcm20s',COMPANYSCHEMA) or substringof('stockpm',COMPANYSCHEMA) or substringof('GLOBUSER_DVLHCM20S',COMPANYSCHEMA) or substringof('globuser_dvlhcm20s',COMPANYSCHEMA)   or substringof('DC',COMPANYSCHEMA) or substringof('dc',COMPANYSCHEMA) or substringof('STG',COMPANYSCHEMA) or substringof('stg',COMPANYSCHEMA) or substringof('HANAPM',COMPANYSCHEMA) or substringof('hanapm',COMPANYSCHEMA)) and COMPANYSCHEMA ne '' and COMPANYID ne 'PAYNGPPRL' and COMPANYID ne 'USBASEIAS22V1' and COMPANYID ne 'SAPSDCHXM0001' and COMPANYID ne 'PAYNGPPRLE' and COMPANY ne '' and COMPANY ne 'SAP SF Cloud Engineering' and TIME_STAMP ge datetime'" +
						fromCompDate + "' and TIME_STAMP le datetime'" + toCompDate + "'";
					}else if(deployKey=="CUST"){
						var url =
						"/UpgradeCenterResult?$select=UPGRADE_ELEMENT,COMPANY,RESULT,COMPANYSCHEMA,TIME_STAMP&$orderby=TIME_STAMP desc&$filter=(substringof('sfv4',COMPANYSCHEMA) or substringof('SFV4',COMPANYSCHEMA) or substringof('STOCKPM',COMPANYSCHEMA) or substringof('GLOBUSER_DVLHCM20S',COMPANYSCHEMA) or substringof('globuser_dvlhcm20s',COMPANYSCHEMA) or substringof('stockpm',COMPANYSCHEMA) or substringof('GLOBUSER_DVLHCM20S',COMPANYSCHEMA) or substringof('globuser_dvlhcm20s',COMPANYSCHEMA)   or substringof('DC',COMPANYSCHEMA) or substringof('dc',COMPANYSCHEMA) or substringof('STG',COMPANYSCHEMA) or substringof('stg',COMPANYSCHEMA) or substringof('HANAPM',COMPANYSCHEMA) or substringof('hanapm',COMPANYSCHEMA)) and substringof('_',UPGRADE_ELEMENT)  and COMPANYSCHEMA ne '' and COMPANYID ne 'PAYNGPPRL' and COMPANYID ne 'USBASEIAS22V1' and COMPANYID ne 'SAPSDCHXM0001' and COMPANYID ne 'PAYNGPPRLE' and COMPANY ne '' and COMPANY ne 'SAP SF Cloud Engineering' and TIME_STAMP ge datetime'" +
						fromCompDate + "' and TIME_STAMP le datetime'" + toCompDate + "'";
					}else{
						var url =
						"/UpgradeCenterResult?$select=UPGRADE_ELEMENT,COMPANY,RESULT,COMPANYSCHEMA,TIME_STAMP&$orderby=TIME_STAMP desc&$filter=(substringof('sfv4',COMPANYSCHEMA) or substringof('SFV4',COMPANYSCHEMA) or substringof('STOCKPM',COMPANYSCHEMA) or substringof('GLOBUSER_DVLHCM20S',COMPANYSCHEMA) or substringof('globuser_dvlhcm20s',COMPANYSCHEMA) or substringof('stockpm',COMPANYSCHEMA) or substringof('GLOBUSER_DVLHCM20S',COMPANYSCHEMA) or substringof('globuser_dvlhcm20s',COMPANYSCHEMA)   or substringof('DC',COMPANYSCHEMA) or substringof('dc',COMPANYSCHEMA) or substringof('STG',COMPANYSCHEMA) or substringof('stg',COMPANYSCHEMA) or substringof('HANAPM',COMPANYSCHEMA) or substringof('hanapm',COMPANYSCHEMA)) and indexof(UPGRADE_ELEMENT,'_') eq -1  and COMPANYSCHEMA ne '' and COMPANYID ne 'PAYNGPPRL' and COMPANYID ne 'USBASEIAS22V1' and COMPANYID ne 'SAPSDCHXM0001' and COMPANYID ne 'PAYNGPPRLE' and COMPANY ne '' and COMPANY ne 'SAP SF Cloud Engineering' and TIME_STAMP ge datetime'" +
						fromCompDate + "' and TIME_STAMP le datetime'" + toCompDate + "'";
					}
					
				}
			} else {
				if (para != "") {
					if(deployKey=="All"){
						var url =
						"/UpgradeCenterResult?$select=UPGRADE_ELEMENT,COMPANY,RESULT,COMPANYSCHEMA,TIME_STAMP&$orderby=TIME_STAMP desc&$filter=(substringof('sfv4',COMPANYSCHEMA) or substringof('SFV4',COMPANYSCHEMA) or substringof('STOCKPM',COMPANYSCHEMA) or substringof('GLOBUSER_DVLHCM20S',COMPANYSCHEMA) or substringof('globuser_dvlhcm20s',COMPANYSCHEMA) or substringof('stockpm',COMPANYSCHEMA) or substringof('GLOBUSER_DVLHCM20S',COMPANYSCHEMA) or substringof('globuser_dvlhcm20s',COMPANYSCHEMA)   or substringof('DC',COMPANYSCHEMA) or substringof('dc',COMPANYSCHEMA) or substringof('STG',COMPANYSCHEMA) or substringof('stg',COMPANYSCHEMA) or substringof('HANAPM',COMPANYSCHEMA) or substringof('hanapm',COMPANYSCHEMA)) and COMPANYSCHEMA ne '' and COMPANYID ne 'PAYNGPPRL' and COMPANYID ne 'USBASEIAS22V1' and COMPANYID ne 'SAPSDCHXM0001' and COMPANYID ne 'PAYNGPPRLE' and COMPANY ne '' and COMPANY ne 'SAP SF Cloud Engineering' and FILEVERSION eq '" +
						para + "' and TIME_STAMP ge datetime'" + fromCompDate + "' and TIME_STAMP le datetime'" + toCompDate + "' and " + fillBP;
					}else if(deployKey=="CUST"){
						var url =
						"/UpgradeCenterResult?$select=UPGRADE_ELEMENT,COMPANY,RESULT,COMPANYSCHEMA,TIME_STAMP&$orderby=TIME_STAMP desc&$filter=(substringof('sfv4',COMPANYSCHEMA) or substringof('SFV4',COMPANYSCHEMA) or substringof('STOCKPM',COMPANYSCHEMA) or substringof('GLOBUSER_DVLHCM20S',COMPANYSCHEMA) or substringof('globuser_dvlhcm20s',COMPANYSCHEMA) or substringof('stockpm',COMPANYSCHEMA) or substringof('GLOBUSER_DVLHCM20S',COMPANYSCHEMA) or substringof('globuser_dvlhcm20s',COMPANYSCHEMA)   or substringof('DC',COMPANYSCHEMA) or substringof('dc',COMPANYSCHEMA) or substringof('STG',COMPANYSCHEMA) or substringof('stg',COMPANYSCHEMA) or substringof('HANAPM',COMPANYSCHEMA) or substringof('hanapm',COMPANYSCHEMA)) and substringof('_',UPGRADE_ELEMENT)  and COMPANYSCHEMA ne '' and COMPANYID ne 'PAYNGPPRL' and COMPANYID ne 'USBASEIAS22V1' and COMPANYID ne 'SAPSDCHXM0001' and COMPANYID ne 'PAYNGPPRLE' and COMPANY ne '' and COMPANY ne 'SAP SF Cloud Engineering' and FILEVERSION eq '" +
						para + "' and TIME_STAMP ge datetime'" + fromCompDate + "' and TIME_STAMP le datetime'" + toCompDate + "' and " + fillBP;
					}else{
						var url =
						"/UpgradeCenterResult?$select=UPGRADE_ELEMENT,COMPANY,RESULT,COMPANYSCHEMA,TIME_STAMP&$orderby=TIME_STAMP desc&$filter=(substringof('sfv4',COMPANYSCHEMA) or substringof('SFV4',COMPANYSCHEMA) or substringof('STOCKPM',COMPANYSCHEMA) or substringof('GLOBUSER_DVLHCM20S',COMPANYSCHEMA) or substringof('globuser_dvlhcm20s',COMPANYSCHEMA) or substringof('stockpm',COMPANYSCHEMA) or substringof('GLOBUSER_DVLHCM20S',COMPANYSCHEMA) or substringof('globuser_dvlhcm20s',COMPANYSCHEMA)   or substringof('DC',COMPANYSCHEMA) or substringof('dc',COMPANYSCHEMA) or substringof('STG',COMPANYSCHEMA) or substringof('stg',COMPANYSCHEMA) or substringof('HANAPM',COMPANYSCHEMA) or substringof('hanapm',COMPANYSCHEMA)) and indexof(UPGRADE_ELEMENT,'_') eq -1  and COMPANYSCHEMA ne '' and COMPANYID ne 'PAYNGPPRL' and COMPANYID ne 'USBASEIAS22V1' and COMPANYID ne 'SAPSDCHXM0001' and COMPANYID ne 'PAYNGPPRLE' and COMPANY ne '' and COMPANY ne 'SAP SF Cloud Engineering' and FILEVERSION eq '" +
						para + "' and TIME_STAMP ge datetime'" + fromCompDate + "' and TIME_STAMP le datetime'" + toCompDate + "' and " + fillBP;
					}
					
				} else {
					if(deployKey=="All"){
						var url =
						"/UpgradeCenterResult?$select=UPGRADE_ELEMENT,COMPANY,RESULT,COMPANYSCHEMA,TIME_STAMP&$orderby=TIME_STAMP desc&$filter=(substringof('sfv4',COMPANYSCHEMA) or substringof('SFV4',COMPANYSCHEMA) or substringof('STOCKPM',COMPANYSCHEMA) or substringof('GLOBUSER_DVLHCM20S',COMPANYSCHEMA) or substringof('globuser_dvlhcm20s',COMPANYSCHEMA) or substringof('stockpm',COMPANYSCHEMA) or substringof('GLOBUSER_DVLHCM20S',COMPANYSCHEMA) or substringof('globuser_dvlhcm20s',COMPANYSCHEMA)   or substringof('DC',COMPANYSCHEMA) or substringof('dc',COMPANYSCHEMA) or substringof('STG',COMPANYSCHEMA) or substringof('stg',COMPANYSCHEMA) or substringof('HANAPM',COMPANYSCHEMA) or substringof('hanapm',COMPANYSCHEMA)) and COMPANYSCHEMA ne '' and COMPANYID ne 'PAYNGPPRL' and COMPANYID ne 'USBASEIAS22V1' and COMPANYID ne 'SAPSDCHXM0001' and COMPANYID ne 'PAYNGPPRLE' and COMPANY ne '' and COMPANY ne 'SAP SF Cloud Engineering' and TIME_STAMP ge datetime'" +
						fromCompDate + "' and TIME_STAMP le datetime'" + toCompDate + "' and " + fillBP;
					}else if(deployKey=="CUST"){
						var url =
						"/UpgradeCenterResult?$select=UPGRADE_ELEMENT,COMPANY,RESULT,COMPANYSCHEMA,TIME_STAMP&$orderby=TIME_STAMP desc&$filter=(substringof('sfv4',COMPANYSCHEMA) or substringof('SFV4',COMPANYSCHEMA) or substringof('STOCKPM',COMPANYSCHEMA) or substringof('GLOBUSER_DVLHCM20S',COMPANYSCHEMA) or substringof('globuser_dvlhcm20s',COMPANYSCHEMA) or substringof('stockpm',COMPANYSCHEMA) or substringof('GLOBUSER_DVLHCM20S',COMPANYSCHEMA) or substringof('globuser_dvlhcm20s',COMPANYSCHEMA)   or substringof('DC',COMPANYSCHEMA) or substringof('dc',COMPANYSCHEMA) or substringof('STG',COMPANYSCHEMA) or substringof('stg',COMPANYSCHEMA) or substringof('HANAPM',COMPANYSCHEMA) or substringof('hanapm',COMPANYSCHEMA)) and substringof('_',UPGRADE_ELEMENT)  and COMPANYSCHEMA ne '' and COMPANYID ne 'PAYNGPPRL' and COMPANYID ne 'USBASEIAS22V1' and COMPANYID ne 'SAPSDCHXM0001' and COMPANYID ne 'PAYNGPPRLE' and COMPANY ne '' and COMPANY ne 'SAP SF Cloud Engineering' and TIME_STAMP ge datetime'" +
						fromCompDate + "' and TIME_STAMP le datetime'" + toCompDate + "' and " + fillBP;
					}else{
						var url =
						"/UpgradeCenterResult?$select=UPGRADE_ELEMENT,COMPANY,RESULT,COMPANYSCHEMA,TIME_STAMP&$orderby=TIME_STAMP desc&$filter=(substringof('sfv4',COMPANYSCHEMA) or substringof('SFV4',COMPANYSCHEMA) or substringof('STOCKPM',COMPANYSCHEMA) or substringof('GLOBUSER_DVLHCM20S',COMPANYSCHEMA) or substringof('globuser_dvlhcm20s',COMPANYSCHEMA) or substringof('stockpm',COMPANYSCHEMA) or substringof('GLOBUSER_DVLHCM20S',COMPANYSCHEMA) or substringof('globuser_dvlhcm20s',COMPANYSCHEMA)   or substringof('DC',COMPANYSCHEMA) or substringof('dc',COMPANYSCHEMA) or substringof('STG',COMPANYSCHEMA) or substringof('stg',COMPANYSCHEMA) or substringof('HANAPM',COMPANYSCHEMA) or substringof('hanapm',COMPANYSCHEMA)) and indexof(UPGRADE_ELEMENT,'_') eq -1  and COMPANYSCHEMA ne '' and COMPANYID ne 'PAYNGPPRL' and COMPANYID ne 'USBASEIAS22V1' and COMPANYID ne 'SAPSDCHXM0001' and COMPANYID ne 'PAYNGPPRLE' and COMPANY ne '' and COMPANY ne 'SAP SF Cloud Engineering' and TIME_STAMP ge datetime'" +
						fromCompDate + "' and TIME_STAMP le datetime'" + toCompDate + "' and " + fillBP;
					}
					
				}
			}

			mdl.read(
				url,
				null, null, true,
				function(oData, oResponse) {
					if(oData.results.length>0){
						
						tempODATAPreCheck = oData.results;
						for (var q = 0; q < tempODATAPreCheck.length; q++) {
							
							
							// if(me.getView().byId("ddlProd").getSelectedKey()=="All"){
							// 	tempODATAPreCheckFilter.push(tempODATAPreCheck[q]);
							// } else if(me.getView().byId("ddlProd").getSelectedKey()=="RM"){
							// 	for(var a2=0;a2<oModelUpgradeRecruitData.length;a2++){
							// 		if(tempODATAPreCheck[q].UPGRADE_ELEMENT==oModelUpgradeRecruitData[a2].UPGRADE_ELEMENT){
							// 			if(oModelUpgradeRecruitData[a2].PRODUCT=="Recruiting"){
							// 				tempODATAPreCheckFilter.push(tempODATAPreCheck[q]);
							// 				break;	
							// 			}
							// 		}
							// 	}
							// }  else if(me.getView().byId("ddlProd").getSelectedKey()=="SM"){
							// 	for(var a2=0;a2<oModelUpgradeRecruitData.length;a2++){
							// 		if(tempODATAPreCheck[q].UPGRADE_ELEMENT==oModelUpgradeRecruitData[a2].UPGRADE_ELEMENT){
							// 			if(oModelUpgradeRecruitData[a2].PRODUCT=="Succession Management"){
							// 				tempODATAPreCheckFilter.push(tempODATAPreCheck[q]);
							// 				break;
							// 			}
							// 		}
							// 	}
							// }  else if(me.getView().byId("ddlProd").getSelectedKey()=="PG"){
							// 	for(var a2=0;a2<oModelUpgradeRecruitData.length;a2++){
							// 		if(tempODATAPreCheck[q].UPGRADE_ELEMENT==oModelUpgradeRecruitData[a2].UPGRADE_ELEMENT){
							// 			if(oModelUpgradeRecruitData[a2].PRODUCT=="Performance and Goals"){
							// 				tempODATAPreCheckFilter.push(tempODATAPreCheck[q]);
							// 				break;
							// 			}
							// 		}
							// 	}
							// } else if(me.getView().byId("ddlProd").getSelectedKey()=="CO"){
							// 	for(var a2=0;a2<oModelUpgradeRecruitData.length;a2++){
							// 		if(tempODATAPreCheck[q].UPGRADE_ELEMENT==oModelUpgradeRecruitData[a2].UPGRADE_ELEMENT){
							// 			if(oModelUpgradeRecruitData[a2].PRODUCT=="Compensation"){
							// 				tempODATAPreCheckFilter.push(tempODATAPreCheck[q]);
							// 				break;
							// 			}
							// 		}
							// 	}
							// }else if(me.getView().byId("ddlProd").getSelectedKey()=="ON"){
							// 	for(var a2=0;a2<oModelUpgradeRecruitData.length;a2++){
							// 		if(tempODATAPreCheck[q].UPGRADE_ELEMENT==oModelUpgradeRecruitData[a2].UPGRADE_ELEMENT){
							// 			if(oModelUpgradeRecruitData[a2].PRODUCT=="Onboarding"){
							// 				tempODATAPreCheckFilter.push(tempODATAPreCheck[q]);
							// 				break;
							// 			}
							// 		}
							// 	}
							// }else if(me.getView().byId("ddlProd").getSelectedKey()=="EC"){
							// 	for(var a2=0; a2<oModelUpgradeRecruitData.length; a2++){
							// 		if(tempODATAPreCheck[q].UPGRADE_ELEMENT!=oModelUpgradeRecruitData[a2].UPGRADE_ELEMENT){
							// 			tempODATAPreCheckFilter.push(tempODATAPreCheck[q]);
							// 			break;
							// 		}
									
							// 	}
							// }
							
							var majorBlk = tempODATAPreCheck[q].UPGRADE_ELEMENT.split("_");
							var lastItem = majorBlk[majorBlk.length-1];
							// if(lastItem.length!=32){
							
							if(me.getView().byId("ddlProd").getSelectedKey()=="All"){
							
								
									tempODATAPreCheckFilter.push(tempODATAPreCheck[q]);
								}  else if(me.getView().byId("ddlProd").getSelectedKey()=="RM"){
			
									for(var a2=0;a2<datatempoModelUpgradeRecruitREC.length;a2++){
										
										if(tempODATAPreCheck[q].UPGRADE_ELEMENT.indexOf("_")==-1){
											
										
											if(tempODATAPreCheck[q].UPGRADE_ELEMENT==datatempoModelUpgradeRecruitREC[a2].UPGRADE_ELEMENT){
													// if(datatempoModelUpgradeRecruitREC[a2].PRODUCT=="Recruiting"){
														tempODATAPreCheckFilter.push(tempODATAPreCheck[q]);
														break;	
													// }
												}
											
										}else{
											var majorBlk = tempODATAPreCheck[q].UPGRADE_ELEMENT.split("_");
											var lastItem = majorBlk[majorBlk.length-1];
											if(lastItem.length==32){
												majorBlk.pop();
												var CompmajorBlk = majorBlk.join("_");
												if(CompmajorBlk==datatempoModelUpgradeRecruitREC[a2].UPGRADE_ELEMENT){
													// if(datatempoModelUpgradeRecruitREC[a2].PRODUCT=="Recruiting"){
														tempODATAPreCheckFilter.push(tempODATAPreCheck[q]);
														break;	
													// }
												}
											}else{
												majorBlk.pop();
												majorBlk.pop();
												var CompmajorBlk = majorBlk.join("_");
												if(CompmajorBlk==datatempoModelUpgradeRecruitREC[a2].UPGRADE_ELEMENT){
													// if(datatempoModelUpgradeRecruitREC[a2].PRODUCT=="Recruiting"){
														tempODATAPreCheckFilter.push(tempODATAPreCheck[q]);
														break;	
													// }
												}
											}
										}
										
										
										
										
										
									}
								}  else if(me.getView().byId("ddlProd").getSelectedKey()=="SM"){
									for(var a2=0;a2<datatempoModelUpgradeRecruitSM.length;a2++){
										
			// 							
										
										
											if(tempODATAPreCheck[q].UPGRADE_ELEMENT.indexOf("_")==-1){
												
										
											if(tempODATAPreCheck[q].UPGRADE_ELEMENT==datatempoModelUpgradeRecruitSM[a2].UPGRADE_ELEMENT){
													// if(oModelUpgradeRecruitData[a2].PRODUCT=="Succession Management"){
														tempODATAPreCheckFilter.push(tempODATAPreCheck[q]);
														break;	
													// }
												}
											
										}else{
											var majorBlk = tempODATAPreCheck[q].UPGRADE_ELEMENT.split("_");
											var lastItem = majorBlk[majorBlk.length-1];
											if(lastItem.length==32){
												majorBlk.pop();
												var CompmajorBlk = majorBlk.join("_");
												if(CompmajorBlk==datatempoModelUpgradeRecruitSM[a2].UPGRADE_ELEMENT){
													// if(oModelUpgradeRecruitData[a2].PRODUCT=="Succession Management"){
														tempODATAPreCheckFilter.push(tempODATAPreCheck[q]);
														break;	
													// }
												}
											}else{
												majorBlk.pop();
												majorBlk.pop();
												var CompmajorBlk = majorBlk.join("_");
												if(CompmajorBlk==datatempoModelUpgradeRecruitSM[a2].UPGRADE_ELEMENT){
													// if(oModelUpgradeRecruitData[a2].PRODUCT=="Succession Management"){
														tempODATAPreCheckFilter.push(tempODATAPreCheck[q]);
														break;	
													// }
												}
											}
										}
										
										
										
										
									}
								}  else if(me.getView().byId("ddlProd").getSelectedKey()=="PG"){
									for(var a2=0;a2<datatempoModelUpgradeRecruitPG.length;a2++){
										
										
									
										
										
										if(tempODATAPreCheck[q].UPGRADE_ELEMENT.indexOf("_")==-1){
										
												if(tempODATAPreCheck[q].UPGRADE_ELEMENT==datatempoModelUpgradeRecruitPG[a2].UPGRADE_ELEMENT){
													// if(oModelUpgradeRecruitData[a2].PRODUCT=="Performance and Goals"){
														tempODATAPreCheckFilter.push(tempODATAPreCheck[q]);
														break;	
													// }
												}
											
										}else{
											var majorBlk = tempODATAPreCheck[q].UPGRADE_ELEMENT.split("_");
											var lastItem = majorBlk[majorBlk.length-1];
											if(lastItem.length==32){
												majorBlk.pop();
												var CompmajorBlk = majorBlk.join("_");
												if(CompmajorBlk==datatempoModelUpgradeRecruitPG[a2].UPGRADE_ELEMENT){
													// if(oModelUpgradeRecruitData[a2].PRODUCT=="Performance and Goals"){
														tempODATAPreCheckFilter.push(tempODATAPreCheck[q]);
														break;	
													// }
												}
											}else{
												majorBlk.pop();
												majorBlk.pop();
												var CompmajorBlk = majorBlk.join("_");
												if(CompmajorBlk==datatempoModelUpgradeRecruitPG[a2].UPGRADE_ELEMENT){
													// if(oModelUpgradeRecruitData[a2].PRODUCT=="Performance and Goals"){
														tempODATAPreCheckFilter.push(tempODATAPreCheck[q]);
														break;	
													// }
												}
											}
										}
										
										
										
										
									}
								}  else if(me.getView().byId("ddlProd").getSelectedKey()=="CO"){
									for(var a2=0;a2<datatempoModelUpgradeRecruitCO.length;a2++){
										
									
			
										if(tempODATAPreCheck[q].UPGRADE_ELEMENT.indexOf("_")==-1){
											
										if(tempODATAPreCheck[q].UPGRADE_ELEMENT==datatempoModelUpgradeRecruitCO[a2].UPGRADE_ELEMENT){
											// if(oModelUpgradeRecruitData[a2].PRODUCT=="Compensation"){
												tempODATAPreCheckFilter.push(tempODATAPreCheck[q]);
												break;
											
											// }
											}
										
										}else{
											var majorBlk = tempODATAPreCheck[q].UPGRADE_ELEMENT.split("_");
											var lastItem = majorBlk[majorBlk.length-1];
											if(lastItem.length==32){
												majorBlk.pop();
												var CompmajorBlk = majorBlk.join("_");
												if(CompmajorBlk==datatempoModelUpgradeRecruitCO[a2].UPGRADE_ELEMENT){
													// if(oModelUpgradeRecruitData[a2].PRODUCT=="Compensation"){
														tempODATAPreCheckFilter.push(tempODATAPreCheck[q]);
														break;	
													// }
												}
											}else{
												majorBlk.pop();
												majorBlk.pop();
												var CompmajorBlk = majorBlk.join("_");
												if(CompmajorBlk==datatempoModelUpgradeRecruitCO[a2].UPGRADE_ELEMENT){
													// if(oModelUpgradeRecruitData[a2].PRODUCT=="Compensation"){
														tempODATAPreCheckFilter.push(tempODATAPreCheck[q]);
														break;	
													// }
												}
											}
										}
										
										
										
										
									}
								}  else if(me.getView().byId("ddlProd").getSelectedKey()=="ON"){
									for(var a2=0;a2<datatempoModelUpgradeRecruitON.length;a2++){
										
									
										
			
										if(tempODATAPreCheck[q].UPGRADE_ELEMENT.indexOf("_")==-1){
											
											if(tempODATAPreCheck[q].UPGRADE_ELEMENT==datatempoModelUpgradeRecruitON[a2].UPGRADE_ELEMENT){
											// if(oModelUpgradeRecruitData[a2].PRODUCT=="Onboarding" || oModelUpgradeRecruitData[a2].PRODUCT=="Onboarding 2.0"){
												tempODATAPreCheckFilter.push(tempODATAPreCheck[q]);
												break;
											// }
										}
										
											
										}else{
											var majorBlk = tempODATAPreCheck[q].UPGRADE_ELEMENT.split("_");
											var lastItem = majorBlk[majorBlk.length-1];
											if(lastItem.length==32){
												majorBlk.pop();
												var CompmajorBlk = majorBlk.join("_");
												if(CompmajorBlk==datatempoModelUpgradeRecruitON[a2].UPGRADE_ELEMENT){
													// if(oModelUpgradeRecruitData[a2].PRODUCT=="Onboarding" || oModelUpgradeRecruitData[a2].PRODUCT=="Onboarding 2.0"){
														tempODATAPreCheckFilter.push(tempODATAPreCheck[q]);
														break;	
													// }
												}
											}else{
												majorBlk.pop();
												majorBlk.pop();
												var CompmajorBlk = majorBlk.join("_");
												if(CompmajorBlk==datatempoModelUpgradeRecruitON[a2].UPGRADE_ELEMENT){
													// if(oModelUpgradeRecruitData[a2].PRODUCT=="Onboarding" || oModelUpgradeRecruitData[a2].PRODUCT=="Onboarding 2.0"){
														tempODATAPreCheckFilter.push(tempODATAPreCheck[q]);
														break;	
													// }
												}
											}
										}
										
										
										
									}
								}  else if(me.getView().byId("ddlProd").getSelectedKey()=="EC"){
									for(var a2=0; a2<datatempoModelUpgradeRecruitEC.length; a2++){
										
									// var datatempoModelUpgradeRecruitON = sap.ui.getCore().getModel("oModelUpgradeRecruitON").getData();
			// var datatempoModelUpgradeRecruitREC = sap.ui.getCore().getModel("oModelUpgradeRecruitREC").getData();
			// var datatempoModelUpgradeRecruitSM = sap.ui.getCore().getModel("oModelUpgradeRecruitSM").getData();
			// var datatempoModelUpgradeRecruitPG = sap.ui.getCore().getModel("oModelUpgradeRecruitPG").getData();
			// var datatempoModelUpgradeRecruitCO = sap.ui.getCore().getModel("oModelUpgradeRecruitCO").getData();
			// var datatempoModelUpgradeRecruitEC = sap.ui.getCore().getModel("oModelUpgradeRecruitEC").getData();
										
										
										if(tempODATAPreCheck[q].UPGRADE_ELEMENT.indexOf("_")==-1){
											
										
												if(tempODATAPreCheck[q].UPGRADE_ELEMENT==datatempoModelUpgradeRecruitEC[a2].UPGRADE_ELEMENT){
													// if(oModelUpgradeRecruitData[a2].PRODUCT=="Employee Central"){
														tempODATAPreCheckFilter.push(tempODATAPreCheck[q]);
														break;	
													// }
												}
											
										 
											
										}else{
											var majorBlk = tempODATAPreCheck[q].UPGRADE_ELEMENT.split("_");
											var lastItem = majorBlk[majorBlk.length-1];
											if(lastItem.length==32){
												majorBlk.pop();
												var CompmajorBlk = majorBlk.join("_");
												if(CompmajorBlk==datatempoModelUpgradeRecruitEC[a2].UPGRADE_ELEMENT){
													// if(datatempoModelUpgradeRecruitEC[a2].PRODUCT=="Employee Central"){
														tempODATAPreCheckFilter.push(tempODATAPreCheck[q]);
														break;	
													// }
												}
											}else{
												majorBlk.pop();
												majorBlk.pop();
												var CompmajorBlk = majorBlk.join("_");
												if(CompmajorBlk==datatempoModelUpgradeRecruitEC[a2].UPGRADE_ELEMENT){
													// if(oModelUpgradeRecruitData[a2].PRODUCT=="Employee Central"){
														tempODATAPreCheckFilter.push(tempODATAPreCheck[q]);
														break;	
													// }
												}
											}
										}
									}
								}
								
							// }
						}
						
						if (tempODATAPreCheckFilter.length > 0) {
							for (var w = 0; w < tempODATAPreCheckFilter.length; w++) {
								// if(tempODATAPreCheckFilter[w].COMPANY=="CRUZ ROJA ESPAÑOLA"){
								// 	tempODATAPreCheckFilter[w].COMPANY="CRUZ ROJA ESPAÑOLA DESARROLLO";
								// }
								// if(tempODATAPreCheckFilter[w].COMPANY=="Release"){
								// 	tempODATAPreCheckFilter[w].COMPANY="Stericycle Inc (de)";
								// }
								if(tempODATAPreCheckFilter[w].COMPANY!="BPMCINSTANCE4" && tempODATAPreCheckFilter[w].COMPANY!="BPMCINSTANCE1"){
									if (tempODATAPreCheckFilter[w].COMPANYSCHEMA != null && tempODATAPreCheckFilter[w].COMPANYSCHEMA.toLowerCase().indexOf("sfsales")==-1) {
										// if (tempODATAPreCheckFilter[w].COMPANYSCHEMA.toLowerCase().indexOf("sfv4") > -1 || tempODATAPreCheckFilter[w].COMPANYSCHEMA.toLowerCase().indexOf("hanapm") > -1 || tempODATAPreCheckFilter[w].COMPANYSCHEMA.toLowerCase().indexOf(
										// 		"stg") > -1 || tempODATAPreCheckFilter[w].COMPANYSCHEMA.toLowerCase().indexOf("dc") > -1 || tempODATAPreCheckFilter[w].COMPANYSCHEMA.toLowerCase().indexOf("stockpm172200_ref2") > -1) {
											if (tempODATAPreCheckFilter[w].RESULT == "true") {
												tempDateResultTrue.push({
													cmpny: tempODATAPreCheckFilter[w].RESULT
												});
											} else if (tempODATAPreCheckFilter[w].RESULT == "false") {
												tempDateResultFalse.push({
													cmpny: tempODATAPreCheckFilter[w].RESULT
												});
											}
										// }
									}
								}
							}
	
							totalRecords = tempDateResultTrue.length + tempDateResultFalse.length;
							percent = ((tempDateResultTrue.length / totalRecords) * 100).toFixed(1);
							
							if(sap.ui.getCore().byId("radialMicroChartUpgrade")==undefined){
								var chartRadial = new sap.suite.ui.microchart.RadialMicroChart("radialMicroChartUpgrade",{
								});
								me.getView().byId("tc").setContent(chartRadial);	
							}
							
							
							if (parseFloat(percent) >= 50) {
								sap.ui.getCore().byId("radialMicroChartUpgrade").setValueColor("Good");
								// me.getView().byId("radialMicroChartUpgrade").setValueColor("Good");
							} else {
								sap.ui.getCore().byId("radialMicroChartUpgrade").setValueColor("Error");
								// me.getView().byId("radialMicroChartUpgrade").setValueColor("Error");
							}
							sap.ui.getCore().byId("radialMicroChartUpgrade").setPercentage(parseFloat(percent));
							// me.getView().byId("radialMicroChartUpgrade").setPercentage(parseFloat(percent));
	
							me.getView().byId("noSuccessValSub").setValue(parseFloat(tempDateResultTrue.length));
							me.getView().byId("noFailValSub").setValue(parseFloat(tempDateResultFalse.length));
							me.getView().byId("noUpgradeValSub").setValue(parseFloat(tempDateResultFalse.length + tempDateResultTrue.length));
	
							me.getView().byId("noSuccessValSub").setDisplayValue((tempDateResultTrue.length).toString());
							me.getView().byId("noFailValSub").setDisplayValue((tempDateResultFalse.length).toString());
							me.getView().byId("noUpgradeValSub").setDisplayValue((tempDateResultFalse.length + tempDateResultTrue.length).toString());
	
						}
					}else{
							sap.ui.getCore().byId("radialMicroChartUpgrade").setPercentage(0);
	
							me.getView().byId("noSuccessValSub").setValue(0);
							me.getView().byId("noFailValSub").setValue(0);
							me.getView().byId("noUpgradeValSub").setValue(0);
	
							me.getView().byId("noSuccessValSub").setDisplayValue("");
							me.getView().byId("noFailValSub").setDisplayValue("");
							me.getView().byId("noUpgradeValSub").setDisplayValue("");
					}
				},
				function(oError) {
					console.log("Error 127");
				});
		},
		
		CallCustomerData: function(mdl, para, fromCompDate, toCompDate, fillBP) {
			var me = this;
			var tempPermission = [];
			var tempDataMdl = [];
			var tempPreData = [];
			var tempNoErrorData = [];
			var tempNoData = [];
			var tempODATAPreCheck = [];
			var tempODATAPreCheckFilter = [];
			// var oModelUpgradeRecruitData = sap.ui.getCore().getModel("oModelUpgradeRecruit").getData();
			var datatempoModelUpgradeRecruitON = sap.ui.getCore().getModel("oModelUpgradeRecruitON").getData();
			var datatempoModelUpgradeRecruitREC = sap.ui.getCore().getModel("oModelUpgradeRecruitREC").getData();
			var datatempoModelUpgradeRecruitSM = sap.ui.getCore().getModel("oModelUpgradeRecruitSM").getData();
			var datatempoModelUpgradeRecruitPG = sap.ui.getCore().getModel("oModelUpgradeRecruitPG").getData();
			var datatempoModelUpgradeRecruitCO = sap.ui.getCore().getModel("oModelUpgradeRecruitCO").getData();
			var datatempoModelUpgradeRecruitEC = sap.ui.getCore().getModel("oModelUpgradeRecruitEC").getData();
			
			
			var chkUP = [];
			
			let sURL = this.getOwnerComponent().getManifestObject().resolveUri("sap/sfsf_repo/service/errorDetails.xsodata/");
			var ODataModelError = new sap.ui.model.odata.ODataModel(sURL, true); // Changes made on 16/03/2017 and on 16/03/2018
			ODataModelError.setDefaultCountMode(false);
			ODataModelError.setDefaultBindingMode(sap.ui.model.BindingMode.TwoWay);
			// this.getView().setModel(ODataModel);
			var mdl = ODataModelError;
			var deployKey = me.getView().byId("ddlDeploy").getSelectedKey();
			
			if(fillBP==""){
				if (para != "") {
					if(deployKey=="All"){
						var url =
						"/UC_STAT?$select=UC_ERROR_USAGE,COMPANYID,USER,MIGRATION,LOG,EMAIL,FILEVERSION,UPGRADE_ELEMENT,RESULT,COMPANYSCHEMA,COMPANY,TIME_STAMP&$expand=UC_ERROR_USAGE&$orderby=TIME_STAMP desc&$filter=(substringof('sfv4',COMPANYSCHEMA) or substringof('SFV4',COMPANYSCHEMA) or substringof('STOCKPM',COMPANYSCHEMA) or substringof('GLOBUSER_DVLHCM20S',COMPANYSCHEMA) or substringof('globuser_dvlhcm20s',COMPANYSCHEMA) or substringof('stockpm',COMPANYSCHEMA) or substringof('GLOBUSER_DVLHCM20S',COMPANYSCHEMA) or substringof('globuser_dvlhcm20s',COMPANYSCHEMA)   or substringof('DC',COMPANYSCHEMA) or substringof('dc',COMPANYSCHEMA) or substringof('STG',COMPANYSCHEMA) or substringof('stg',COMPANYSCHEMA) or substringof('HANAPM',COMPANYSCHEMA) or substringof('hanapm',COMPANYSCHEMA)) and COMPANYSCHEMA ne '' and COMPANYID ne 'PAYNGPPRL' and COMPANYID ne 'USBASEIAS22V1' and COMPANYID ne 'SAPSDCHXM0001' and COMPANYID ne 'PAYNGPPRLE' and COMPANY ne '' and COMPANY ne 'SAP SF Cloud Engineering' and FILEVERSION eq '" +
						para + "' and TIME_STAMP ge datetime'"+fromCompDate+"' and TIME_STAMP le datetime'"+toCompDate+"'";
					}else if(deployKey=="CUST"){
						var url =
						"/UC_STAT?$select=UC_ERROR_USAGE,COMPANYID,USER,MIGRATION,LOG,EMAIL,FILEVERSION,UPGRADE_ELEMENT,RESULT,COMPANYSCHEMA,COMPANY,TIME_STAMP&$expand=UC_ERROR_USAGE&$orderby=TIME_STAMP desc&$filter=(substringof('sfv4',COMPANYSCHEMA) or substringof('SFV4',COMPANYSCHEMA) or substringof('STOCKPM',COMPANYSCHEMA) or substringof('GLOBUSER_DVLHCM20S',COMPANYSCHEMA) or substringof('globuser_dvlhcm20s',COMPANYSCHEMA) or substringof('stockpm',COMPANYSCHEMA) or substringof('GLOBUSER_DVLHCM20S',COMPANYSCHEMA) or substringof('globuser_dvlhcm20s',COMPANYSCHEMA)   or substringof('DC',COMPANYSCHEMA) or substringof('dc',COMPANYSCHEMA) or substringof('STG',COMPANYSCHEMA) or substringof('stg',COMPANYSCHEMA) or substringof('HANAPM',COMPANYSCHEMA) or substringof('hanapm',COMPANYSCHEMA)) and substringof('_',UPGRADE_ELEMENT) and COMPANYSCHEMA ne '' and COMPANYID ne 'PAYNGPPRL' and COMPANYID ne 'USBASEIAS22V1' and COMPANYID ne 'SAPSDCHXM0001' and COMPANYID ne 'PAYNGPPRLE' and COMPANY ne '' and COMPANY ne 'SAP SF Cloud Engineering' and FILEVERSION eq '" +
						para + "' and TIME_STAMP ge datetime'"+fromCompDate+"' and TIME_STAMP le datetime'"+toCompDate+"'";
					}else{
						var url =
						"/UC_STAT?$select=UC_ERROR_USAGE,COMPANYID,USER,MIGRATION,LOG,EMAIL,FILEVERSION,UPGRADE_ELEMENT,RESULT,COMPANYSCHEMA,COMPANY,TIME_STAMP&$expand=UC_ERROR_USAGE&$orderby=TIME_STAMP desc&$filter=(substringof('sfv4',COMPANYSCHEMA) or substringof('SFV4',COMPANYSCHEMA) or substringof('STOCKPM',COMPANYSCHEMA) or substringof('GLOBUSER_DVLHCM20S',COMPANYSCHEMA) or substringof('globuser_dvlhcm20s',COMPANYSCHEMA) or substringof('stockpm',COMPANYSCHEMA) or substringof('GLOBUSER_DVLHCM20S',COMPANYSCHEMA) or substringof('globuser_dvlhcm20s',COMPANYSCHEMA)   or substringof('DC',COMPANYSCHEMA) or substringof('dc',COMPANYSCHEMA) or substringof('STG',COMPANYSCHEMA) or substringof('stg',COMPANYSCHEMA) or substringof('HANAPM',COMPANYSCHEMA) or substringof('hanapm',COMPANYSCHEMA)) and indexof(UPGRADE_ELEMENT,'_') eq -1 and COMPANYSCHEMA ne '' and COMPANYID ne 'PAYNGPPRL' and COMPANYID ne 'USBASEIAS22V1' and COMPANYID ne 'SAPSDCHXM0001' and COMPANYID ne 'PAYNGPPRLE' and COMPANY ne '' and COMPANY ne 'SAP SF Cloud Engineering' and FILEVERSION eq '" +
						para + "' and TIME_STAMP ge datetime'"+fromCompDate+"' and TIME_STAMP le datetime'"+toCompDate+"'";
					}
					
				} else {
					if(deployKey=="All"){
						var url =
						"/UC_STAT?$select=UC_ERROR_USAGE,COMPANYID,USER,MIGRATION,LOG,EMAIL,FILEVERSION,UPGRADE_ELEMENT,RESULT,COMPANYSCHEMA,COMPANY,TIME_STAMP&$expand=UC_ERROR_USAGE&$orderby=TIME_STAMP desc&$filter=(substringof('sfv4',COMPANYSCHEMA) or substringof('SFV4',COMPANYSCHEMA) or substringof('STOCKPM',COMPANYSCHEMA) or substringof('GLOBUSER_DVLHCM20S',COMPANYSCHEMA) or substringof('globuser_dvlhcm20s',COMPANYSCHEMA) or substringof('stockpm',COMPANYSCHEMA) or substringof('GLOBUSER_DVLHCM20S',COMPANYSCHEMA) or substringof('globuser_dvlhcm20s',COMPANYSCHEMA)   or substringof('DC',COMPANYSCHEMA) or substringof('dc',COMPANYSCHEMA) or substringof('STG',COMPANYSCHEMA) or substringof('stg',COMPANYSCHEMA) or substringof('HANAPM',COMPANYSCHEMA) or substringof('hanapm',COMPANYSCHEMA)) and COMPANYSCHEMA ne '' and COMPANYID ne 'PAYNGPPRL' and COMPANYID ne 'USBASEIAS22V1' and COMPANYID ne 'SAPSDCHXM0001' and COMPANYID ne 'PAYNGPPRLE' and COMPANY ne '' and COMPANY ne 'SAP SF Cloud Engineering' and TIME_STAMP ge datetime'"+fromCompDate+"' and TIME_STAMP le datetime'"+toCompDate+"'";
					}else if(deployKey=="CUST"){
						var url =
						"/UC_STAT?$select=UC_ERROR_USAGE,COMPANYID,USER,MIGRATION,LOG,EMAIL,FILEVERSION,UPGRADE_ELEMENT,RESULT,COMPANYSCHEMA,COMPANY,TIME_STAMP&$expand=UC_ERROR_USAGE&$orderby=TIME_STAMP desc&$filter=(substringof('sfv4',COMPANYSCHEMA) or substringof('SFV4',COMPANYSCHEMA) or substringof('STOCKPM',COMPANYSCHEMA) or substringof('GLOBUSER_DVLHCM20S',COMPANYSCHEMA) or substringof('globuser_dvlhcm20s',COMPANYSCHEMA) or substringof('stockpm',COMPANYSCHEMA) or substringof('GLOBUSER_DVLHCM20S',COMPANYSCHEMA) or substringof('globuser_dvlhcm20s',COMPANYSCHEMA)   or substringof('DC',COMPANYSCHEMA) or substringof('dc',COMPANYSCHEMA) or substringof('STG',COMPANYSCHEMA) or substringof('stg',COMPANYSCHEMA) or substringof('HANAPM',COMPANYSCHEMA) or substringof('hanapm',COMPANYSCHEMA)) and substringof('_',UPGRADE_ELEMENT)  and COMPANYSCHEMA ne '' and COMPANYID ne 'PAYNGPPRL' and COMPANYID ne 'USBASEIAS22V1' and COMPANYID ne 'SAPSDCHXM0001' and COMPANYID ne 'PAYNGPPRLE' and COMPANY ne '' and COMPANY ne 'SAP SF Cloud Engineering' and TIME_STAMP ge datetime'"+fromCompDate+"' and TIME_STAMP le datetime'"+toCompDate+"'";
					}else{
						var url =
						"/UC_STAT?$select=UC_ERROR_USAGE,COMPANYID,USER,MIGRATION,LOG,EMAIL,FILEVERSION,UPGRADE_ELEMENT,RESULT,COMPANYSCHEMA,COMPANY,TIME_STAMP&$expand=UC_ERROR_USAGE&$orderby=TIME_STAMP desc&$filter=(substringof('sfv4',COMPANYSCHEMA) or substringof('SFV4',COMPANYSCHEMA) or substringof('STOCKPM',COMPANYSCHEMA) or substringof('GLOBUSER_DVLHCM20S',COMPANYSCHEMA) or substringof('globuser_dvlhcm20s',COMPANYSCHEMA) or substringof('stockpm',COMPANYSCHEMA) or substringof('GLOBUSER_DVLHCM20S',COMPANYSCHEMA) or substringof('globuser_dvlhcm20s',COMPANYSCHEMA)   or substringof('DC',COMPANYSCHEMA) or substringof('dc',COMPANYSCHEMA) or substringof('STG',COMPANYSCHEMA) or substringof('stg',COMPANYSCHEMA) or substringof('HANAPM',COMPANYSCHEMA) or substringof('hanapm',COMPANYSCHEMA)) and indexof(UPGRADE_ELEMENT,'_') eq -1 and  COMPANYSCHEMA ne '' and COMPANYID ne 'PAYNGPPRL' and COMPANYID ne 'USBASEIAS22V1' and COMPANYID ne 'SAPSDCHXM0001' and COMPANYID ne 'PAYNGPPRLE' and COMPANY ne '' and COMPANY ne 'SAP SF Cloud Engineering' and TIME_STAMP ge datetime'"+fromCompDate+"' and TIME_STAMP le datetime'"+toCompDate+"'";
					}
					
				}
			}else{
				if (para != "") {
					if(deployKey=="All"){
						var url =
						"/UC_STAT?$select=UC_ERROR_USAGE,COMPANYID,USER,MIGRATION,LOG,EMAIL,FILEVERSION,UPGRADE_ELEMENT,RESULT,COMPANYSCHEMA,COMPANY,TIME_STAMP&$expand=UC_ERROR_USAGE&$orderby=TIME_STAMP desc&$filter=(substringof('sfv4',COMPANYSCHEMA) or substringof('SFV4',COMPANYSCHEMA) or substringof('STOCKPM',COMPANYSCHEMA) or substringof('GLOBUSER_DVLHCM20S',COMPANYSCHEMA) or substringof('globuser_dvlhcm20s',COMPANYSCHEMA) or substringof('stockpm',COMPANYSCHEMA) or substringof('GLOBUSER_DVLHCM20S',COMPANYSCHEMA) or substringof('globuser_dvlhcm20s',COMPANYSCHEMA)   or substringof('DC',COMPANYSCHEMA) or substringof('dc',COMPANYSCHEMA) or substringof('STG',COMPANYSCHEMA) or substringof('stg',COMPANYSCHEMA) or substringof('HANAPM',COMPANYSCHEMA) or substringof('hanapm',COMPANYSCHEMA)) and COMPANYSCHEMA ne '' and COMPANYID ne 'PAYNGPPRL' and COMPANYID ne 'USBASEIAS22V1' and COMPANYID ne 'SAPSDCHXM0001' and COMPANYID ne 'PAYNGPPRLE' and COMPANY ne '' and COMPANY ne 'SAP SF Cloud Engineering' and FILEVERSION eq '" +
						para + "' and TIME_STAMP ge datetime'"+fromCompDate+"' and TIME_STAMP le datetime'"+toCompDate+"' and "+fillBP;
					}else if(deployKey=="CUST"){
						var url =
						"/UC_STAT?$select=UC_ERROR_USAGE,COMPANYID,USER,MIGRATION,LOG,EMAIL,FILEVERSION,UPGRADE_ELEMENT,RESULT,COMPANYSCHEMA,COMPANY,TIME_STAMP&$expand=UC_ERROR_USAGE&$orderby=TIME_STAMP desc&$filter=(substringof('sfv4',COMPANYSCHEMA) or substringof('SFV4',COMPANYSCHEMA) or substringof('STOCKPM',COMPANYSCHEMA) or substringof('GLOBUSER_DVLHCM20S',COMPANYSCHEMA) or substringof('globuser_dvlhcm20s',COMPANYSCHEMA) or substringof('stockpm',COMPANYSCHEMA) or substringof('GLOBUSER_DVLHCM20S',COMPANYSCHEMA) or substringof('globuser_dvlhcm20s',COMPANYSCHEMA)   or substringof('DC',COMPANYSCHEMA) or substringof('dc',COMPANYSCHEMA) or substringof('STG',COMPANYSCHEMA) or substringof('stg',COMPANYSCHEMA) or substringof('HANAPM',COMPANYSCHEMA) or substringof('hanapm',COMPANYSCHEMA)) and substringof('_',UPGRADE_ELEMENT)  and COMPANYSCHEMA ne '' and COMPANYID ne 'PAYNGPPRL' and COMPANYID ne 'USBASEIAS22V1' and COMPANYID ne 'SAPSDCHXM0001' and COMPANYID ne 'PAYNGPPRLE' and COMPANY ne '' and COMPANY ne 'SAP SF Cloud Engineering' and FILEVERSION eq '" +
						para + "' and TIME_STAMP ge datetime'"+fromCompDate+"' and TIME_STAMP le datetime'"+toCompDate+"' and "+fillBP;
					}else{
						var url =
						"/UC_STAT?$select=UC_ERROR_USAGE,COMPANYID,USER,MIGRATION,LOG,EMAIL,FILEVERSION,UPGRADE_ELEMENT,RESULT,COMPANYSCHEMA,COMPANY,TIME_STAMP&$expand=UC_ERROR_USAGE&$orderby=TIME_STAMP desc&$filter=(substringof('sfv4',COMPANYSCHEMA) or substringof('SFV4',COMPANYSCHEMA) or substringof('STOCKPM',COMPANYSCHEMA) or substringof('GLOBUSER_DVLHCM20S',COMPANYSCHEMA) or substringof('globuser_dvlhcm20s',COMPANYSCHEMA) or substringof('stockpm',COMPANYSCHEMA) or substringof('GLOBUSER_DVLHCM20S',COMPANYSCHEMA) or substringof('globuser_dvlhcm20s',COMPANYSCHEMA)   or substringof('DC',COMPANYSCHEMA) or substringof('dc',COMPANYSCHEMA) or substringof('STG',COMPANYSCHEMA) or substringof('stg',COMPANYSCHEMA) or substringof('HANAPM',COMPANYSCHEMA) or substringof('hanapm',COMPANYSCHEMA)) and indexof(UPGRADE_ELEMENT,'_') eq -1 and  COMPANYSCHEMA ne '' and COMPANYID ne 'PAYNGPPRL' and COMPANYID ne 'USBASEIAS22V1' and COMPANYID ne 'SAPSDCHXM0001' and COMPANYID ne 'PAYNGPPRLE' and COMPANY ne '' and COMPANY ne 'SAP SF Cloud Engineering' and FILEVERSION eq '" +
						para + "' and TIME_STAMP ge datetime'"+fromCompDate+"' and TIME_STAMP le datetime'"+toCompDate+"' and "+fillBP;
					}
					
				} else {
					if(deployKey=="All"){
						var url =
						"/UC_STAT?$select=UC_ERROR_USAGE,COMPANYID,USER,MIGRATION,LOG,EMAIL,FILEVERSION,UPGRADE_ELEMENT,RESULT,COMPANYSCHEMA,COMPANY,TIME_STAMP&$expand=UC_ERROR_USAGE&$orderby=TIME_STAMP desc&$filter=(substringof('sfv4',COMPANYSCHEMA) or substringof('SFV4',COMPANYSCHEMA) or substringof('STOCKPM',COMPANYSCHEMA) or substringof('GLOBUSER_DVLHCM20S',COMPANYSCHEMA) or substringof('globuser_dvlhcm20s',COMPANYSCHEMA) or substringof('stockpm',COMPANYSCHEMA) or substringof('GLOBUSER_DVLHCM20S',COMPANYSCHEMA) or substringof('globuser_dvlhcm20s',COMPANYSCHEMA)   or substringof('DC',COMPANYSCHEMA) or substringof('dc',COMPANYSCHEMA) or substringof('STG',COMPANYSCHEMA) or substringof('stg',COMPANYSCHEMA) or substringof('HANAPM',COMPANYSCHEMA) or substringof('hanapm',COMPANYSCHEMA)) and COMPANYSCHEMA ne '' and COMPANYID ne 'PAYNGPPRL' and COMPANYID ne 'USBASEIAS22V1' and COMPANYID ne 'SAPSDCHXM0001' and COMPANYID ne 'PAYNGPPRLE' and COMPANY ne '' and COMPANY ne 'SAP SF Cloud Engineering' and TIME_STAMP ge datetime'"+fromCompDate+"' and TIME_STAMP le datetime'"+toCompDate+"' and "+fillBP;
					}else if(deployKey=="CUST"){
						var url =
						"/UC_STAT?$select=UC_ERROR_USAGE,COMPANYID,USER,MIGRATION,LOG,EMAIL,FILEVERSION,UPGRADE_ELEMENT,RESULT,COMPANYSCHEMA,COMPANY,TIME_STAMP&$expand=UC_ERROR_USAGE&$orderby=TIME_STAMP desc&$filter=(substringof('sfv4',COMPANYSCHEMA) or substringof('SFV4',COMPANYSCHEMA) or substringof('STOCKPM',COMPANYSCHEMA) or substringof('GLOBUSER_DVLHCM20S',COMPANYSCHEMA) or substringof('globuser_dvlhcm20s',COMPANYSCHEMA) or substringof('stockpm',COMPANYSCHEMA) or substringof('GLOBUSER_DVLHCM20S',COMPANYSCHEMA) or substringof('globuser_dvlhcm20s',COMPANYSCHEMA)   or substringof('DC',COMPANYSCHEMA) or substringof('dc',COMPANYSCHEMA) or substringof('STG',COMPANYSCHEMA) or substringof('stg',COMPANYSCHEMA) or substringof('HANAPM',COMPANYSCHEMA) or substringof('hanapm',COMPANYSCHEMA)) and substringof('_',UPGRADE_ELEMENT) and COMPANYSCHEMA ne '' and COMPANYID ne 'PAYNGPPRL' and COMPANYID ne 'USBASEIAS22V1' and COMPANYID ne 'SAPSDCHXM0001' and COMPANYID ne 'PAYNGPPRLE' and COMPANY ne '' and COMPANY ne 'SAP SF Cloud Engineering' and TIME_STAMP ge datetime'"+fromCompDate+"' and TIME_STAMP le datetime'"+toCompDate+"' and "+fillBP;
					}else{
						var url =
						"/UC_STAT?$select=UC_ERROR_USAGE,COMPANYID,USER,MIGRATION,LOG,EMAIL,FILEVERSION,UPGRADE_ELEMENT,RESULT,COMPANYSCHEMA,COMPANY,TIME_STAMP&$expand=UC_ERROR_USAGE&$orderby=TIME_STAMP desc&$filter=(substringof('sfv4',COMPANYSCHEMA) or substringof('SFV4',COMPANYSCHEMA) or substringof('STOCKPM',COMPANYSCHEMA) or substringof('GLOBUSER_DVLHCM20S',COMPANYSCHEMA) or substringof('globuser_dvlhcm20s',COMPANYSCHEMA) or substringof('stockpm',COMPANYSCHEMA) or substringof('GLOBUSER_DVLHCM20S',COMPANYSCHEMA) or substringof('globuser_dvlhcm20s',COMPANYSCHEMA)   or substringof('DC',COMPANYSCHEMA) or substringof('dc',COMPANYSCHEMA) or substringof('STG',COMPANYSCHEMA) or substringof('stg',COMPANYSCHEMA) or substringof('HANAPM',COMPANYSCHEMA) or substringof('hanapm',COMPANYSCHEMA)) and indexof(UPGRADE_ELEMENT,'_') eq -1 and  COMPANYSCHEMA ne '' and COMPANYID ne 'PAYNGPPRL' and COMPANYID ne 'USBASEIAS22V1' and COMPANYID ne 'SAPSDCHXM0001' and COMPANYID ne 'PAYNGPPRLE' and COMPANY ne '' and COMPANY ne 'SAP SF Cloud Engineering' and TIME_STAMP ge datetime'"+fromCompDate+"' and TIME_STAMP le datetime'"+toCompDate+"' and "+fillBP;
					}
					
				}
			}
			
			var chkEmail = "";
			mdl.read(
				url,
				null, null, true,
				function(oData, oResponse) {
					if(oData.results.length>0){

					tempODATAPreCheck = oData.results;
					
					for (var q = 0; q < tempODATAPreCheck.length; q++) {
							if (tempODATAPreCheck[q].COMPANYSCHEMA.toLowerCase().indexOf("sales40") == -1 ) {
							if(tempODATAPreCheck[q].COMPANYID!="MC4HRTest2011" && tempODATAPreCheck[q].COMPANYID!="SAPSDCHXM0001"){ 
								
							var majorBlk = tempODATAPreCheck[q].UPGRADE_ELEMENT.split("_");
							var lastItem = majorBlk[majorBlk.length-1];
							// if(lastItem.length!=32){
								
								if(me.getView().byId("ddlProd").getSelectedKey()=="All"){
							
								
									tempODATAPreCheckFilter.push(tempODATAPreCheck[q]);
								}  else if(me.getView().byId("ddlProd").getSelectedKey()=="RM"){
			
									for(var a2=0;a2<datatempoModelUpgradeRecruitREC.length;a2++){
										
										if(tempODATAPreCheck[q].UPGRADE_ELEMENT.indexOf("_")==-1){
											
										
											if(tempODATAPreCheck[q].UPGRADE_ELEMENT==datatempoModelUpgradeRecruitREC[a2].UPGRADE_ELEMENT){
													// if(datatempoModelUpgradeRecruitREC[a2].PRODUCT=="Recruiting"){
														tempODATAPreCheckFilter.push(tempODATAPreCheck[q]);
														break;	
													// }
												}
											
										}else{
											var majorBlk = tempODATAPreCheck[q].UPGRADE_ELEMENT.split("_");
											var lastItem = majorBlk[majorBlk.length-1];
											if(lastItem.length==32){
												majorBlk.pop();
												var CompmajorBlk = majorBlk.join("_");
												if(CompmajorBlk==datatempoModelUpgradeRecruitREC[a2].UPGRADE_ELEMENT){
													// if(datatempoModelUpgradeRecruitREC[a2].PRODUCT=="Recruiting"){
														tempODATAPreCheckFilter.push(tempODATAPreCheck[q]);
														break;	
													// }
												}
											}else{
												majorBlk.pop();
												majorBlk.pop();
												var CompmajorBlk = majorBlk.join("_");
												if(CompmajorBlk==datatempoModelUpgradeRecruitREC[a2].UPGRADE_ELEMENT){
													// if(datatempoModelUpgradeRecruitREC[a2].PRODUCT=="Recruiting"){
														tempODATAPreCheckFilter.push(tempODATAPreCheck[q]);
														break;	
													// }
												}
											}
										}
										
										
										
										
										
									}
								}  else if(me.getView().byId("ddlProd").getSelectedKey()=="SM"){
									for(var a2=0;a2<datatempoModelUpgradeRecruitSM.length;a2++){
										
			// 							
										
										
											if(tempODATAPreCheck[q].UPGRADE_ELEMENT.indexOf("_")==-1){
												
										
											if(tempODATAPreCheck[q].UPGRADE_ELEMENT==datatempoModelUpgradeRecruitSM[a2].UPGRADE_ELEMENT){
													// if(oModelUpgradeRecruitData[a2].PRODUCT=="Succession Management"){
														tempODATAPreCheckFilter.push(tempODATAPreCheck[q]);
														break;	
													// }
												}
											
										}else{
											var majorBlk = tempODATAPreCheck[q].UPGRADE_ELEMENT.split("_");
											var lastItem = majorBlk[majorBlk.length-1];
											if(lastItem.length==32){
												majorBlk.pop();
												var CompmajorBlk = majorBlk.join("_");
												if(CompmajorBlk==datatempoModelUpgradeRecruitSM[a2].UPGRADE_ELEMENT){
													// if(oModelUpgradeRecruitData[a2].PRODUCT=="Succession Management"){
														tempODATAPreCheckFilter.push(tempODATAPreCheck[q]);
														break;	
													// }
												}
											}else{
												majorBlk.pop();
												majorBlk.pop();
												var CompmajorBlk = majorBlk.join("_");
												if(CompmajorBlk==datatempoModelUpgradeRecruitSM[a2].UPGRADE_ELEMENT){
													// if(oModelUpgradeRecruitData[a2].PRODUCT=="Succession Management"){
														tempODATAPreCheckFilter.push(tempODATAPreCheck[q]);
														break;	
													// }
												}
											}
										}
										
										
										
										
									}
								}  else if(me.getView().byId("ddlProd").getSelectedKey()=="PG"){
									for(var a2=0;a2<datatempoModelUpgradeRecruitPG.length;a2++){
										
										
									
										
										
										if(tempODATAPreCheck[q].UPGRADE_ELEMENT.indexOf("_")==-1){
										
												if(tempODATAPreCheck[q].UPGRADE_ELEMENT==datatempoModelUpgradeRecruitPG[a2].UPGRADE_ELEMENT){
													// if(oModelUpgradeRecruitData[a2].PRODUCT=="Performance and Goals"){
														tempODATAPreCheckFilter.push(tempODATAPreCheck[q]);
														break;	
													// }
												}
											
										}else{
											var majorBlk = tempODATAPreCheck[q].UPGRADE_ELEMENT.split("_");
											var lastItem = majorBlk[majorBlk.length-1];
											if(lastItem.length==32){
												majorBlk.pop();
												var CompmajorBlk = majorBlk.join("_");
												if(CompmajorBlk==datatempoModelUpgradeRecruitPG[a2].UPGRADE_ELEMENT){
													// if(oModelUpgradeRecruitData[a2].PRODUCT=="Performance and Goals"){
														tempODATAPreCheckFilter.push(tempODATAPreCheck[q]);
														break;	
													// }
												}
											}else{
												majorBlk.pop();
												majorBlk.pop();
												var CompmajorBlk = majorBlk.join("_");
												if(CompmajorBlk==datatempoModelUpgradeRecruitPG[a2].UPGRADE_ELEMENT){
													// if(oModelUpgradeRecruitData[a2].PRODUCT=="Performance and Goals"){
														tempODATAPreCheckFilter.push(tempODATAPreCheck[q]);
														break;	
													// }
												}
											}
										}
										
										
										
										
									}
								}  else if(me.getView().byId("ddlProd").getSelectedKey()=="CO"){
									for(var a2=0;a2<datatempoModelUpgradeRecruitCO.length;a2++){
										
									
			
										if(tempODATAPreCheck[q].UPGRADE_ELEMENT.indexOf("_")==-1){
											
										if(tempODATAPreCheck[q].UPGRADE_ELEMENT==datatempoModelUpgradeRecruitCO[a2].UPGRADE_ELEMENT){
											// if(oModelUpgradeRecruitData[a2].PRODUCT=="Compensation"){
												tempODATAPreCheckFilter.push(tempODATAPreCheck[q]);
												break;
											
											// }
											}
										
										}else{
											var majorBlk = tempODATAPreCheck[q].UPGRADE_ELEMENT.split("_");
											var lastItem = majorBlk[majorBlk.length-1];
											if(lastItem.length==32){
												majorBlk.pop();
												var CompmajorBlk = majorBlk.join("_");
												if(CompmajorBlk==datatempoModelUpgradeRecruitCO[a2].UPGRADE_ELEMENT){
													// if(oModelUpgradeRecruitData[a2].PRODUCT=="Compensation"){
														tempODATAPreCheckFilter.push(tempODATAPreCheck[q]);
														break;	
													// }
												}
											}else{
												majorBlk.pop();
												majorBlk.pop();
												var CompmajorBlk = majorBlk.join("_");
												if(CompmajorBlk==datatempoModelUpgradeRecruitCO[a2].UPGRADE_ELEMENT){
													// if(oModelUpgradeRecruitData[a2].PRODUCT=="Compensation"){
														tempODATAPreCheckFilter.push(tempODATAPreCheck[q]);
														break;	
													// }
												}
											}
										}
										
										
										
										
									}
								}  else if(me.getView().byId("ddlProd").getSelectedKey()=="ON"){
									for(var a2=0;a2<datatempoModelUpgradeRecruitON.length;a2++){
										
									
										
			
										if(tempODATAPreCheck[q].UPGRADE_ELEMENT.indexOf("_")==-1){
											
											if(tempODATAPreCheck[q].UPGRADE_ELEMENT==datatempoModelUpgradeRecruitON[a2].UPGRADE_ELEMENT){
											// if(oModelUpgradeRecruitData[a2].PRODUCT=="Onboarding" || oModelUpgradeRecruitData[a2].PRODUCT=="Onboarding 2.0"){
												tempODATAPreCheckFilter.push(tempODATAPreCheck[q]);
												break;
											// }
										}
										
											
										}else{
											var majorBlk = tempODATAPreCheck[q].UPGRADE_ELEMENT.split("_");
											var lastItem = majorBlk[majorBlk.length-1];
											if(lastItem.length==32){
												majorBlk.pop();
												var CompmajorBlk = majorBlk.join("_");
												if(CompmajorBlk==datatempoModelUpgradeRecruitON[a2].UPGRADE_ELEMENT){
													// if(oModelUpgradeRecruitData[a2].PRODUCT=="Onboarding" || oModelUpgradeRecruitData[a2].PRODUCT=="Onboarding 2.0"){
														tempODATAPreCheckFilter.push(tempODATAPreCheck[q]);
														break;	
													// }
												}
											}else{
												majorBlk.pop();
												majorBlk.pop();
												var CompmajorBlk = majorBlk.join("_");
												if(CompmajorBlk==datatempoModelUpgradeRecruitON[a2].UPGRADE_ELEMENT){
													// if(oModelUpgradeRecruitData[a2].PRODUCT=="Onboarding" || oModelUpgradeRecruitData[a2].PRODUCT=="Onboarding 2.0"){
														tempODATAPreCheckFilter.push(tempODATAPreCheck[q]);
														break;	
													// }
												}
											}
										}
										
										
										
									}
								}  else if(me.getView().byId("ddlProd").getSelectedKey()=="EC"){
									for(var a2=0; a2<datatempoModelUpgradeRecruitEC.length; a2++){
										
									// var datatempoModelUpgradeRecruitON = sap.ui.getCore().getModel("oModelUpgradeRecruitON").getData();
			// var datatempoModelUpgradeRecruitREC = sap.ui.getCore().getModel("oModelUpgradeRecruitREC").getData();
			// var datatempoModelUpgradeRecruitSM = sap.ui.getCore().getModel("oModelUpgradeRecruitSM").getData();
			// var datatempoModelUpgradeRecruitPG = sap.ui.getCore().getModel("oModelUpgradeRecruitPG").getData();
			// var datatempoModelUpgradeRecruitCO = sap.ui.getCore().getModel("oModelUpgradeRecruitCO").getData();
			// var datatempoModelUpgradeRecruitEC = sap.ui.getCore().getModel("oModelUpgradeRecruitEC").getData();
										
										
										if(tempODATAPreCheck[q].UPGRADE_ELEMENT.indexOf("_")==-1){
											
										
												if(tempODATAPreCheck[q].UPGRADE_ELEMENT==datatempoModelUpgradeRecruitEC[a2].UPGRADE_ELEMENT){
													// if(oModelUpgradeRecruitData[a2].PRODUCT=="Employee Central"){
														tempODATAPreCheckFilter.push(tempODATAPreCheck[q]);
														break;	
													// }
												}
											
										 
											
										}else{
											var majorBlk = tempODATAPreCheck[q].UPGRADE_ELEMENT.split("_");
											var lastItem = majorBlk[majorBlk.length-1];
											if(lastItem.length==32){
												majorBlk.pop();
												var CompmajorBlk = majorBlk.join("_");
												if(CompmajorBlk==datatempoModelUpgradeRecruitEC[a2].UPGRADE_ELEMENT){
													// if(datatempoModelUpgradeRecruitEC[a2].PRODUCT=="Employee Central"){
														tempODATAPreCheckFilter.push(tempODATAPreCheck[q]);
														break;	
													// }
												}
											}else{
												majorBlk.pop();
												majorBlk.pop();
												var CompmajorBlk = majorBlk.join("_");
												if(CompmajorBlk==datatempoModelUpgradeRecruitEC[a2].UPGRADE_ELEMENT){
													// if(oModelUpgradeRecruitData[a2].PRODUCT=="Employee Central"){
														tempODATAPreCheckFilter.push(tempODATAPreCheck[q]);
														break;	
													// }
												}
											}
										}
									}
								}
								
							// }
								
							}
							}
						}
					
					if (tempODATAPreCheckFilter.length > 0) {
						var cIDData = [];
						var oModelTable = new sap.ui.model.json.JSONModel();
						oModelTable.setSizeLimit(10000);
						sap.ui.getCore().setModel(oModelTable, "oModelTable");

						var tempODATA = [];
						var tempTimeData = [];
						for (var q = 0; q < tempODATAPreCheckFilter.length; q++) {
							if(tempODATAPreCheckFilter[q].COMPANY!="SAP SF Cloud Engineering"){
								
							
							
							
							
							if(tempODATAPreCheckFilter[q].COMPANY!="BPMCINSTANCE4" && tempODATAPreCheckFilter[q].COMPANY!="BPMCINSTANCE1"){
								if (tempODATAPreCheckFilter[q].COMPANYSCHEMA!=null && tempODATAPreCheckFilter[q].COMPANYSCHEMA.toLowerCase().indexOf("sfsales")==-1) {
									if(tempODATAPreCheckFilter[q].COMPANYSCHEMA.toLowerCase().indexOf("sfbizx3_bpsdct1")==-1 ){
												
											if(tempODATAPreCheckFilter[q].RESULT=="true"){
												var statResult = "Success";
												var classResult = "greenTable";
												var enable = false;
												
											}else if(tempODATAPreCheckFilter[q].RESULT=="false"){
												var statResult = "Failure";
												var classResult = "redTable";
												var enable = true;
											}
											if(tempODATAPreCheckFilter[q].MIGRATION=="true"){
												var statMig = "MDF";
											}else if(tempODATAPreCheckFilter[q].MIGRATION=="false"){
												var statMig = "Legacy";
											}
											
											// if(tempODATAPreCheckFilter[q].EMAIL=="joel.caceres@rizing.com"){
											// 	debugger;
											// }
											
											if(tempODATAPreCheckFilter[q].COMPANYSCHEMA.toLowerCase().indexOf("eusfv4")==0){
												var statEnv = "Production" ;
											}
											if(tempODATAPreCheckFilter[q].COMPANYSCHEMA.toLowerCase().indexOf("sfv4")==0){
												if(tempODATAPreCheckFilter[q].COMPANYSCHEMA.toLowerCase()=="sfv4"){
													var statEnv = "Production" ;
												}else{
													// var statEnv = "Production";
													var tempStr = tempODATAPreCheckFilter[q].COMPANYSCHEMA.toLowerCase().split("sfv4")[1];
													var firstChar = tempStr.charAt(0);
													var secChar = tempStr.charAt(1);
													if(isNaN(parseInt(secChar))){
														if(isNaN(parseInt(firstChar))){
															var statEnv = "Production" ;
														}else{
															var statEnv = "Production (DC"+firstChar+")" ;
														}
														
														// var statEnv = "Production (DC-"+firstChar+")" ;
														
													}else{
														var statEnv = "Production (DC"+firstChar+secChar+")" ;
													}
												}
											}else if(tempODATAPreCheckFilter[q].COMPANYSCHEMA.toLowerCase().indexOf("dc")==0){
												// var statEnv = "Production";
												var tempStr = tempODATAPreCheckFilter[q].COMPANYSCHEMA.toLowerCase().split("dc")[1];
												var firstChar = tempStr.charAt(0);
												var secChar = tempStr.charAt(1);
												if(isNaN(parseInt(secChar))){
													// var statEnv = "Production (DC-"+firstChar+")" ;
													if(isNaN(parseInt(firstChar))){
														var statEnv = "Production" ;
													}else{
														var statEnv = "Production (DC"+firstChar+")" ;
													}
												}else{
													var statEnv = "Production (DC"+firstChar+secChar+")" ;
												}
											}else if(tempODATAPreCheckFilter[q].COMPANYSCHEMA.toLowerCase().indexOf("stg")==0){
												// var statEnv = "Preview";
												var tempStr = tempODATAPreCheckFilter[q].COMPANYSCHEMA.toLowerCase().split("stg")[1];
												var firstChar = tempStr.charAt(0);
												var secChar = tempStr.charAt(1);
												if(isNaN(parseInt(secChar))){
													// var statEnv = "Preview (DC-"+firstChar+")" ;
													if(isNaN(parseInt(firstChar))){
														var statEnv = "Preview" ;
													}else{
														var statEnv = "Preview (DC"+firstChar+")" ;
													}
												}else{
													var statEnv = "Preview (DC"+firstChar+secChar+")" ;
												}
											}else if(tempODATAPreCheckFilter[q].COMPANYSCHEMA.toLowerCase().indexOf("hanapm")==0){
												// var statEnv = "Preview";
												var tempStr = tempODATAPreCheckFilter[q].COMPANYSCHEMA.toLowerCase().split("hanapm")[1];
												var firstChar = tempStr.charAt(0);
												var secChar = tempStr.charAt(1);
												if(isNaN(parseInt(secChar))){
													// var statEnv = "Preview (DC-"+firstChar+")" ;
													if(isNaN(parseInt(firstChar))){
														var statEnv = "Preview" ;
													}else{
														var statEnv = "Preview (DC"+firstChar+")" ;
													}
												}else{
													var statEnv = "Preview (DC"+firstChar+secChar+")" ;
												}
											}else{
												var statEnv = "Production" ;
											}
											
											
											if (tempODATAPreCheckFilter[q].FILEVERSION != "") {
												if (tempODATAPreCheckFilter[q].FILEVERSION != null) {
													var	version = tempODATAPreCheckFilter[q].FILEVERSION.split("b")[1].split("/")[0];
												}
											}
											
											if((tempODATAPreCheckFilter[q].LOG).indexOf("SQLException")>-1){
												if((tempODATAPreCheckFilter[q].LOG).indexOf("PERMISSION")>-1 || (tempODATAPreCheckFilter[q].LOG).indexOf("permissionRoleBean")>-1){
													if((tempODATAPreCheckFilter[q].LOG).indexOf("SQLException")>(tempODATAPreCheckFilter[q].LOG).indexOf("permissionRoleBean")||(tempODATAPreCheckFilter[q].LOG).indexOf("SQLException")>(tempODATAPreCheckFilter[q].LOG).indexOf("PERMISSION")){
														var category = "Permission";
														tempPreData.push({
															name: category,
															y: 0
														});
													}else{
														var category = "Object Definition";
														tempPermission.push({
															name: category,
															y: 0
														});
													}
													
												}else{
													var category = "Object Definition";
													tempPermission.push({
														name: category,
														y: 0
													});
												}
											
											}else if((tempODATAPreCheckFilter[q].LOG).indexOf("PERMISSION")>-1 || (tempODATAPreCheckFilter[q].LOG).indexOf("permissionRoleBean")>-1){
												var category = "Permission";
												tempPreData.push({
													name: category,
													y: 0
												});
											}else if((tempODATAPreCheckFilter[q].LOG).indexOf("EMPFILE_HRIS")>-1 || (tempODATAPreCheckFilter[q].LOG).indexOf("INVALID_COLUMNS")>-1){
												var category = "Data Model";
												tempDataMdl.push({
													name: category,
													y: 0
												});
											}else if((tempODATAPreCheckFilter[q].LOG).indexOf("EmpCostDistribution")>-1){
												// var category = "Pre- requisite missing";
												// tempPreData.push({
												// 	name: category,
												// 	y: 0
												// });
												var category = "Undefined";
												tempNoData.push({
													name: category,
													y: 0
												});
											}else if((tempODATAPreCheckFilter[q].LOG).indexOf("unable to get data from server")>-1){
												var category = "Temp. issue with GitHub";
												tempPreData.push({
													name: category,
													y: 0
												});
											}else if((tempODATAPreCheckFilter[q].LOG).indexOf("COMMON_DG_ERR_GROUP_EXIST()")>-1){
												var category = "Existing Data";
												tempPreData.push({
													name: category,
													y: 0
												});
											}else{
												if(tempODATAPreCheckFilter[q].RESULT=="true"){
													var category = "No Error";
													tempNoErrorData.push({
														name: category,
														y: 0
													});
												}else{
													var category = "Undefined";
													tempNoData.push({
														name: category,
														y: 0
													});
												}
												
											}
											
											var reason = "";
											var solution = "";
											var tempErrorLog = "";
											var tempErrorLogDetails = "";
												
											if((tempODATAPreCheckFilter[q].LOG).indexOf("GO_TEMPLATE_FIELDNOTFOUND_ERROR")>-1){
												var rsn0 = (((tempODATAPreCheckFilter[q].LOG).split("values=[")[1]).split("]")[0]).split(",")[0];
												var rsn1 = (((tempODATAPreCheckFilter[q].LOG).split("values=[")[1]).split("]")[0]).split(",")[1];
												var reason = "The field "+ rsn0+" is not defined in the object definition for "+rsn1;
												var solution = "Check the object definition for "+rsn1+"\n"+"Enable the field "+rsn0;
											}else if((tempODATAPreCheckFilter[q].LOG).indexOf("SA_Generic_Profile")>-1){
												if((tempODATAPreCheckFilter[q].LOG).indexOf("USA_Generic_Profile")>-1){
													
												}else{
													
												if(tempODATAPreCheckFilter[q].EMAIL=="uspeh@dejavnikiuspeha.si"){
													var rsn0 = "";
													var rsn1 = "";
													var rsn2 = "";
												}else{
													var rsn0 = (((tempODATAPreCheckFilter[q].LOG).split("object by keys: [")[1]).split("]")[0]);
												
													var rsn1 = (((tempODATAPreCheckFilter[q].LOG).split("Object:")[1]).split("Key Values: ")[0]);
													var rsn2 = (((tempODATAPreCheckFilter[q].LOG).split("Key Values: ")[1]).split("{externalCode=")[0]).split("}")[0];
												}
												
												// var rsn0 = (((tempODATAPreCheckFilter[q].LOG).split("object by keys: [")[1]).split("]")[0]);
												
												// var rsn1 = (((tempODATAPreCheckFilter[q].LOG).split("Object:")[1]).split("Key Values: ")[0]);
												// var rsn2 = (((tempODATAPreCheckFilter[q].LOG).split("Key Values: ")[1]).split("{externalCode=")[0]).split("}")[0];
												
												var reason = "Value "+rsn2+" does not exist for field "+rsn0;
												var solution = "Go to the tool manage data and check if the value "+rsn2+" is maintained for object "+rsn1;
											
												}
											}else if((tempODATAPreCheckFilter[q].LOG).indexOf("STATUS_MARKED_ROLLBACK")>-1){
												
												if((tempODATAPreCheckFilter[q].LOG).indexOf("_NO_IMPORT_PERMISSION")>-1){
													var reason = "Permission is missing";
													var solution = "Maintain the missing permission";
												}else{
													if((tempODATAPreCheckFilter[q].LOG).indexOf("Error: ")>-1){
														if(((tempODATAPreCheckFilter[q].LOG).split("BPMsg: ")[1])==undefined){
															if((tempODATAPreCheckFilter[q].LOG).split("BPMsg:")[1]==undefined){
																var rsn0 = (((tempODATAPreCheckFilter[q].LOG).split("Error: ")[1]).split("Error: ")[0]);
															}else{
																var rsn0 = (((tempODATAPreCheckFilter[q].LOG).split("BPMsg:")[1]).split("Error: ")[0]);
															}
														}else{
															if((tempODATAPreCheckFilter[q].LOG).split("BPMsg: ")[1]==undefined){
																var rsn0 = (((tempODATAPreCheckFilter[q].LOG).split("Error: ")[1]).split("Error: ")[0]);
															}else{
																var rsn0 = (((tempODATAPreCheckFilter[q].LOG).split("BPMsg: ")[1]).split("Error: ")[0]);
															}
														}
														// var rsn0 = (((tempODATAPreCheckFilter[q].LOG).split("BPMsg: ")[1]).split("Error: ")[0]);
													}else if((tempODATAPreCheckFilter[q].LOG).indexOf("Err:")>-1){
														if(((tempODATAPreCheckFilter[q].LOG).split("BPMsg: ")[1])==undefined){
															var rsn0 = (((tempODATAPreCheckFilter[q].LOG).split("BPMsg:")[1]).split("Err")[0]);
														}else{
															var rsn0 = (((tempODATAPreCheckFilter[q].LOG).split("BPMsg: ")[1]).split("Err")[0]);
														}
													}
													
													var reason = "An exception was not caught. "+rsn0;
													var solution = "Check if the object definition has been changed for the objects that were imported before the error.";
												}
												
											}else if((tempODATAPreCheckFilter[q].LOG).indexOf("unable to get element")>-1){
												var rsn0 = (((tempODATAPreCheckFilter[q].LOG).split("unable to get element")[1]).split("Error: ")[0]);
												var reason = "Element "+rsn0+" does not exist in the SDM";
												var solution = "Check SDM for element "+rsn0;
											}else if((tempODATAPreCheckFilter[q].LOG).indexOf("For entity")>-1){
												if(((tempODATAPreCheckFilter[q].LOG).split("Object Definition.Code :")[1])){
													var query = (((tempODATAPreCheckFilter[q].LOG).split("Object Definition.Code :")[1]).split("Secured")[0]);	 
													var reason = "Generic Object "+query+" not existing in the instance";
												}else{
													if((tempODATAPreCheckFilter[q].LOG).indexOf("Some of the records failed to be imported for ")>-1){
														var query = (tempODATAPreCheckFilter[q].LOG).split("Some of the records failed to be imported for")[1].split("\n")[0];
													}else{
														var query = "";
													}
													
													
													var reason = "Generic Object "+query+" not existing in the instance";
												}
												
												var solution = "In the tool configure object definition check if the object exists \n Check Role based permission for import of this object \n Check if the feature is activated in provisioning if applicable";
	
											}else if((tempODATAPreCheckFilter[q].LOG).indexOf("COMMON_DG_ERR_GROUP_EXIST")>-1){
												var reason = "Existing Data";
												var solution = "Workflow group SAP BestPractices Payroll Group already exists in the system. Delete this group to rerun the activation.";
											}else if((tempODATAPreCheckFilter[q].LOG).toLowerCase().indexOf("unable to get data from server")>-1){
												var reason = "Temp. issue with GitHub";
												var solution = "Re-run the activation during off-peak time.";
											}else if((tempODATAPreCheckFilter[q].LOG).indexOf("GO_NO_IMPORT_PERMISSION_BASE_OBJ")>-1){
												var rsn = ((tempODATAPreCheckFilter[q].LOG).split("values=[")[1]).split("]")[0];
												var reason = "The import permission for "+rsn+" is not maintained";
												var solution = "Maintain the RBP for import of object "+rsn;
											}else if((tempODATAPreCheckFilter[q].LOG).indexOf("permissionRoleBean")>-1 || (tempODATAPreCheckFilter[q].LOG).indexOf("NO_IMPORT_PERMISSION")>-1){
												var reason = "Permission is missing";
												var solution = "Maintain the missing permission";
											}
											
											if(reason.indexOf("Generic Object")>-1){
												var category = "Generic Object";
												tempPreData.push({
													name: category,
													y: 0
												});
											}else if(reason.indexOf("Value")>-1){
												var category = "Object Value";
												tempPreData.push({
													name: category,
													y: 0
												});
											}
											
											if(tempODATAPreCheckFilter[q].UC_ERROR_USAGE==null){
												tempErrorLog = "No";
												tempErrorLogDetails = "";
											}else{
												tempErrorLog = "Yes";
												tempErrorLogDetails = tempODATAPreCheckFilter[q].UC_ERROR_USAGE.RESPONSE;
											}
											
											if (tempODATAPreCheckFilter[q].UPGRADE_ELEMENT.split("Best Practice Configurations Employee Central")[1] == undefined) {
												if(tempODATAPreCheckFilter[q].UPGRADE_ELEMENT.split("bestpracticesEmployeeCentral")[1] == undefined){
													if(tempODATAPreCheckFilter[q].UPGRADE_ELEMENT.split("Best Practices Employee Central")[1] == undefined){
														if(tempODATAPreCheckFilter[q].UPGRADE_ELEMENT.split("Best Practices")[1]==undefined){
															if(tempODATAPreCheckFilter[q].UPGRADE_ELEMENT.split("Best Practice")[1]==undefined){
																tempTimeData.push({
																	id:tempODATAPreCheckFilter[q].COMPANYID,
																	user: tempODATAPreCheckFilter[q].USER,
																	log:tempODATAPreCheckFilter[q].LOG,
																	email:tempODATAPreCheckFilter[q].EMAIL,
																	fversion: version,
																	company: tempODATAPreCheckFilter[q].COMPANY,
																	env: statEnv,
																	mig: statMig,
																	errorlog:tempErrorLog,
																	errorlogdetails:tempErrorLogDetails,
																	result: statResult,
																	upgrade:tempODATAPreCheckFilter[q].UPGRADE_ELEMENT,
																	// puretimestamp: tempODATAPreCheckFilter[q].TIME_STAMP,
																	puretimestamp:tempODATAPreCheckFilter[q].TIME_STAMP.toUTCString(),
																	catg:category,
																	classResult:classResult,
																	rsn:reason,
																	sol:solution,
																	enable: enable
																});
															}else{
																tempTimeData.push({
																	id:tempODATAPreCheckFilter[q].COMPANYID,
																	user: tempODATAPreCheckFilter[q].USER,
																	log:tempODATAPreCheckFilter[q].LOG,
																	email:tempODATAPreCheckFilter[q].EMAIL,
																	fversion: version,
																	company: tempODATAPreCheckFilter[q].COMPANY,
																	env: statEnv,
																	mig: statMig,
																	errorlog:tempErrorLog,
																	errorlogdetails:tempErrorLogDetails,
																	result: statResult,
																	upgrade:tempODATAPreCheckFilter[q].UPGRADE_ELEMENT.split("Best Practice")[1],
																	// puretimestamp: tempODATAPreCheckFilter[q].TIME_STAMP,
																	puretimestamp:tempODATAPreCheckFilter[q].TIME_STAMP.toUTCString(),
																	catg:category,
																	classResult:classResult,
																	rsn:reason,
																	sol:solution,
																	enable: enable
																});
															}
														}else{
															if(tempODATAPreCheckFilter[q].UPGRADE_ELEMENT.indexOf("In-app learning")>-1){
																tempTimeData.push({
																id:tempODATAPreCheckFilter[q].COMPANYID,
																user: tempODATAPreCheckFilter[q].USER,
																log:tempODATAPreCheckFilter[q].LOG,
																email:tempODATAPreCheckFilter[q].EMAIL,
																fversion: version,
																company: tempODATAPreCheckFilter[q].COMPANY,
																env: statEnv,
																mig: statMig,
																errorlog:tempErrorLog,
																errorlogdetails:tempErrorLogDetails,
																result: statResult,
																upgrade:tempODATAPreCheckFilter[q].UPGRADE_ELEMENT,
																// puretimestamp: tempODATAPreCheckFilter[q].TIME_STAMP,
																puretimestamp:tempODATAPreCheckFilter[q].TIME_STAMP.toUTCString(),															
																catg:category,
																classResult:classResult,
																rsn:reason,
																sol:solution,
																enable: enable
															});
															}else{
															tempTimeData.push({
																id:tempODATAPreCheckFilter[q].COMPANYID,
																user: tempODATAPreCheckFilter[q].USER,
																log:tempODATAPreCheckFilter[q].LOG,
																email:tempODATAPreCheckFilter[q].EMAIL,
																fversion: version,
																company: tempODATAPreCheckFilter[q].COMPANY,
																env: statEnv,
																mig: statMig,
																errorlog:tempErrorLog,
																errorlogdetails:tempErrorLogDetails,
																result: statResult,
																upgrade:tempODATAPreCheckFilter[q].UPGRADE_ELEMENT.split("Best Practices")[1],
																// puretimestamp: tempODATAPreCheckFilter[q].TIME_STAMP,
																puretimestamp:tempODATAPreCheckFilter[q].TIME_STAMP.toUTCString(),															
																catg:category,
																classResult:classResult,
																rsn:reason,
																sol:solution,
																enable: enable
															});
															}
														}
													}else{
														tempTimeData.push({
															id:tempODATAPreCheckFilter[q].COMPANYID,
															user: tempODATAPreCheckFilter[q].USER,
															log:tempODATAPreCheckFilter[q].LOG,
															email:tempODATAPreCheckFilter[q].EMAIL,
															fversion: version,
															company: tempODATAPreCheckFilter[q].COMPANY,
															env: statEnv,
															mig: statMig,
															errorlog:tempErrorLog,
															errorlogdetails:tempErrorLogDetails,
															result: statResult,
															upgrade:"EC"+tempODATAPreCheckFilter[q].UPGRADE_ELEMENT.split("Best Practices Employee Central")[1],
															// puretimestamp: tempODATAPreCheckFilter[q].TIME_STAMP,
															puretimestamp:tempODATAPreCheckFilter[q].TIME_STAMP.toUTCString(),
															catg:category,
															classResult:classResult,
															rsn:reason,
															sol:solution,
															enable: enable
														});
													}
												}else{
													tempTimeData.push({
														id:tempODATAPreCheckFilter[q].COMPANYID,
														user: tempODATAPreCheckFilter[q].USER,
														log:tempODATAPreCheckFilter[q].LOG,
														email:tempODATAPreCheckFilter[q].EMAIL,
														fversion: version,
														company: tempODATAPreCheckFilter[q].COMPANY,
														env: statEnv,
														mig: statMig,
														errorlog:tempErrorLog,
														errorlogdetails:tempErrorLogDetails,
														result: statResult,
														upgrade: "EC"+tempODATAPreCheckFilter[q].UPGRADE_ELEMENT.split("bestpracticesEmployeeCentral")[1],
														// puretimestamp: tempODATAPreCheckFilter[q].TIME_STAMP,
														puretimestamp:tempODATAPreCheckFilter[q].TIME_STAMP.toUTCString(),		
														catg:category,
														classResult:classResult,
														rsn:reason,
														sol:solution,
														enable: enable
													});
												}
											} else {
												tempTimeData.push({
													id:tempODATAPreCheckFilter[q].COMPANYID,
													user: tempODATAPreCheckFilter[q].USER,
													log:tempODATAPreCheckFilter[q].LOG,
													email:tempODATAPreCheckFilter[q].EMAIL,
													fversion: version,
													company: tempODATAPreCheckFilter[q].COMPANY,
													env: statEnv,
													mig: statMig,
													errorlog:tempErrorLog,
													errorlogdetails:tempErrorLogDetails,
													result: statResult,
													upgrade: "EC"+tempODATAPreCheckFilter[q].UPGRADE_ELEMENT.split("Best Practice Configurations Employee Central")[1],
													// puretimestamp: tempODATAPreCheckFilter[q].TIME_STAMP,
													puretimestamp:tempODATAPreCheckFilter[q].TIME_STAMP.toUTCString(),			
													catg:category,
													classResult:classResult,
													rsn:reason,
													sol:solution,
													enable: enable
												});
											
											}
		
									}
								}
							}
							
							}
							var oModelTable = sap.ui.getCore().getModel("oModelTable");
							oModelTable.setProperty('/stlistUser', tempTimeData);
							
						}

						
						var oDataGrpUsers = {
							"stlistUser": tempTimeData
						};
						oModelTable.setData(oDataGrpUsers);
						me.getView().byId("listTableBtm").setModel(oModelTable);
						
						me.loadErrorChart();
						me.mGroupFunctions = {
							upgrade: function(oContext) {
								var name = oContext.getProperty("upgrade");
								return {
									key: name,
									text: name
								};
							},
							company: function(oContext) {
								var name = oContext.getProperty("company");
								return {
									key: name,
									text: name
								};
							},
							env: function(oContext) {
								var name = oContext.getProperty("env");
								return {
									key: name,
									text: name
								};
							},
							result: function(oContext) {
								var name = oContext.getProperty("result");
								return {
									key: name,
									text: name
								};
							},
							mig: function(oContext) {
								var name = oContext.getProperty("mig");
								return {
									key: name,
									text: name
								};
							},
							catg: function(oContext) {
								var name = oContext.getProperty("catg");
								return {
									key: name,
									text: name
								};
							}
						};
						
						// // init and activate controller
						// me._oTPC = new TablePersoController({
						// 	table: me.getView().byId("listTableBtm"),
						// 	//specify the first part of persistence ids e.g. 'demoApp-productsTable-dimensionsCol'
						// 	componentName: "demoApp",
						// 	persoService: DemoPersoService
						// }).activate();

					}
					}else{
						var oModelTable = new sap.ui.model.json.JSONModel();
						oModelTable.setSizeLimit(10000);
						sap.ui.getCore().setModel(oModelTable, "oModelTable");
						
						var oDataGrpUsers = {
							"stlistUser": []
						};
						oModelTable.setData(oDataGrpUsers);
						me.getView().byId("listTableBtm").setModel(oModelTable);
						me.loadErrorChart();
					}
				},
				function(oError) {
					console.log("Error 127");
				});

		},
		
		onPressCompany: function (evt) {
			if (evt.getSource().getPressed()) {
				// MessageToast.show(evt.getSource().getId() + " Pressed");
				var aFilters = [];
				var sQueryText = evt.getSource().getText();
				var sQuery = evt.getSource().data("target");
				var filter = new sap.ui.model.Filter("company", sap.ui.model.FilterOperator.Contains, sQuery);
				// var filterNE = new sap.ui.model.Filter("company", sap.ui.model.FilterOperator.NE, sQuery);
				this.getView().byId("searchfield").setValue(sQueryText);
				
				aFilters.push(filter);
				// aFilters.push(filterNE);
					
				// update list binding
				var list = this.getView().byId("listTableBtm");
				var binding = list.getBinding("items");
				binding.filter(aFilters, "Application");
			
			} else {
				var aFilters = [];
				var list = this.getView().byId("listTableBtm");
				var binding = list.getBinding("items");
				binding.filter(aFilters, "Application");
				this.getView().byId("searchfield").setValue("");
				// MessageToast.show(evt.getSource().getId() + " Unpressed");
			}
		},
		onSearch: function(oEvt) {
			// add filter for search
			var aFilters = [];
			var sQuery = oEvt.getSource().getValue();
			window.sQuery = false;
			if (sQuery && sQuery.length > 0) {
				var filter = new sap.ui.model.Filter("company", sap.ui.model.FilterOperator.Contains, sQuery);
				aFilters.push(filter);
				window.sQuery = true;
			}else{
				window.sQuery = false;
			}
			
			// update list binding
			var list = this.getView().byId("listTableBtm");
			var binding = list.getBinding("items");
			binding.filter(aFilters, "Application");
		},
		removeDuplicates: function(originalArray, prop) {
			var newArray = [];
			var lookupObject = {};

			for (var i in originalArray) {
				lookupObject[originalArray[i][prop]] = originalArray[i];
			}

			for (i in lookupObject) {
				newArray.push(lookupObject[i]);
			}
			return newArray;
		},
		NumberFormat: function(val) {
			if (val == "" || val == null) {
				val = 0;
			}
			if (isNaN(val)) {
				val = 0;
			}
			var num = {};
			val = Math.abs(val);
			if (val < 0) {
				val = Math.abs(val);
			} else {
				val = val;
			}
			if (val < 1000) {
				num["value"] = val.toFixed(0).replace(/(\d)(?=(\d{3})+\.)/g, '$1');
				num["type"] = "";
			} else if (val / 1000 < 1000) {
				num["value"] = (val / 1000).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1');
				num["type"] = "K";
			} else {
				num["value"] = (val / 1000000).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1');
				num["type"] = "M";
			}
			// else {
			//  num["value"] = (val / 1000000000).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,');
			//  num["type"] = "B";
			// }
			return num;
		},
		// onExit : function () {
		// 	if (this._oDialog) {
		// 		this._oDialog.destroy();
		// 	}
		// },
		
	});
	
	function MentionGetMonthName(value) {
		var a = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
		return a[value];
	};

	function GetDDMM(date) {
		var d = date;
		var day = d.getDate();
		var month = MentionGetMonthName(d.getMonth());
		var year = d.getFullYear();
		var result = year + "-" + month;
		return result;
	};

	function GetDDMMYY(date) {
		var d = date;
		var day = d.getDate();
		var month = MentionGetMonthName(d.getMonth());
		var year = d.getFullYear();
		var result = year + "-" + month + "-" + day;
		return result;
	};
	Date.prototype.YYYYMMDD = function() {
		var yyyy = this.getFullYear().toString();
		var mm = (this.getMonth() + 1).toString(); // getMonth() is zero-based
		var dd = this.getDate().toString();
		return yyyy + "-" + (mm[1] ? mm : "0" + mm[0]) + "-" + (dd[1] ? dd : "0" + dd[0]); // padding
	};

	function stringToDate(dateStr) {
		// var date = new Date(dateStr);
		// return date;
		var tempDate1 = dateStr.replace("-","/");
		var tempDate2 =tempDate1.replace("-","/");
		var date = new Date(tempDate2); 
		return date;

	};
});

Date.prototype.YYYYMMDD = function() {
	var yyyy = this.getFullYear().toString();
	var mm = (this.getMonth() + 1).toString(); // getMonth() is zero-based
	var dd = this.getDate().toString();
	return yyyy + "-" + (mm[1] ? mm : "0" + mm[0]) + "-" + (dd[1] ? dd : "0" + dd[0]); // padding
};
function setCustomClassForSAPUI5ImageControl(_class) {
	var addClassGreen= "greenTable";
	var addClassRed= "redTable";
	
	if(_class=="Success"){
		if(this.hasStyleClass(addClassRed)){
			this.removeStyleClass(addClassRed);
		}
		this.addStyleClass(addClassGreen);
		return true;
	}else if(_class=="Failure"){
		
		if(this.hasStyleClass(addClassGreen)){
			this.removeStyleClass(addClassGreen);
		}
		this.addStyleClass(addClassRed);
		return true;
	}
		
};
function setCustomEnableForSolution(_class){
	
	if(_class=="Yes"){
		return true;
	}else  if(_class=="No"){
		return false;
	}
		

};
function setCustomClassForSolution(_class) {
	
	var addClassGreen= "greenTableLink";
	var addClassRed= "whiteerror";
	
	if(_class=="Yes"){
		if(this.oView.hasStyleClass(addClassRed)){
			this.oView.removeStyleClass(addClassRed);
		}
		this.oView.addStyleClass(addClassGreen);
		return true;
	}else  if(_class=="No"){
		
		if(this.oView.hasStyleClass(addClassGreen)){
			this.oView.removeStyleClass(addClassGreen);
		}
		this.oView.addStyleClass(addClassRed);
		return true;
	}
		
};

function setCustomClassForSAPUI5ImageControlVisibility(_class) {
	if(_class=="Success"){
		var falseVar = false;
		return falseVar;
	}else if(_class=="Failure"){
		var trueVar = true;
		return trueVar;
	}
		
};