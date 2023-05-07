window.addEventListener('load', function(){
    //textInput ma być w części interfejsu potem
    const textInput = document.getElementById('textInput');
    //Canvas ma wskazywać na główne pole podglądu w prototypie
    const canvas = document.getElementById('canvas1');

    const ctx = canvas.getContext('2d');
    //Canvas element has two independent sizes that need to be sync,
    //otherwise we get distorted shapes.
    //When you set canvas size with just CSS, you are setting
    //just the element size, but that will stretch the drawning surface size
    //and distort your rawings.
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    //Using canvas.width we will set both element size and drawing 
    //surface size to the same value.

    console.log(ctx);//logi są ważne

    //Rysowanie metodą ctx.fillText używając środka jako canvas.width/2 bierze
    //swój punkt odniesienia od lini przecinającej środek! co oznacza że to nie
    //będzie środek ekranu
    //Stosujemy ctx.textAlign aby odnosić sie do środka ekranu
    //Rysuj sobie kreski pomocnicze przez środek

    //Rysowanie kresek
    ctx.lineWidth = 3;
    //beginPath mówi js że będziemy malować nowy kształt
    ctx.beginPath();
    //moveTo to poczatkowe koordynaty
    ctx.moveTo(canvas.width/2, 0);
    //lineTo to koncowe koordynaty
    //lineTo mozna wywolywac wiele razy aby robic rozne ksztalty
    ctx.lineTo(canvas.width/2, canvas.height);
    //stroke to chyba po prostu "maluj"
    ctx.strokeStyle = 'red';
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(0, canvas.height/2);
    ctx.lineTo(canvas.width, canvas.height/2);
    ctx.strokeStyle = 'green';
    ctx.stroke();

    //const text = 'Hello!';
    //const textX = canvas.width/2;
    //const textY = canvas.height/2;
    
    //W przegladarce F12 masz "CanvasRenderingContext2D"
    //Tutaj widzisz wszystkie ustawienia 
    //(plus wartosci domyslne jak ich nie zmieniles)

    //W konsoli [[Prototype]]:CanvasRenderingContext2D
    //masz tez wszystkie metody siedzace na zmiennej ctx

    //Stroke to obwódka! Jak pomylisz koordynaty to sie rozjedzie

    //
    //Trzeba to zrobić jako osobną funkcję i podpiąć pod interfejs, bo
    //to jest proste a efekt ładny
    //Rysuje niewidzialną kręskę wyznaczającą kierunek gradientu
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    //Jest jeszcze ctx.createRadialGradient() jak masz kaprys
    gradient.addColorStop(0.3, 'red');//Pierwszy argument to offset
    gradient.addColorStop(0.5, 'orange');
    gradient.addColorStop(0.7, 'yellow');
    //Ogólnie offset traktuje jako punkty gdzie zaczynają się zmiany koloru
    //Gotowy gradient podpinamy pod ctx.fillStyle
    //

    //letterSpacing jest oznaczone jako eksperymental
    //ctx.letterSpacing = '10px';
    //Text Color
    //ctx.fillStyle = 'white';
    ctx.fillStyle = gradient;
    //kolor cienia strokeText
    ctx.strokeStyle = 'orangered';
    //Text Font
    ctx.font = '80px Helvetica';
    //Odniesienie do środka ekranu - czerwona
    ctx.textAlign = "center";
    //Odniesienie do lini poziomej - zielonej
    ctx.textBaseline = 'middle';
    //Create Text + wersja z zmienna
    //ctx.fillText('minitest', 50, 100);
    //ctx.fillText(text, textX, textY);
    //Taki dziwny cien
    //ctx.strokeText(text, textX, textY);

    //let VARIABLES are block scoped, they only exist inside
    //the code block where we define them.
    //Inside code block means inside the nearest set of brackets {}

    const maxTextWidth = canvas.width/2;
    const lineHeight = 80;

    //Funkcja zawijania tekstu
    function wrapText(text){
        let linesArray = [];//Przechowuje linie tekstu
        let lineCounter = 0;//Zlicza ile razy złamano linie
        let line = '';
        let words = text.split(' ');//biore string tekstu i gdy znajdzie spacje to łamie go
        for (let i = 0; i < words.length; i++){
            //Za każdym wejściem bierzemy linie, dodajemy słowo i spacje za nim
            let testLine = line + words[i] + ' ';
            //measureText zwraca w konsoli TextMetrics i tam jest zmienna width z wartością!
            //console.log(ctx.measureText(testLine).width);
            if(ctx.measureText(testLine).width > maxTextWidth){
                line = words[i] + ' ';
                lineCounter++;
            } else {
                line = testLine;
            }
            linesArray[lineCounter] = line;
            //Rysuje każde słowo nałożone na siebie
            //a dzięki measureText to widzimy w logach jak dłogie jest każde słowo
            //ctx.fillText(testLine, canvas.width/2, canvas.height/2 + i * 80);
        }
        //tutaj bedzie centrowanie w pionie po złamaniu
        let textHeight = lineHeight * lineCounter;
        let textY = canvas.height/2 - textHeight/2;
        //
        linesArray.forEach((element, index) => {
            ctx.fillText(element, canvas.width/2, textY + (index * lineHeight));
        });
        console.log(linesArray);
    }

    //Manualne pisanie tekstu na potrzeby testów
    //wrapText('Hello this is a test very long word');

    //Listener w czasie rzeczywistym
    textInput.addEventListener('keyup', function(e){
        //Za każdym update czyści całe pole canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        console.log(e.target.value);//to jest po to aby w logach znaleźć
        //w jakim obiekcie wykonuje się event - interesuje nas target
        wrapText(e.target.value);
    });
});