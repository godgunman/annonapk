$(function() {
    $.get('/api/apk/list', function(data) {
        for(var i in data.result) {
            var item = data.result[i];
            var $li = $('<li></li>')
                .data('data', item)
                .append(
                    $('<img>')
                        .attr('src', '/apk/analytics/' + item.icon_link)
                )
                .append(
                    $('<span></span>')
                        .addClass('title')
                        .text(item.app_name)
                )
                .append(
                    $('<span></span>')
                        .addClass('package')
                        .text(item.package)
                )
                .click(function() {
                    var item = $(this).data('data');
                    window.open(item.link);
                })
                .hide();

            $('#result-list')
                .append(
                    $li.fadeIn()
                );
        }
    });
});
