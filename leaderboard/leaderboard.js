PlayersList = new Mongo.Collection('players');

/*
	Database data for insert

	PlayersList.insert({ name : "Bob", score : 0 });
	PlayersList.insert({ name : "Mary", score : 0 });
	PlayersList.insert({ name : "David", score : 0 });
	PlayersList.insert({ name : "Bill", score : 0 });
	PlayersList.insert({ name : "Tim", score : 0 });
	PlayersList.insert({ name : "Warren", score : 0 });
	
*/

if (Meteor.isClient)
{
	//the code runs only on the client
	/*
	// this is a deprecated approach
	Template.leaderboard.player = function()
	{ 
		return "Some other text" 
	}
	*/
	/*
	// new approach
	Template.leaderboard.helpers({
		"player" : function() {return "Some other text"},
		"otherHelperFunction" : function() {return "Some other function"}
	});
	*/

	Template.leaderboard.helpers({
		"player" : function() { return PlayersList.find({}, { sort : {score : -1, name: 1} }) },
		"countPlayers" : function() { return PlayersList.find().count() },
		"selectedClass" : function() { 
			var playerId = this._id;
			var selectedPlayer = Session.get("selectedPlayer");
			if (playerId == selectedPlayer)	{ return "selected"; }
		},
		"showSelectedPlayer" : function() {
			var selectedPlayer = Session.get("selectedPlayer");
			return PlayersList.findOne(selectedPlayer)
		}
	});

	Template.leaderboard.events({
		"click .player" : function(){
			var playerId = this._id;
			Session.set('selectedPlayer', playerId);
			var selectedPlayer = Session.get("selectedPlayer");
			console.log(selectedPlayer);
			console.log("You clicked .player element");
		},
		"click .increment" : function () {
			var selectedPlayer = Session.get("selectedPlayer");
			PlayersList.update(selectedPlayer, { $inc : { score : 5 }  });
		},
		"click .decrement" : function () {
			var selectedPlayer = Session.get("selectedPlayer");
			PlayersList.update(selectedPlayer, { $inc : { score : -5 }  });
		},

		"click .remove" : function() {
			var selectedPlayer = Session.get("selectedPlayer");
			var choice = confirm("Do you want really to remove the player?");
			if(choice == true) PlayersList.remove(selectedPlayer);

		}

	});

	Template.addPlayerForm.events({

		"submit form" : function () {
		 	event.preventDefault();
			var playerNameVar = event.target.playerName.value;
			var playerScore = event.target.scoreNumber.value;
			PlayersList.insert({
				name: playerNameVar,
				score: playerScore,
			});
			event.target.playerName.value = null;
			event.target.scoreNumber.value = null;
			

		}
	});
}

if (Meteor.isServer)
{
	//the code runs only on the server


}