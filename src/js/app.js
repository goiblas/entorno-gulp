import jQuery from "jquery/dist/jquery";

import "bootstrap/js/src/toast";
import "bootstrap/js/src/util";



(($) => {
    console.log($);
    $('.toast').toast('show');

    $('body').on('click', () => {
        console.log('hola body')
    });

})(jQuery);
document.addEventListener('load', () => console.log('hey!'))

