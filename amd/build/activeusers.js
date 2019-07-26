define(["jquery","core/modal_factory","core/fragment","core/templates","report_elucidsitereport/variables","report_elucidsitereport/jquery.dataTables","report_elucidsitereport/dataTables.bootstrap4"],function($,ModalFactory,Fragment,Templates,V){function init(CONTEXTID){$(document).ready(function(){var PageId="#wdm-activeusers-individual",ActiveUsersTable=PageId+" .table",loader=PageId+" .loader",ModalTrigger=ActiveUsersTable+" a";$.ajax({url:V.requestUrl,data:{action:"get_activeusers_graph_data_ajax",data:JSON.stringify({filter:"all"})}}).done(function(a){var r=[];$.each(a.labels,function(e,t){r[e]={date:t,filter:parseInt(new Date(t).getTime()/1e3),activeusers:a.data.activeUsers[e],courseenrolment:a.data.enrolments[e],coursecompletion:a.data.completionRate[e]}});var e={activeusers:r};Templates.render("report_elucidsitereport/activeusers_individual",e).then(function(e,t){Templates.replaceNode(PageId,e,t)}).fail(function(e){console.log(e)}).always(function(){$(ActiveUsersTable).DataTable({order:[[0,"desc"]],columnDefs:[{targets:0},{targets:1,className:"text-center"},{targets:2,className:"text-center"},{targets:3,className:"text-center"}]}),$(ActiveUsersTable).removeClass("d-none"),$(loader).remove()})}).fail(function(e){console.log(e)}),$(document).on("click",ModalTrigger,function(){var title,action=$(this).data("action"),filter=$(this).data("filter");"activeusers"==action?title="Active Users in ":"enrolments"==action?title="Enroled Users in ":"completions"==action&&(title="Completed Users in ");var titleDate=new Date(eval(1e3*filter));title+=titleDate.toLocaleString().split(",")[0],ModalFactory.create({body:Fragment.loadFragment("report_elucidsitereport","userslist",CONTEXTID,{filter:filter,action:action})}).then(function(e){e.setTitle(title),e.show(),e.getRoot().on("hidden.bs.modal",function(){alert("Hide")})}).done(function(){$(".modal-table").DataTable()})})})}return{init:init}});