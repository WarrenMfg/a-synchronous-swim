(function() {

  const serverUrl = 'http://127.0.0.1:3000';

  //
  // TODO: build the swim command fetcher here
  //
  var swimCommandFetcher = (options, callback) => {
    $.ajax({
      url: serverUrl,
      type: 'GET',
      data: options.data,
      success: callback,
      error: function(error) {
        console.error('FAILED FETCH', error);
      }

    })
  };

  var e = $.Event("keydown");

  var getSwim = function() {
    setTimeout(function(){
      swimCommandFetcher({data: 'random'}, function(data) {
        if(!!data) {
          // var temp = {'up':'Up', 'down':'Down', 'left':'Left', 'right':'Right'};
          console.log('swimCommandFetcher ' + data);
          e.key = 'Arrow' + data;
          $('body').trigger(e);
        }
          // this is to loop
       getSwim();
      });
    },1000);
  };
  getSwim();


  /////////////////////////////////////////////////////////////////////
  // The ajax file uplaoder is provided for your convenience!
  // Note: remember to fix the URL below.
  /////////////////////////////////////////////////////////////////////

  ajaxFileUplaod = (file) => {
    var formData = new FormData();
    formData.append('file', file);
    $.ajax({
      type: 'POST',
      data: formData,
      url: serverUrl + '/background.jpg',
      cache: false,
      contentType: false,
      processData: false,
      success: () => {
        // reload the page
       window.location = window.location.href;
      }
    });
  };

  $('form').on('submit', function(e) {
    e.preventDefault();

    var form = $('form .file')[0];
    if (form.files.length === 0) {
      console.log('No file selected!');
      return;
    }

    var file = form.files[0];
    if (file.type !== 'image/jpeg') {
      console.log('Not a jpg file!');
      return;
    }

    ajaxFileUplaod(file);
  });

})();
