$(document).ready(function(){
    $(".hamburger").click(function () {
        $(".menus").toggleClass("headermenus-show");
        $(".menus").toggleClass("headermenus");
        $(this).toggleClass("cross");
    });

    let loginform = $('.loginform'),
    username = $('.username'),
    password = $('.password'),
    usererror = $('.usernameerror'),
    passerror = $('.passworderror');
localStorage.setItem('username1', 'saurabh96');
localStorage.setItem('password1', '123456');
console.log(username);

//blur validation
username.focusout(() => {
    usererror.html("");
    passerror.html("");
    $('.username').removeClass('errorbox');
    $('.password').removeClass('errorbox');
    if (username.val().length === 0) {
        usererror.html("please enter username");
        $('.username').addClass("errorbox");
    }
});

password.focusout(() => {
    usererror.html("");
    passerror.html("");
    $('.username').removeClass('errorbox');
    $('.password').removeClass('errorbox');
    if (password.val().length === 0) {
        passerror.html("please enter password");
        $('.password').addClass("errorbox");
    }
})
//login validation
loginform.submit((event) => {
    $('.username').removeClass('errorbox');
    $('.password').removeClass('errorbox');
    event.preventDefault();

    usererror.html("");
    passerror.html("");
    let user1 = localStorage.getItem('username1'),
        pass1 = localStorage.getItem('password1');
    event.preventDefault();

    if (username.val().length === 0) {
        usererror.html("please enter username");
        $('.username').addClass("errorbox");
    } else if (password.val().length === 0) {
        passerror.html("please enter password")
        $('.password').addClass("errorbox");
    } else if (username.val() === user1 && password.val() === pass1) {
        localStorage.setItem('validuser', 'true');
        window.open('homepage.html');
    } else {
        passerror.html("invalid username or password");
    }
})
})




















