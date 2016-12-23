var ids = require("./ids.js");

var connect = function (callback) {
	var browser = this;
	browser.visit("https://iliade.cib.bnpparibas.com/portal/app/template/portal/PortalLogin.vm/", function () {
		console.log("Page de connexion");	
		browser
			.fill("#loginInput", ids.login)
			.fill("#password", ids.password)
			.pressButton("#xsubmit", callback);
	});
};

/**
 * Only reference parameter is supported for now.
 */

var recherche = function (options, callback) {
	browser
		.fill("input[name=PORTAL_SupplierConsultationFilterGroup_keyPORTAL_SupplierConsultationFilterGroupconsultationStateCode_key]", options.consultationState||"")
		.fill("input[name=PORTAL_SupplierConsultationFilterGroup_keyPORTAL_SupplierConsultationFilterGroupreference_key]", options.reference||"")
	
	var document = browser.document;
	var formId = browser.query("form").name;
	document[formId] = browser.query("form");
	
	if (callback) {
		browser.pressButton("Chercher", callback);
	} else {
		return browser.pressButton("Chercher");
	}
}

module.exports = {
	connect: connect,
	recherche: recherche
};