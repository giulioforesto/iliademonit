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
	
	dao.find({etat: {'$ne': "Terminé"}}, function(err, result) {
		for (var i = 0; i < result.length; i++) {
		//open tab!
			browser.recherche({reference: result[i]._id}, function() {
				if (browser.query("table #matrix > tbody > tr")) {
					let status = browser.queryAll("table #matrix > tbody > tr > td")[4].innerHTML
					if (status != result[i].etat) {
						dao.update({_id: result[i]._id}, {'$set': {etat: status}});
					}
				} else {
					console.log("Erreur non fatale : L'AO " + result[i]._id + " est présent dans la base mais pas dans Iliade.");
				}
			});
			
		}
	});

	browser = new Browser();

	var visitNextPage = function(newPage) {
		var processNewPage = function () {
			console.log("new page function");
			var pagingText = browser.queryAll("div.paging > ul > li > span")[2].innerHTML;
			var maxPages = pagingText.substring(11);
			
			if (newPage <= maxPages) {
				browser.fill("input[name=pageNb]", newPage);
				var form = browser.queryAll("form")[1];
				form.submit();
				
				browser.wait()
					.then(function() {
						console.log(browser.queryAll("div.paging > ul > li > span")[2].innerHTML);
						
						var links = browser.queryAll("a");
						return {
							page: newPage,
							links: links
						};
					}).then(visitNextAO);
			} else {
				console.log("Insertion completed");
				db.close();
				process.exit();
			}
		}
		
		if (browser.query("Liste des consultations")) {
			browser.clickLink("Liste des consultations", processNewPage);
		} else {
			processNewPage();
		}
	};

	browser.connect(function() {
		console.log("Accueil");
		browser.clickLink("Liste des consultations", function() {
			console.log("Liste des consultations");
			browser.clickLink("Date de la première diffusion", function() {
				browser.clickLink("Date de la première diffusion", function() {
					console.log("Tri effectué");
					var page;
					if (browser.query("div.paging")) {
						var paging = browser.queryAll("div.paging > ul > li > span")[2].innerHTML;
						console.log(paging); // "Page p sur n"
						page = 1;
					}
					
					var links = browser.queryAll("a");
					var options = {
						page: page,
						links: links
					};
					visitNextAO(options);
				});
			});
		});
	});
});