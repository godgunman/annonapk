$(function() {
    $('.pure-fake-file')
        .prop('disabled', false)
        .click(function() {
            $('.pure-file').click();
        }).show();

    $('.pure-file')
        .change(function() {
            var $file = $(this);
            $('.pure-fake-file').val($file.val());
        });
});
