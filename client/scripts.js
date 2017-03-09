$(document).ready(function () {
    /*Calls function once page loaded to display tweets to page*/
    getData();
    //disable button on page load
    $('button').prop('disabled', true);
    //when input field has text in it, enable the button
    $("#createChirp").keypress(function () {
        $('button').prop('disabled', false);
    });
    //on  button click, empty the input field and disable the button
    $("#btn").click(function () {
        postData();
        $('#createChirp').val('');
        $('button').prop('disabled', true);
    })

    function postData() {
        var newChirp = {
            message: $('#createChirp').val(),
            user: "myName",
        }

        // console.log('hello');

        $.ajax({
            method: "POST",
            url: 'http://localhost:3000/api/chirps',
            contentType: 'application/json',
            data: JSON.stringify(newChirp)
        })
            .then(function (success) {
                console.log("APPENDING");
                $('<div class="results"></div>').text(newChirp.message).appendTo(
                    $("#posts")

                ), function (err) {
                    console.log(err);
                };
            })
            .fail(function (xhr, status, error) {
                console.log('failing');
                console.log(xhr);
                console.log(status);
                console.log(error);
            });
    }

    function getData() {
        console.log("GETTING");
        $.ajax({
            method: 'GET',
            url: 'http://localhost:3000/api/chirps',
            contentType: 'application/json'
        }).then(function (success) {
            console.log(success);
            $('#posts').empty();
            for (i = 0; i < success.length; i++) {
                $('<div class="results"></div>').text(success[i].message).appendTo($('#posts'));
                $('<button></button').text("DELETE").appendTo($('#posts'));
            }
        })
    }
});


