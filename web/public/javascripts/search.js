$(function() {
    $('.pure-form').submit(function() {
        $('#modal-loading').show();
        $('#modal-result').empty();
        $('#myModal').modal('show');

        var query = $('#query').val();
        $.getJSON('/api/apk/search', { q: query }, function(data) {
            $('#modal-loading').hide();

            for(var i in data.result) {
                var item = data.result[i];
                var $item = $('<div></div>')
                    .addClass('result')
                    .append($('<span></span>').addClass('title').text(item.title))
                    .append($('<span></span>').addClass('version').text(item.version))
                    .append($('<span></span>').addClass('package').text(item.packagename));
                $item.append(
                    $('<button></button>')
                        .addClass('pure-button')
                        .data('data', item)
                        .click(function() {
                            var item = $(this).data('data');
                            window.open('/api/apk/download?id=' + item.id);
                        })
                        .text('Download')
                );

                $('#modal-result').append($item);
            }

            $('#modal-result').show();
            $('#myModal').modal('show');
        });
        return false;
    });
});
