//
$.ajax({
	url: 'http://localhost:5000/read-records',
	type: 'get',
	success: function(response) {
		var returnData = JSON.parse(response);

		if (returnData.msg === 'SUCCESS') {
			console.log('Data returned: ' + JSON.stringify(returnData.cardData));
			displayTable(returnData.cardData);
		} else {
			console.log(response);
		}
	},
	error: function(response) {
		console.log(response);
	}
});

function displayTable(dataArr) {
	console.log('Database Array: ' + dataArr);
	console.log('Database Array length: ' + dataArr.length);
	console.log('First Card: ' + dataArr[0].cardName);

	var htmlString = '';
	for (var i = 0; i < dataArr.length; i++) {
		htmlString += '<tr>';
		htmlString += '<td>' + dataArr[i].cardName + '</td>';
		htmlString += '<td>' + dataArr[i].description + '</td>';
		htmlString += '<td>' + dataArr[i].cardType + '</td>';
		htmlString += '<td>' + dataArr[i].attribute + '</td>';
		htmlString += '<td>' + dataArr[i].level + '</td>';
		htmlString += '</tr>';
	}

	$('#card-table').append(htmlString);
}
