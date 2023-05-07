//To jest wersja przepisana na OOP aby dało dodać animacje
window.addEventListener('load', function(){
    //const textInput = document.getElementById('textInput');//to leci jako class property
    const canvas = document.getElementById('canvas1');
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    console.log(ctx);

    //Klasa Particle jest wzorcem dla każdego indywidualnego pixela
    class Particle {
        constructor(effect, x, y, color){
            this.effect = effect;
            this.x = Math.random() * this.effect.canvasWidth;
            this.y = 0;//Tą zmienną moża kontrolować z jakiej części ekrany pixele zaczynają się pojawiać
            this.color = color;
            this.originX = x;//zapamiętujemy orginalne położenie aby pixel do niego wracał
            this.originY = y;
            this.size = this.effect.gap;
            this.dx = 0;//Odległość od myszy oś x
            this.dy = 0;//Odległość od myszy oś y
            this.vx = 0;//Velocity oś x
            this.vy = 0;//Velocity oś y
            this.force = 0;//Force
            this.angle = 0;//Push direction
            this.distance = 0;//Odległość gdzie sie zatrzyma
            //Friction i Ease to są kandydaci do interfejsu
            //Te dwie zmienne mają gigantyczny wpływ na zachowanie całości
            this.friction = Math.random() * 0.6 + 0.15;//spowalnia poruszanie sie pixeli
            this.ease = Math.random() * 0.1 + 0.005;

        }
        draw(){
            this.effect.context.fillStyle = this.color;
            //Tutaj można dać 60fps na całość, ale to usmaży komputer
            //Trzeba zastosować sztuczke optymalizacyją i sprawdzać czy w danym miejscu sie opłaca rysować
            this.effect.context.fillRect(this.x, this.y, this.size, this.size);
        }
        update(){
            //How calculate distance between any 2 points (in this case between the mouse cursor and each individual particle)
            //Tutaj sie dieje zwykły pitagoras
            this.dx = this.effect.mouse.x - this.x;
            this.dy = this.effect.mouse.y - this.y;
            //Tutaj używam bardzo nie-efektywnego sqrt, jakby tu dać ten z quake to by było śmiesznie
            //EKSTREMALNIE KOSZTOWA OPERACJA!!!
            //this.distance = Math.sqrt(this.dx * this.dx + this.dy * this.dy);
            this.distance = this.dx * this.dx + this.dy * this.dy
            this.force = -this.effect.mouse.radius / this.distance;
            //atan2 gives us an angle in radians between positive x axis and a line projected from point 0,0 towards particle position
            if (this.distance < this.effect.mouse.radius){
                this.angle = Math.atan2(this.dy, this.dx);
                //Tutaj można dać w sumie coś innego niż sin i cos - efekt i tak jest już niezły
                this.vx += this.force * Math.cos(this.angle);
                this.vy += this.force * Math.sin(this.angle);
            }
            //Te dwie linijki odpowiadają za to że particles wracają do swoich pozycji początkowych
            //To jest kandydat na opcje w interfejsie
            this.x += (this.vx *= this.friction) + (this.originX - this.x) * this.ease;
            this.y += (this.vy *= this.friction) + (this.originY - this.y) * this.ease;
            //this.x += (this.originX - this.x) * this.ease
            //this.y += this.originY - this.y;
        }
    }
    //Kręgosłup tej animacji
    class Effect {
        constructor(context, canvasWidth, canvasHeight){
            this.context = context;
            this.canvasWidth = canvasWidth;
            this.canvasHeight = canvasHeight;
            this.textX = this.canvasWidth / 2;
            this.textY = this.canvasHeight / 2;
            this.fontSize = 100;
            this.lineHeight = this.fontSize * 0.8;
            this.maxTextWidth = this.canvasWidth * 0.8;
            this.textInput = document.getElementById('textInput');
            //(e) => to ES6 ARROW FUNCTION
            //one of the special features of these functions is that they
            //inherit 'this' from the parent scope automatically
            this.textInput.addEventListener('keyup', (e) => {
                if (e.key !==' ') {
                    this.context.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
                    this.wrapText(e.target.value);
                }//Nie animujemy spacji bo to nie ma sensu
            });
            //Uwaga tutaj chwilowo wrzucamy logike particle text
            //To ma być przeniesione jako osobny skrypt
            this.particles = [];
            this.gap = 3;//nie zmniejszać poniżej 1
            //ogólnie gap jest kandydatem do interfejsu bo ma hardkorowy wpływ na wygląd (i wydajność)
            this.mouse = {
                radius: 20000,
                x: 0,
                y: 0
            }
            window.addEventListener('mousemove', (e) => {
                this.mouse.x = e.x;
                this.mouse.y = e.y;
                //Te logi strasznie spamują, włączać tylko na testy jak coś nie działa
                //console.log(this.mouse.x, this.mouse.y);
            });
        }
        wrapText(text){
            //static setting to trzeba zmienic
            const gradient = this.context.createLinearGradient(0, 0, this.canvasWidth, this.canvasHeight);
            gradient.addColorStop(0.3, 'red');
            gradient.addColorStop(0.5, 'orange');
            gradient.addColorStop(0.7, 'yellow');
            this.context.fillStyle = gradient;
            this.context.textAlign = 'center';
            this.context.textBaseline = 'middle';
            this.context.lineWidth = 3;
            this.context.strokeStyle = 'white';
            this.context.font = this.fontSize + 'px Helvetica';
            
            //funkcja zawijania tekstu w wersji opp
            let linesArray = [];
            let words = text.split(' ');
            let lineCounter = 0;
            let line = '';
            for(let i = 0; i < words.length; i++){
                let testLine = line + words[i] + ' ';
                if (this.context.measureText(testLine).width > this.maxTextWidth){
                    line = words[i] + ' ';
                    lineCounter++;
                } else {
                    line = testLine;
                }
                linesArray[lineCounter] = line;
            }
            let textHeight = this.lineHeight + lineCounter;
            this.textY = this.canvasHeight / 2 - textHeight / 2;
            linesArray.forEach((element, index) => {
                this.context.fillText(element, this.textX, this.textY + (index * this.lineHeight));
                this.context.strokeText(element, this.textX, this.textY + (index * this.lineHeight));
            });
            //Tylko do testu, usun to potem
            this.convertToParticles();
        }
        //convertToParticles skanuje obszar canvas i zamienia na Particle
        convertToParticles(){
            //getImageData() method will return auto generated ImageData object which contains pixel data for a specified portion of canvas.
            this.particles = [];
            const pixels = this.context.getImageData(0, 0, this.canvasWidth, this.canvasHeight).data;
            this.context.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
            //Ten imageData jest niemożliwy do zrozumienia - format Uint8ClampedArray
            //W sumie jest do zrozumienia, to są kolejno piksele od lewej do prawej w macierzy, a wartości oznaczają jaki to jest kolor
            //Coś w stylu kolorów RGB
            //console.log(pixels);
            //Gap oznacza że skaczemy co 3 pixele - canvas traktujemy jak grid albo macierz
            for (let y = 0; y < this.canvasHeight; y += this.gap){
                for (let x = 0; x < this.canvasWidth; x += this.gap){
                    const index = (y * this.canvasWidth + x) * 4;//ta linia jest skomplikowana - ona wylicza gdzie sie znajdujemy
                    const alpha = pixels[index + 3];//0 oznacza transparent
                    if (alpha > 0){
                        //Jeżeli nie będziemy pomijać 0, to algorytm usmaży nam komputer
                        const red = pixels[index];
                        const green = pixels[index + 1];
                        const blue = pixels[index + 2];
                        const color = 'rgb(' + red + ',' + green + ',' + blue + ')';
                        //console.log(color);
                        //Tutaj tworzymy new particle tylko w przypadku gdy alpha > 0 aka nie jest transparent
                        this.particles.push(new Particle(this, x, y, color));
                    }
                }
            }
            //console.log(this.particles);
        }
        //render will draw and update particles
        render(){
            this.particles.forEach(particle => {
                particle.update();
                particle.draw();
            });
        }
    }
    //
    //new powoduje że zmienna będzie wywoływała konstruktor metody
    const effect = new Effect(ctx, canvas.width, canvas.height);
    effect.wrapText('Hello to jest długi tekst');
    //console.log(effect);
    effect.render();
    //
    //Animate wywołuje render
    function animate(){
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        effect.render();
        requestAnimationFrame(animate);
        //console.log(animate);
    }
    animate();
});