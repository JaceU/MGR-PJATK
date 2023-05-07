const canvas = document.getElementById("canvas1");
const ctx = canvas.getContext("2d");
canvas.width  = window.innerWidth;
canvas.height = window.innerHeight;
let particleArray = [];


// get mouse mouse position ///////////////////////////////
let mouse = {
	x: null,
	y: null,
    radius: 80
}
window.addEventListener('mousemove', 
	function(event){
		mouse.x = event.x + canvas.clientLeft/2;
		mouse.y = event.y + canvas.clientTop/2;
});

function drawImage(){
    let imageWidth = png.width || png.naturalWidth;
    let imageHeight = png.height || png.naturalHeight;
    const data = ctx.getImageData(0, 0, imageWidth, imageHeight);
    ctx.clearRect(0,0,canvas.width, canvas.height);
    class Particle {
        constructor(x, y, color, size){
            this.x = x + canvas.width/2-png.width*2,
            this.y = y + canvas.height/2-png.height*2,
            this.color = color,
            this.size = 2,
            this.baseX = x + canvas.width/2-png.width*2,
            this.baseY = y + canvas.height/2-png.height*2,
            this.density = ((Math.random() * 10) + 2);
        }
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI*2);
            ctx.closePath();
            ctx.fill();
        }
        update() {
            ctx.fillStyle = this.color;
            // check mouse position/particle position - collision detection
            let dx = mouse.x - this.x;
            let dy = mouse.y - this.y;
            let distance = Math.sqrt(dx*dx + dy*dy);
            let forceDirectionX = dx / distance;
            let forceDirectionY = dy / distance;
            // distance past which the force is zero
            var maxDistance = 80;
            var force = (maxDistance - distance) / maxDistance;

            // if we go below zero, set it to zero.
            if (force < 0) force = 0;

            let directionX = (forceDirectionX * force * this.density) * 0.9;
            let directionY = (forceDirectionY * force * this.density) * 0.9;

            if (distance < mouse.radius + this.size){
                this.x -= directionX;
                this.y -= directionY;
            } else {
                if (this.x !== this.baseX ) {
                    let dx = this.x - this.baseX;
                    let dy = this.y - this.baseY;
                    this.x -= dx/5;
                } if (this.y !== this.baseY) {
                    let dx = this.x - this.baseX;
                    let dy = this.y - this.baseY;
                    this.y -= dy/5;
                }
            }
            this.draw();
        }
    }
    function init(){
        particleArray = [];

        for (var y = 0, y2 = data.height; y < y2; y++) {
            for (var x = 0, x2 = data.width; x < x2; x++) {
                if (data.data[(y * 4 * data.width) + (x * 4) + 3] > 128) {
                    let positionX = x;
                    let positionY = y;
                    let color = "rgb("+data.data[(y * 4 * data.width)+ (x * 4)]+","+data.data[(y * 4 * data.width)+ (x * 4) +1]+","+data.data[(y * 4 * data.width)+ (x * 4) +2]+")";

                    particleArray.push(new Particle(positionX*4, positionY*4, color));

                }
            }
        }
        
    }
    function animate(){
        requestAnimationFrame(animate);
        ctx.fillStyle = 'rgba(255,255,255,.2)';
        ctx.fillRect(0,0,innerWidth,innerHeight);
       // ctx.clearRect(0,0,innerWidth,innerHeight);
	    
	
	    for (let i = 0; i < particleArray.length; i++){
            particleArray[i].update();
	    }
    }
    init();
    animate();

    // RESIZE SETTING - empty and refill particle array every time window changes size + change canvas size
    window.addEventListener('resize',
	function(){
		canvas.width = innerWidth;
		canvas.height = innerHeight;
		init();
	});
}


var png = new Image();
//let test1 = new String( "\"" + convertImageToBase64('https://miro.medium.com/fit/c/64/64/1*3wTm70KPAVCovuotmFReJA.png', console.log) + "\"" );
//imageData = "\"" + convertImageToBase64('https://miro.medium.com/fit/c/64/64/1*3wTm70KPAVCovuotmFReJA.png', console.log) + "\"";
//test1 = convertImageToBase64('https://miro.medium.com/fit/c/64/64/1*3wTm70KPAVCovuotmFReJA.png', console.log);
//console.log(test1);
//png.src = "\"" + convertImageToBase64('https://miro.medium.com/fit/c/64/64/1*3wTm70KPAVCovuotmFReJA.png', console.log) + "\"";


//png.src = "data:image/png;base64,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";


png.src = 
"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAYAAABw4pVUAAAABGdBTUEAALGPC/xhBQAAAAlwSFlzAAAOwgAADsIBFShKgAAAABl0RVh0U29mdHdhcmUAcGFpbnQubmV0IDQuMC4yMfEgaZUAAAS5SURBVHhe7d0t25RAGAVgg8FgMBgMBoPBYDAYDAaD0WAwGgwGg8HgfzAYDG8wGAz+0PGc8VqEh8PyNV+7POGeazgvy7KDu8Aw4K0QgmuIDF09MmzSz58hfP0awrt3Ibx8GcKjRyHcu4e/4M99zPg3zsN5+Rq+lsu4ADJswqdPITx7hhomU+IyuWxMtUiGVdzchPDqVQi3b2MKUQl8L75nQ98gGRb19m0Id+6ghsmauA5cF0zVJMPsfv0K4fFj1DDZIq4b1xFTpckwm9+/Q3j4EDVMXgKuK9cZU6XIMIscO+hSuO6olSDDpN6/R4nqNeBnQS0nGSZz/z5KVK8JPxNquchwNx7n2w9ybTKdy8hwl+fPUaJ6BBn2LTLc7MEDlKgeCT8zaqnIcJMWTu5q4WdHLQUZrlayu6NVbAPU9pLhKnbFjg7lHjJczL8ZYzu/KTJc5Mj7jDk79ikynHXEo6m1Nh59yfCsI51n7LXhPEWGk45wBp7ax49oOtGWE2Q4yb6ZWwblUjKUrrGjsJQVHZIyHLmmLvRaOAIGtTkyHLELd9ugnCPDgUu+0tcaXqtH7RwZdng92S7U7TMz5EiGnUsakHAp2KaoTZFhxGEwdmEujR8/0MSizUGGUcvjpi7dmW+JDCO7EJcWSkWGcUilXYBLa2LY6iiIvGs9v4nrJqMgHpbZF7s8vn9Hkw/bfzARcXi+faHLgzcVodY3mIj8smw54mdrMBHZF7m8/vxBs/9v/64S+QWo8swFrK4SeUdieU+foumnNoid2ZWB8qSrRHZGVwbKk67i5x8V8Q5k1IYbhDfY2xldGV++iA3Ca752RldGr18rFhHPGu2MrowXL8QG4fNB7IyuDLY9asMNoh7k4srojduKRWRncmWh9A3SEpS+QVqC0jdIS1AON4jv1Ou5e1dsED/srUce9vLkxM7oypAnht51Uo/sOmEHl53RlfH5s9gg7AK2M7oyemN9Y9GxM7oyUJ50lcjO6MpAedJVIl5wtzO7vMxdVV0l4pAU+wKX14cPaPqpDcJBW/YFLi/zGNqu0vGhpGWh7BtMRH4pt5zeGfrJYCLiMbF9ocvj2zc0+bD9BxMd/9nKb/ENO+S3tOX3+jWaetz2o6BjF+DSQqnIMPLrI/mcedqcDCPfueez6cEB5I/WSG/m2Vky7PjjNdI78+0gGQ74IzbS2f14phO7YLcNyjkyHHnzBiWqbju2IWpzZCj5uK3teuOu5shwkn0jt4y5F/0cGU7yp5Out/BppCcyPOvJE5SounlsK9TWkOEs/ibaN3dDK/YbfTJcxLvop010rS8hw8Xsirh/UG4lw8V8tOPYTNfIHBmu4hvlv50bg2S4yZH3KTv2GZYMNzvi0dfGo6kpMtzlSOcpG84z5shwtyPc/LPyDHwpGSbB/ptr/AnjZ1rRN7WWDJO6pq77hV3oe8gwi0u+8rjgSl8qMsyGx+mX9J+LcV0TnFusIcPs+CFb/t9CuW6FN8SJDIvikMoWTiq5DhPDO0uSYRUcCV7j4QV8TzEKvRYZVse7inirV44DAS6TyzZ3LrVChk3ibzpvsOfIfP6r5thjdZ7DwRj8G+fhvHwgQqX9wRYydPXI0NUSbv0FneLe5cXkdjwAAAAASUVORK5CYII=";


window.addEventListener('load' , (event) => {
    console.log('page has loaded');
    ctx.drawImage(png, 0, 0);
    drawImage();
});

