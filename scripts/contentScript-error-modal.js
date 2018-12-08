function ShowError(error, $selectorContainer, $suspiciousItem) {
	//clear data
	$suspiciousItem.text('  ' + error.suspicious + '  ');
	$selectorContainer.find('input[type=text]').val('');
	let oldList = $selectorContainer.find('ol.data-ispraviMe-selectorList');
	oldList.selectable('destroy');
	oldList.remove();
	//setup new inputs
	let $list = $('<ol>', { class: 'data-ispraviMe-selectorList' });
	$.each(error.suggestions, function(i, e) {
		$list.append($('<li>', { class: 'ui-widget-content' }).append(e));
	});
	$selectorContainer.append(
		$list.selectable({
			selected: function(event, ui) {
				var selectedValue = $list.find('.ui-selected').html();
				$selectorContainer.find('input[type=text]').val(selectedValue);
			}
		})
	);
}

function GetNextErrorByIncrement(currentError, errors, increment) {
	var currentIndex = 0;
	while (true) {
		if (currentError.index == errors[currentIndex].index) {
			break;
		}
		currentIndex++;
	}
	let nextIndex = currentIndex + increment;
	if (nextIndex >= 0 && nextIndex < errors.length) {
		return errors[nextIndex];
	} else {
		return null;
	}
}

function ShowErrorModal(errors, valueSelectedCallback, defaultErrorIndex) {
	// brisanje modala ako postoji
	var dialogContainerId = 'dialogContainerId';

	$('#' + dialogContainerId).remove();

	let error = $.grep(errors, function(i) {
		return i.index === defaultErrorIndex;
	})[0];
	let $selectorContainer = $('<div>', { id: 'dialogContainerId', class: 'data-ispraviMe-suspiciousContainer' });
	let $previousErrorButton = $('<input>', { type: 'button', value: '<' });
	$previousErrorButton.click(function() {
		var nextError = GetNextErrorByIncrement(error, errors, -1);
		if (nextError != null) {
			ShowError(nextError, $selectorContainer, $suspiciousItem);
		}
	});
	$selectorContainer.append($previousErrorButton);
	let $suspiciousItem = $('<span>', { class: 'data-ispraviMe-suspiciousItem' });
	$selectorContainer.append($suspiciousItem);
	let $nextErrorButton = $('<input>', { type: 'button', value: '>' });
	$nextErrorButton.click(function() {
		var nextError = GetNextErrorByIncrement(error, errors, 1);
		if (nextError != null) {
			ShowError(nextError, $selectorContainer, $suspiciousItem);
		}
	});
	$selectorContainer.append($nextErrorButton);
	ShowError(error, $selectorContainer, $suspiciousItem);
	$selectorContainer.append($('<input>', { type: 'text', class: 'ispraviMe-errorValue' }));
	$('body').append($selectorContainer);

	$selectorContainer.dialog({
		dialogClass: 'no-close',
		title: 'Ispravi me',
		position: { my: 'center', at: 'top' },
		buttons: [
			{
				text: 'Zamjeni',
				click: function() {
					let selectedValue = $('input[type="text"].ispraviMe-errorValue').val();
					if (selectedValue) {
						valueSelectedCallback(selectedValue, error.index);
					}

					let nextError = GetNextErrorByIncrement(error, errors, 1);
					if (nextError != null) {
						ShowError(nextError, $selectorContainer, $suspiciousItem);
					} else {
						nextError = GetNextErrorByIncrement(error, errors, -1);
						if (nextError != null) {
							ShowError(nextError, $selectorContainer, $suspiciousItem);
						} else {
							$(this).dialog('close');
						}
					}
				}
			}
		]
	});
}
