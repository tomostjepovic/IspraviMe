function Highlight($container, ispraviMeResponse){
    var textArray = [];
    var currIndex = 0;
    var text = $container.text();

    var newArr = $.map(ispraviMeResponse.response.error, function(item, _index){
        return { index: _index, position: item.position[0], length: item.length };
    });

    newArr.sort(function(a, b){return a.position - b.position});

    newArr.forEach(function(error) {
        if (currIndex != error.position){
            textArray.push(text.slice(currIndex, error.position));
        }
        textArray.push(format(text.slice(error.position, error.position + error.length), error.index));
        currIndex = currIndex + error.position + error.length;
    });

    if (currIndex != text.length - 1){
        textArray.push(text.slice(currIndex));
    }

    function format(text, index){
        return '<span class="ispravi-me-highlight" data-index="' + index + '">' + text + '</span>';
    }

    $container.html(textArray.join(""));
}