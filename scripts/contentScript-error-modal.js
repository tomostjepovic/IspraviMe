function ShowError(error, $selectorContainer, $suspiciousItem) {
	//clear data
	$suspiciousItem.text(error.suspicious);
	let oldList = $selectorContainer.find('ol.data-ispraviMe-selectorList');
	oldList.selectable('destroy');
	oldList.remove();
	let $list = $('<ol>', { class: 'data-ispraviMe-selectorList' });
	$.each(error.suggestions, function(i, e) {
		$list.append($('<li>', { class: 'ui-widget-content' }).append(e));
	});
	$selectorContainer.append($list.selectable());
}

function GetNextIndexByIncrement(fixedErrorIndexes, currentIndex, increment) {
	var newIndex = currentIndex;
	while (true) {
		newIndex = newIndex + increment;
		if ($.inArray(newIndex, fixedErrorIndexes) === -1) {
			break;
		}
	}
	return newIndex;
}

function ShowErrorModal(res, valueSelectedCallback, defaultErrorIndex) {
	// brisanje modala ako postoji
	var dialogContainerId = 'dialogContainerId';

	$('#' + dialogContainerId).remove();

	let errorIndex = 0;
	let fixedErrorIndexes = [];
	if (defaultErrorIndex != null) {
		errorIndex = defaultErrorIndex;
	}
	let $selectorContainer = $('<div>', { id: 'dialogContainerId', class: 'data-ispraviMe-suspiciousContainer' });
	let $previousErrorButton = $('<input>', { type: 'button', value: '<' });
	$previousErrorButton.click(function() {
		var nextIndex = GetNextIndexByIncrement(fixedErrorIndexes, errorIndex, -1);
		if (nextIndex >= 0) {
			errorIndex = nextIndex;
			console.log('Previous index: ' + errorIndex);
			ShowError(res.response.error[errorIndex], $selectorContainer, $suspiciousItem);
		}
	});
	$selectorContainer.append($previousErrorButton);
	let $suspiciousItem = $('<strong>', { class: 'data-ispraviMe-suspiciousItem' });
	$selectorContainer.append($suspiciousItem);
	let $nextErrorButton = $('<input>', { type: 'button', value: '>' });
	$nextErrorButton.click(function() {
		var nextIndex = GetNextIndexByIncrement(fixedErrorIndexes, errorIndex, 1);
		if (nextIndex < res.response.errors) {
			errorIndex = nextIndex;
			console.log('Next index: ' + errorIndex);
			ShowError(res.response.error[errorIndex], $selectorContainer, $suspiciousItem);
		}
	});
	$selectorContainer.append($nextErrorButton);
	ShowError(res.response.error[errorIndex], $selectorContainer, $suspiciousItem);
	$('body').append($selectorContainer);

	$selectorContainer.dialog({
		dialogClass: 'no-close',
		title: 'Ispravi me',
		position: { my: 'center', at: 'top' },
		buttons: [
			{
				text: 'Zamjeni',
				click: function() {
					let selectedValue = $('.data-ispraviMe-selectorList .ui-selected').html();
					if (selectedValue) {
						fixedErrorIndexes.push(errorIndex);
						valueSelectedCallback(selectedValue, errorIndex);
					}

					errorIndex++;
					if (errorIndex < res.response.errors) {
						ShowError(res.response.error[errorIndex], $selectorContainer, $suspiciousItem);
					} else {
						$(this).dialog('close');
					}
				}
			}
		]
	});
}
