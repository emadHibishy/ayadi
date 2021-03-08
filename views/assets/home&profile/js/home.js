/*global $, jQuery, alert*/

$(document).ready(function () {
    
    "use strict";
    
   
    
    
   // Caching The Scroll Top Element 
  var scrollButton = $("#scroll-top");
    
       
    
    $(window).scroll(function () {
        
        if ($(this).scrollTop() >= 700) {
            
            scrollButton.show();
            
        } else {
            
            scrollButton.hide();
        }
        
    
});
    
 // Click On Button To Scroll Top
    
 scrollButton.click(function () {
        
   $("html,body").animate({ scrollTop : 0 }, 600);
        
});
    

    
});