function initLoginPopup(force){
  // ajax login form. See event detail for example.
  // simply add to page : <div class="reveal" id="loginModal" data-reveal data-animation-in="slide-in-up"></div>
  // call initLoginPopup after doc ready

  $('#loginModal').on('open.zf.reveal', function(){
    console.log('modal opened');
  });

  $('#loginModal').on('closed.zf.reveal',function(){
    console.log('modal closed');
    createSeenLoginCookie();
  });
  $('#loginModal').on('submit', '#formLogin', function(e){
    e.preventDefault();
    console.log('form submitted');
    $(this).addClass('processing');
    $.ajax({url:'index.php', data: $(this).serialize()})
    .done(function(response){
      if ($(response).find('#loginPopup').length) {
        console.log('Found Login in Response');
        setModalHtml(response);
      } else {
        $.cookie('seenloginpopup', 'yes');
        console.log('Creating Seen Login Cookie!');
        location.reload();
      }
    });
  });

  function setModalHtml(data, triggerOpen){
    $('#loginModal').html( data +' <button class="close-button" data-close aria-label="Close Login Popup" type="button"><span aria-hidden="true">&times;</span></button>');
    if(triggerOpen === true){
      $('#loginModal').foundation('open');
    }

  }
  function createSeenLoginCookie(){
    console.log('Creating Seen Login Cookie!');
    //$.cookie('seenloginpopup', 'yes');
  }
  if(force || (!$.cookie('USERAUTH'))) {
    $.get('index.php?src=membership&srctype=membership_login_ajax&direct=y', function(data) {
      console.log($(data).find('#loginPopup').length);
      if ($(data).find('#loginPopup').length) {

        setModalHtml(data, true);
      } else {
        createSeenLoginCookie();
        location.reload();
      }
    });
  } else {
    setModalHtml("<p>You are already logged in! <br> If you still can't access the intended content, you may not have permissions.</p>", false);
  }
}