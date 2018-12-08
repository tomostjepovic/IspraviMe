
var ispraviMeDataAttribute = 'ispravi-me-id';

function provjeri($clickedButton){
    var text = getContainerText($clickedButton);

    if (!text){
        alert("Potrebno je upisati barem jednu riječ.");
    }

    $.get("http://omega.ispravi.me/api/ispravi.pl?textarea=" + text + "&context=on", function(response){
        console.log(response);
    });
}

var getContainerText = function($button){
    var ispraviMeId = $button.data(ispraviMeDataAttribute);
    var text = $($('body').find("[data-container-" + ispraviMeDataAttribute + "='" + ispraviMeId + "']")[0]).text();

    return text;
}

var createButton = function(ispraviMeId) {
    var ispraviMeButton = $('<button/>',
    {
        text: 'Provjeri',
        click: function () { 
            provjeri($(this));
        },
        ['data-' + ispraviMeDataAttribute]: ispraviMeId
    }); 

	return ispraviMeButton;
};

var containers = $('.ispravi-me-container');
containers.each(function(){
    var uniqueId = Date.now() + Math.random();
    $(this).attr('data-container-' + ispraviMeDataAttribute, uniqueId);
    var newButton = createButton(uniqueId);
    $(newButton).insertAfter($(this));
});