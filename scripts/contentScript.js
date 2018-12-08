var ispraviMeDataAttribute = 'ispravi-me-id';

var ispraviMeResponses = [];

$('body').on('click', '.ispravi-me-highlight', function(){
    debugger;
    var _index = $(this).data('index');
    var _ispraviMeId = $(this).data('ispravi-me-id');
    var errors = $.grep(ispraviMeResponses, function(item){ 
        return item.id == _ispraviMeId; 
    });
    ShowErrorModal(errors[0].errors, function(selectedValue, index){
        $("[data-index='" + index + "']").text(selectedValue);
        $("[data-index='" + index + "']").removeClass("ispravi-me-highlight");

        errors = $.grep(errors[_ispraviMeId], function(item){ 
            return item.index != index; 
       });
    }, _index);
});

function provjeri($clickedButton) {
	var ispraviMeId = $clickedButton.data(ispraviMeDataAttribute);
	var $container = $($('body').find('[data-container-' + ispraviMeDataAttribute + "='" + ispraviMeId + "']")[0]);
	var text = $container.text();
	if (!text) {
		alert('Potrebno je upisati barem jednu riječ.');

		return;
	}

    $clickedButton.LoadingOverlay("show", {imageColor: "#0061A6"});
    $.get("http://omega.ispravi.me/api/ispravi.pl?textarea=" + text + "&context=on", function(data){   
        $clickedButton.LoadingOverlay("hide", {imageColor: "#0061A6"});
        if (!data.response){            
            $container.effect('highlight', {color: 'green'}, 1000);
        } else{
            var _errors = $.map(data.response.error, function(item, _index){
                return { index: _index, position: item.position[0], length: item.length, suspicious: item.suspicious, suggestions: item.suggestions };
            });
        
            _errors.sort(function(a, b){return a.position - b.position});

            ispraviMeResponses.push({id: ispraviMeId, errors: _errors});
            
            Highlight($container, _errors, ispraviMeId);
        }
    });
}

var createButton = function(ispraviMeId) {
	var ispraviMeButton = $('<button/>', {
		text: 'Provjeri',
		click: function() {
			provjeri($(this));
		},
		['data-' + ispraviMeDataAttribute]: ispraviMeId,
		class: 'ispravi-me-button'
	});
	ispraviMeButton.button({ icon: 'ui-icon-check' });
	return ispraviMeButton;
};

var containers = $('.ispravi-me-container');
containers.each(function() {
	var uniqueId = Date.now() + Math.random();
	$(this).attr('data-container-' + ispraviMeDataAttribute, uniqueId);
	var newButton = createButton(uniqueId);
	$(newButton).insertAfter($(this));
});
