$(function() {
    $('.pure-fake-file').click(function() {
        $('.pure-file').click();
    });

    $('.pure-file').change(function() {
        var path = $(this).val().split('\\');
        $('.pure-fake-file').val(path.slice(-1)[0]);
    });

    $('.pure-form').submit(function() { 
        $('#modal-loading').show();
        $('#modal-result').empty();
        $('#myModal').modal('show');

        $.ajax({
            url: '/api/apk/analyze',
            type: 'post',
            success: function(data) {
                $('#modal-loading').hide();
                $('#modal-result')
                    .append($('<pre></pre>').text(JSON.stringify(data, undefined, 2)))
                    .show();
                $('#myModal').modal('show');
            },
            data: new FormData($('.pure-form')[0]),
            cache: false,
            contentType: false,
            processData: false
        });

        return false;
    });
});
