var companyOptions = $(".dropdown-menu a")
for(var i = 0 ; i<companyOptions.length ; i++){
  companyOptions[i].addEventListener("click", fillInput(i))
}

function fillInput(numberClicked){
  return function(){
    search(event,companyTickers[numberClicked]);
  }
}

$(function() {
  $("#getQuandl").on("click",search);
});

$(document).ready(function(){
    $('[data-toggle="tooltip"]').tooltip({placement : 'right', trigger : 'hover', container : 'body'});
});

//Variables to be used for dcf analysis (separate file)
var wacc
var totalPV = 0


//On search, get data
function search(event,companyClick) {
  event.preventDefault();
  if(!companyClick){
    var ticker = $("input[name=ticker]").val();
  }else{
    var ticker = companyClick;
  }
  // "CSCO"
  var urlRevenue = "https://www.quandl.com/api/v3/datasets/ZFB/"+ticker+"_TOT_REVNU_A.json?api_key=nuNBBsNJx2dfRJ_dhsgc";
  var urlOpCashFlow = "https://www.quandl.com/api/v3/datasets/ZFB/"+ticker+"_CASH_FLOW_OPER_ACTIVITY_A.json?api_key=nuNBBsNJx2dfRJ_dhsgc";
  var urlEBITDA = "https://www.quandl.com/api/v3/datasets/ZFB/"+ticker+"_EBITDA_A.json?api_key=nuNBBsNJx2dfRJ_dhsgc";
  var urlNetIncome = "https://www.quandl.com/api/v3/datasets/ZFB/"+ticker+"_NET_INCOME_LOSS_A.json?api_key=nuNBBsNJx2dfRJ_dhsgc";

  var params = {};

//Variables to calculate ufcf later
  var revenue
  var operatingcashflow
  var ebitda
  var ebitdaOverRevenue
  var cfoOverRevenue
  var capexOverRevenue
  var netIncomeOverRevenue
  var cashFlowStore = []

//Get data from Quandl and fill table
  $.get(urlRevenue, params).done(function(data) {
    var date = data.dataset.data[0][0];
    var dateYear = new Date(date).getFullYear();
    $("#fye").text(date);
    $("#date th:nth-child(2)").text(dateYear + " Annual");
    $("#date th:nth-child(3)").text(new Date(new Date().setFullYear(dateYear + 1)).getFullYear() + " Estimated");
    $("#date th:nth-child(4)").text(new Date(new Date().setFullYear(dateYear + 2)).getFullYear() + " Estimated");
    $("#date th:nth-child(5)").text(new Date(new Date().setFullYear(dateYear + 3)).getFullYear() + " Estimated");
    $("#date th:nth-child(6)").text(new Date(new Date().setFullYear(dateYear + 4)).getFullYear() + " Estimated");
    $("#date th:nth-child(7)").text(new Date(new Date().setFullYear(dateYear + 5)).getFullYear() + " Estimated");

    revenue = parseInt(data.dataset.data[0][1]);
    $("#revenue td:nth-child(2)").text(revenue).css("color","blue");
  }); // end get function

  $.get(urlOpCashFlow, params).done(function(data) {
    operatingcashflow = parseInt(data.dataset.data[0][1]);
    $("#cfo td:nth-child(2)").text(operatingcashflow).css("color","blue");
  }); // end get function

  $.get(urlEBITDA, params).done(function(data) {
    ebitda = parseInt(data.dataset.data[0][1]);
    $("#ebitda td:nth-child(2)").text(ebitda).css("color","blue");
  }); // end get function

  $.get(urlNetIncome, params).done(function(data) {
    netIncome = parseInt(data.dataset.data[0][1]);
    $("#netIncome td:nth-child(2)").text(netIncome).css("color","blue");
  }); // end get function

//Ask for further input
  var div = $("<div>").attr("id","inputAssumptions").css("margin-top","30px");
  var para = $("<p>").text("Year-on-year revenue growth rate (please input as decimal): ");
  var input = $("<input>").attr("type","text").attr("id","growthRate").attr("data-toggle","tooltip").attr("title","% annual growth rate of revenue");
  var para2 = $("<p>").text("Capital expenditures as a % of revenue (please input as decimal): ");
  var input2 = $("<input>").attr("type","text").attr("id","capex").attr("data-toggle","tooltip").attr("title","The Capex to Revenue ratio measures a company's investments in property, plant, equipment and other capital assets to its total sales. The ratio shows how aggressively the company is re-investing its revenue back into productive assets. A high ratio potentially indicates that a company is investing heavily, which could be a positive or a negative sign depending on how effectively it uses those assets to produce new income.");
  var para3 = $("<p>").text("Weighted Average Cost of Capital (please input as decimal)");
  var input3 = $("<input>").attr("type","text").attr("id","wacc").attr("data-toggle","tooltip").attr("title","Weighted average cost of capital (WACC) is a calculation of a firm's cost of capital in which each category of capital is proportionately weighted. Read more: Weighted Average Cost Of Capital");
  var button = $("<button>").attr("id","growthRateSubmit").text("submit").css("display","block").css("margin","0 auto").css("margin-top","20px");
  var assumption = div.append(para).append(input).append(para2).append(input2).append(para3).append(input3).append(button);
  $(assumption).insertAfter("#getQuandl");

//On input of key assumptions, calculate UFCF
  $("#growthRateSubmit").on("click",calculateUFCF);
  $("#recalculate").on("click",recalculate);

  function calculateUFCF(){
    $('#dcf-content').fadeIn(700);
    var growthRate = Number($("#growthRate").val());
    capexOverRevenue = Number($("#capex").val());
    wacc = Number($("#wacc").val());
    ebitdaOverRevenue = ebitda/revenue;
    cfoOverRevenue = operatingcashflow/revenue;
    netIncomeOverRevenue = netIncome/revenue;

    for(var i = 0; i<5; i++){
      var currentEbitda = Math.round( ebitda/revenue * (Math.pow((1+growthRate),i+1)*revenue));
      var currentcfo = Math.round( cfoOverRevenue * (Math.pow((1+growthRate),i+1)*revenue));
      var currentNetIncome = Math.round( netIncomeOverRevenue * (Math.pow((1+growthRate),i+1)*revenue));
      var currentCapex = Math.round( capexOverRevenue * (Math.pow((1+growthRate),i+1)*revenue));

      $( "#revenue td:nth-child(" + (i+3) + ")" ).text(Math.round(Math.pow((1+growthRate),i+1)*revenue));
      $( "#ebitda td:nth-child(" + (i+3) + ")" ).text(currentEbitda);
      $( "#cfo td:nth-child(" + (i+3) + ")" ).text(currentcfo);
      $( "#netIncome td:nth-child(" + (i+3) + ")" ).text(currentNetIncome);
      $( "#capex td:nth-child(" + (i+3) + ")" ).text(currentCapex);

      var currentPV = Number(currentEbitda)+Number(currentcfo)-Number(currentNetIncome)-Number(currentCapex);
      cashFlowStore.push(currentPV);

    }

    function calculatePV (cashFlow,year) {
    	var PV = cashFlow/(Math.pow((1+wacc),year));
    	return PV;
    }

    for(var i=0; i<cashFlowStore.length; i+=1){
    	var addPV = calculatePV(cashFlowStore[i],i+1);
    	totalPV += addPV;
      $( "#pv td:nth-child(" + (i+3) + ")" ).text(Math.round(addPV));
    }

    $( "#npv td:nth-child(3)").text(Math.round(totalPV)).css("font-weight","bold");

    $("#inputAssumptions").empty();
  }

}

function recalculate() {
  var newCashFlowStore = [];
  totalPV = 0;
  for(var i = 0; i<5; i++){
    var currentEbitda = $( "#ebitda td:nth-child(" + (i+3) + ")" ).text();
    var currentcfo = $( "#cfo td:nth-child(" + (i+3) + ")" ).text();
    var currentNetIncome = $( "#netIncome td:nth-child(" + (i+3) + ")" ).text();
    var currentCapex = $( "#capex td:nth-child(" + (i+3) + ")" ).text();
    var currentPV = Number(currentEbitda)+Number(currentcfo)-Number(currentNetIncome)-Number(currentCapex);
    for(var v = 0; v<(currentRows-5); v++){
      var newData = $( "#newRow"+v+ " td:nth-child(" + (i+3) + ")" ).text();
      currentPV += Number(newData);
    }
    newCashFlowStore.push(currentPV);
  }

  function calculatePV (cashFlow,year) {
    var PV = cashFlow/(Math.pow((1+wacc),year));
    return PV;
  }

  for(var i=0; i<newCashFlowStore.length; i+=1){
    var addPV = calculatePV(newCashFlowStore[i],i+1);
    totalPV += addPV;
    $( "#pv td:nth-child(" + (i+3) + ")" ).text(Math.round(addPV));
  }


  $( "#npv td:nth-child(3)").text(Math.round(totalPV)).css("font-weight","bold");

}

//Add finincial data to table
var currentRows = 5;

$("#addRow").on("click",addRow);

function addRow(){
    var i = currentRows;
    var lastRow = $("#table tr:nth-child(" + i + ")" );
    var newRow = $("<tr>").attr("id","newRow"+(i-5));
    var rowName = $("#addRowName").val();
    var selection = $("select").val();
    var newtd1 = $("<td>").text(selection + rowName);
    var newtd2 = $("<td>").text($("#addRowAnnual").val());
    var newtd3 = $("<td>").text($("#addRowY1").val());
    var newtd4 = $("<td>").text($("#addRowY2").val());
    var newtd5 = $("<td>").text($("#addRowY3").val());
    var newtd6 = $("<td>").text($("#addRowY4").val());
    var newtd7 = $("<td>").text($("#addRowY5").val());
    var wholeRow = newRow.append(newtd1).append(newtd2).append(newtd3).append(newtd4).append(newtd5).append(newtd6).append(newtd7);
    wholeRow.insertAfter(lastRow);

    currentRows += 1;
    $('#table').editableTableWidget();
}



//Make table editable
$('#table').editableTableWidget();
