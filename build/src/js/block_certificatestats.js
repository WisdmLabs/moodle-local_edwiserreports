define(["jquery", "core/templates", "report_elucidsitereport/defaultconfig"], function($, templates, cfg) {
    var panel = cfg.getPanel("#certificatestatsblock");
    var panelBody = cfg.getPanel("#certificatestatsblock", "body");
    var table = panel + " .table";
    var dropdownBody = panel + " .table-dropdown";
    var dropdownTable = panelBody + " .dataTables_wrapper .row:first-child > div:first-child";

    function init () {
        $.ajax({
            url: cfg.requestUrl,
            type: cfg.requestType,
            dataType: cfg.requestDataType,
            data: {
                action: 'get_certificates_data_ajax',
                sesskey: $(panel).data("sesskey")
            },
        })
        .done(function(response) {
            templates.render('report_elucidsitereport/certificatestable', response.data)
            .then(function(html, js) {
                $(panelBody).empty();
                templates.appendNodeContents(panelBody, html, js);
                createActiveCourseTable(response.data);
            }).fail(function(ex) {
                console.log(ex);
            });
        })
        .fail(function(error) {
            console.log(error);
        });
    }

    function createActiveCourseTable() {
        certificatesTable = $(table).DataTable({
            language: {
                searchPlaceholder: "Search Certificates"
            },
            initComplete: function() {
                $(dropdownTable).html($(dropdownBody).html());
                $(dropdownBody).remove();
                $(dropdownTable + " .dropdown").show();
            },
            scrollY : "200px",
            scrollCollapse : true,
            fixedHeader: {
                header: true,
                headerOffset: 45
            },
            scrollX: true,
            paging: false,
            bInfo : false
        });
    }

    // Must return the init function
    return {
        init: init
    };
});