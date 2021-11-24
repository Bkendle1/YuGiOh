var deck = [];
var activeCard = 0;

//define our app
var app = angular.module('browseCardsApp', []);

//create controller
app.controller('browsedCardsCtrl', function($scope, $http) {
	$scope.obj = [];

	$scope.get_records = function() {
		$http({
			method: 'get',
			url: 'http://localhost:5000/read-records'
		}).then(
			function(response) {
				if (response.data.msg === 'SUCCESS') {
					deck = response.data.cardData;
					$scope.obj = deck[activeCard];
					$scope.showHide();
				} else {
					console.log(response);
					//the problem is that for some reason, response.data.msg != 'SUCCESS'
					console.log(response.data.msg);
					console.log("msg wasn't SUCCESS");
				}
			},
			function(response) {
				console.log(response);
			}
		);
	};

	//call function
	$scope.get_records();

	$scope.changeCard = function(direction) {
		activeCard += direction;
		//update the obj
		$scope.obj = deck[activeCard];
		$scope.showHide();
	};

	$scope.showHide = function() {
		//ternary variable
		$scope.hidePrev = activeCard === 0 ? true : false;
		$scope.hideNext = activeCard === deck.length - 1 ? true : false;
	};
});
