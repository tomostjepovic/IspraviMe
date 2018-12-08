function Highlight($container, errorList, ispraviMeId){
    var textArray = [];
    var currIndex = 0;
    var text = $container.text();

    errorList.forEach(function(error) {
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
        return '<span class="ispravi-me-highlight" data-index="' + index + '" data-ispravi-me-id="' + ispraviMeId + '">' + text + '</span>';
    }

    $container.html(textArray.join(""));
}