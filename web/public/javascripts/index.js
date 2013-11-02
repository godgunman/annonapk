$(function() {
    $('.pure-fake-file').click(function() {
        $('.pure-file').click();
    }).show();

    $('.pure-file').change(function() {
        var $file = $(this);
        $('.pure-fake-file').val($file.val());
    });

    $('.pure-form').submit(function() { 
        var $data = $(this).serialize();
        $.post('/api/apk/analyze', $data, function(data,textStatus) {
            console.log(data);
        });
        return false;
    });
});
