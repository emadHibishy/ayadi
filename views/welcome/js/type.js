const texts = ["Discover, request and buy lots of manual labor and art pieces! Which made by the best Handicraft all over the world!"];
let count = 0;
let index= 0;
let currentText= "" ;
let letter = "";

(function type(){
    if(count === texts.length){
        count = 0;
    }
    currentText = texts[count];
    letter = currentText.slice(0,++index);
    document.querySelector('.text-white-75').textContent = letter;
    if(letter.length === currentText.length){
        count++;
        
        
    }
    setTimeout(type,100);
    
}());