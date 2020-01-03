define(["jquery","core/modal_factory","core/modal_events","core/fragment","core/templates","report_elucidsitereport/variables","report_elucidsitereport/select2","report_elucidsitereport/jquery.dataTables","report_elucidsitereport/dataTables.bootstrap4","report_elucidsitereport/jquery-asPieProgress","report_elucidsitereport/common"],function(p,e,t,r,a,u){return{init:function(e){var a=p("#wdm-certificates-individual"),o=a.find(".table"),t=(a.find(".loader"),p("#wdm-certificates-dropdown")),r="#wdm-certificates-select",l=".dropdown-menu[aria-labelledby='export-dropdown'] .dropdown-item",i=p("#wdm-userfilter .row .col-md-6:first-child"),s=null,d=null,c=0,n="#cohortfilter";function m(e,t){var r={action:"get_certificates_data_ajax",sesskey:p(a).data("sesskey"),data:JSON.stringify({certificateid:e,cohortid:t})};s&&s.destroy(),s=o.DataTable({ajax:u.generateUrl(u.requestUrl,r),dom:"<'pull-left'f><t><p>",columnDefs:[{targets:0,className:"align-middle"},{targets:1,className:"align-middle"},{targets:"_all",className:"align-middle text-center"}],columns:[{data:"username"},{data:"email"},{data:"issuedate"},{data:"dateenrolled"},{data:"grade"},{data:"courseprogress"}],language:{searchPlaceholder:"Search users",emptyTable:"No certificates are awarded"},initComplete:function(e,t){p(".pie-progress").asPieProgress(),o.show()},bInfo:!1,lengthChange:!1,paginate:!1,responsive:!0,scrollY:"350px",scrollX:!0,sScrollX:"100%",bScrollCollapse:!0})}p(document).ready(function(){i.html(t.html()),t.remove(),p(document).find(r).show(),p(document).find(r).select2(),m(d=p(r).val()),p("#cohortfilter ~ .dropdown-menu .dropdown-item").on("click",function(){c=p(this).data("cohortid"),u.changeExportUrl(c,l,u.cohortReplaceFlag),p(n).html(p(this).text()),m(d,c)}),p(document).on("change",r,function(){m(d=p(this).val()),console.log(d),u.changeExportUrl(d,l,u.filterReplaceFlag)})})}}});