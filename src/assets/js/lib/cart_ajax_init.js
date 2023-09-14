/**
 * set up the ajax add to cart functionality
 *
 */
function initAjaxCart(){

    var cartLayout = 'commerce_shoppingcart_mini';

    var $oCart = new CommerceAjaxCart({
        'cartLayout' : cartLayout,
        beforeUpdate: function(data, cmd){
            var input = $('form[relid="'+data['refno']+'"]').find('.cartAddSubmit input');
            input.val('Adding...');
            return true;
        },
        afterUpdate: function(cart, cmd){
            //this = jquery xhr object
            var $showExpandedCart = $('.'+cartLayout +' .expandableMiniCart').hasClass('expanded');
            $('.'+cartLayout).replaceWith(cart);
            if($showExpandedCart){
                $('.'+cartLayout +' .expandableMiniCart').addClass('expanded');
            }
            $('.shoppingCartTable tr.product').each(function(i, el){if(i%2){ $(el).addClass('even')}});

            var urlparams = Freedom.getQueryParameters(this.url);
            var input = $('form[relid="'+urlparams['refno']+'"]').find('.cartAddSubmit input');
            input.delay(300).queue(function(next){ $(this).css('color', '#006998').val('Added!'); next();}).queue(function(next){
                $(this).css('color', '#FFF');
                next();
            });
        }
    });
    $oCart.initSet('.shoppingFormQuantity', 'keyup');
    $oCart.initAdd();
    $oCart.initDel('.deletesku');
}