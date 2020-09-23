define([
    'jquery',
    'core/notification',
    'core/fragment',
    'core/modal_factory',
    'core/modal_events', 
    'core/templates',
    'core/str',
    'local_sitereport/variables',
    'local_sitereport/selectors',
    'local_sitereport/templateselector',
    'local_sitereport/jspdf',
    'local_sitereport/select2',
    'local_sitereport/jquery.dataTables',
    'local_sitereport/dataTables.bootstrap4'
    ], function(
        $,
        notif,
        fragment,
        ModalFactory,
        ModalEvents,
        Templates,
        str,
        v,
        selector,
        tempSelector,
        jsPDF
    ) {
    var emailListTable = null;
    /**
     * Email Shcedule Modal Related Psrametres start
     */
    // Form root
    var formRoot = '#scheduletab';

    // Dropdowns
    var dropdowns = formRoot + ' .dropdown a.dropdown-item';
    var dropdownSelector = 'button.dropdown-toggle';

    // Duration dropdown selectors
    var durationSelector = formRoot + ' .dropdown.duration-dropdown a.dropdown-item';
    var durationBtn = formRoot + ' button#durationcount';
    var durationInput = formRoot + ' input#esr-sendduration';

    // Times dropdown selector
    var timesDropdown = formRoot + ' .dropdown:not(.duration-dropdown)';
    var timesDropdownBtn = timesDropdown + ' button.dropdown-toggle';
    var timesDropdownLink = timesDropdown + ' a.dropdown-item';
    var dailyDropdownBtn = formRoot + ' .dropdown.daily-dropdown button.dropdown-toggle';
    var weeklyDropdownBtn = formRoot + ' .dropdown.weekly-dropdown button.dropdown-toggle';
    var monthlyDropdownBtn = formRoot + ' .dropdown.monthly-dropdown button.dropdown-toggle';
    
    var daySelector = formRoot + ' .dropdown.weeks-dropdown a.dropdown-item';
    var dayBtn = formRoot + ' button#weeksdropdown';
    var timeInput = formRoot + ' input#esr-sendtime';

    // For email schedule setting
    var settingBtn = "#listemailstab .esr-email-sched-setting";
    var deleteBtn = "#listemailstab .esr-email-sched-delete";
    var emailListToggleSwitch = "#listemailstab [id^='esr-toggle-']";

    // Messaged for email schedule
    var loader = '<div class="w-full text-center"><i class="fa fa-spinner fa-spin" aria-hidden="true"></i></div>'
    var errormsg = '<div class="alert alert-danger"><b>ERROR:</b> Error while scheduling email<div>';
    var successmsg = '<div class="alert alert-success"><b>Success:</b> Email scheduled successfully<div>';
    var deletesuccessmsg = '<div class="alert alert-success"><b>Success:</b> Email deleted successfully<div>';
    var deleteerrormsg = '<div class="alert alert-danger"><b>ERROR:</b> Email deletion failed<div>';
    var emptyerrormsg = '<div class="alert alert-danger"><b>ERROR:</b> Name and Recepient Fields can not be empty<div>';
    var emailinvaliderrormsg = '<div class="alert alert-danger"><b>ERROR:</b> Invalid email adderesses space not allowed<div>';

    var tabs = '[data-plugin="tabs"] .nav-link, [data-plugin="tabs"] .tab-pane';
    var formTab = '[aria-controls="scheduletab"], #scheduletab';

    var windowLoader = '<div id="cover-spin"></div>';

    /**
     * Email Shcedule Modal Related Psrametres end
     */

    $(document).ready(function() {
        var isNavlink = null;
        var pageContent = $("#page-admin-report-elucidsitereport-index .page-content");
        var pageWidth = pageContent.width();
        var exportPdf = '.download-links button[value="pdf"]';
        var exportEmailDropdown = '.download-links button[value="email"]';
        var scheduledEmailDropdown = '.download-links button[value="emailscheduled"]';
        var durationDropdown = '#scheduletab .dropdown.duration-dropdown a.dropdown-item';
        var weeksDropdown = '#scheduletab .dropdown.weeks-dropdown a.dropdown-item';

        // Export Selectors
        var exportLinks = '.download-links';
        var exportLink = '.download-links a[data-typr="pdf"], .download-links a[data-typr="csv"]';

        rearrangeBlocks(pageWidth, isNavlink);

        // Resize block according to the block
        $(window).on('resize', function() {
            var pageWidth = v.pluginPage.width();
            rearrangeBlocks(pageWidth);
        });

        // function showCoverLoader() {
        //     if ($(document).find('#cover-spin')) {
        //         $("body").append(windowLoader);
        //     }
        //     $(document).find('#cover-spin').show(0);
        // }

        // // Export data in various formats
        // $(document).on("click", exportLink, function(e) {
        //     // Remove the default action
        //     e.preventDefault();

        //     // Show loader while downloading the csv content
        //     showCoverLoader();

        //     var _this = this;
        //     $.ajax({
        //         url: this.href,
        //         type: 'POST',
        //         data: {
        //             'type': $(_this).data('type'),
        //             'block': $(exportLinks).data('block'),
        //             'filter': $(exportLinks).data('filter'),
        //             'cohortid': $(exportLinks).data('cohortid'),
        //             'region': $(exportLinks).data('region')
        //         }
        //     }).done(function(response) {
        //         response = JSON.parse(response);
        //         window.open(response.data);
        //     }).always(function() {
        //         $(document).find('#cover-spin').remove();
        //     });
        // });

        // Export data in pdf
        $(document).on("click", exportPdf, function(e) {
            e.preventDefault();

            if ($(document).find('#cover-spin')) {
                $("body").append(windowLoader);
            }

            $(document).find('#cover-spin').show(0);

            var _this = this;
            var form = $(_this).closest("form");
            $.ajax({
                url: form.attr('action'),
                type: 'POST',
                data: {
                    'type': $(_this).val(),
                    'block': form.find('input[name="block"]').val(),
                    'filter': form.find('input[name="filter"]').val(),
                    'cohortid': form.find('input[name="cohortid"]').val(),
                    'region': form.find('input[name="region"]').val()
                }
            }).done(function(response) {
                response = JSON.parse(response);
                var pdf = new jsPDF('p', 'pt', 'a4');
                var margins = {
                    top: 40,
                    bottom: 30,
                    left: 10,
                    width: "100%"
                };

                pdf.setFontSize(10)

                // we support special element handlers. Register them with jQuery-style 
                // ID selector for either ID or node name. ("#iAmID", "div", "span" etc.)
                // There is no support for any other type of selectors 
                // (class, of compound) at this time.
                var specialElementHandlers = {
                    // element with id of "bypass" - jQuery style selector
                    '#bypassme': function (element, renderer) {
                        // true = "handled elsewhere, bypass text extraction"
                        return true
                    }
                };

                // all coords and widths are in jsPDF instance's declared units
                // 'inches' in this case
                pdf.fromHTML(
                response.data.html, // HTML string or DOM elem ref.
                margins.left, // x coord
                margins.top, { // y coord
                    'width': margins.width, // max width of content on PDF
                    'elementHandlers': specialElementHandlers
                },

                function (dispose) {
                    // dispose: object with X, Y of the last line add to the PDF 
                    //          this allow the insertion of new lines after html
                    pdf.save(response.data.filename);
                }, margins);
            }).always(function() {
                $(document).find('#cover-spin').hide();
            });
        });

        // Send email the report
        $(document).on("click", exportEmailDropdown, function(e) {
            e.preventDefault();
            var _this = this;
            ModalFactory.create({
                type: ModalFactory.types.SAVE_CANCEL,
                title: v.getEmailModalHeader($(_this).data("blockname"), 0),
                body: fragment.loadFragment(
                    'local_sitereport',
                    'email_dialog',
                    $(_this).data("contextid"),
                    {
                        blockname : $(_this).data("blockname")
                    }
                ),
            }, $(this))
            .done(function(modal) {
                var root = modal.getRoot();
                root.on(ModalEvents.hidden, function() {
                    modal.destroy();
                });
                root.on(ModalEvents.save, function() {
                    sendMailToUser(_this, root);
                });
                modal.setSaveButtonText('Send');
                modal.show();
            });
        });

        /**
         * Schedule emails to send reports                                    e.preventDefault();            var _this [description]
         */
        $(document).on("click", scheduledEmailDropdown, function(e) {
            e.preventDefault();
            var _this = this;
            var context = v.getScheduledEmailFormContext();

            ModalFactory.create({
                title: v.getEmailModalHeader($(_this).data("blockname"), 1),
                body: Templates.render('local_sitereport/email_schedule_tabs', context)
            }, $(this))
            .done(function(modal) {
                var root = modal.getRoot();
                modal.modal.addClass("modal-lg");

                root.on(ModalEvents.bodyRendered, function() {
                    root.find("#esr-blockname").val($( _this).data("blockname"));
                    root.find("#esr-region").val($(_this).data("region"));
                    emailListTable = render_all_scheduled_emails(_this, modal);
                });

                root.on(ModalEvents.hidden, function() {
                    modal.destroy();
                });

                email_schedule_form_init(_this, root, modal);
                modal.show();
            });
        });

        // Show reports page when document is ready
        $('#wdm-elucidsitereport').removeClass('d-none');

        setupBlockEditing();
    });

    /**
     * Setup block setting button
     */
    function setupBlockEditing() {
        $(document).on('click', selector.blockSettingsBtn, function(e) {
            e.preventDefault();

            var contextid = $(e.currentTarget).data('contextid');
            var blockname = $(e.currentTarget).data('blockname');
            var action = $(e.currentTarget).data('action');

            if (action == 'edit') {
                ModalFactory.create({
                    title: 'Edit Block Setting',
                    // body: Templates.render(tempSelector.blockEditSettings, {})
                    body: fragment.loadFragment(
                        'local_sitereport',
                        'get_blocksetting_form',
                        contextid,
                        {
                            blockname : blockname
                        }
                    )
                }).done(function(modal) {
                    var root = modal.getRoot();
                    modal.modal.addClass('modal-dialog-centered');

                    root.on(ModalEvents.bodyRendered, function() {
                        var form = modal.modal.find('.block-settings-form');
                        modal.modal.find('.save-block-settings').on('click', function(event) {
                            event.preventDefault();
                            var formData = form.serializeArray();
                            var data = {};
                            $(formData).each(function($k, $d) {
                                data[$d.name] = $d.value;
                            });
                            
                            // Set users preferences
                            set_block_preference(blockname, data, function() {

                            });
                        });
                    });

                    root.on(ModalEvents.hidden, function() {
                        modal.destroy();
                    });
                    modal.show();
                });
            } else if (action == "hide") {
                // Todo: add functionality to hide the blocks
            } else if (action == "editcap") {
                ModalFactory.create({
                    title: 'Edit Block Capabilities',
                    body: fragment.loadFragment(
                        'local_sitereport',
                        'get_blockscap_form',
                        contextid,
                        {
                            blockname : blockname
                        }
                    )
                }).done(function(modal) {
                    var root = modal.getRoot();
                    modal.modal.addClass('modal-dialog-centered modal-lg');

                    root.on(ModalEvents.bodyRendered, function() {
                        var form = modal.modal.find('.block-cap-form');
                        modal.modal.find('#menucapabilities').on('change', function(event) {
                            event.preventDefault();
                            var formData = form.serializeArray();
                            var data = {};
                            $(formData).each(function($k, $d) {
                                data[$d.name] = $d.value;
                            });

                            fragment.loadFragment(
                                'local_sitereport',
                                'block_overview_display',
                                contextid,
                                {
                                    capvalue : data.capabilities
                                }
                            ).done(function(html, js, css) {
                                modal.modal.find('.cap-overview').html(html);
                                switchCapabilitiesBlock(modal);
                            });
                        });

                        switchCapabilitiesBlock(modal);

                        var form = modal.modal.find('.block-cap-form');
                        modal.modal.find('.save-block-caps').on('click', function(event) {
                            event.preventDefault();
                            var formData = form.serializeArray();
                            var data = {};
                            $(formData).each(function($k, $d) {
                                data[$d.name] = $d.value;
                            });
                            
                            // Set block capabilities
                            setBlockCapabilities(blockname, data, function() {
                                modal.destroy();
                            });
                        });
                    });

                    root.on(ModalEvents.hidden, function() {
                        modal.destroy();
                    });
                    modal.show();
                });
            }
        });
    }

    function switchCapabilitiesBlock (modal) {
        modal.modal.find('.comparisontable .switch-capability').on('click', function(event) {
            var permissions = $(event.currentTarget).find('input[type=radio]');
            var current = permissions.filter(':checked');
            var next = permissions.eq(permissions.index(current) + 1);
            if (next.length === 0) {
                next = permissions.eq(0);
            }
            next.prop('checked', true);

            var perStr = next.data('strpermission');
            var perClass = next.data('permissionclass');

            $(event.currentTarget).removeClass('inherit allow prevent prohibit');
            $(event.currentTarget).addClass(perClass);
            $(event.currentTarget).find('label').html(perStr);
        });
    }

    /**
     * Set blocks capabilities
     * @param {string} blockname 
     * @param {string} data 
     * @param {function} callback 
     */
    function setBlockCapabilities(blockname, data, callback) {
        data['blockname'] = blockname; 
        data = JSON.stringify(data);
        var sesskey = $('#' + blockname).data('sesskey');

        // Update users capability
        $.ajax({
            url: v.requestUrl,
            type: 'GET',
            data: {
                action: 'set_block_capability_ajax',
                sesskey: sesskey,
                data : data
            }
        }).done(function(response) {
            if (response.success) {
                callback();
                location.reload();
            } else {
                notif.addNotification({
                    message: "Error",
                    type: "error"
                });
            }
        }).fail(function(error) {
            console.log(error);
            notif.addNotification({
                message: error,
                type: "error"
            });
        }).always(function() {
            callback();
            location.reload();
        });
    }

    /**
     * Set users preferences
     * @param {string} blockname 
     * @param {string} data 
     * @param {function} callback 
     */
    function set_block_preference(blockname, data, callback) {
        data['blockname'] = blockname; 
        data = JSON.stringify(data);
        var prefname = 'pref_' + blockname
        var sesskey = $('#' + blockname).data('sesskey');


        // Set users preferences
        $.ajax({
            url: v.requestUrl,
            type: 'GET',
            data: {
                action: 'set_block_preferences_ajax',
                sesskey: sesskey,
                data : data
            }
        }).done(function(response) {
            if (response.success) {
                location.reload();
            } else {
                notif.addNotification({
                    message: "Error",
                    type: "error"
                });
            }
        }).fail(function(error) {
            console.log(error);
            notif.addNotification({
                message: error,
                type: "error"
            });
        }).always(function() {
            location.reload();
        });
    }

    /**
     * Render all emails in modal
     * @param {object} _this Anchor tag object
     * @param {Object} modal Modal object
     */
    function render_all_scheduled_emails(_this, modal) {
        var table = modal.getRoot().find("#esr-shceduled-emails");

        // Resize event to adjust datatable when click on the all list tab
        // Not able to call resize when ajax completed
        // So got the temporary solution
        $(document).on('click', '[aria-controls="listemailstab"]', function() {
            $(window).resize();
        });

        // Create datatable
        return table.DataTable({
            ajax : {
                url: v.requestUrl,
                type: v.requestType,
                data: {
                    action: 'get_scheduled_emails_ajax',
                    sesskey: $(_this).data("sesskey"),
                    data : JSON.stringify({
                        blockname : $(_this).attr("data-blockname"),
                        href : $(_this).attr("href"),
                        region : $(_this).attr("data-region")
                    })
                }
            },
            scrollY : "300px",
            scrollX: true,
            scrollCollapse : true,
            language: {
                searchPlaceholder: "Search shceduled email",
                emptyTable: "There is no scheduled emails"
            },
            order : [[ 1, "asc" ]],
            columns : [
                {
                    "data" : "esrtoggle",
                    "orderable" : false
                },
                {
                    "data" : "esrname",
                    "orderable" : true
                }, 
                {
                    "data" : "esrcomponent",
                    "orderable" : true
                },
                {
                    "data" : "esrnextrun",
                    "orderable" : true
                },
                {
                    "data" : "esrfrequency",
                    "orderable" : true
                },
                {
                    "data" : "esrmanage",
                    "orderable" : false
                }
            ],
            responsive : true,
            bInfo : false,
            lengthChange : false,
            paging :   false
        });
    }

    /**
     * Validate email shceduled form
     * @param  {object} form Form object
     * @param  {object} Error Box to show error
     * @return {boolean} Return form validation status
     */
    function validate_email_scheduled_form(form, errorBox) {
        var esrname = form.find('[name="esrname"]').val();
        var esrrecepient = form.find('[name="esrrecepient"]').val();
        if (esrname == "" || esrrecepient == "") {
            errorBox.html(emptyerrormsg).show();
            return false;
        }

        var re = /^(\s?[^\s,]+@[^\s,]+\.[^\s,]+\s?,)*(\s?[^\s,]+@[^\s,]+\.[^\s,]+)$/g;
        if (!re.test(esrrecepient)) {
            errorBox.html(emailinvaliderrormsg).show();
            return false;
        }

        return true;
    }

    /**
     * Save scheduled emails
     * @param  {object} root Modal root object
     */
    function save_schedule_email_init(_this, root, modal) {
        // On save perform operation
        root.on('click', '[data-action="save"]', function() {
            var errorBox = root.find(".esr-form-error");
            errorBox.html(loader).show();

            if (validate_email_scheduled_form(root.find("form"), errorBox)) {
                var filter = v.getUrlParams(_this.href, "filter");
                var cohortid = v.getUrlParams(_this.href, "cohortid");

                // Send ajax to save the scheduled email
                $.ajax({
                    url: M.cfg.wwwroot + "/local/sitereport/download.php?format=emailscheduled&filter=" + filter + "&cohortid=" + cohortid,
                    type: "POST",
                    data: root.find("form").serialize()
                }).done(function(response) {
                    response = $.parseJSON(response);

                    // If error then log the error
                    if (response.error) {
                        errorBox.html(errormsg);
                        console.log(response.error);
                    } else {
                        if (emailListTable) {
                            emailListTable.destroy();
                        }
                        emailListTable = render_all_scheduled_emails(_this, modal);
                        errorBox.html(successmsg);
                    }
                }).fail(function(error) {
                    errorBox.html(errormsg);
                    console.log(error);
                }).always(function() {
                    errorBox.delay(3000).fadeOut('slow');
                });
            }
        });

        // Reset scheduled form
        root.on('click', '[data-action="cancel"]', function() {
            root.find('[name^=esr]:not(.d-none):not([id="esr-toggle-"])').val("");
            root.find('#esr-id').val(-1);
        });
    }

    /**
     * Update dropdown button text
     * @param  {object} _this click object
     */
    function update_dropdown_btn_text(_this) {
        var val = $(_this).data('value');
        var text = $(_this).text();
        var dropdownBtn = $(_this).closest(".dropdown").find(dropdownSelector);
        
        // Set button values
        dropdownBtn.text(text);
        dropdownBtn.data("value", val);
    }

    /**
     * Duration dropdown init
     * @param  {object} _this click object
     */
    function duration_dropdown_init(_this, root) {
        var val = $(_this).data('value');
        var text = $(_this).text();

        root.find(durationInput).val(val);
        $(timesDropdownBtn).hide();

        // Show only selected dropdown
        var subDropdown = null;
        switch(val) {
            case 1: // Weekly
                subDropdown = $(weeklyDropdownBtn);
                break;
            case 2: // Monthly
                subDropdown = $(monthlyDropdownBtn);
                break;
            default: // Daily
                subDropdown = $(dailyDropdownBtn);
        }

        // Show subdropdown
        subDropdown.show();

        // Set values to hidden input fieds
        var timeval = subDropdown.data("value");
        $(timeInput).val(timeval);
    }

    /**
     * Email schedle setting session initialization
     * @param  {[type]} _this [description]
     * @return {[type]}       [description]
     */
    function email_schedule_setting_init(_this, root) {
        var id = $(_this).data("id");
        var blockname = $(_this).data("blockname");
        var region = $(_this).data("region");

        $.ajax({
            url: v.requestUrl,
            type: v.requestType,
            sesskey : $(_this).data("sesskey"),
            data: {
                action: 'get_scheduled_email_detail_ajax',
                sesskey: $(_this).data("sesskey"),
                data : JSON.stringify({
                    id : id,
                    blockname : blockname,
                    region : region
                })
            }
        }).done(function(response) {
            if (!response.error) {
                set_email_shedule_form_values(response, _this, root);

                root.find(tabs).removeClass("active show");
                root.find(formTab).addClass("active show");
            } else {
                console.log(response);
            }
        }).fail(function(error) {
            console.log(error);
        });
    }

    /**
     * Set email shcedule values in form
     * @param {[type]} response [description]
     */
    function set_email_shedule_form_values(response, _this, root) {
        var esrDurationVal = null;
        var esrTimeVal = null;

        $.each(response.data, function(idx, val) {
            if (typeof val === 'object') {
                // Set block value name
                root.find("#esr-blockname").val(val.blockname);
                root.find("#esr-region").val(val.region);
            } else if (idx === "esrduration") {
                var esrDuration = '[aria-labelledby="durationcount"] .dropdown-item[data-value="' + val + '"]';
                esrDurationVal = val;
                // Trigger click event
                root.find(esrDuration).click();
            } else if (idx === "esrtime") {
                esrTimeVal = val;
            } else if (idx === "esremailenable") {
                var checkbox = $('input[name="' + idx + '"]');
                if (val) {
                    checkbox.prop("checked", true);
                } else {
                    checkbox.prop("checked", false);
                }
            } else {
                // Set values for input text
                $('[name="' + idx + '"]').val(val);
            }

        });

        // Subdropdown click event
        var subSelectedDropdpown = '.dropdown-item[data-value="' + esrTimeVal + '"]';
        
        // Show only selected dropdown
        var subDropdown = null;
        switch(esrDurationVal) {
            case "1": // Weekly
                subDropdown = $(".weekly-dropdown");
                break;
            case "2": // Monthly
                subDropdown = $(".monthly-dropdown");
                break;
            default: // Daily
                subDropdown = $(".daily-dropdown");
        }

        // Trigger click event
        subDropdown.find(subSelectedDropdpown).click();
    }

    /**
     * Delete Scheduled email
     * @param  {[type]} _this [description]
     * @param  {[type]} root  [description]
     * @param  {[type]} modal  [description]
     * @return {[type]}       [description]
     */
    function email_schedule_delete_init(_this, root, modal) {
        var id = $(_this).data("id");
        var blockname = $(_this).data("blockname");
        var region = $(_this).data("region");
        var errorBox = root.find(".esr-form-error");
        errorBox.html(loader).show();

        $.ajax({
            url: v.requestUrl,
            type: v.requestType,
            sesskey : $(_this).data("sesskey"),
            data: {
                action: 'delete_scheduled_email_ajax',
                sesskey: $(_this).data("sesskey"),
                data : JSON.stringify({
                    id : id,
                    blockname : blockname,
                    region : region
                })
            }
        }).done(function(response) {
            if (!response.error) {
                if (emailListTable) {
                    emailListTable.destroy();
                }
                emailListTable = render_all_scheduled_emails(_this, modal);
                errorBox.html(deletesuccessmsg);
            } else {
                errorBox.html(deleteerrormsg);
            }
        }).fail(function(error) {
            errorBox.html(deleteerrormsg);
            console.log(error);
        }).always(function() {
            errorBox.delay(3000).fadeOut('slow');
        });
    }

    /**
     * Change scheduled email status
     * @param  {[type]} _this [description]
     * @param  {[type]} root  [description]
     * @param  {[type]} modal  [description]
     * @return {[type]}       [description]
     */
    function change_scheduled_email_status_init(_this, root, modal) {
        var id = $(_this).data("id");
        var blockname = $(_this).data("blockname");
        var region = $(_this).data("region");

        $.ajax({
            url: v.requestUrl,
            type: v.requestType,
            sesskey : $(_this).data("sesskey"),
            data: {
                action: 'change_scheduled_email_status_ajax',
                sesskey: $(_this).data("sesskey"),
                data : JSON.stringify({
                    id : id,
                    blockname : blockname,
                    region : region
                })
            }
        }).done(function(response) {
            if (!response.error) {
                if (emailListTable) {
                    emailListTable.destroy();
                }
                emailListTable = render_all_scheduled_emails(_this, modal);
                errorBox.html(successmsg);
            }
        });
    }

    /**
     * Manage schedule emails form initialization
     * @param  {object} root Modal root object
     */
    function email_schedule_form_init(_this, root, modal) {
        // If dropdown selected then update the button text
        root.on('click', dropdowns, function() {
            update_dropdown_btn_text(this);
        });

        // Select duration for email schedule
        root.on('click', durationSelector, function() {
            duration_dropdown_init(this, root);
        });

        // Select time for schedule
        root.on('click', timesDropdownLink, function() {
            root.find(timeInput).val($(this).data('value'));
        });

        // When setting button clicked then
        root.on('click', settingBtn, function() {
            email_schedule_setting_init(this, root);
        });

        // When delete button clicked then
        root.on('click', deleteBtn, function(e) {
            var _this = this;

            str.get_strings([
                {
                    key:        'confirmemailremovaltitle',
                    component:  'local_sitereport'
                },
                {
                    key:        'confirmemailremovalquestion',
                    component:  'local_sitereport'
                },
                {
                    key:        'yes',
                    component:  'moodle'
                },
                {
                    key:        'no',
                    component:  'moodle'
                }
            ]).done(function(s) {
                notif.confirm(s[0], s[1], s[2], s[3], $.proxy(function() {
                    email_schedule_delete_init(_this, root, modal);
                }, e.currentTarget));
            });
        });

        // When toggle switch clicked then
        root.on('change', emailListToggleSwitch, function() {
            change_scheduled_email_status_init(this, root, modal);
        });

        // On save perform operation
        save_schedule_email_init(_this, root, modal);
    }

    /**
     * Send mail to user
     * @param  {object} _this anchor tag
     * @param  {object} root Modal root object
     */
    function sendMailToUser(_this, root) {
        $.ajax({
            url: _this.href,
            type: "POST",
            data: root.find('form').serialize()
        }).done(function(response) {
            response = $.parseJSON(response);
            if (response.error) {
                notif.addNotification({
                    message: response.errormsg,
                    type: "error"
                });
            } else {
                notif.addNotification({
                    message: "Email has been sent",
                    type: "info"
                });
            }
        }).fail(function() {
            notif.addNotification({
                message: "Failed to send the email",
                type: "error"
            });
        });
    }

    // Rearrange Block according to the width of the page
    function rearrangeBlocks(pageWidth) {
        var blocks ="#wdm-elucidsitereport > div";

        if (pageWidth < 780 ) {
            $(blocks).addClass("col-lg-12");
        } else {
            $(blocks).removeClass("col-lg-12");
        }

        $(blocks).find('.table.dataTable').DataTable().draw();
    }

    /**
     * Generate Email dialog to send emails 
     * @param  {string} url Url to send emails
     * @param  {int} CONTEXTID Context Id
     */
    function emailDialogBox(url, CONTEXTID) {
        fragment.loadFragment('local_sitereport', 'email_dialog', CONTEXTID)
        .done(function(html, js) {
            ModalFactory.create({            
                type: ModalFactory.types.SAVE_CANCEL,
                title: 'Email Dialog Box',
                body: html,
            }, $(this))
            .done(function(modal) {
                // Do what you want with your new modal.
            });
        })
        .fail(function(e) {
            console.log(e)
        });
    }
});