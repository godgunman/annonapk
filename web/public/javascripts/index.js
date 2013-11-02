$(function() {
    $('.pure-fake-file')
        .prop('disabled', false)
        .click(function() {
            $('.pure-file').click();
        }).show();

    $('.pure-file')
        .change(function() {
            $('.pure-fake-file').val($(this).val());
        });
});
