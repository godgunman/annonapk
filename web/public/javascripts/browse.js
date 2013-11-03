$(function() {
    $.get('/api/apk/list', function(data) {
        for(var i in data.result) {
            var item = data.result[i];
            var $li = $('<li></li>')
                .append(
                    $('<img>')
                        .attr('src', item.link + '/res/drawable/icon.png')
                )
                .append(
                    $('<span></span>')
                        .addClass('package')
                        .text(item.package)
                )
                .hide();

            $('#result-list')
                .append(
                    $li.fadeIn()
                );
        }
    });
});
