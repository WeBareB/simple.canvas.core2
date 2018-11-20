class Scene {
    constructor(props = {}){
        if(!props.name)
            throw "Can't create scene without name";
        
        assignDeep(this,{
            viewport: new V2(500, 300),
            goLayers: [],
            space: new V2(500, 300),
            AI: undefined,
            ui: [],
            collisionDetection: {
                enabled: false,
                level: 1,
                cells: [],
                init(spaceSize){
                    if(this.level == 0){
                        this.enabled = false;
                    }

                    if(!this.enabled)
                        return;

                    this.cellSize = new V2(spaceSize.x/this.level, spaceSize.y/this.level);

                    let rowsCount = parseInt(spaceSize.y/this.cellSize.y);
                    let columnsCount = parseInt(spaceSize.x/this.cellSize.x);
                    this.cells = [];

                    for(let ri = 0; ri < rowsCount; ri++){
                        this.cells[ri] = [];

                        for(let ci = 0; ci < columnsCount; ci++){
                            this.cells[ri][ci] = [];
                        }
                    }
                },
                update(go){
                    if(!go.collisionDetection || go.collisionDetection.enabled)
                        throw `GO id: ${go.id} collision detection is disabled.`;

                    go.collisionDetection.cells = [];
                    let corners = [go.collisionDetection.box.topLeft, go.collisionDetection.box.topRight, go.collisionDetection.box.bottomLeft, go.collisionDetection.box.bottomRight];
                    for(ci = 0; ci < corners.length;ci++){
                        let corner = corners[ci];
                        let index = new V2(Math.floor(corner.x/this.cellSize.x), Math.floor(corner.y/this.cellSize.y));
                        if(go.collisionDetection.cells.filter((c) => c.equals(index)).length == 0){
                            go.collisionDetection.cells.push(index);
                        }
                    }
                }
            },
            events: { // custom event handling
                up: undefined,
                down: undefined,
                move: undefined
            },
            scrollOptions: { // default scroll options
                enabled: false,
                type: SCG.viewport.scrollTypes.drag,
                restrictBySpace: true
            }
        }, props);   
        
        if(!props.space)
            this.space = this.viewport;
    }

    addUIGo(go) {
        if(go === undefined)
            throw 'No GO provided';
        
        if(this.ui.indexOf(go) !== -1)
            return;

        this.ui.push(go);
        go.regEvents();

        go.parentScene = this;

        return go;
    }

    addGo(go, layerIndex = 0, regEvents = false) { // must be called instead of adding go directly
        if(go === undefined)
            throw 'No GO provided';

        if(this.goLayers[layerIndex] === undefined)
            this.goLayers[layerIndex] = [];

        this.goLayers[layerIndex].push(go);
        if(regEvents)
            go.regEvents(layerIndex);

        go.parentScene = this;

        return go;
    }

    innerStart(sceneProperties) {
        SCG.viewport.graphInit();
        SCG.UI.invalidate();
        for(let layerIndex = 0; layerIndex < this.goLayers.length; layerIndex++){ 
            if(this.goLayers[layerIndex] === undefined)
                this.goLayers[layerIndex] = [];

            let goLayer = this.goLayers[layerIndex];

            for(let goi = 0; goi < goLayer.length; goi++){
                goLayer[goi].regEvents(layerIndex);
                // todo reg events for childrens
            }
        }

        // init collision detection matrix
        if(this.collisionDetection && this.collisionDetection.enabled){
            this.collisionDetection.init(this.space);
        }

        this.start(sceneProperties);
    }

    start(sceneProperties) {}

    backgroundRender() {}
    
    innerDispose(){
        SCG.controls.clearEventsHandlers(); //reset event hadlers

        this.dispose();
    }
    
    dispose() {}

    preMainWorkInner(now) {
        SCG.contexts.main.clearRect(0, 0, SCG.viewport.real.width, SCG.viewport.real.height);
        this.preMainWork(now);
    }

    preMainWork(now) {
         
    }

    afterMainWork(now) {}

    cycleWork(now) {
        this.preMainWorkInner(now);

        for(let layerIndex = 0; layerIndex < this.goLayers.length; layerIndex++){
            let goLayer = this.goLayers[layerIndex];
            if(goLayer === undefined)
                continue;

            let i = goLayer.length;
            while (i--) {
                goLayer[i].update(now);
                goLayer[i].render();
        
                if(SCG.frameCounter && goLayer[i].renderPosition!=undefined){
                    SCG.frameCounter.visibleCount++;
                }
        
                if(!goLayer[i].alive){
                    var deleted = goLayer.splice(i,1);
                }
            }
        }
        
        this.afterMainWork(now);
    }
}

SCG.scenes = {
    activeScene: undefined,
    cachedScenes: {},
    selectScene(scene, sceneProperties){
        if(!scene)
            throw 'Cant select undefined scene';
        if(this.activeScene)
            this.activeScene.innerDispose(); //disposing current scene if exists

        if(scene instanceof Scene)
            this.activeScene = scene;
        else if(typeof(scene) === 'string')
            this.activeScene = this.cachedScenes[scene];

        if(!this.activeScene)
            throw 'No scene selected';      

        SCG.viewport.logical = new Box(new V2, this.activeScene.viewport);
        SCG.viewport.originalLogical = new Box(new V2, this.activeScene.viewport);
        SCG.viewport.scrollOptions = this.activeScene.scrollOptions;

        // AI creation
		SCG.AI.initialize();        

        this.activeScene.innerStart(sceneProperties);
    },
    cacheScene(scene) { //to reuse later
        if(!scene)
            throw "Can't register undefined scene";
        if(scene.name === undefined)
            throw "Can't register scene without name";

        this.cachedScenes[scene.name] = scene;
    },
    setNeedRecalcRenderProperties(){
        for(let layerIndex = 0; layerIndex < SCG.scenes.activeScene.goLayers.length; layerIndex++){ 
            if(SCG.scenes.activeScene.goLayers[layerIndex] === undefined)
                continue;
                
            for(let goi = 0; goi <  SCG.scenes.activeScene.goLayers[layerIndex].length; goi++){ // force recalculate go render params
                SCG.scenes.activeScene.goLayers[layerIndex][goi].needRecalcRenderProperties = true;
            }
        }
    }
}