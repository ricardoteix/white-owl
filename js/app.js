var canvas, stage, stageHud, stageGrid, grid;
var drawingCanvas, gridCanvas;
var  gridMc, drawingMc, penMc;
var lapisDesenha = true;
//var oldPt;
//var oldMidPt;
var editor
var from;
var title;
var showGrid = false;
var stroke = 1;
var colors;
var index;
var drawCursor;
var cursor;
var splitCodeConsole;
var splitEditorBoard;
var pen;
var showConsole = true;
var hud;
var idInterval;
var Ler = {
    valor: "",
    entrada: lerPara
}

var desenhoIniciado = false;


$(document).ready(onDocumentReady);

function init() {

    grid = document.getElementById("grid");
    hud = document.getElementById("hud");
    canvas = document.getElementById("canvas");
    index = 0;
    colors = ["#828b20", "#b0ac31", "#cbc53d", "#fad779", "#f9e4ad", "#faf2db", "#563512", "#9b4a0b", "#d36600", "#fe8a00", "#f9a71f"];

    //check to see if we are running in a browser with touch support
    stageHud = new createjs.Stage(hud);
    stageHud.autoClear = true;
    stageHud.enableMouseOver(10);
    stageHud.mouseMoveOutside = true;

    stageGrid = new createjs.Stage(grid);
    stageGrid.autoClear = false;

    stage = new createjs.Stage(canvas);
    stage.autoClear = false;

    createjs.Touch.enable(stage);
    createjs.Ticker.framerate = 60;
    createjs.Ticker.timingMode = createjs.Ticker.RAF;
    createjs.Ticker.addEventListener("tick", onTick);

    gridMc = new createjs.MovieClip();
    drawingMc = new createjs.MovieClip();
    penMc = new createjs.MovieClip();

    gridCanvas = new createjs.Shape();
    drawingCanvas = new createjs.Shape();

    gridMc.addChild(gridCanvas);
    drawingMc.addChild(drawingCanvas);

    stageGrid.addChild(gridCanvas);
    stage.addChild(drawingMc);

    pen = new createjs.MovieClip( {loop:-1, labels: {start: 0 } } );
    var penBmp = new createjs.Bitmap("assets/pen.png");
    penBmp.image.onload = function() {
        penBmp.x = 0;
        penBmp.y = -48;
        stage.update();
    }

    pen.on("mousedown", function (evt) {
        this.offset = {x: this.x - evt.stageX, y: this.y - evt.stageY};
        moveTo(mouseX() - (largura()/2) + this.offset.x, -mouseY() + (altura()/2) - this.offset.y);
    });

    pen.on("mouseup", function (evt) {
    });

    // the pressmove event is dispatched when the mouse moves after a mousedown on the target until the mouse is released.
    pen.on("pressmove", function (evt) {
        this.x = evt.stageX + this.offset.x;
        this.y = evt.stageY + this.offset.y;
        lineTo(mouseX() - (largura()/2) + this.offset.x, -mouseY() + (altura()/2) - this.offset.y);
    });

    stageHud.addChild(penMc);
    penMc.addChild(pen);
    pen.addChild(penBmp);
    stageHud.addChild(pen);
    stage.update();

    //onToggleGrid();
    mostrarGrade(20, "#00A000");
    stageGrid.update();

    setTimeout(updateCanvasSize, 100);
    setTimeout(updateEditorSize, 100);
}

function eixos() {
    mover( -largura() / 2, 0 );
    desenhar ( largura() / 2, 0, "#3e6d51" );
    mover( 0, -altura() / 2 );
    desenhar ( 0, altura() / 2 , "#3e6d51");
}

function onTick(event) {
    stageGrid.update(event);
    stageHud.update(event);
    stage.update(event);

    if (!desenhoIniciado) {
        drawingMc.x = largura() / 2;
        drawingMc.y = altura() / 2;
        penMc.x = largura() / 2;
        penMc.y = altura() / 2;
        drawingMc.scaleY = -1;
        //penMc.scaleY = -1;
        eixos();
        if (largura() > 20) {
            desenhoIniciado = true;
        }
    }
}

function transpile() {
    var code = editor.getValue();
    code = code.split("cmd {").join("function(indice, nVezes) {");
    code = code.split("cmd{").join("function(indice, nVezes) {");

    return code;
}


function movePen(x, y) {

    pen.x = x + ( largura() / 2 );
    pen.y = -y + ( altura() / 2 );

    //var bounds = pen.getBounds();
    //console.log(bounds);
    //pen.cache(pen.x, pen.y, bounds.width, bounds.height);
    //pen.updateCache();

    stage.update();
}

function updateEditorSize() {

    var code = $("#code");
    var w = code.width() - 10;
    var h = code.height();
    editor.setSize(w, h);

}

function largura() {
    var htmlCanvas = document.getElementById('canvas');
    // Obtain a graphics context on the canvas element for drawing.
    var context = htmlCanvas.getContext('2d');
    var ctx = context;
    return ctx.canvas.width;
}

function altura() {
    var htmlCanvas = document.getElementById('canvas');
    // Obtain a graphics context on the canvas element for drawing.
    var context = htmlCanvas.getContext('2d');
    var ctx = context;
    return ctx.canvas.height;
}

function updateCanvasSize() {
    limpar();
    var board = $("#board");

    var htmlCanvasGrid = document.getElementById('grid');
    var contextGrid = htmlCanvasGrid.getContext('2d');
    var ctxGrid = contextGrid;
    ctxGrid.canvas.width  = board.width();
    ctxGrid.canvas.height = board.height() - 20;

    var htmlCanvasHud = document.getElementById('hud');
    var contextHud = htmlCanvasHud.getContext('2d');
    var ctxHud = contextHud;
    ctxHud.canvas.width  = board.width();
    ctxHud.canvas.height = board.height() - 20;

    var htmlCanvas = document.getElementById('canvas');
    // Obtain a graphics context on the canvas element for drawing.
    var context = htmlCanvas.getContext('2d');
    var ctx = context;
    ctx.canvas.width  = board.width();
    ctx.canvas.height = board.height() - 20;


    setTimeout(onDraw, 100);
}
function reloadFile() {
    var reader = new FileReader();
    reader.onload = function(e) {
        var contents = e.target.result;
        onLoadFile(contents);
    };
    reader.readAsText(fileInput);
    onDraw();
}
var fileInput;
function onSelectFile(e) {
    fileInput = e.target.files[0];
    if (!fileInput) {
        return;
    }
    var reader = new FileReader();
    reader.onload = function(e) {
        var contents = e.target.result;
        onLoadFile(contents);
    };
    reader.readAsText(fileInput);

    $('#reload').show();

    /*
    clearInterval(valFile);
    valFile = setInterval(
        function () {
            var reader = new FileReader();
            reader.onload = function(e) {
                var contents = e.target.result;
                onLoadFile(contents);
            };
            reader.readAsText(fileInput);
        },
        100
    );
    */
}

function onSave() {
    var filename = "codigo.js"
    var data = editor.getValue();
    var file = new Blob([data], {type: 'js'});
    if (window.navigator.msSaveOrOpenBlob) // IE10+
        window.navigator.msSaveOrOpenBlob(file, filename);
    else { // Others
        var a = document.createElement("a"),
            url = URL.createObjectURL(file);
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        setTimeout(function() {
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
        }, 0);
    }
}

function onLoadFile(contents) {
    var doc = editor.getDoc();
    doc.setValue(contents);
    onDraw();
}

function onDocumentReady() {
    init();

    $('#reload').hide();

    var file = document.getElementById('file-input');
    file.addEventListener('change', onSelectFile, false);

    shortcut.add("Ctrl+1",
        function() {
            onDraw();
        }
    );

    shortcut.add("Ctrl+L",
        function() {
            alert(1);
        }
    );

    $("#board")[0].addEventListener("mousemove", function() {
        $('#info').text(
            "[ Mouse(x,y): (" + Math.round(stage.mouseX - (largura()/2)) + ", " + -Math.round(stage.mouseY - (altura()/2)) +
            " ), Lápis(x,y): (" + Math.round(pen.x - (largura()/2)) + ", " + -Math.round(pen.y - (altura()/2)) + ") ]"
        );
    });

    splitCodeConsole = Split(['#code', '#console'], {
        sizes: [50, 50],
        minSize: 0,
        cursor: 'row-resize',
        onDragEnd: function() {
            console.log("drag-code-console");
            updateEditorSize();
        }
    });
    splitEditorBoard = Split(['#editor', '#board'], {
        direction: 'vertical',
        sizes: [30, 70],
        minSize: 0,
        cursor: 'row-resize',
        onDragEnd: function() {
            console.log("drag-editor-board");
            updateEditorSize();
            updateCanvasSize();
        }
    });

    //code here...
    var code = $(".codemirror-textarea")[0];
    editor = CodeMirror.fromTextArea(code, {
        lineNumbers : true,
        mode:  "javascript",
        viewportMargin: 20
    });
    editor.on("change", function() {
        localStorage.setItem('codigo', editor.getValue());
    });
    if (!localStorage.getItem('codigo')) {
        localStorage.setItem('codigo', `ajuda();`);
    }
/*
limpar();
// use moveTo(x, y) para definir o inicio do desenho
moveTo(200, 100);
// use lineTo(x, y) para traçar a linhar a partir do moveTo ou do lineTo anterior
lineTo(200, 200);
lineTo(300, 200);
* */
    var doc = editor.getDoc();
    doc.setValue(localStorage.getItem('codigo'));

    /*
// F
moveTo(50, 100);
lineTo(50, 200);
moveTo(50, 100);
lineTo(150, 100);
moveTo(50, 150);
lineTo(150, 150);

// P
moveTo(350, 100);
lineTo(350, 200);

moveTo(350, 100);
lineTo(450, 100);

moveTo(350, 150);
lineTo(450, 150);

lineTo(450, 150);
lineTo(450, 100);
*/
}

function initCursor() {

    if (!stage.contains(cursor)) {
        drawCursor = new createjs.Shape();
        cursor = new createjs.MovieClip();
        cursor.addChild(drawCursor);
        stage.addChild(cursor);
    }
    return;
    var graph = drawCursor.graphics;
    graph.clear();
    graph.setStrokeStyle(stroke, 'round', 'round')
    graph.beginStroke("#FF0000");
    graph.moveTo(0, 5);
    graph.lineTo(10, 5);
    graph.moveTo(5, 0);
    graph.lineTo(5, 10);
    drawCursor.x = -5;
    drawCursor.y = -5;

    stage.update();
}

function handleMouseDown(event) {
    if (!event.primary) { return; }
    if (stage.contains(title)) {
        stage.clear();
        stage.removeChild(title);
    }
    color = colors[(index++) % colors.length];
    stroke = Math.random() * 30 + 10 | 0;
    oldPt = new createjs.Point(stage.mouseX, stage.mouseY);
    oldMidPt = oldPt.clone();
    stage.addEventListener("stagemousemove", handleMouseMove);
}

function handleMouseMove(event) {
    if (!event.primary) { return; }
    var midPt = new createjs.Point(oldPt.x + stage.mouseX >> 1, oldPt.y + stage.mouseY >> 1);
    drawingCanvas.graphics.clear().setStrokeStyle(stroke, 'round', 'round').beginStroke(color).moveTo(midPt.x, midPt.y).curveTo(oldPt.x, oldPt.y, oldMidPt.x, oldMidPt.y);

    oldPt.x = stage.mouseX;
    oldPt.y = stage.mouseY;

    oldMidPt.x = midPt.x;
    oldMidPt.y = midPt.y;

    stage.update();
}

function limpar() {

    stage.clear();
    //drawingCanvas.graphics.clear();
    stage.update();
    //print("clear");
}

function createText(text, x, y, tFont, tColor) {
    if (!tFont) {
        tFont = "36px Arial";
    }
    if (!tColor) {
        tColor = "#777777";
    }

    var text = new createjs.Text(text, tFont, tColor);
    text.x = x;
    text.y = y;
    stage.addChild(text);
    stage.update();

    return text;
}

function moveTo(px, py) {
    from = new createjs.Point(px, py);
    //oldMidPt = oldPt.clone();
    /*cursor.x = px;
    cursor.y = py;*/

    movePen(px, py);

    initCursor();
    //print("moveTo(" + px + "," + py + ")");
}

function lineTo(px, py, color, gCanvas) {
    if (!color) {
        color = "#000000";
    }

    if (!gCanvas) {
        gCanvas = drawingCanvas;
    }
    //var from = new createjs.Point(oldPt.x, oldPt.y );
    gCanvas.graphics.clear()
        .setStrokeStyle(stroke, 'round', 'round')
        .beginStroke(color)
        .moveTo(from.x, from.y)
        .lineTo(px, py);

    from.x = px;
    from.y = py;

    //cursor.x = px;
    //cursor.y = py;

    movePen(px, py);

    initCursor();

    stage.update();

    //print("lineTo(" + px + "," + py + ")");
}

function handleMouseUp(event) {
    if (!event.primary) { return; }
    stage.removeEventListener("stagemousemove", handleMouseMove);
}

function onDraw() {
    if (idInterval) {
        clearInterval(idInterval);
    }

    var position = $("#canvas").offset();
    $("#hud").css({ top: position.top, left: position.left });
    //mostrarGrade(20, "#00A000");
    eval ( transpile() );

}

function onToggleGrid() {
    showGrid = !showGrid;

    var px = pen.x;
    var py = pen.y;

    if (showGrid) {
        mostrarGrade(20, "#00A000");
    } else {
        gridCanvas.graphics.clear();// = false;
    }


    //onDraw();

    pen.x = px;
    pen.y = py;
}

function onToggleConsole() {
    var btn = document.getElementById("toggleConsole");
    var isVisible = btn.textContent == "Ocultar Console";//$(".console").is(":visible");
    if (isVisible) {
        $("#console").css({padding: "0px"})
        $(".console").hide();
        $("#btnLimpar").hide();
        btn.textContent = "Exibir Console";
        splitCodeConsole.collapse(1);
        showConsole = false;
    } else {
        $("#console").css({padding: "10px"})
        $(".console").show();
        $("#btnLimpar").show();
        btn.textContent = "Ocultar Console";
        splitCodeConsole.setSizes([50,50]);
        showConsole = true;
    }
    updateEditorSize();
}

function onClearConsole() {
    var c = $('#console-text')
    c.text("");
}

function imprimir(value) {
    if (showConsole) {
        //var c = $(".console");
        //c.append(value + "\n");
        //console.log(value);
        var c = $('#console-text')
        c.append("\t" + value + "<br>");

        var trueDivHeight = $('#console')[0].scrollHeight;
        var divHeight = $('#console').height();
        var scrollLeft = trueDivHeight - divHeight;
        $('#console').scrollTop(scrollLeft);
    }
}

function lerPara() {
    smalltalk.prompt("Novo valor", "").then(
        (value) => {
        Ler.valor = value;
    }).catch((err) => {
        Ler.valor = "";
    });
}