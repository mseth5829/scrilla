$(function() {
  $("#submitAssumptions").on("click",dcfAnalysis);
});


//Variables to be used in both dcf and sensitivity analysis
var finalYearEbitda
var finalYearUFCF
var ebitdaMultiple
var perpetuityGrowthRate

function dcfAnalysis() {
  $('#sensitivityAnalysis-content').fadeIn(700);
  totalPV = Math.round(totalPV);
  finalYearEbitda = Number($("#ebitda td:nth-child(6)").text());
  finalYearUFCF = Number($("#pv td:nth-child(6)").text());
  ebitdaMultiple = Number($("#ebitdaExit").val());
  perpetuityGrowthRate = Number($("#perpetuityGrowthRate").val());
  var pvEbitdaMethod = Math.round((finalYearEbitda*ebitdaMultiple)/(Math.pow((1+wacc),5)));

  var evForEbitdaMethod = Math.round(totalPV + (finalYearEbitda*ebitdaMultiple)/(Math.pow((1+wacc),5)));
  var terminalPerpetuityValue = Math.round(((finalYearUFCF)*(1+perpetuityGrowthRate))/(wacc-perpetuityGrowthRate));
  var pvPerpetuityMethod = Math.round(terminalPerpetuityValue / (Math.pow(1+wacc,5)) );
  var evForPerpetuityMethod = Math.round(totalPV + terminalPerpetuityValue / (Math.pow(1+wacc,5)));

//Fill up DCF Analysis table
  $("#exitYear td:nth-child(2)").text(finalYearEbitda);
  $("#exitYear td:nth-child(5)").text(finalYearUFCF);
  $("#mainInputs td:nth-child(2)").text(ebitdaMultiple);
  $("#mainInputs td:nth-child(5)").text(perpetuityGrowthRate);
  $("#terminalValues td:nth-child(2)").text(finalYearEbitda*ebitdaMultiple);
  $("#terminalValues td:nth-child(5)").text(terminalPerpetuityValue);
  $("#periods td:nth-child(2)").text("5");
  $("#periods td:nth-child(5)").text("5");
  $("#WACCs td:nth-child(2)").text(wacc);
  $("#WACCs td:nth-child(5)").text(wacc);
  $("#presentValues td:nth-child(2)").text(pvEbitdaMethod);
  $("#presentValues td:nth-child(5)").text(pvPerpetuityMethod);
  $("#npvOfUFCF td:nth-child(2)").text(totalPV);
  $("#npvOfUFCF td:nth-child(5)").text(totalPV);
  $("#impliedEVs td:nth-child(2)").text(evForEbitdaMethod);
  $("#impliedEVs td:nth-child(5)").text(evForPerpetuityMethod);
}

$('form').submit(function(e) {
  e.preventDefault();
  var ebitdaStep = Number($('form').find('input[name="ebitdaStep"]').val());
  var waccStep = Number($('form').find('input[name="waccStep"]').val());
  var grStep = Number($('form').find('input[name="grStep"]').val());


  function calculateEVForPerpetuityMethod(finalYearUFCF,newPerpetuityGrowthRate,newWacc) {
    var terminalPerpetuity = Math.round(((finalYearUFCF)*(1+newPerpetuityGrowthRate))/(newWacc-newPerpetuityGrowthRate));
    return (Math.round(totalPV + terminalPerpetuity / (Math.pow(1+newWacc,5))));
  }

  function calculateEVforEbitdaMethod(finalYearEbitda,newEbitda,newWacc){
    return (Math.round(totalPV + (finalYearEbitda*newEbitda)/(Math.pow((1+newWacc),5))));
  }

  var ebitdaArray = [ebitdaMultiple-ebitdaStep,ebitdaMultiple,ebitdaMultiple+ebitdaStep];
  var waccArray = [wacc-waccStep,wacc,wacc+waccStep];
  var grArray = [perpetuityGrowthRate-grStep,perpetuityGrowthRate,perpetuityGrowthRate+grStep];


//create range for inputs
  for(var i = 0; i<3; i++){
//inputs
    $("#inputRanges td:nth-child(" + (i+1) + ")").text(ebitdaArray[i]+"x");
    $("#waccRange" + (i+1) + " td:nth-child(4)").text(Math.round((waccArray[i])*100)+"%");
    $("#inputRanges td:nth-child(" +(i+5) + ")").text( Math.round(((grArray[i]) * 100) * 100) / 100+"%");
    console.log("waccRange" + (i+1) + " td:nth-child(4)")
    console.log("waccRange: "+Math.round((waccArray[i])*100)+"%")
//results row 1
    $("#waccRange1 td:nth-child(" + (i+1) + ")").text(calculateEVforEbitdaMethod(finalYearEbitda,ebitdaArray[i],waccArray[0]));
    $("#waccRange1 td:nth-child("+ (i+5) + ")").text(calculateEVForPerpetuityMethod(finalYearUFCF,grArray[i],waccArray[0]));
//results row 2
    $("#waccRange2 td:nth-child(" + (i+1) + ")").text(calculateEVforEbitdaMethod(finalYearEbitda,ebitdaArray[i],waccArray[1]));
    $("#waccRange2 td:nth-child(" + (i+5) + ")").text(calculateEVForPerpetuityMethod(finalYearUFCF,grArray[i],waccArray[1]));
//results row 3
    $("#waccRange3 td:nth-child(" + (i+1) + ")").text(calculateEVforEbitdaMethod(finalYearEbitda,ebitdaArray[i],waccArray[2]));
    $("#waccRange3 td:nth-child(" + (i+5) + ")").text(calculateEVForPerpetuityMethod(finalYearUFCF,grArray[i],waccArray[2]));
  }

//Create table
  Highcharts.setOptions({
    colors: ['transparent', 'rgba(19,170,173,0.7)', 'transparent'],
    legend: {enabled: false}
  });

  $(function () {
      $('#chart').highcharts({
          chart: {
            type: 'bar'
          },
          title: {
            text: 'Football Field: Enterprise Value'
          },
          xAxis: {
            categories: ['DCF EBITDA Method, Terminal EBITDA:'+ebitdaArray[0]+'x-'+ebitdaArray[2]+'x, WACC: '+waccArray[0]+"%-"+waccArray[1]+"%", 'DCF Perpertuity Method Growth Rate:'+Math.round(((grArray[0]) * 100) * 100)/100+'%-'+Math.round(((grArray[2]) * 100) * 100)/100+'%, WACC: '+waccArray[0]+"%-"+waccArray[1]+"%"]
          },
          yAxis: {
            min: 0,
          },
          legend: {
            reversed: true
          },
          tooltip: {
            formatter: function () {
              return 'Upper bound: '+ this.points[i].total
            }
          },
          plotOptions: {
            series: {
              stacking: 'normal'
            }
          },
          series: [{
            name: '',
            data: [Number($("#waccRange3 td:nth-child(1)").text())/2, Number($("#waccRange3 td:nth-child(7)").text())/2]
          }, {
            name: 'Enterprise Value Range',
            data: [Number($("#waccRange1 td:nth-child(3)").text())-Number($("#waccRange3 td:nth-child(1)").text()), Number($("#waccRange1 td:nth-child(5)").text())-Number($("#waccRange3 td:nth-child(7)").text())]
          }, {
            name: '',
            data: [Number($("#waccRange3 td:nth-child(1)").text()), Number($("#waccRange3 td:nth-child(7)").text())]
          }]
      });
  });

});
