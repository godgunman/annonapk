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

                var $code = $('<pre><code></code></pre>').text(JSON.stringify(data, undefined, 2));
                $('#modal-result')
                    .append($code)
                    .show();
                hljs.highlightBlock($code[0]);

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
