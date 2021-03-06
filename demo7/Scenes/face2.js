class Face2Scene extends Scene {
    constructor(options = {}){
        options.debug = {enabled: true};
        super(options);

        this.bgLayersCount = 5;
        this.bgLayers = [];
        for(let l = 0; l<this.bgLayersCount;l++){
            let opacityBase = 0.1 + 0.8*l/(this.bgLayersCount-1);
            this.bgLayers[l] = [];
            for(let i = 0; i < 3; i++){
                this.bgLayers[l][i] = textureGenerator.textureGenerator({
                    size: this.viewport,
                    backgroundColor: 'rgba(0,0,0,0)',
                    surfaces: [
                        textureGenerator.getSurfaceProperties({
                            colors: ['#E28B00','#034B7B', '#E9F4FA'], opacity: [opacityBase,opacityBase+0.1],   line: { length: [1,1], directionAngle: 90, angleSpread: 0 }, 
                            density: 0.005 - 0.004*l/(this.bgLayersCount-1)
                        }),
                    ]
                })
            }
        }
        
    }

    start() {
        this.faceSize = new V2(186, 176);
        this.multiplier = 2;
        this.faceImg = createCanvas(this.faceSize.mul(this.multiplier), (ctx, size) => {
            //<body>
            draw(ctx, {
                fillStyle: '#CD8F66', points: [
                    //left
                    new V2(73,62), new V2(75,68), new V2(76,71), new V2(76,74), new V2(74,77), new V2(72,78), new V2(63,79), new V2(58,83), new V2(54,87), new V2(53,91), new V2(53,94), new V2(54,98), 
                    new V2(53,102), new V2(49,108), new V2(44,116), new V2(39,124), new V2(36,132), new V2(36,139),new V2(36,141), new V2(37,145), new V2(41,151), new V2(44,153), new V2(46,154), new V2(44,159), new V2(43,166), new V2(43,175),
                    //right
                    new V2(108,175), new V2(111,167), new V2(116,154), new V2(121,142), new V2(127,134),  
                    //arm left-part
                    new V2(129,137), new V2(132,143), new V2(135,150), new V2(138,159), new V2(140,167), new V2(143,175),
                    //arm-rightpart
                    new V2(167,175),new V2(163,159),new V2(157,141),new V2(154,127),new V2(151,115),new V2(146,102),new V2(143,95),new V2(137,88),new V2(132,85),new V2(127,84),new V2(121,82),new V2(103,75),new V2(92,55)
                ].map(p => p.mul(this.multiplier))  
            })

            //<shadows>
                //arm
                draw(ctx, {
                    fillStyle: '#5F3B26', points: [
                        //left
                        new V2(114,79), new V2(102,94), new V2(95,104), new V2(90,110), new V2(85,117),
                        new V2(83,140),new V2(87,139),new V2(91,130),new V2(97,122),new V2(107,112),new V2(115,109),
                        new V2(129,137), new V2(132,143), new V2(135,150), new V2(138,159), new V2(140,167), new V2(143,175),
                        new V2(167,175),new V2(163,159),new V2(157,141),new V2(154,127),new V2(151,115),new V2(146,102),new V2(143,95),new V2(137,88),new V2(132,85),new V2(127,84),new V2(121,82),new V2(103,75),new V2(92,55)
                    ].map(p => p.mul(this.multiplier))  
                })

                //arm-right
                draw(ctx, {
                    fillStyle: '#281913', points: [
                        //left
                        new V2(111,87), new V2(128,90), new V2(134,96), new V2(141,111), new V2(146,130), new V2(151,148), new V2(155,165), new V2(157,175),
                        //right
                        ...[new V2(167,175),new V2(163,159),new V2(157,141),new V2(154,127),new V2(151,115),new V2(146,102),new V2(143,95),new V2(137,88),new V2(132,85),new V2(127,83),new V2(121,81)].map(p => p.add(new V2(0.5,0)))
                    ].map(p => p.mul(this.multiplier))  
                })

                //body-right
                draw(ctx, {
                    fillStyle: '#201511', points: [
                        new V2(109,105), new V2(99.5,115), new V2(90,128), new V2(84,139),  new V2(80,142), new V2(77,156), new V2(80,164), new V2(77,171), new V2(75,175),
                        ...[new V2(108,175), new V2(111,167), new V2(116,154), new V2(121,142), new V2(127,135)].map(p => p.add(new V2(0.5, 0))),  
                        ...[new V2(129,137), new V2(132,143), new V2(135,150)].map(p => p.add(new V2(-.5, 0))), 
                        new V2(138,158), new V2(135,144), new V2(130,124) , new V2(125,110), new V2(115,104)
                         
                    ].map(p => p.mul(this.multiplier))  
                })

                //breast right
                draw(ctx, {
                    fillStyle: '#563A33', points: [
                        new V2(121,124), new V2(116,126), new V2(111,130), new V2(107,136), new V2(102,143), new V2(97,150), new V2(95,154),
                        new V2(99,150), new V2(104,145),  new V2(108,139), new V2(112,132),new V2(116,128)
                        , new V2(121, 125), new V2(124, 128), new V2(124, 128), new V2(129, 137.5), new V2(125, 127)
                    ].map(p => p.mul(this.multiplier))  
                })

                //breast-right-bottom
                draw(ctx, {
                    fillStyle: '#553423', points: [
                        new V2(80,148), new V2(78,152), new V2(77,158),  new V2(80,159), new V2(85,159), new V2(89,158), new V2(84,152)
                    ].map(p => p.mul(this.multiplier))  
                })
                //

                //breast right - light
                draw(ctx, {
                    fillStyle: '#754930', points: [
                        new V2(88,128), new V2(82,138), new V2(80,147), new V2(80,152), new V2(82,156), new V2(86,158), new V2(88,158),
                        new V2(87,153), new V2(86,147), new V2(86,140), new V2(87,133)
                    ].map(p => p.mul(this.multiplier))  
                })

                //breast right - leftpart
                draw(ctx, {
                    fillStyle: '#99694C', points: [
                        //new V2(96,104), new V2(84,110), new V2(77,112), 
                        new V2(77,112), new V2(73,115), new V2(69,121), new V2(67,124), new V2(66,126), 

                        new V2(65,129), new V2(64,132), new V2(63,135), new V2(62,141), new V2(63,145), new V2(65,150), new V2(67,153), new V2(69,155),
                        new V2(76,141), new V2(91,118), new V2(68,128),

                        new V2(67.5,126),new V2(68,124),new V2(70,121),new V2(74,115)
                    ].map(p => p.mul(this.multiplier))  
                })

                //breast right - leftpart - light
                draw(ctx, {
                    fillStyle: '#DB9D74', points: [
                        new V2(69,137), new V2(66,138.5), new V2(64,141), new V2(64.5,146), new V2(68,152),new V2(69.5,144),new V2(70.5,140)
                    ].map(p => p.mul(this.multiplier))  
                })

                //breast left
                

                //breast left - dark
                draw(ctx, {
                    fillStyle: '#99694C', points: [
                        new V2(61,110), new V2(62,117), new V2(63,123), new V2(63,128), new V2(62,132), new V2(61,135), new V2(60,138), new V2(58,142), new V2(56,145), new V2(54,148), new V2(52,150), 
                        new V2(59,130),new V2(59,125),new V2(57,118)//,new V2(54,114)//,new V2(51,110),new V2(53,105),
                    ].map(p => p.mul(this.multiplier))  
                })

                //breast left - light
                draw(ctx, {
                    fillStyle: '#DB9D74', points: [
                        new V2(37,133), new V2(36,138), new V2(37,144), new V2(40.5,149), new V2(44,152),new V2(47.5,143), new V2(47,138), new V2(43,135)
                    ].map(p => p.mul(this.multiplier))  
                })
                
                draw(ctx, {
                    fillStyle: '#B6784F', points: [
                        new V2(36,139),new V2(36,141), new V2(37,145), new V2(41,151), new V2(44,153), new V2(46,154), new V2(50,153), new V2(55,147)
                        , new V2(51,148.5), new V2(48,150), new V2(45,150), new V2(42,148)
                        // new V2(62,92),new V2(66,92),new V2(64,95),new V2(60,101),
                        // new V2(59,106), new V2(63,110), new V2(65,117), new V2(65,123), new V2(64,128), new V2(62.5,132), new V2(61,135), new V2(60,138), new V2(58,142), new V2(56,145), new V2(54,148), new V2(52,150), new V2(49,152),
                        // new V2(43, 153),new V2(43, 151),new V2(44, 153),new V2(47,154),new V2(48,151),new V2(51,145),new V2(53,139),new V2(52,132),new V2(51,127), new V2(48,125), new V2(43,123),new V2(45,115),new V2(48,114),new V2(54,105) 
                    ].map(p => p.mul(this.multiplier))  
                })
            //</shadows>
                
            //<stomath>
            draw(ctx, {
                fillStyle: '#B57F5C', points: [
                    new V2(57,147), new V2(54,153), new V2(48,161), new V2(45,171), 
                    new V2(48,165),new V2(52,161),new V2(56,158), 
                    new V2(58,161), new V2(58,167), new V2(59,172), new V2(60,175),
                    new V2(63,175), new V2(64,171), new V2(65,165), new V2(63,161), new V2(60,155),
                ].map(p => p.mul(this.multiplier))  
            })
            //</stomath>

            //<neck>
            draw(ctx, {
                fillStyle: '#5A3022', points: [
                    new V2(76.5,73),new V2(75,76),new V2(74,80),
                    new V2(74,83), new V2(71,86), new V2(69,89), new V2(74,91), new V2(75,93),
                    new V2(77,94),new V2(81,92),  new V2(78,90), new V2(77,84), 
                ].map(p => p.mul(this.multiplier))  
            })

            draw(ctx, {
                fillStyle: '#5A3022', points: [
                    new V2(89,88),new V2(85,89),new V2(79,92),new V2(84,92),new V2(89,92),new V2(94,91)
                    
                ].map(p => p.mul(this.multiplier))  
            })

            draw(ctx, {
                fillStyle: '#80482B', points: [
                    new V2(95,55), new V2(83,62), new V2(83,64), new V2(88,68), new V2(89,70), new V2(92,79)      
                ].map(p => p.mul(this.multiplier))  
            })
            //</neck>

            //</body>

            //<straps>
            //left
            draw(ctx, {
                fillStyle: '#0F0B0C', points: [//
                    new V2(75,76), new V2(64,87), new V2(57,96), new V2(52.5,102), new V2(49.25,107), new V2(46.5,112), new V2(43.5,117), new V2(39.5,123), new V2(37.5,127), new V2(36,130), new V2(35.25,135), new V2(35.5,139), new V2(35.5,143), new V2(36,152), new V2(36.5,157), new V2(37.5,166), new V2(38,170), new V2(39,175),
                    new V2(39,167),new V2(38,156),new V2(38,144),new V2(38,134),
                    new V2(38,142),new V2(38.5,133), new V2(44,122),new V2(48.5,115),new V2(52,109),new V2(55,104),new V2(61,97),new V2(67,90),new V2(75,82),

                ].map(p => p.mul(this.multiplier))  
            })

            //right
            draw(ctx, {
                fillStyle: '#070707', points: [//
                    new V2(114,79), new V2(102,94), new V2(95,104), new V2(90,110), new V2(85,117), new V2(79,125), new V2(75,133), new V2(72,139), new V2(71,143), new V2(70,147), new V2(69,151), new V2(68,156), new V2(67,160), new V2(66,164), new V2(65,168), new V2(64,172), new V2(64,175),
                    new V2(73,175),new V2(74,170),new V2(75,166),new V2(76,162),new V2(77,158),new V2(78,154),new V2(79,150),new V2(80,145),new V2(83,138),new V2(85,133),new V2(87,130),new V2(91,124),new V2(95,119),new V2(99,114),new V2(104,108),new V2(110,101),new V2(118,90),new V2(125,82),
                ].map(p => p.mul(this.multiplier))  
            })
            //</straps>

            //<hairBack>
            draw(ctx, {
                fillStyle: '#8C5B33', points: [
                    //left
                    new V2(60,0),new V2(53,0), new V2(47,6), new V2(43,12), new V2(42,15), new V2(42,22), new V2(39,32), new V2(37,39), new V2(38,49), new V2(41,57), new V2(48,65), new V2(49,69), new V2(46,73), new V2(49,80), new V2(56,85), new V2(58,93), new V2(54,100),
                    new V2(61,94), new V2(69,90), new V2(73,84), new V2(70,78), new V2(69,73),  new V2(70,70)

                ].map(p => p.mul(this.multiplier))  
            })

            //left-shadow-middle
            draw(ctx, {
                fillStyle: '#4C311C', points: [
                    new V2(52,28), new V2(54,37), new V2(56,50), new V2(55,60), new V2(52,63),
                    new V2(48,68), new V2(47,65), new V2(43,62), new V2(41,57), new V2(43,50), new V2(45,45), new V2(47,36), new V2(49,30), 
                ].map(p => p.mul(this.multiplier))  
            })

            //left-shadow-bottom
            draw(ctx, {
                fillStyle: '#4C311C', points: [
                    new V2(49,80), new V2(56,85), new V2(58,93), new V2(54,100),
                    new V2(61,94), new V2(69,90), new V2(73,84),  new V2(70,78),new V2(69,73),  new V2(70,69),
                    new V2(62,68),new V2(58,74)
                ].map(p => p.mul(this.multiplier))  
            })

            //left-shadow
            draw(ctx, {
                fillStyle: '#684326', points: [
                    new V2(60,0),new V2(53,0), new V2(47,6), new V2(45,10), new V2(43,16), new V2(43,22), new V2(44,26), new V2(45,29), new V2(45,38), new V2(45,45),
                    new V2(47,41), new V2(47,36),  new V2(49,27), new V2(49,26),new V2(50,15), new V2(55,11)
                ].map(p => p.mul(this.multiplier))  
            })
 

            //</hairBack>

            //<face>
            draw(ctx, {
                fillStyle: '#D89771', points: [
                    new V2(68,1), new V2(61,3), new V2(55,7), new V2(52,11), new V2(50,15), new V2(49,24), new V2(48,32), new V2(51,34), new V2(52,45), new V2(54,51), new V2(57,57), new V2(58,59), new V2(59,61), new V2(60.5,63), new V2(61,65), new V2(63,67.5), new V2(65,68.5),
                    new V2(68,69), new V2(76,67), new V2(82,64), new V2(89,58), new V2(95,56)
                ].map(p => p.mul(this.multiplier))  
            })

            //face-left-shadow
            draw(ctx, {
                fillStyle: '#AF6E4B', points: [
                    ...[new V2(55,7),new V2(52,11), new V2(50,15), new V2(49,24), new V2(48,32), new V2(51,34), new V2(52,45), new V2(54,51)].map(p => p.add(new V2(-0.5,0))),
                    new V2(55,46),new V2(56,39),new V2(56,35),new V2(51,30),new V2(52,24),new V2(53,17),new V2(62,9)
                ].map(p => p.mul(this.multiplier))  
            })

            //face-right-shadow
            draw(ctx, {
                fillStyle: '#77452E', points: [
                    new V2(62,10), new V2(63,19), new V2(62,24),  new V2(63,29),new V2(67,27), new V2(78,27),
                ].map(p => p.mul(this.multiplier))  
            })

            //face-right-bottom-shadow
            draw(ctx, {
                fillStyle: '#84503A', points: [
                    new V2(79,43), new V2(75,49), new V2(71,53), new V2(72,58), new V2(72,61), new V2(69,65), new V2(70,68.5),
                    new V2(74,67.5), new V2(78,66),new V2(82,64), new V2(86,62), new V2(89,60), new V2(93,54)
                ].map(p => p.mul(this.multiplier))  
            })

            //face-right-bottom-stroke
            draw(ctx, {
                strokeStyle: '#23130F', closePath: false, points: [ 
                    new V2(82,64), new V2(86,62), new V2(89,60), new V2(93,54)
                ].map(p => p.mul(this.multiplier))  
            })//

            //<left eye>
            draw(ctx, {
                fillStyle: '#876D5C', strokeStyle: '#2F201B', points: [
                    new V2(50.5,33), new V2(53,32.5), new V2(56,35), new V2(56,35.5), new V2(55,35), new V2(51.5,35.5)
                ].map(p => p.add(new V2(0,0.5)).mul(this.multiplier))  
            })

            // eyebrow
            draw(ctx, {
                strokeStyle: '#392116', points: [
                    new V2(47.5,30.5), new V2(50,30.5), new V2(53,31.5)
                ].map(p => p.add(new V2(0,0.5)).mul(this.multiplier))  
            })

            //upper-lashe
            draw(ctx, {
                strokeStyle: '#09090B', closePath: false, lineWidth: 2, points: [
                    new V2(49.5,34), new V2(51,33.5), new V2(53,34)
                ].map(p => p.mul(this.multiplier))  
            })

            //apple
            draw(ctx, {
                fillStyle: '#070602', points: [
                    new V2(51.5,33), new V2(54,33.5),new V2(54.5,35),new V2(53,36),new V2(52,34.5)
                ].map(p => p.mul(this.multiplier))  
            })
            //blik
            // draw(ctx, {
            //     fillStyle: 'white', points: [//'#444645'
            //         new V2(53,34), new V2(53.5,34),new V2(53.5,35)
            //     ].map(p => p.mul(this.multiplier))  
            // })

            //lower-stroke
            draw(ctx, {
                strokeStyle: '#895640', closePath:false, points: [
                    new V2(51,37.5),new V2(53,38), new V2(53,38)
                ].map(p => p.mul(this.multiplier))  
            })
            //</left eye>

            //<right eye>
            draw(ctx, {
                fillStyle: '#A88C80', strokeStyle: '#2F201B', points: [
                    new V2(64.5,35),new V2(67,31.75),new V2(75,32.5),
                    new V2(75,34),new V2(69,35.5),new V2(67,35.5)
                    
                ].map(p => p.mul(this.multiplier))  
            })

            // eyebrow
            draw(ctx, {
                strokeStyle: '#392116', lineWidth:3, closePath: false, points: [
                    new V2(60,31), new V2(63,29.5), new V2(67,27.5)
                ].map(p => p.mul(this.multiplier))  
            })
            draw(ctx, {
                strokeStyle: '#392116', lineWidth:2, closePath: false, points: [
                    new V2(63,29.5), new V2(67,27.5), new V2(73,27.5)
                ].map(p => p.mul(this.multiplier))  
            })

            //upper-lashe
            draw(ctx, {
                strokeStyle: '#09090B', closePath: false, lineWidth: 2, points: [
                    new V2(65.25,34),new V2(67,32),new V2(75,33),
                ].map(p => p.mul(this.multiplier))  
            })

            //apple
            draw(ctx, {
                fillStyle: '#070602', points: [
                    new V2(67,32.55),new V2(69,31.55),new V2(71,32.5),new V2(71,34.5),new V2(69,35.5),new V2(67,34.5)
                ].map(p => p.mul(this.multiplier))  
            })

            //blik
            // draw(ctx, {
            //     fillStyle: 'white', points: [//'#444645'
            //     new V2(67.75,32.55),new V2(67.75,34),new V2(69,34.5),
            //     ].map(p => p.mul(this.multiplier))  
            // })

            //lower-stroke
            draw(ctx, {
                strokeStyle: '#895640', closePath:false, points: [
                    new V2(68,37),new V2(71,37.5), new V2(75,36.5)
                ].map(p => p.mul(this.multiplier))  
            })
            //</right eye>

            //nose-up-stroke
            draw(ctx, {
                strokeStyle: '#895640', closePath:false, points: [
                    new V2(62,32),new V2(63,35),new V2(65,37),
                ].map(p => p.add(new V2(0,0.5)).mul(this.multiplier))  
            })


            //nose-right-shadow
            // draw(ctx, {
            //     fillStyle: '#A86950'/*'#895640'*/,  points: [
            //         // new V2(60,50),new V2(62,51),new V2(64,51.5),
            //         // new V2(66,49), new V2(64,46),new V2(61,45),
            //         new V2(62,32),new V2(63,35),new V2(65,37), new V2(63,41),new V2(63.5,44), new V2(64,46), new V2(66,49),new V2(64,51.5), new V2(62,51),new V2(57,51),new V2(56,49)
            //         ,new V2(58,43),new V2(58,37),new V2(57,34)
            //     ].map(p => p.add(new V2(0,0.5)).mul(this.multiplier))  
            // })

            draw(ctx, {
                    fillStyle: '#A86950'/*'#895640'*/,  points: [
                        new V2(62,32),new V2(63,35),new V2(65,37), new V2(61,39), new V2(61,37)
                    ].map(p => p.add(new V2(0,0.5)).mul(this.multiplier))  
                })

            //nose-right-stroke
            draw(ctx, {
                strokeStyle: '#895640', closePath:false, points: [
                    new V2(56,34),new V2(56,38),new V2(55,43),new V2(54,47),new V2(53.5,50.5),new V2(58,52),new V2(62,51),new V2(64,51.5),
                    new V2(66,49), new V2(64,46)
                ].map(p => p.add(new V2(0,0.5)).mul(this.multiplier))  
            })

            

            //nosetrill
            draw(ctx, {
                fillStyle: 'black',  points: [
                    new V2(58,52.5),new V2(61,52),new V2(59,51.5)
                ].map(p => p.mul(this.multiplier))  
            })

            // nose-blink
            draw(ctx, {
                fillStyle: '#EAC0A8', points: [//'#444645'
                    new V2(54.5,49.5), new V2(54.5,51),new V2(56,51)
                ].map(p => p.mul(this.multiplier))  
            })
            
            //lips
            draw(ctx, {
                fillStyle: '#A4352F', points: [
                    new V2(58,57),new V2(58.5,59), new V2(59,61), new V2(60,62), new V2(63,62),new V2(65,61),new V2(69,58),new V2(66,58),new V2(62,57)
                ].map(p => p.add(new V2(-.5,0)).mul(this.multiplier))  
            })
            //lips-lower-stroke
            draw(ctx, {
                strokeStyle: '#7A2723', closePath: false, lineWidth:0.5, points: [
                    new V2(59,61), new V2(60,62), new V2(63,62),new V2(65,61),new V2(69,58.5)
                ].map(p => p.add(new V2(-.5,0)).mul(this.multiplier))  
            })

            //lips-line
            draw(ctx, {
                strokeStyle: '#45140F', lineWidth: 0.25, closePath: false, points: [
                    //new V2(58,58.5), new V2(59,59.5), new V2(63,59.5)//,new V2(69,58.5)
                    new V2(58,58),new V2(60,59), new V2(63,59),new V2(69,58.5)
                ].map(p => p.add(new V2(-.5,0)).mul(this.multiplier))  
            })

            //lips-upper stroke
            draw(ctx, {
                strokeStyle: '#895640', closePath:false, points: [
                    new V2(58.5,53),new V2(58.5,55),new V2(58,57)
                ].map(p => p.mul(this.multiplier))  
            })

            //</face>

            //<hairFront>
            draw(ctx, {
                fillStyle: '#1E1813', points: [
                    new V2(55,0), new V2(52,5), new V2(53,8), new V2(59,9), new V2(64,12), new V2(67,18), new V2(69,25), new V2(71,32), new V2(75,42), new V2(81,48), new V2(88,52), new V2(91,55), new V2(91,64), new V2(90,69), new V2(90,74), new V2(89,82), new V2(90,90), new V2(96,98), new V2(102,103),
                    new V2(103,97),new V2(107,93),new V2(113,91),new V2(118,89),new V2(122,83),new V2(123,79),new V2(121,73),new V2(120,65),new V2(117,59),new V2(115,53),new V2(118,46),new V2(117,33),new V2(115,21),new V2(111,11),new V2(107,4),new V2(104,0)
                ].map(p => p.mul(this.multiplier))  
            })

            //left-light
            draw(ctx, {
                fillStyle: '#9B6642', points: [
                    ...[new V2(59,9), new V2(64,12), new V2(67,18), new V2(69,25), new V2(71,32), new V2(75,42), new V2(81,48), new V2(88,52), new V2(91,55), new V2(98,58)].map(p => p.add(new V2(-0.5,0))),
                    new V2(91,46), new V2(83,38), new V2(76,32), new V2(72,23),new V2(69,16),new V2(64,9)
                ].map(p => p.mul(this.multiplier))  
            })

            //right-light
            draw(ctx, {
                fillStyle: '#382C23', points: [
                    new V2(102,3), new V2(104,13), new V2(104,24), new V2(107,34), new V2(112,42), new V2(110,53), new V2(114,64),
                    new V2(116,49), new V2(114,27), new V2(107,9),  
                ].map(p => p.mul(this.multiplier))  
            })

            //bottom-light
            draw(ctx, {
                fillStyle: '#9B6642', points: [
                    new V2(95,64), new V2(92,69), new V2(90,74), new V2(89,82), new V2(90,90), new V2(96,98), new V2(102,103),
                    new V2(103,97),new V2(100,87),new V2(99,78),new V2(108,81),new V2(104,69),
                ].map(p => p.mul(this.multiplier))  
            })

            //</hairFront>
            //
            
        });

        let faceSize = this.faceSize.mul(1.70);
        let borderSizeY = (this.viewport.y - faceSize.y)/2;
        this.person = this.addGo(new GO({
            position: this.sceneCenter,
            size: faceSize,
            img: this.faceImg,
            isVisible: true,
            blinkingCounter: 0,
            init() {
                this.leftEyeShine = this.addChild(new GO({
                    position: new V2(-68,-90),
                    size: new V2(12,10),
                    img:createCanvas(new V2(12,12), (ctx, size) => { 
                        draw(ctx, {
                            fillStyle: 'white', points: [new V2(5,4), new V2(6.5,4),new V2(5.5,5)]
                        })
                    }),
                    init() {
                        this.originPosition = this.position.clone();
                    }
                }));
        
                this.rightEyeShine = this.addChild(new GO({
                    position: new V2(-43,-93),
                    size: new V2(12,10),
                    img:createCanvas(new V2(12,12), (ctx, size) => { 
                        draw(ctx, {
                            fillStyle: 'white', points: [new V2(6,4),new V2(7,9),new V2(8,7.5)] 
                        })
                    }),
                    init() {
                        this.originPosition = this.position.clone();
                    }
                }));

                this.leftEyeClosed = this.addChild(new GO({
                    position: new V2(-68,-90),
                    size: new V2(12,10),
                    isVisible: false,
                    images: [createCanvas(new V2(12,12), (ctx, size) => { 
                        draw(ctx, {
                            fillStyle: '#B78061',   points:  
                                [new V2(0, 2.5), new V2(6, 1.5), new V2(12, 6), 
                                    new V2(5, 4.5), new V2(3.5, 4.5)]
                        })
        
                        draw(ctx, {
                            strokeStyle: '#2F201B',   points:  //
                                [new V2(12, 6), new V2(5, 4.5), new V2(3.5, 4.5)]
                        })
                     }),
                    createCanvas(new V2(12,12), (ctx, size) => { 
                        draw(ctx, {
                            fillStyle: '#B78061',   points:  
                                [new V2(0, 2.5), new V2(6, 1.5), new V2(12, 7), 
                                    new V2(5, 9), new V2(3.5, 8)]
                        })
        
                        draw(ctx, {
                            strokeStyle: '#2F201B',   points:  //
                                [new V2(12, 7), new V2(5, 9), new V2(3.5, 8)]
                        })
                     })]
                }))
        
                this.rightEyeClosed = this.addChild(new GO({
                    position: new V2(-43,-93),
                    size: new V2(12,10),
                    isVisible: true,
                    images: [createCanvas(new V2(12,12), (ctx, size) => { 
        
                        draw(ctx, {
                            fillStyle: '#B78061',   points:  //strokeStyle: '#2F201B',
                                [
                                    new V2(0, 9), new V2(3.5, 2.5), new V2(11.5, 2), 
                                    new V2(12, 6), new V2(6, 6.5), new V2(2, 6)
                                ]
                        })
        
                        draw(ctx, {
                            strokeStyle: '#2F201B',   points:  //
                                [
                                    new V2(12, 6.5), new V2(6, 6.5), new V2(2, 6), new V2(0, 8),
                                ]    
                        })
                     }),
                    createCanvas(new V2(12,12), (ctx, size) => { 
                        //ctx.fillStyle = 'rgba(255,255,255, 0.5)'; ctx.fillRect(0,0,size.x,size.y);
                        draw(ctx, {
                            fillStyle: '#B78061',   points:  //strokeStyle: '#2F201B',
                                [
                                    new V2(0, 9), new V2(3.5, 2.5), new V2(11.5, 2), 
                                    new V2(12, 10), new V2(6, 10.5), new V2(2, 10)
                                ]
                        })
        
                        draw(ctx, {
                            strokeStyle: '#2F201B',   points:  //
                                [
                                    new V2(12, 10), new V2(6, 10.5), new V2(2, 10), new V2(0, 9),
                                ]    
                        })
                     })]
                }))

                this.shineTiltTimer = createTimer(150, () => {
                    let d = getRandom(-0.25, 0.25);
                    this.rightEyeShine.position.x = this.rightEyeShine.originPosition.x + d;
                    this.leftEyeShine.position.x = this.leftEyeShine.originPosition.x + d;
                    this.rightEyeShine.needRecalcRenderProperties = true;
                    this.leftEyeShine.needRecalcRenderProperties = true;
                }, this, true)

                this.blinkingInitTimer = createTimer(6000, () => {
                    this.blinkingTimer = createTimer(100, () => {
                        this.leftEyeClosed.isVisible = true;
                        this.rightEyeClosed.isVisible = true;
                        if(this.blinkingCounter == 0 || this.blinkingCounter == 2){
                            this.leftEyeClosed.img = this.leftEyeClosed.images[0];
                            this.rightEyeClosed.img = this.rightEyeClosed.images[0];
                        }
                        else if(this.blinkingCounter == 1){
                            this.leftEyeClosed.img = this.leftEyeClosed.images[1];
                            this.rightEyeClosed.img = this.rightEyeClosed.images[1];
                        }
                        else if(this.blinkingCounter == 3){
                            this.blinkingCounter = 0
                            this.blinkingTimer = undefined;
                            this.leftEyeClosed.isVisible = false;
                            this.rightEyeClosed.isVisible = false;
                            this.leftEyeClosed.img = undefined;
                            this.rightEyeClosed.img = undefined;
                        }

                        this.blinkingCounter++;
                            
                    }, this, true);
                    
                }, this, false);
            },
            internalUpdate(now){
                if(this.blinkingInitTimer)
                    doWorkByTimer(this.blinkingInitTimer, now);
                
                if(this.blinkingTimer)
                    doWorkByTimer(this.blinkingTimer, now);

                if(this.shineTiltTimer)
                    doWorkByTimer(this.shineTiltTimer, now);
            }
        }),10);


        this.cockpit = this.addGo(new GO({
            position: this.sceneCenter,
            size: this.viewport,
            img: createCanvas(this.viewport, (ctx, size) => {
                
                draw(ctx, { fillStyle: 'gray', points: [new V2(), new V2(size.x, 0), new V2(size.x, 30), new V2(0, 50)]})
                //draw(ctx, { fillStyle: 'darkgray', points: [new V2(0, 40), new V2(size.x, 20), new V2(size.x, 30), new V2(0, 50)]})
                draw(ctx, { fillStyle: 'gray', points: [new V2(0, 250),new V2(size.x, 200),new V2(size.x, size.y),new V2(0, size.y),]})
                

                ctx.drawImage(createCanvas(this.viewport, (ctx, size) => {
                    draw(ctx, { fillStyle: '#727272', points: [new V2(0, 290),new V2(size.x, 220),new V2(size.x, size.y),new V2(0, size.y)]})
                    // ctx.strokeStyle = '#3D3D3D';
                    // ctx.beginPath();
                    // ctx.lineWidth = 2;
                    // ctx.moveTo(0, 290);ctx.lineTo(size.x, 220);
                    // ctx.stroke();

                    ctx.clearRect(100, 0, 10, size.y);
                    ctx.clearRect(300, 0, 10, size.y);
                    ctx.clearRect(450, 0, 8, size.y);
                }), 0, 0, size.x, size.y);

                draw(ctx, { fillStyle: 'lightgray', points: [new V2(0, 250),new V2(size.x, 200),new V2(size.x, 210),new V2(0, 270),]})
            })
        }), 9);

        this.infoScreenSize = new V2(80, 100);

        this.infoScreen = this.addGo(new GO({
            levitation: {
                time: 0, 
                duration: 40, 
                startValue: 0, 
                change: 5, 
                min: 0,
                max: 5,
                direction: 1,
                type: 'quad',
                method: 'inOut',
            },
            position: new V2(this.viewport.x/5, this.viewport.y/4),
            size: this.infoScreenSize,
            textLines: [],
            renderValuesRound: true,
            img: createCanvas(this.infoScreenSize.mul(2),  (ctx, size) => {
                // ctx.fillStyle = 'rgba(0,255,0, 0.5)';
                // ctx.fillRect(0,0,size.x, size.y);
                draw(ctx, {
                    fillStyle: 'rgba(0,255,0, 0.5)', points: [new V2(0,0), new V2(size.x*9/10, size.y*1/10), new V2(size.x, size.y), new V2(size.x*1/10, size.y*9/10)]
                })

                ctx.lineWidth = 3;
                ctx.strokeStyle = 'rgba(0,50,0, 0.75)';
                ctx.beginPath();ctx.moveTo(0,1); ctx.lineTo(size.x*9/10, size.y*1/10);ctx.stroke();
                ctx.beginPath();ctx.moveTo(size.x, size.y-1); ctx.lineTo(size.x*1/10, size.y*9/10);ctx.stroke();
            }),
            init() {
                this.originalY = this.position.y;
                let scene = this.parentScene;
                this.textChangeTimer = createTimer(5000, () => {
                    for(let i = 0; i < this.textLines.length; i++){
                        this.textLines[i].addEffect(new FadeOutEffect({effectTime: 150, startDelay: 25*i, removeEffectOnComplete: true, updateDelay: 40, initOnAdd: true,
                            completeCallback: function() {
                                this.parent.isVisible = false;
                                this.parent.img = scene.textLineImgGenerator();
                                this.parent.addEffect(new FadeInEffect({beforeStartCallback: function(){ this.parent.isVisible = true; },
                                    effectTime: 250, startDelay: 50*i, removeEffectOnComplete: true, updateDelay: 40, initOnAdd: true}))
                            }}))
                    }
                }, this, false);

                this.levitationTimer = createTimer(50, () => {
                    let l = this.levitation;

                    if(l.time > l.duration){
                        l.direction*=-1;
                        l.time = 0;

                        if(l.direction < 0){
                            l.startValue = l.max;
                            l.change = -l.max;
                        }
                        else if(l.direction > 0){
                            l.startValue = l.min;
                            l.change = l.max;
                        }
                        
                    }

                    let delta = easing.process(l);
                    this.position.y = this.originalY + delta;

                    this.needRecalcRenderProperties = true;
                    l.time++;
                }, this, true);
            },
            internalUpdate(now) {
                if(this.textChangeTimer)
                    doWorkByTimer(this.textChangeTimer, now);

                if(this.levitationTimer)
                    doWorkByTimer(this.levitationTimer, now);
            }
        }),20)

        this.infoScreenLineSize = new V2(this.infoScreenSize.x, this.infoScreenSize.y/10)

        for(let i = 0; i < 20; i++){
            this.infoScreen.textLines.push(this.infoScreen.addChild(new GO({
                position: new V2(-this.infoScreenLineSize.x*0.05 + this.infoScreenLineSize.x*0.0045*i, -this.infoScreenSize.y/2 + this.infoScreenSize.y/10 + this.infoScreenSize.y*i/24),
                size: new V2(this.infoScreenLineSize.x*0.8, this.infoScreenLineSize.y),
                img: this.textLineImgGenerator(),
                //renderValuesRound: true,
            })));
        }
        
        for(let l = 0; l < this.bgLayersCount; l++){
            for(let i = 0; i < 3; i++){
                this.addGo(new MovingGO({
                    position: new V2(this.viewport.x/2  -  this.viewport.x*i + 5*i, this.viewport.y/2),
                    size: this.viewport,
                    img: this.bgLayers[l][i],//this.bgImgs[i],
                    setDestinationOnInit: true,
                    renderValuesRound: true,
                    speed: 0.01 + 0.09*l/(this.bgLayersCount-1),//0.01 + 0.035*l,//0.1,
                    destination: new V2(this.viewport.x*3/2, this.viewport.y/2),
                    destinationCompleteCheck() {
                        let p = this.parentScene;
                        if(this.position.x >= p.viewport.x*3/2){
                            this.position.x = p.sceneCenter.x - p.viewport.x*(2) + 5*(3)
                        }
                    }
                }),l)
            }
        }
        
    }

    textLineImgGenerator(){
       return createCanvas(this.infoScreenLineSize.mul(2), (ctx, size) => {

            ctx.strokeStyle = 'rgba(255,255,255, 0.3)';
            ctx.lineWidth = 3;
            ctx.moveTo(0,1);
            ctx.lineTo(size.x, size.y-1);
            ctx.stroke();

            for(let i = 0; i < getRandomInt(10, 20); i++){
                ctx.clearRect(getRandomInt(1, size.x-2), 0, getRandomBool() ? 2: 4,size.y);
            }
        }); 
    }

    backgroundRender() {
        this.backgroundRenderDefault();
        //SCG.contexts.background.drawImage(this.bgImg, 0,0, SCG.viewport.real.width,SCG.viewport.real.height);
    }
}