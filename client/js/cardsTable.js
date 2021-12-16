var app = angular.module('cardsTableApp', []);

app.controller('cardsTableCtrl', function($scope, $http) {
	$scope.deck = [];

	//drop down for card types
	$scope.types = [];

	$scope.get_records = function() {
		$http({
			method: 'get',
			url: 'http://localhost:5000/read-records'
		}).then(
			function(response) {
				if (response.data.msg === 'SUCCESS') {
					console.log(response.data.cardData);
					$scope.deck = response.data.cardData;
					$scope.types = getTypes(response.data.cardData);
					$scope.selectedType = $scope.types[0];
				}
			},
			function(response) {
				console.log(response);
			}
		);
	}; //end of get_records

	$scope.redrawTable = function() {
		//get the selected card types
		var type = $scope.selectedType.value;

		$http({
			method: 'get',
			url: 'http://localhost:5000/get-cardsByType',
			params: { cardType: type }
		}).then(
			function(response) {
				if (response.data.msg === 'SUCCESS') {
					$scope.deck = response.data.deck;
				} else {
					console.log(response);
				}
			},
			function(response) {
				console.log(response);
			}
		);
	}; //end of redrawTable()

	$scope.deleteCard = function(cardID) {
		$http({
			method: 'delete',
			url: 'http://localhost:5000/delete-records',
			params: { id: cardID }
		}).then(
			function(response) {
				if (response.data.msg === 'SUCCESS') {
					$scope.redrawTable();
				} else {
					console.log(response);
				}
			},
			function(response) {
				console.log(response);
			}
		);
	};

	$scope.get_records();

	$scope.editCard = function(cardNum) {
		$scope.name = $scope.deck[cardNum].cardName;
		$scope.description = $scope.deck[cardNum].description;
		$scope.type = $scope.deck[cardNum].cardType;
		$scope.attribute = $scope.deck[cardNum].attribute;
		$scope.level = $scope.deck[cardNum].level;
		$scope.cardID = $scope.deck[cardNum]['_id'];

		$scope.hideTable = true;
		$scope.hideForm = false;
	};

	$scope.cancelEdit = function() {
		$scope.hideTable = false;
		$scope.hideForm = true;
	};

	$scope.updateCard = function() {
		if ($scope.name === '' || $scope.description === '' || $scope.type === '') {
			return;
		}

		console.log('Card ID check: ' + $scope.cardID);

		$http({
			method: 'put',
			url: 'http://localhost:5000/update-card',
			data: {
				cardID: $scope.cardID,
				cardName: $scope.name,
				description: $scope.description,
				cardType: $scope.type.toLowerCase(),
				attribute: $scope.attribute,
				level: $scope.level
			}
		}).then(
			function(response) {
				
				if (response.data.msg === 'SUCCESS') {
					$scope.hideTable = false;
					$scope.hideForm = true;
					$scope.redrawTable();

					$scope.name = '';
					$scope.description = '';
					$scope.type = '';
					$scope.attribute = '';
					$scope.level = '';
				} else {
					console.log(response);
				}
			},
			function(response) {
				console.log(response);
			}
		);
	};
}); //end of controller

function getTypes(cardTableData) {
	//detect unique card types in array
	var typeExist;

	var typesArray = [ { value: '', display: 'ALL' } ];
	//card types
	for (var i = 0; i < cardTableData.length; i++) {
		typeExist = typesArray.find(function(element) {
			return element.value === cardTableData[i].cardType;
		});

		if (typeExist) {
			continue;
		} else {
			typesArray.push({ value: cardTableData[i].cardType, display: cardTableData[i].cardType.toUpperCase() });
		}
	}
	return typesArray;
}
