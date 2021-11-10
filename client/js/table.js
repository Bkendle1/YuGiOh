//receive record from services.js
const deckURL = 'http://localhost:5000/read-records'

createTable();

function createTable() {
	$.ajax({
		url: deckURL,
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
}


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
		// htmlString += '<td>' + dataArr[i].id + '</td>';
		//add delete button for each element
		htmlString += "<td>" + "<button class='data-delete'" + "data_id='" + dataArr[i].id + "'>Graveyard" + "</button></td>";
		htmlString += '</tr>';
	}
	//you could use .html(htmlString) if you put the table headers in <thead>
	//and then have the rows in a <tbody> and give that the idea for this jQuery
	$('#card-table').html(htmlString);

	//create enable delete buttons for when the rows exist
	enableDelete();
}

//deletes rows (still need to implement app.delete in services.js)
function enableDelete() {
$('.data-delete').click(function() {
	//when the delete button is clicked, it specifies that it's whatever delete button specifically you just clicked
	var id = $(this).val();

	$.ajax({
		url: deckURL + '/delete-records',
		 type: 'delete',
		 data: id,
		success: function(response) {
			var returnData = JSON.parse(response);
	
			if (returnData.msg === 'SUCCESS') {
				createTable();
			} else {
				console.log(response);
			}
		},
		error: function(response) {
			console.log(response);
		}
	});
	
})
}

