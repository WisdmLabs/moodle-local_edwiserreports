define(["jquery","core/templates","core/fragment","core/modal_factory","core/modal_events","core/str","report_elucidsitereport/variables","report_elucidsitereport/common"],function(m,h,g,w,v,_,y){return{init:function(o){var e="#wdm-lpstats-individual",t="#wdm-lp-select",r=e+" .table",n=e+" .loader",i=m("#wdm-userfilter .row .col-md-6:first-child"),l=m(e).find("#wdm-lp-dropdown"),c=null,d=m("#wdm-export-detail-lpsreports"),a=null,s="report_elucidsitereport",p=_.get_strings([{key:"lpdetailedreport",component:s}]),u=0;function f(e,t){c&&(c.destroy(),m(r).hide(),m(n).show()),g.loadFragment("report_elucidsitereport","lpstats",o,{lpid:e,cohortid:t}).done(function(e){var t=JSON.parse(e);h.render("report_elucidsitereport/lpstatsinfo",t).then(function(e,t){h.replaceNode(r,e,t)}).fail(function(e){console.log(e)}).always(function(){m(r).show(),c=m(r).DataTable({dom:"<'pull-left'f><t><p>",oLanguage:{sEmptyTable:"No Users are enrolled in any Learning Programs"},responsive:!0}),m(n).hide()})})}m(document).ready(function(){i.html(l.html()),m(document).find(t).select2(),m(document).find(t).show(),l.remove();var e=m(document).find(t).val();f(e,u),m(y.cohortFilterItem).on("click",function(){u=m(this).data("cohortid"),m(y.cohortFilterBtn).html(m(this).text()),y.changeExportUrl(u,y.exportUrlLink,y.cohortReplaceFlag),f(e,u)}),m(document).find(t).on("change",function(){m(r).hide(),m(n).show(),e=m(document).find(t).val(),y.changeExportUrl(e,y.exportUrlLink,y.filterReplaceFlag),f(e,u)}),d.on("click",function(){!function(e){console.log(e),a?a.show():p.then(function(){w.create({title:M.util.get_string("lpdetailedreport",s)},e).done(function(e){var t=e.getRoot();a=e,t.on(v.cancel,function(){e.hide()}),e.setBody(h.render("report_elucidsitereport/lpdetailedreport",{})),e.show()})})}(d)})})}}});