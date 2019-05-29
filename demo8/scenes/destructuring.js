class DestrScene extends Scene {
    constructor(options = {}) {
        options = assignDeep({}, {
            debug: {
                enabled: true,
                additional: []
            },

        }, options)

        super(options);
    }

    start() {

        this.imgCache = {};

        let imgSize = new V2(8,16);
        let startImg = createCanvas(imgSize, (ctx, size) => {
            ctx.fillStyle = 'red';
            ctx.fillRect(0,0, size.x,size.y);
        })

        let targetImgSize = new V2(16,8);
        let targetImg = createCanvas(targetImgSize, (ctx, size) => {
            ctx.fillStyle = 'green';
            ctx.fillRect(0,0, size.x,size.y);
        })

        let scale = 5;

        this.demoGo = this.addGo(new GO({
            position: this.sceneCenter,
            size: imgSize.mul(scale),
            targetSize: targetImgSize.mul(scale),
            pixels: [],
            imgCache: this.imgCache,
            //img: startImg,
            scale,
            init() {
                this.direction = 1;
                this.registerTimer(createTimer(2000, () => {

                    if(this.direction == 1) {
                        this.startMutations({
                            size: this.size, 
                            img: startImg, 
                            imgSize: imgSize
                        }, {
                            size: this.targetSize,
                            img: targetImg, 
                            imgSize: targetImgSize
                        })
                    }
                    else {
                        this.startMutations({
                            size: this.targetSize,
                            img: targetImg, 
                            imgSize: targetImgSize
                        }, {
                            size: this.size, 
                            img: startImg, 
                            imgSize: imgSize
                        })
                    }
                    this.direction*=-1;

                }, this, true));
            },
            startMutations(start, target) {
                let topLeftStart = new V2(-start.size.x/2, -start.size.y/2);
                let topLeftTarget = new V2(-target.size.x/2, -target.size.y/2);

                let targetPixels = this.parentScene.getPixels(target.img, target.imgSize).map(p => {
                    return {
                        size: new V2(1,1).mul(this.scale),
                        position: topLeftTarget.add(p.position.mul(this.scale)).add(new V2(1,1).mul(this.scale/2)),
                        color: p.color
                    }
                })

                let startPixels = this.parentScene.getPixels(start.img, start.imgSize).map(p => {            
                    return {
                        size: new V2(1,1).mul(this.scale),
                        position: topLeftStart.add(p.position.mul(this.scale)).add(new V2(1,1).mul(this.scale/2)),
                        color: p.color
                    }
                });

                let startPixelsOriginals = [...startPixels];
                let targetPixelsOriginals = [...targetPixels];

                if(this.pixels.length){
                    this.pixels.forEach(c => this.removeChild(c));
                }

                this.pixels = [];

                while(startPixels.length || targetPixels.length){
                    let startPixel = startPixels.shift();
                    let targetPixel = targetPixels.shift();

                    if(startPixel == undefined){
                        startPixel = startPixelsOriginals[startPixelsOriginals.getRandom(0, startPixelsOriginals.length-1)];
                    }

                    this.pixels[this.pixels.length] = this.addChild(new MutationPixel({
                        imgCache: this.imgCache,
                        position: startPixel.position,
                        midPosition: new V2(
                            fastRoundWithPrecision(this.size.x* getRandom(1,2) * (startPixel.position.x >= 0 ? 1 : -1)), 
                            fastRoundWithPrecision(this.size.y/2 - this.size.y* getRandom(0,2))),
                        targetPosition: targetPixel.position,
                        startSize: startPixel.size,
                        targetSize: targetPixel.size,
                        startColorRGB: startPixel.color,
                        targetColorRGB: targetPixel.color
                    }))
                }
            }
        }));

    }

    backgroundRender(){
        this.backgroundRenderDefault();
    }

    getPixels(img, size) {
        let ctx = img.getContext("2d");
        let  pixels = [];

        let imageData = ctx.getImageData(0,0,size.x, size.y).data;

        for(let i = 0; i < imageData.length;i+=4){
            if(imageData[i+3] == 0)            
                continue;

            let y = fastFloorWithPrecision((i/4)/size.x);
            let x = (i/4)%size.x;//i - y*size.x;
            let color = [imageData[i], imageData[i+1], imageData[2], fastRoundWithPrecision(imageData[i+3]/255, 4)] //`rgba(${imageData[i]}, ${imageData[i+1]}, ${imageData[2]}, ${ fastRoundWithPrecision(imageData[i+3]/255, 4)})`

            pixels[pixels.length] = { position: new V2(x,y), color };
        }
        
        //console.log(imageData);
        return pixels;
    }


}

class MutationPixel extends GO {
    constructor(options = {}) {
        options = assignDeep({}, {
            startColorRGB: [0,0,0],
            targetColorRGB:[0,0,0],
            duration: 40,
            startSize: new V2(1,1),
            targetSize: new V2(1,1),
            size: new V2(1,1),
            midPosition: new V2(),
            targetPosition: new V2(),
            pixelSize: new V2(1,1)
        }, options)

        super(options);
    }

    init(){

        this.size = this.startSize;
        this.currentColor = colors.rgbToString({value: [this.startColorRGB[0], this.startColorRGB[1], this.startColorRGB[2]], opacity: this.startColorRGB[3] != undefined ? this.startColorRGB[3] : 1});
        if(!this.imgCache[this.currentColor]){
            this.imgCache[this.currentColor] = createCanvas(this.pixelSize, (ctx, size) => {
                ctx.fillStyle = this.currentColor;
                ctx.fillRect(0,0, size.x, size.y);
            });
        }

        this.img = this.imgCache[this.currentColor];

        this.isColorChange = this.startColorRGB[0] != this.targetColorRGB[0] || this.startColorRGB[1] != this.targetColorRGB[1] || this.startColorRGB[2] != this.targetColorRGB[2];
        this.isSizeChange = !this.startSize.equal(this.targetSize);

        if(this.isColorChange){
            this.colorChange = [
                { time: 0, duration: this.duration, change: this.targetColorRGB[0] - this.startColorRGB[0] , type: 'linear', method: 'base', startValue: this.startColorRGB[0] },
                { time: 0, duration: this.duration, change: this.targetColorRGB[1] - this.startColorRGB[1] , type: 'linear', method: 'base', startValue: this.startColorRGB[1] },
                { time: 0, duration: this.duration, change: this.targetColorRGB[2] - this.startColorRGB[2] , type: 'linear', method: 'base', startValue: this.startColorRGB[2] }
            ];
        }
        
        if(this.isSizeChange) {
            this.sizeXChange = { time: 0, duration: this.duration, change: this.targetSize.x - this.size.x , type: 'quad', method: 'out', startValue: this.size.x }
            this.sizeYChange = { time: 0, duration: this.duration, change: this.targetSize.y - this.size.y , type: 'quad', method: 'out', startValue: this.size.y }
        }

        this.flyOut = true;
        this.xChange = { time: 0, duration: this.duration/2, change: this.midPosition.x - this.position.x , type: 'quad', method: 'out', startValue: this.position.x }
        this.yChange = { time: 0, duration: this.duration/2, change: this.midPosition.y - this.position.y , type: 'quad', method: 'out', startValue: this.position.y }

        this.mutationTimer = this.registerTimer(createTimer(30, () => {
            this.position.x = easing.process(this.xChange);
            this.position.y = easing.process(this.yChange);

            if(this.isColorChange){
                this.currentColor = colors.rgbToString({value: [easing.process(this.colorChange[0]), easing.process(this.colorChange[1]), easing.process(this.colorChange[2])], opacity: this.startColorRGB[3] != undefined ? this.startColorRGB[3] : 1});
                // this.img = createCanvas(this.pixelSize, (ctx, size) => {
                //     ctx.fillStyle = this.currentColor;
                //     ctx.fillRect(0,0, size.x, size.y);
                // })

                if(!this.imgCache[this.currentColor]){
                    this.imgCache[this.currentColor] = createCanvas(this.pixelSize, (ctx, size) => {
                        ctx.fillStyle = this.currentColor;
                        ctx.fillRect(0,0, size.x, size.y);
                    });
                }
                
                this.img = this.imgCache[this.currentColor];

                this.colorChange.forEach(cc => cc.time++);
            }

            if(this.isSizeChange) {
                this.size.x = easing.process(this.sizeXChange);
                this.size.y = easing.process(this.sizeYChange);

                this.sizeXChange.time++;
                this.sizeYChange.time++;
            }

            this.needRecalcRenderProperties = true;
            
            this.xChange.time++;
            this.yChange.time++;

            if(this.xChange.time > this.xChange.duration){
                if(this.flyOut){
                    this.xChange = { time: 0, duration: this.duration/2, change: this.targetPosition.x - this.position.x , type: 'quad', method: 'in', startValue: this.position.x }
                    this.yChange = { time: 0, duration: this.duration/2, change: this.targetPosition.y - this.position.y , type: 'quad', method: 'in', startValue: this.position.y }
                }
                else 
                    this.unregTimer(this.moveTImer);
            }

        }, this. true));
    }
}

