$(function() {
    $('.pure-fake-file').click(function() {
        $('.pure-file').click();
    });

    $('.pure-file').change(function() {
        var $file = $(this);
        $('.pure-fake-file').val($file.val());
    });

    $('.pure-button').click(function() { 
        var client = new XMLHttpRequest();

        function upload() {
            var file = document.getElementById("apk");
            /* Create a FormData instance */
            var formData = new FormData();
            /* Add the file */ 
            formData.append("apk", file.files[0]);

            client.open("post", "/api/apk/analyze", true);
            client.send(formData);  /* Send to server */ 
        }

        /* Check the response status */  
        client.onreadystatechange = function() {
            if (client.readyState == 4 && client.status == 200) {
                if(client.statusText == "OK") {
                    alert(client.response);
                }
            }
        }
        upload();
        $('#loading').fadeIn();
        $('.pure-fake-file').prop('disabled','true');
        $('.pure-button').prop('disabled','true')
        return false;
    });
});
