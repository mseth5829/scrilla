
$(function() {
  $("#submit").on("click",search);
  $("#clear").on("click",clearSearchResults);
});

function search(event) {
  event.preventDefault();
  var ticker = "CSCO"
  var urlRevenue = "https://www.quandl.com/api/v3/datasets/ZFB/"+ticker+"_TOT_REVNU_A.json?api_key=nuNBBsNJx2dfRJ_dhsgc";
  var urlOpCashFlow = "https://www.quandl.com/api/v3/datasets/ZFB/"+ticker+"_CASH_FLOW_OPER_ACTIVITY_A.json?api_key=nuNBBsNJx2dfRJ_dhsgc";
  var urlEBITDA = "https://www.quandl.com/api/v3/datasets/ZFB/"+ticker+"_EBITDA_A.json?api_key=nuNBBsNJx2dfRJ_dhsgc";

  var key = "nuNBBsNJx2dfRJ_dhsgc";
  // var search = $("#query").val() || $("#query").attr('placeholder');
  // api_key:"dc6zaTOxFJmzC"
  var params = {};

  clearSearchResults();

  $.get(urlRevenue, params).done(function(data) {
    var date = data.dataset.data[0][0];
    var operatingcashflow = data.dataset.data[0][1];
    console.log("Date: "+date);
    console.log("Revenue :"+operatingcashflow);

    for (var i = 0; data.dataset.data.length; i++) {
      var
    }
  }); // end get function

  $.get(urlOpCashFlow, params).done(function(data) {
    var date = data.dataset.data[0][0];
    var operatingcashflow = data.dataset.data[0][1];
    console.log("Date: "+date);
    console.log("Operating Cash Flow :"+operatingcashflow);
  }); // end get function

  $.get(urlEBITDA, params).done(function(data) {
    var date = data.dataset.data[0][0];
    var operatingcashflow = data.dataset.data[0][1];
    console.log("Date: "+date);
    console.log("EBITDA :"+operatingcashflow);
  }); // end get function


}




// Clear previous search results.
function clearSearchResults() {
  $("#results").empty();
}

// adds a single search result to the page.
function addSearchResult(addImage) {
  var data = $("<li>").css("list-style","none");
  var newImage = $("<img>").attr("src",addImage.images.fixed_height.url);
  newImage.appendTo(listItem);
  listItem.appendTo("#results");
  console.log(addImage.images.fixed_height.url);
}
