class CraneScene extends Scene {
    constructor(options = {}) {
        options = assignDeep({}, {
            debug: {
                enabled: true,
                showFrameTimeLeft: true,
                additional: [],
            },
            imgCache: [],
            
        }, options)

        super(options);

    }

    backgroundRender() {
        this.backgroundRenderDefault('#41B7E9');
    }

    start() {
        this.currentFloor = 0;
        this.currentBlock = 0;
        this.maxFloors = 5;
        this.maxBlocks = 2;

        this.panelBlockSize = new V2(30,20)
        this.truckSize = new V2(60,20);
        this.truckWheelSize = new V2(7,7);

        this.apartmentsBlocks = [];
        this.addGo(new GO({
            position: new V2(this.sceneCenter.x, this.sceneCenter.y+65),
            size: new V2(this.viewport.x, 100),
            img: createCanvas(new V2(1,1), (_, __, hlp) => {
                hlp.setFillColor('#3E2231').dot(0,0);
            })
        }), 0)
        this.addGo(new GO({
            position: new V2(this.sceneCenter.x, this.sceneCenter.y+15),
            size: new V2(this.viewport.x, 14),
            img: createCanvas(new V2(this.viewport.x, 14), (ctx, size, hlp) => {
                hlp.setFillColor('#57CBFA').rect(0,0,size.x, 4);
                hlp.setFillColor('#51AC5F').rect(0,4,size.x, 4).setFillColor('#314347').rect(0,8,size.x,1).setFillColor('#221E2C').rect(0,9,size.x, 5);
                hlp.setFillColor('#B1CA55');
                let x = -10;
                while(x < size.x){hlp.dot(x, 4); x+=getRandomInt(2,4); }
                x = -10;
                while(x < size.x){hlp.dot(x, 5); x+=getRandomInt(4,7); }

                hlp.setFillColor('#316B6D');
                x = -10;
                while(x < size.x){hlp.dot(x, 6); x+=getRandomInt(4,7); }
                x = -10;
                while(x < size.x){hlp.dot(x, 7); x+=getRandomInt(2,4); }
                hlp.setFillColor('#272331');
                x = -10;
                while(x < size.x){hlp.dot(x, 8); x+=getRandomInt(2,4); }
                hlp.setFillColor('#6D3D26');
                x = -10;
                while(x < size.x){hlp.dot(x, 9); x+=getRandomInt(2,4); }
                hlp.setFillColor('#48282B');
                x = -10;
                while(x < size.x){hlp.dot(x, 9); x+=getRandomInt(4,8); }
                x = -10;
                while(x < size.x){hlp.rect(x, 10, 2,1); x+=getRandomInt(2,4); }
                hlp.setFillColor('#3E2231');
                x = -10;
                while(x < size.x){hlp.dot(x, 10); x+=getRandomInt(4,8); }
                x = -10;
                while(x < size.x){hlp.dot(x, 11); x+=getRandomInt(2,4); }
                x = -10;
                while(x < size.x){hlp.dot(x, 12); x+=getRandomInt(3,6); }
                x = -10;
                while(x < size.x){hlp.dot(x, 13); x+=getRandomInt(4,8); }
            })
        }), 1)

        this.crane = this.addGo(new Crane({
            position: this.sceneCenter.add(new V2(60, 5)),
        }), 5)

        this.truck = this.addGo(new Truck({
            position: new V2(this.viewport.x + this.truckSize.x/2, this.sceneCenter.y),
            size: this.truckSize,
            truckWheelSize: this.truckWheelSize,
        }), 10)

        // this.truck.cargo(new PanelBlock({
        //     position: new V2(),//this.sceneCenter.add(new V2(-40, 0)),
        //     size: this.panelBlockSize,
        //     panelImg: PP.createImage(apartmentModels.panelBlock)
        // }));

        this.sceneManager = this.addGo(new GO({
            position: new V2(), 
            size: new V2(1,1),
            init() {
                let scene = this.parentScene;

                this.script.items = [
                    this.addProcessScriptDelay(500),
                    function() {
                        scene.crane.moveHook(40, -8, () => this.processScript(), (origin, position) => {
                            let delta = position.y - origin.y;
                            //console.log(delta);
                            scene.truck.getCargo().setRopePosition(fast.r(delta));
                        });
                    },
                    function() {
                        scene.truck.removeCargo();
                        scene.crane.addPayload(new PanelBlock({
                            position: new V2(),//this.sceneCenter.add(new V2(-40, 0)),
                            size: scene.panelBlockSize,
                            panelImg: PP.createImage(apartmentModels.panelBlock),
                            ropePosition: -8
                        }));  
                        this.processScript();
                    },
                    this.addProcessScriptDelay(50),
                    function() {
                        scene.crane.moveHook(40, -20, () => this.processScript())
                    }

                ]

                this.startDelay = this.registerTimer(createTimer(3000, () => {
                    this.unregTimer(this.startDelay);
                    this.startDelay = undefined;
                    this.workSequence();    
                }, this, false));

                
            },
            workSequence() {
                let scene = this.parentScene;
                let isDoor = false;
                let vChange = easing.createProps(scene.maxFloors-1, 41, 60, 'linear', 'base');
                this.script.items = [
                    function() {          
                        let model = apartmentModels.panelBlock;
                        if(scene.currentFloor == 0){
                            model = scene.currentBlock == 0 ? apartmentModels.groundFloorDoor : apartmentModels.groundFloorBlock;
                            isDoor = scene.currentBlock == 0;
                        }
                        else if(scene.currentFloor == scene.maxFloors-1) {
                            model = scene.currentBlock == 0 ? apartmentModels.lastFloorLeft : apartmentModels.lastFloorRight;
                        }
                        else {
                            model = scene.currentBlock == 0 ? apartmentModels.panelBlockLeft : apartmentModels.panelBlockRight;
                        }
                        
                        model = model();
                        vChange.time = scene.currentFloor;
                        model.main.layers[0].fillColor = hsvToHex({hsv: [48,29,fast.r(easing.process(vChange))]});

                        scene.currentApartmentsImgModel = model;
                        scene.truck.cargo(new PanelBlock({
                            position: new V2(),//this.sceneCenter.add(new V2(-40, 0)),
                            size: scene.panelBlockSize,
                            panelImg: PP.createImage(scene.currentApartmentsImgModel)
                        }));
                        scene.truck.position = new V2(scene.viewport.x + scene.truckSize.x/2, scene.sceneCenter.y);
                        scene.truck.moveIn(() => this.processScript())
                    },
                    function() {
                        scene.crane.moveCaret(25, -52 - scene.crane.caret.position.x, () => this.processScript());
                    },
                    function() {
                        scene.crane.moveHook(15 + scene.currentFloor*5, -25 - scene.crane.hook.position.y, () => this.processScript());
                    },
                    this.addProcessScriptDelay(50),
                    function() {
                        scene.crane.moveHook(15, -8, () => this.processScript(), (origin, position) => {
                            let delta = position.y - origin.y;
                            scene.truck.getCargo().setRopePosition(fast.r(delta));
                        });
                    },
                    function() {
                        scene.truck.removeCargo();
                        scene.crane.addPayload(new PanelBlock({
                            position: new V2(),//this.sceneCenter.add(new V2(-40, 0)),
                            size: scene.panelBlockSize,
                            panelImg: PP.createImage(scene.currentApartmentsImgModel),
                            ropePosition: -8
                        }));  
                        scene.truck.moveOut();
                        this.processScript();
                    },
                    this.addProcessScriptDelay(50),
                    function() {
                        scene.crane.moveHook(15+ scene.currentFloor*5,(scene.crane.caret.position.y+10) - scene.crane.hook.position.y, () => this.processScript())
                    },
                    function() {
                        scene.crane.moveCaret(25, -scene.panelBlockSize.x/2 - 5 + scene.currentBlock*scene.panelBlockSize.x, () => this.processScript());
                    },
                    //
                    function() {
                        scene.crane.moveHook(15+ scene.currentFloor*2, -23 - (scene.panelBlockSize.y*scene.currentFloor) - scene.crane.hook.position.y, () => this.processScript());
                    },
                    function() {
                        let p = scene.crane.getPayload();
                        let position = p.getAbsolutePosition();
                        
                        scene.placingBlock = scene.addGo(new PanelBlock({
                            position: position,
                            size: scene.panelBlockSize,
                            panelImg: PP.createImage(scene.currentApartmentsImgModel),
                            ropePosition: -8,
                            model: scene.currentApartmentsImgModel
                        }),2);

                        scene.apartmentsBlocks[scene.apartmentsBlocks.length] = scene.placingBlock;

                        this.processScript();
                    },
                    this.addProcessScriptDelay(20),
                    function() {
                        scene.crane.removePayload();
                        this.processScript();
                    },
                    function() {
                        scene.crane.moveHook(15, 9, () => this.processScript(), (origin, position) => {
                            let delta = -8 + (position.y - origin.y);
                            scene.placingBlock.setRopePosition(fast.r(delta));
                        });
                    },
                    this.addProcessScriptDelay(20),
                    function() {
                        scene.crane.moveHook(15+ scene.currentFloor*2,(scene.crane.caret.position.y+10) - scene.crane.hook.position.y, () => this.processScript())
                    },
                    function() {
                        scene.currentBlock++;
                        if(scene.currentBlock == scene.maxBlocks){
                            scene.currentBlock = 0;
                            scene.currentFloor++;

                            if(scene.currentFloor == scene.maxFloors){
                                this.processScript();
                            }
                            else {
                                scene.crane.addVSegment(() => this.workSequence());
                            }
                        }
                        else {
                            this.workSequence();
                        }
                    },
                    this.addProcessScriptDelay(200),
                    function() {
                        let currentBlock = 1;
                        this.blockLightTimer = this.regTimerDefault(50, () => {
                            let b = scene.apartmentsBlocks[currentBlock];

                            let model = b.model;
                            model.main.layers[1].fillColor = '#FEEF92';
                            model.main.layers[2].visible = false;
                            model.main.layers[3].visible = false;
                            b.panel.img = PP.createImage(model);

                            currentBlock++;

                            if(currentBlock == scene.apartmentsBlocks.length){
                                this.unregTimer(this.blockLightTimer);
                                this.blockLightTimer = undefined;
                                this.processScript();
                            }
                        })
                    },
                    this.addProcessScriptDelay(400),
                    function() {
                        this.xChange = easing.createProps(20, 0, -250, 'quad', 'in');
                        scene.apartmentsBlocks.forEach(b => { b.originX = b.position.x });
                        this.moveOutTimer = this.regTimerDefault(30, () => {
                            let xDelta = easing.process(this.xChange);
                            scene.apartmentsBlocks.forEach(b => { 
                                b.position.x = b.originX + xDelta;
                                b.needRecalcRenderProperties = true;
                            });

                            this.xChange.time++;

                            if(this.xChange.time > this.xChange.duration){
                                this.unregTimer(this.moveOutTimer);
                                this.moveOutTimer = undefined;
                                this.processScript();
                            }
                        });
                    },
                    ...new Array(scene.maxFloors-1).fill().map((_,i) => (function(){
                        scene.crane.removeVSegment(() => this.processScript());
                    })),
                    this.addProcessScriptDelay(20),
                    function() {
                        scene.crane.moveHook(15,scene.crane.hook.initialY - scene.crane.hook.position.y, () => this.processScript())
                    },
                    function() {
                        scene.crane.moveCaret(25,scene.crane.caret.initialX - scene.crane.caret.position.x, () => this.processScript())
                    },
                ]

                this.processScript();
            }
        }))
    }
}

class PanelBlock extends GO {
    constructor(options = {}) {
        options = assignDeep({}, {
            renderValuesRound: true,
            size: new V2(1,1),
            ropePosition: 0
        }, options)

        super(options);
    }

    init() {
        this.ropeSize =new V2(this.size.x, 8);
        this.panel = this.addChild(new GO({
            position: new V2(),
            size: this.size,
            img: this.panelImg
        }))

        this.rope = this.addChild(new GO({
            position: new V2(0, -this.size.y/2 - this.ropeSize.y/2),
            size: this.ropeSize,
        }))

        if(this.ropePosition < 0){
            this.renderRope()
        }
    }

    setRopePosition(ropePosition) {
        this.ropePosition = ropePosition;
        this.renderRope();
    }

    renderRope(){
        this.rope.img = createCanvas(this.ropeSize, (ctx, size, hlp) => {
            if(this.ropePosition > 0)
                return;
                
            hlp.setFillColor('#343434');
            let pp = new PerfectPixel({context: ctx});
            let cX = fast.r(size.x/2);
            let y = size.y + this.ropePosition;
            pp.line(cX, y, 1,size.y-1);
            pp.line(cX, y, size.x-2,size.y-1)
        })
    }
}

class Truck extends GO {
    constructor(options = {}) {
        options = assignDeep({}, {
            renderValuesRound: true,
            size: new V2(1,1),
            bodyImg: PP.createImage(truck.body),
            wheelImg: truck.wheel.map(w => PP.createImage(w)),
            currentWheelRotationDelay: 0
        }, options)

        super(options);
    }

    init() {
        this.timer = this.regTimerDefault(30, () => {
            if(this.xChange) {
                this.position.x = easing.process(this.xChange);
                this.needRecalcRenderProperties = true;
                this.xChange.time++;

                if(this.xChange.time > this.xChange.duration){
                    this.xChange.onComplete();
                    this.xChange = undefined;
                }
            }

            if(this.durationChange) {
                this.currentWheelRotationDelay = easing.process(this.durationChange);

                this.wheels.forEach(w => {
                    w.updateTimer(this.currentWheelRotationDelay);
                })

                this.durationChange.time++;
                if(this.durationChange.time > this.durationChange.duration){
                    this.durationChange = undefined;
                }
            }
        });

        this.body = this.addChild(new GO({
            renderValuesRound: true,
            position: new V2(),
            size: this.size.clone(),
            img: this.bodyImg
        }));

        this.wheels = [new V2(-21.5, 9), new V2(11, 9), new V2(20,9)].map(p => this.addChild(new GO({
            renderValuesRound: false,
            position: p,
            size: this.truckWheelSize,
            wheelImg: this.wheelImg,
            init() {
                this.wheelImgIndex = 0;
                this.img = this.wheelImg[this.wheelImgIndex++];
            },
            updateTimer(delay) {
                this.currentImgChangeDelayOrigin = delay;

                if(!this.timer) {
                    this.currentImgChangeDelay = delay;
                    this.timer = this.regTimerDefault(30, () => {
                        this.currentImgChangeDelay-=30;
                        if(this.currentImgChangeDelay < 0){
                            this.currentImgChangeDelay = this.currentImgChangeDelayOrigin;
                            this.img = this.wheelImg[this.wheelImgIndex++];
                            if(this.wheelImgIndex == this.wheelImg.length){
                                this.wheelImgIndex = 0;
                            }
                        }

                        
                    })
                }  
            },
            stopAnimation() {
                this.unregTimer(this.timer);
                this.timer = undefined;
            }
        })))
    }
    cargo(go){
        go.position = new V2(22,3).add(go.size.mul(-0.5))
        this.payload = this.addChild(go);
    }
    removeCargo() {
        this.removeChild(this.payload);
    }
    getCargo() {
        return this.payload;
    }
    moveIn(callback) {
        this.script.items = [
            function() {
                this.startWheelBreakAnimation(40);
                this.xChange = easing.createProps(50, this.position.x, this.parentScene.sceneCenter.x, 'quad', 'out');
                this.xChange.onComplete = () => this.processScript();
            },
            function() {
                this.stopWheelAnimation();
                callback();
                this.processScript();
            },
        ]

        this.processScript();
    }

    moveOut(callback = () => {}) {
        this.script.items = [
            function() {
                this.startWheelAccelerateAnimation(40);
                this.xChange = easing.createProps(50, this.position.x, -this.size.x/2, 'quad', 'in');
                this.xChange.onComplete = () => this.processScript();
            },
            function() {
                this.stopWheelAnimation();
                callback();
                this.processScript();
            }
        ]

        this.processScript();
    }

    startWheelAccelerateAnimation(duration) {
        this.durationChange = easing.createProps(duration, 150, 50, 'quad', 'in');
    }

    startWheelBreakAnimation(duration) {
        this.durationChange = easing.createProps(duration, 50, 150, 'quad', 'out');
    }

    stopWheelAnimation() {
        this.wheels.forEach(w => {
            w.stopAnimation();
        })
    }
}

class Crane extends GO {
    constructor(options = {}) {
        options = assignDeep({}, {
            renderValuesRound: true,
            size: new V2(1,1),
            componentSizes: {
                vSegmentSize: new V2(10,20),
                hSegmentSize: new V2(20, 8),
                hSegmentEnd: new V2(8,8),
                baseSize: new V2(30, 15),
                cabinSize: new V2(10,12),
                weightSize: new V2(20,10),
                caretSize: new V2(10,5),
                hookSize: new V2(10,10)
            },
            images: Object.keys(craneModels).reduce((r,c) => { r[c] = PP.createImage(craneModels[c]); return r }, {}),
            segmentsCount: {
                h: 4,
                v: 3
            }
        }, options)

        super(options);
    }

    init() {
        this.base = this.addChild(new Go({
            renderValuesRound: true,
            size: this.componentSizes.baseSize,
            position: new V2(),
            img: this.images.base
        }));

        this.vStart = new V2().add(new V2(0, -this.componentSizes.baseSize.y/2 - this.componentSizes.vSegmentSize.y/2));
        this.vSegments = [];
        for(let i = 0; i < this.segmentsCount.v; i++){
            if(i > 0)
                this.vStart = this.vStart.add(new V2(0, -this.componentSizes.vSegmentSize.y));

            this.vSegments[i] = this.addChild(new GO({
                renderValuesRound: true,
                position: this.vStart.clone(),
                size: this.componentSizes.vSegmentSize,
                img: this.images.vSegment,
            })) 
        }

        this.ropesSize = new V2(this.componentSizes.hSegmentEnd.x + this.componentSizes.hSegmentSize.x*this.segmentsCount.h, this.componentSizes.vSegmentSize.y - this.componentSizes.hSegmentSize.y);
        this.ropes = this.addChild(new GO({
            renderValuesRound: true,
            position: this.vStart.add(new V2(
                this.componentSizes.vSegmentSize.x/2 - this.ropesSize.x/2, 
                -this.componentSizes.vSegmentSize.y/2 - this.componentSizes.hSegmentEnd.y - this.ropesSize.y/2)),
            size: this.ropesSize,
            img: createCanvas(this.ropesSize, (ctx, size, hlp) => {
                hlp.setFillColor('#030303');
                let pp = new PerfectPixel({context: ctx});
                pp.line(3,size.y-2,size.x-1, 0);
                pp.line(fast.r(size.x*2/3),size.y-2,size.x-1, 0);

                hlp.setFillColor('#E1A32A').rect(0,size.y-1, 3, 1).rect(fast.r(size.x*2/3)-1, size.y-1,3,1);
            }),
        }))

        this.vTopEnd = this.addChild(new GO({
            renderValuesRound: true,
            position: this.vStart.add(new V2(0, -this.componentSizes.vSegmentSize.y)),
            size: this.componentSizes.vSegmentSize,
            img: this.images.vTopEnd,
        }))

        
        this.weight = this.addChild(new GO({
            renderValuesRound: true,
            position: this.vStart.add(new V2(this.componentSizes.vSegmentSize.x/2 + this.componentSizes.weightSize.x/2, -this.componentSizes.vSegmentSize.y/2 - this.componentSizes.hSegmentSize.y/2 + this.componentSizes.weightSize.y/2)),
            size: this.componentSizes.weightSize,
            img: this.images.weight,
        }))

        this.cabinPosition = this.vStart.add(new V2(-this.componentSizes.vSegmentSize.x/3, -this.componentSizes.vSegmentSize.y/3));

        this.hSegments = [];
        this.hStart = this.vStart.add(new V2(-this.componentSizes.hSegmentEnd.y/2, -this.componentSizes.vSegmentSize.y/2 - this.componentSizes.hSegmentEnd.y/2))
        this.hSegments[0] = this.addChild(new GO({
            renderValuesRound: true,
                position: this.hStart.clone(),
                size: this.componentSizes.hSegmentEnd,
                img: this.images.hRightEnd,
        }))

        this.hStart = this.hStart.add(new V2(-this.componentSizes.hSegmentEnd.x/2 - this.componentSizes.hSegmentSize.x/2, 0));
        for(let i = 0; i < this.segmentsCount.h; i++){
            if(i > 0)
                this.hStart = this.hStart.add(new V2(-this.componentSizes.hSegmentSize.x, 0));

            this.hSegments[i+1] = this.addChild(new GO({
                renderValuesRound: true,
                    position: this.hStart.clone(),
                    size: this.componentSizes.hSegmentSize,
                    img: this.images.hSegment,
            }))
        }

        this.hSegments[this.hSegments.length] = this.addChild(new GO({
            renderValuesRound: true,
            position: this.hStart.add(new V2(-this.componentSizes.hSegmentSize.x/2 - this.componentSizes.hSegmentEnd.x/2)),
            size: this.componentSizes.hSegmentEnd,
            img: this.images.hLeftEnd,
        }))

        this.cabin = this.addChild(new GO({
            position: this.cabinPosition,
            size: this.componentSizes.cabinSize,
            renderValuesRound: true,
            img: this.images.cabin,
        }))

        

        this.caret = this.addChild(new GO({
            position: this.vStart.add(new V2(-this.componentSizes.vSegmentSize.x/2 - this.componentSizes.caretSize.x/2 - 5, -this.componentSizes.vSegmentSize.y/2+1)),
            //.add(new V2(-37, 0)),
            size: this.componentSizes.caretSize,
            renderValuesRound: true,
            img: this.images.caret,
        }));
        
        this.caret.initialX = this.caret.position.x;
        

        this.hook = this.addChild(new GO({
            position: this.caret.position.add(new V2(0, 20)),
            //.add(new V2(0,21)),
            size: this.componentSizes.hookSize,
            renderValuesRound: true,
            img: this.images.hook,
        })); 

        this.hook.initialY = this.hook.position.y;

        this.hookRopes = this.addChild(new GO({
            position: new V2(),
            size: new V2(1,1),
            renderValuesRound: true,
            init() {
                this.getImage();
            },
            getImage() {

                let left = this.parent.hook.position.x >= this.parent.caret.position.x ? this.parent.caret : this.parent.hook;
                let right = this.parent.hook.position.x >= this.parent.caret.position.x ? this.parent.hook : this.parent.caret;

                this.size = new V2(
                    (right.position.x + right.size.x/2) - (left.position.x - left.size.x/2),
                    (this.parent.hook.position.y - this.parent.hook.size.y/2) - (this.parent.caret.position.y + this.parent.caret.size.y/2)
                );

                this.position = //this.parent.caret.position.add(this.parent.caret.position.direction(this.parent.hook.position).mul(this.parent.caret.position.distance(this.parent.hook.position)/2));
                    new V2(
                        (left.position.x - left.size.x/2) + this.size.x/2,
                        (this.parent.caret.position.y + this.parent.caret.size.y/2) + this.size.y/2
                        )

                this.needRecalcRenderProperties = true;
                this.img = createCanvas(this.size, (ctx, size, hlp) => {
                    //hlp.setFillColor('green').rect(0,0,size.x, size.y)
                    let pp = new PerfectPixel({context: ctx});
                    hlp.setFillColor('#030303');
                    if(this.parent.hook.position.x >= this.parent.caret.position.x){
                        // pp.line(1, 0, size.x - this.parent.hook.size.x + 1, size.y-1);
                        // pp.line(this.parent.caret.size.x - 2, 0, size.x - 2, size.y-1)
                        pp.line(1, 0, size.x - 9, size.y-1)
                        pp.line(8, 0, size.x - 2, size.y-1)
                    }
                    else {
                        // pp.line(size.x - this.parent.caret.size.x + 1, 0, 1, size.y-1);
                        // pp.line(size.x - 1, 0, this.parent.hook.size.x-1, size.y-1)
                        pp.line(size.x-9, 0, 1, size.y-1);
                        pp.line(size.x - 2, 0, 8, size.y-1);
                        
                    }
                })
            }
        }))


        this.timer = this.regTimerDefault(30, () => {
            if(this.hookYChange){
                this.hook.position.y = easing.process(this.hookYChange);
                this.hookYChange.onChange(this.hook.originPosition, this.hook.position);
                this.hook.needRecalcRenderProperties = true;
                this.hookYChange.time++;

                if(this.hookYChange.time > this.hookYChange.duration){
                    this.hookYChange.onComplete();
                    this.hookYChange = undefined;
                }

                this.updateHookRopes = true;
            }

            if(this.caretXChange){
                this.caret.position.x = easing.process(this.caretXChange);
                this.caret.needRecalcRenderProperties = true;
                this.caretXChange.time++;

                if(this.caretXChange.time > this.caretXChange.duration){
                    this.caretXChange = undefined;
                }

                this.updateHookRopes = true;
            }

            if(this.hookXChange){
                this.hook.position.x = easing.process(this.hookXChange);
                this.hook.needRecalcRenderProperties = true;
                this.hookXChange.time++;

                if(this.hookXChange.time > this.hookXChange.duration){
                    if(this.hookXChange.onComplete){
                        this.hook.position.x = this.caret.position.x;
                        this.hookXChange.onComplete();
                    }
                        

                    this.hookXChange = undefined;
                    if(this.hookXChanges.length){
                        this.hookXChange = this.hookXChanges.shift();
                    }
                }

                this.updateHookRopes = true;
            }

            if(this.updateHookRopes) {
                this.hookRopes.getImage();
            }
        })
    }

    moveCaret(duration, xChange, completeCallback = () => {}){
        this.caretXChange = easing.createProps(duration, this.caret.position.x, this.caret.position.x+xChange, 'quad', 'inOut');
        let hookPositionXChange = this.caret.position.x+xChange;
        this.hookXChangeCreateTimer = this.registerTimer(createTimer(50, () => {
            
            let out = xChange/15;
            if(Math.abs(out) > 1){
                hookPositionXChange+=out;
            }
            this.hookXChanges = [
                easing.createProps(duration, this.hook.position.x, hookPositionXChange, 'quad', 'inOut')
            ]
            if(Math.abs(out) > 1){
                this.hookXChanges[this.hookXChanges.length] = easing.createProps(fast.r(duration/3), hookPositionXChange, hookPositionXChange-out, 'quad', 'inOut')
            }

            this.hookXChanges[this.hookXChanges.length-1].onComplete = completeCallback;
            //this.hookXChanges[this.hookXChanges.length-1].targetX = this.caret.position.x+xChange;

            this.hookXChange = this.hookXChanges.shift();//easing.createProps(duration, this.hook.position.x, this.caret.position.x+xChange, 'quad', 'inOut');
            this.unregTimer(this.hookXChangeCreateTimer);
            this.hookXChangeCreateTimer = undefined;
        }, this, false));
    }

    addPayload(go) {
        go.position = new V2(-1, this.hook.size.y/2 + 8 + go.size.y/2 - 2);
        this.hook.payload = this.hook.addChild(go);
    }

    getPayload() {
        return this.hook.payload;
    }
    removePayload() {
        this.hook.removeChild(this.hook.payload);
    }

    moveHook(duration, yChange, completeCallback = () => {}, changeCallback = () => {}){
        this.hook.originPosition = this.hook.position.clone();
        this.hookYChange = easing.createProps(duration, this.hook.position.y, this.hook.position.y+yChange, 'quad', 'inOut');
        this.hookYChange.onComplete = completeCallback;
        this.hookYChange.onChange = changeCallback;
    }

    removeVSegment(callback = () => {}) {
        let toRemove = this.vSegments.shift();
        let shiftedItems = [
            ...this.hSegments, this.cabin, this.weight, this.vTopEnd, ...this.vSegments, this.ropes,
            this.hook, this.caret, this.hookRopes
        ]

        shiftedItems.forEach(x => x.originPosition = x.position.clone());

        this.yChange = easing.createProps(25, 0, this.componentSizes.vSegmentSize.y, 'quad', 'inOut');
        this.riseTimer = this.regTimerDefault(30, () => {
            let yShift = fast.r(easing.process(this.yChange));

            shiftedItems.forEach(x => {
                x.position.y = x.originPosition.y+yShift;
                x.needRecalcRenderProperties = true;
            });
            this.yChange.time++

            if(this.yChange.time > this.yChange.duration){
                this.yChange = undefined;
                this.unregTimer(this.riseTimer);
                this.riseTimer = undefined;
                this.removeChild(toRemove);
                callback();
            }
        })
    }

    addVSegment(callback = () => {}) {
        this.vSegments[this.vSegments.length] = this.addChild(new GO({
            renderValuesRound: true,
            position: this.vSegments[this.vSegments.length-1].position.clone(),
            size: this.componentSizes.vSegmentSize,
            img: this.images.vSegment
        }), false, true);

        let shiftedItems = [
            ...this.hSegments, this.cabin, this.weight, this.vTopEnd, this.vSegments[this.vSegments.length-1], this.ropes,
            this.hook, this.caret,this.hookRopes
        ]

        shiftedItems.forEach(x => x.originPosition = x.position.clone());

        this.yChange = easing.createProps(25, 0, -this.componentSizes.vSegmentSize.y, 'quad', 'inOut');
        this.riseTimer = this.regTimerDefault(30, () => {
            let yShift = fast.r(easing.process(this.yChange));

            shiftedItems.forEach(x => {
                x.position.y = x.originPosition.y+yShift;
                x.needRecalcRenderProperties = true;
            });
            this.yChange.time++

            if(this.yChange.time > this.yChange.duration){
                this.yChange = undefined;
                this.unregTimer(this.riseTimer);
                this.riseTimer = undefined;
                callback();
            }
        })
    }
}