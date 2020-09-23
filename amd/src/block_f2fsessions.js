define(['jquery', 'core/templates', 'local_sitereport/defaultconfig', 'local_sitereport/jquery.dataTables', 'local_sitereport/dataTables.bootstrap4'], function ($, templates, cfg) {
    var panel = cfg.getPanel("#f2fsessionsblock");
    var panelBody = cfg.getPanel("#f2fsessionsblock", "body");
    var table = panelBody + " #f2fsessionstable";

    function init() {
        $.ajax({
            url: cfg.requestUrl,
            type: cfg.requestType,
            dataType: cfg.requestDataType,
            data: {
                action: 'get_f2fsession_data_ajax',
                sesskey: $(panel).data("sesskey"),
                data: JSON.stringify({
                })
            },
        })
        .done(function(response) {
            templates.render(cfg.getTemplate('f2fsessiontable'), response.data)
            .then(function(html, js) {
                $(panelBody).empty();
                templates.appendNodeContents(panelBody, html, js);
            }).fail(function(ex) {
                console.log(ex);
            });
        })
        .fail(function(error) {
            console.log(error);
        })
    }

    // Must return the init function
    return {
        init: init
    };
});