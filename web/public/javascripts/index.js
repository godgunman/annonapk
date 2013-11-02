$(function() {
    $('.pure-fake-file').click(function() {
        $('.pure-file').click();
    }).show();

    $('.pure-file').change(function() {
        $('.pure-fake-file').val($(this).val());
    });

    $('.pure-form').submit(function() {
        var $data = $(this).serialize();
        $.post('/api/apk/analyze', $data, function(data) {
            console.log(data);
        });
        return false;
    });
});
