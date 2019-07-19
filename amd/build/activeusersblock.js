define(['jquery', 'core/chartjs', 'report_elucidsitereport/defaultconfig', 'report_elucidsitereport/flatpickr'], function ($, Chart, defaultConfig) {
    function init() {
        /* Varible for active users block */
        var cfg               = defaultConfig.activeUsersBlock;
        var panel             = defaultConfig.getPanel("#activeusersblock");
        var panelBody         = defaultConfig.getPanel("#activeusersblock", "body");
        var panelTitle        = defaultConfig.getPanel("#activeusersblock", "title");
        var panelFooter       = defaultConfig.getPanel("#activeusersblock", "footer");
        var dropdownMenu      = panel + " .dropdown-menu";
        var dropdownItem      = dropdownMenu + " .dropdown-item";
        var dropdownToggle    = panel + " .dropdown-toggle";
        var flatpickrCalender = panel + " #flatpickrCalender";
        var chart             = panelBody + " .ct-chart";
        var loader            = panelBody + " .loader";
        var dropdownButton    = panel + " button[data-toggle='dropdown']";


        /* Custom Dropdown hide and show */
        $(document).ready(function() {
            /* Show custom dropdown */
            $(dropdownToggle).on("click", function() {
                $(dropdownMenu).addClass("show");
            });

            /* Hide dropdown when click anywhere in the screen */
            $(document).click(function(e){
                if ($(e.target).hasClass("dropdown-menu") || 
                    $(e.target).parents(".dropdown-menu").length) {
                  e.preventDefault();
                } else {
                    $(dropdownMenu).removeClass('show');
                }
            });

            /* Select filter for active users block */
            $(dropdownItem + ":not(.custom)").on('click', function() {
                $(dropdownMenu).removeClass('show');
                $(dropdownButton).html($(this).text());
                getActiveUsersBlockData($(this).attr('value'));
            });

            createDropdownCalendar();
        });

        /* Create Calender in dropdown tp select range */
        function createDropdownCalendar() {
            $(flatpickrCalender).flatpickr({
                mode: 'range',
                altInput: true,
                altFormat: "d/m/Y",
                dateFormat: "Y-m-d",
                maxDate: "today",
                appendTo: document.getElementById("activeUser-calendar"),
                onOpen: function(event) {
                    $(dropdownMenu).addClass('withcalendar');
                },
                onClose: function() {
                    $(dropdownMenu).removeClass('withcalendar');
                    $(dropdownMenu).removeClass('show');
                    selectedCustomDate();
                }
            });
        }

        /* After Select Custom date get active users details */
        function selectedCustomDate() {
            var date = $(flatpickrCalender).val();

            if (!date.includes("to")) {
                return false;
            }

            $(dropdownButton).html(date);
            $(flatpickrCalender).val("");
            getActiveUsersBlockData(date);
        }

        /* Get data for active users block */
        function getActiveUsersBlockData(filter) {
            $(chart).addClass('d-none');
            $(loader).removeClass('d-none');

            $.ajax({
                url: defaultConfig.requestUrl,
                data: {
                    action: 'get_activeusers_graph_data_ajax',
                    data: JSON.stringify({
                        filter : filter
                    })
                },
            }).done(function(response) {
                cfg.graph.data = response.data;
                cfg.graph.labels = response.labels;
            }).fail(function(error) {
                console.log(error);
            }).always(function() {
                activeUsersGraph = generateActiveUsersGraph();
                setInterval(inceamentUpdateTime, 1000 * 60);
                $(chart).removeClass('d-none');
                $(loader).addClass('d-none');
            });
        }

        /* Increament update time in panel header */
        function inceamentUpdateTime() {
            $(panelTitle + " #updated-time > span.minute").html(parseInt($(panelTitle + " #updated-time > span.minute").text()) + 1);
        }

        /* Generate Active Users graph */
        function generateActiveUsersGraph () {
            if(activeUsersGraph) {
                activeUsersGraph.destroy();
            }

            Chart.defaults.global.defaultFontFamily = cfg.graph.fontFamily;
            Chart.defaults.global.defaultFontStyle = cfg.graph.fontStyle;
            return activeUsersGraph = new Chart(cfg.ctx, {
                type: cfg.graph.type,
                data: getGraphData(),
                options: cfg.graph.options
            });
        }

        /* Get graph data */
        function getGraphData() {
            return {
                labels: cfg.graph.labels,
                datasets: [{
                    label: cfg.graph.labelName.activeUsers,
                    data: cfg.graph.data.activeUsers,
                    backgroundColor: cfg.graph.backgroundColor.activeUsers,
                    borderColor: cfg.graph.borderColor.activeUsers,
                    pointBorderColor: cfg.graph.borderColor.activeUsers,
                    pointBackgroundColor: cfg.graph.borderColor.activeUsers,
                    pointStyle: cfg.graph.pointStyle
                },
                {
                    label: cfg.graph.labelName.enrolments,
                    data: cfg.graph.data.enrolments,
                    backgroundColor: cfg.graph.backgroundColor.enrolments,
                    borderColor: cfg.graph.borderColor.enrolments,
                    pointBorderColor: cfg.graph.borderColor.enrolments,
                    pointBackgroundColor: cfg.graph.borderColor.enrolments,
                    pointStyle: cfg.graph.pointStyle
                },
                {
                    label: cfg.graph.labelName.completionRate,
                    data: cfg.graph.data.completionRate,
                    backgroundColor: cfg.graph.backgroundColor.completionRate,
                    borderColor: cfg.graph.borderColor.completionRate,
                    pointBorderColor: cfg.graph.borderColor.completionRate,
                    pointBackgroundColor: cfg.graph.borderColor.completionRate,
                    pointStyle: cfg.graph.pointStyle
                }]
            };
        }

        /* Call function to initialize the active users block graph */
        var activeUsersGraph = getActiveUsersBlockData();
    }

    // Must return the init function
    return {
        init: init
    };
});