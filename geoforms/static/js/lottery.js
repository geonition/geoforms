function addLotteryForm(url, thank_you_msg) {
    function getCookie(name) {
        var cookieValue = null;
        if (document.cookie && document.cookie != '') {
            var cookies = document.cookie.split(';');
            for (var i = 0; i < cookies.length; i++) {
                var cookie = jQuery.trim(cookies[i]);
                // Does this cookie string begin with the name we want?
                if (cookie.substring(0, name.length + 1) == (name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    }
    var csrftoken = getCookie('csrftoken');
    var beforeSend = function(xhr, settings) {
            xhr.setRequestHeader("X-CSRFToken", csrftoken);
        };

    $.ajax({
        url: url,
        beforeSend: beforeSend
    }).done(
        function(data) {
            var empty_form = $(data.msg); 
            $('.lottery')
                .append($('<a href="http://ayk.asiatkartalle.fi/static/rekisteriseloste_ayk.doc">Rekisteriseloste</a><br /><br />'))
                .append(empty_form
                    .append($('<button></button>')
                        .text('Save')
                        .click(function(){
                            $.ajax({
                                url: url,
                                type: 'POST',
                                data: $('.lottery input#id_email').val(),
                                beforeSend: beforeSend
                            }).done(function(data){
                                        if (data.msg === 'success'){
                                            $('.lottery').html($('<p>' + thank_you_msg + '</p>'));
                                        }
                            });

                        })
            ));
    });
}
