sap.ui.define([], () => {
	"use strict";
	return {
        setCustomClassForSolution(_class) {
			var addClassGreen= "greenTableLink";
			var addClassRed= "whiteerror";
			
			if(_class=="Yes"){
				if(this.hasStyleClass(addClassRed)){
					this.removeStyleClass(addClassRed);
				}
				this.addStyleClass(addClassGreen);
				return true;
			}
			else  if(_class=="No"){
				if(this.hasStyleClass(addClassGreen)){
					this.removeStyleClass(addClassGreen);
				}
				this.addStyleClass(addClassRed);
				return true;
			}
        },
		statusText(sStatus) {
			const oResourceBundle = this.getOwnerComponent().getModel("i18n").getResourceBundle();
			switch (sStatus) {
				case "A":
					return oResourceBundle.getText("invoiceStatusA");
				case "B":
					return oResourceBundle.getText("invoiceStatusB");
				case "C":
					return oResourceBundle.getText("invoiceStatusC");
				default:
					return sStatus;
			}
		}
	};
});
