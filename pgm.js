var Browser = require('zombie');
var Db = require('mongodb').Db;
var Server = require('mongodb').Server;

var DAO = require('./DAO.js');

Browser.prototype.connect = require('./iliadeFcts.js').connect;
Browser.prototype.recherche = require('./iliadeFcts.js').recherche;

var db = new Db('db', new Server('localhost', 27017), {safe: false});

db.open(function(err, db) {
	if (err) throw err;
	
	var dao = new DAO(db);
	browser = new Browser();
	
	browser.connect(function() {
		console.log("Accueil");
		browser.clickLink("Liste des consultations", function () {
			var cursor = dao.coll.find({etat: {'$ne': "Terminé"}}, {'_id': 1, etat: 1}, {limit: 20});
			function nextObjFct (err, result) {
				if (err) {console.log(err);}
				if (result) {
					browser.recherche({reference: result._id}, function() {
						console.log("Searched " + result._id);
						var line = browser.querySelector("table.matrix > tbody > tr");
						if (line) {
							var lineElts = line.querySelectorAll("td");
							if (lineElts[0].children[0].innerHTML.match(new RegExp(result._id)) && lineElts[4].innerHTML != result.etat) {
								dao.update({'_id': result._id}, {'$set': {etat: lineElts[4].innerHTML}});
							}
						}
						cursor.nextObject(nextObjFct);
					});
				} else {
					cursor.close();
					db.close();
				}
			}
			cursor.nextObject(nextObjFct);
		});
	});
});