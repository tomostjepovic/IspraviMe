function Highlight($container, ispraviMeResponse){
    console.log($container.text());
    console.log(ispraviMeResponse);

    $container.html('<span class="ispravi-me-highlight" data-index="0">Ovo je 0</span> a sada slijedi <span class="ispravi-me-highlight" data-index="1">jedaaaan</span>');
}