
var ispraviMeDataAttribute = 'ispravi-me-id';

// TODO: izbrisati kada se implementira ispravno highlightanje
var ispraviMeFakeResponse = {
    response: {
        error: [
            {
                suspicious: "čovijek",
                suggestions: ["čovijek"]
            },            
            {
                suspicious: "diiiijete",
                suggestions: ["dijete", "pijete"]
            }
        ]
    }
};

$('body').on('click', '.ispravi-me-highlight', function(){
    var _index = $(this).data('index');
    ShowErrorModal(ispraviMeFakeResponse, function(selectedValue, index){
        $("[data-index='" + index + "']").text(selectedValue);
        $("[data-index='" + index + "']").removeClass("ispravi-me-highlight");
    }, _index);
});

function provjeri($clickedButton){
    var ispraviMeId = $clickedButton.data(ispraviMeDataAttribute);
    var $container = $($('body').find("[data-container-" + ispraviMeDataAttribute + "='" + ispraviMeId + "']")[0]);
    var text = $container.text();
    if (!text){
        alert("Potrebno je upisati barem jednu riječ.");

        return;
    }

    $clickedButton.LoadingOverlay("show", {imageColor: "#0061A6"});
    $.get("http://omega.ispravi.me/api/ispravi.pl?textarea=" + text + "&context=on", function(data){   
        $clickedButton.LoadingOverlay("hide", {imageColor: "#0061A6"});
        if (!data.response){            
        $container.effect('highlight', {color: 'green'}, 1000);
        } else{
            Highlight($container, data);
        }
    });
}

var createButton = function(ispraviMeId) {
    var ispraviMeButton = $('<button/>',
    {
        text: 'Provjeri',
        click: function () { 
            provjeri($(this));
        },
        ['data-' + ispraviMeDataAttribute]: ispraviMeId,
        class: 'ispravi-me-button'
    }); 
    ispraviMeButton.button({icon: "ui-icon-check"});
	return ispraviMeButton;
};

var containers = $('.ispravi-me-container');
containers.each(function(){
    var uniqueId = Date.now() + Math.random();
    $(this).attr('data-container-' + ispraviMeDataAttribute, uniqueId);
    var newButton = createButton(uniqueId);
    $(newButton).insertAfter($(this));
});