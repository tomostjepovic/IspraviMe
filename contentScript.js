console.log("-----------");
$("textarea").val("test");
$("button").on("click", function(){
    $.get("http://omega.ispravi.me/api/ispravi.pl?textarea=čovijek+s+sobom&context=on", function(data){
        console.log(data);
    });

    var NewDialog = $('<div id="MenuDialog"><p>This is your dialog content, which can be multiline and dynamic.</p></div>');
    NewDialog.dialog({
    modal: true,
    title: "title",
    show: 'clip',
    hide: 'clip',
    buttons: [
        {text: "Submit", click: function() {doSomething()}},
        {text: "Cancel", click: function() {$(this).dialog("close")}}
    ]
    });
    NewDialog.dialog("open");
});