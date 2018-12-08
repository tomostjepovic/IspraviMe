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

function ShowErrorModal(res, valueSelectedCallback, defaultErrorIndex) {
	let errorIndex = 0;
	if (defaultErrorIndex != null) {
		errorIndex = defaultErrorIndex;
	}
	let $selectorContainer = $('<div>', { id: 'ispraviMeDialogContainer', class: 'data-ispraviMe-suspiciousContainer' });
	let $previousErrorButton = $('<input>', { type: 'button', value: '<' });
	$previousErrorButton.click(function() {
		if (errorIndex > 0) {
			errorIndex--;
			ShowError(res.response.error[errorIndex], $selectorContainer, $suspiciousItem);
		}
	});
	$selectorContainer.append($previousErrorButton);
	let $suspiciousItem = $('<strong>', { class: 'data-ispraviMe-suspiciousItem' });
	$selectorContainer.append($suspiciousItem);
	let $nextErrorButton = $('<input>', { type: 'button', value: '>' });
	$nextErrorButton.click(function() {
		if (errorIndex + 1 < res.response.errors) {
			errorIndex++;
			ShowError(res.response.error[errorIndex], $selectorContainer, $suspiciousItem);
		}
	});
	$selectorContainer.append($nextErrorButton);
	ShowError(res.response.error[errorIndex], $selectorContainer, $suspiciousItem);
	$('body').append($selectorContainer);

	$selectorContainer.dialog({
		dialogClass: 'no-close',
		title: 'Ispravi me',
		buttons: [
			{
				text: 'Zamjeni',
				click: function() {
					let selectedValue = $('.data-ispraviMe-selectorList .ui-selected').html();
					if (selectedValue != '') {
						valueSelectedCallback(selectedValue, res.response.error[errorIndex]);
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
