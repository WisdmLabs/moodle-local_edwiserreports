define(["jquery","core/chartjs","report_elucidsitereport/defaultconfig"],function(n,y,r){return{init:function(o){var e,i=r.getPanel("#todaysactivityblock"),d=r.getPanel("#todaysactivityblock","body"),t=i+" #flatpickrCalender";function c(t){var a=n(i).data("sesskey");n.ajax({url:r.requestUrl,type:r.requestType,dataType:r.requestDataType,data:{action:"get_todaysactivity_data_ajax",sesskey:a,data:JSON.stringify({date:t})}}).done(function(t){n.each(t.data,function(t,a){var o=n(d+" #todays-"+t);o.find(".loader").hide(),o.find(".data").html(a)}),function(t){r.todaysActivityBlock.graph.data=t;t={labels:r.todaysActivityBlock.graph.labels,datasets:[{label:r.todaysActivityBlock.graph.labelName,data:r.todaysActivityBlock.graph.data,backgroundColor:r.todaysActivityBlock.graph.backgroundColor}]};e&&e.destroy();e=new y(r.todaysActivityBlock.ctx,{type:r.todaysActivityBlock.graph.type,options:r.todaysActivityBlock.graph.options,data:t})}(t.data.visitshour)}).fail(function(t){console.log(t)}).always(function(){o("todaysActivity")})}n(document).ready(function(){c(),n(t).flatpickr({dateFormat:"d M Y",maxDate:"today",defaultDate:["today"],onChange:function(t,a,o){n(d).find("loader").show(),c(a)}})})}}});