!function ($) {

  $(function(){

    var $window = $(window)

    // Disable certain links in docs
    $('section [href^=#]').click(function (e) {
      e.preventDefault()
    })

  })

  var ajaxErrorCount = 0;
  
  var storageAccount = undefined;
  var storageKey = undefined;

  var pagingKeys = [];
  var currentPage = 0;

  function setCredentials() {
    storageAccount = $('#storageAccount').val();
    storageKey = $('#storageKey').val();

    $('#credentials').hide();

    loadTablesList();

    return false;
  }

  function credentialsNeeded() {
    $('#credentials').show();
  }

  function showError(subject, content) {
    $("#modal_error_subject").html(subject);
    $("#modal_error_text").html(content);
    $("#modal_error").modal('show');
  }

  function hideError() {
    $("#modal_error").modal('hide');
  }

  function showErrorElse(json, callback) {
    if (json.ok === true) {
      callback();
    } else {
      var subject = 'Error';
      var text = 'Something went wrong with the dynamic request.';

      alert(JSON.stringify(json));

      showError(subject, text);
    }
  }

  $(document).ajaxError(function (event, request, settings) {
    ++ajaxErrorCount;

    var subject = 'Error';
    var text = 'Something went wrong. Oops.';

    credentialsNeeded();

    if (request.status == 403) {
      if (ajaxErrorCount == 1) {
        return;
      }
      subject = '403 Unauthorized';
      text = 'An unauthorized response was returned. Most likely this means that the storage account credentials are incorrect or that the storage credentials have not been provided to the server application (either through the request or via environment variables).';
    } else {
      text = request.statusText || request.responseText;
    }

    showError(subject, text);
  });

  $("#modal_close").click(hideError);

  window.getTable = function (tableName) {
  	$("#table-link-" + tableName).addClass("active");

  	for (var tbl in window.tables) {
  		var table = window.tables[tbl];
  		if (table != tableName) {
  			$("#table-link-" + table).removeClass("active");
  		}
  	}

  	loadTable(tableName);

  	return false;
  }

  window.tables = [];

  function getUniqueColumns(table) {
    var columns = [];
    var hash = {
      PartitionKey: true,
      RowKey: true
      // Timestamp: false
    };

    for (var r in table) {
      var row = table[r];
      for (var column in row) {
        if (column == '_') {
          // etag, id, link, updated
          continue;
        }
        if (!hash[column]) {
          hash[column] = true;
          columns.push(column);
        }
      }
    }

    return columns;
  }

  function loadTableData(tableName, table, page) {
    if (page === undefined) {
      page = 1;
    }

    if (table.rows && table.rows.length && table.rows.length > 0) {
      // Calculate the fields used in the table.
      var fields = getUniqueColumns(table.rows);

      var partitionKey = undefined;

      // Data grid! Nasty code.
      var html = [];
      html.push('<table class="table table-hover table-condensed">');
      html.push('<thead>');
      for (var c in fields) {
        var field = fields[c];
        html.push('<th>');
        html.push('<p>' + field + '</p>');
        html.push('</th>');
      }
      html.push('</thead>');

      html.push('<tbody>');

      var rc = 0;
      var clicks = [];
      for (var t in table.rows) {
        var row = table.rows[t];

        if (row.PartitionKey != partitionKey) {
          partitionKey = row.PartitionKey;
          html.push('<tr class="row');
          html.push('' + rc);
          html.push('" style="background-color:#eee"><td colspan="');
          html.push(fields.length + '">');
          html.push('<p><strong>');
          html.push(partitionKey);
          html.push('</strong></p>');
          html.push('</td></tr>');
        }

        html.push('<tr>');

        for (var field in fields) {
          var column = fields[field];
          html.push('<td>');
          html.push('<p>');

          if (row[column]) {
            html.push(row[column]);
          }

          html.push('</p>');
          html.push('</td>');
        }

        html.push('</tr>');

        ++rc;
      }

      html.push('</tbody>');
      html.push('</table>');

      // Pagination
      var hasContinuation = table.continuation.nextRowKey && table.continuation.nextPartitionKey;
      var ip = +page; // ensure it is a number

      html.push('<div class="pagination"><ul>');

      // Previous
      html.push('<li');
      if (ip <= 1) {
        html.push(' class="disabled"');
      }      
      html.push('><a href="#">Prev</a></li>');

      // Numbers
      var start = ip > 5 ? ip - 5 : 1;
      var end = ip + 2;

      for (var i = start; i < end; i++) {
        html.push('<li');
        if (i == ip) {
          html.push(' class="active"');
        }
        html.push('><a href="#">');
        html.push('' + i);
        html.push('</a></li>');
      }

      // Next
      html.push('<li');
      if (!hasContinuation) {
        html.push(' class="disabled"');
      }
      html.push('><a href="#">Next</a></li>');

      html.push('</ul></div>');

      // to string
      $('#results').html(html.join(''));

    } else {
      $('#results').html('There are no rows in the table.');
    }

    // alert(JSON.stringify(table));
  }

  function loadTable(tableName) {
  	$.ajax({
  		url: "/json/table/" + tableName,
      data: getAjaxCredentials(),
  		success: function (data) {
        showErrorElse(data, function () {
          loadTableData(tableName, data.table);
        });
  		}
  	});

  }

  function getAjaxCredentials() {
    if (storageAccount && storageKey) {
      return {
        account: storageAccount,
        key: storageKey
      };
    } else {
      return undefined;
    }
  }

  var loadTablesList = function () {
    $.ajax({ 
    	url: "/json/table",
      data: getAjaxCredentials(),
    	success: function (data) {
        showErrorElse(data, function () {
          dr = data.result;
          if (dr.name) {
            storageAccount = dr.name;
            $('#accountName').html(storageAccount);
          }

          window.tables = [];
          var tableList = $("#tableList");
          tableList.empty();

          var html = '<ul class="nav nav-list">';
          html += '<li class="nav-header">Tables</li>';
          
          var c = 0;
          for (var tbl in dr.tables) {
            var table = dr.tables[tbl];

            html += '<li id="table-link-' + table + '">';
            html += '<a href="#" onclick="';
            html += 'return window.getTable(' + "'" + table + "'" + ');">' + table + '</a></li>';

            window.tables.push(table);
            ++c;
          }

          if (c == 0) {
            html += '<li>No tables</li>';
          }

          html += '</ul>';
          tableList.append(html);
        });
    	}});
  }

  // 1. Security check
  var ssl = document.location.protocol === "https:";
  $('#' + (ssl ? '' : 'no') + 'ssl').show();
  $('#' + (ssl ? 'no' : '') + 'ssl').hide();
  $('#setCredentials').click(setCredentials);

  // 2. Load the table list (will 403 to show the login form if server credentials are not being used)
  loadTablesList();

}(window.jQuery)
