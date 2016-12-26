var dict = require("./dict.js");

var DAO = function(db) {
	var that = this;
	this.db = db;
	this.coll = db.collection('test');
	this.update = function (query, updateDoc) {
		that.coll.update(query, updateDoc, function (err, count, operationStatus) {
			if (err) {console.log(err); console.log(operationStatus);};
			if (query._id) {console.log("Updated " + query._id)};
		});
	};
	this.saveAO = function (document) {
		var coll = that.coll;
		
		var data = document.querySelectorAll("tr > td", document.querySelector("div.tabcontent"));
			
		var doc = {};
		
		doc["_id"] = parseInt(document.querySelector("span#ref").innerHTML.substring(33), 10);
		doc["date_maj"] = new Date();
		
		//éventuellement changer en : parcourir tous les items. De toute façon ils sont checkés par le if et on évite des risques de décalage
		for (var i = 0; i < data.length - 1; i += 2) {
			if (dict[data[i].innerHTML]) {
				doc[dict[data[i].innerHTML]] = data[i+1].innerHTML;
			}
		}
		
		var date = doc.date_diffusion.split("/");
		doc.date_diffusion = new Date(date[2], date[1]-1, date[0]);
		
		date = doc.date_debut.split("/");
		doc.date_debut = new Date(date[2], date[1]-1, date[0]);
		
		date = doc.date_fin.split("/");
		doc.date_fin = new Date(date[2], date[1]-1, date[0]);
		
		doc.competences = {};
		
		var competences = document.querySelectorAll("li > a[nclickallowed=true]", document.querySelector("div.tabcontent"));
		
		for (var i=0; i < competences.length; i++) {
			var cptce = competences[i].childNodes[0].data.replace(/ $/, "");
			doc.competences[cptce] = competences[i].className;
		}
		
		coll.save(doc);
	}
}

module.exports = DAO;