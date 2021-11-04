//when i click this button, do this:
//'#' is used when referring to ids like in CSS
$('#data-submit').click(function(){
    var formData = {
        cardName: $('#name').val(),
        description: $('#description').val(),
        cardType: $('#type').val(),
        attribute: $('#attribute').val(),
        level: $('#level').val() 
    }
    console.log("data: " + JSON.stringify(formData));

    
    $.ajax({
      url:'https://localhost:5000/write-record',
      type: 'post',
      data: formData,
      success: function(response) {
        var returnData = JSON.parse(response);

        if(returnData.msg === "SUCCESS") {
            alert("SUCCESS");
        } else {
            console.log(response);
        }
      },
      error: function(response) {
          console.log(response);
      }
    })
    return false;
})