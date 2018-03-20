const AZUL = 'blue';
const VERMELHO = 'red';
const VERDE = 'green';
const BRANCO = 'white';
const PRETO = 'black';
const AMARELO = '#FFFF00';
const CIANO = '#00FFFF';
const ROSA = '#FF00FF';

var idAnimacao;
var idLoop;

function ajuda() {
    const info = [
        "AJUDA<br>-----------------------------------",
        "imprimir(valor);<br><span class='ajuda'>Imprime no console o valor especificado.</span>",
        "ler();<br><span class='ajuda'>Abre uma janela para entrada de algum valor e retorna a entrada caso o usuário click OK.</span>",
        "limpar();<br><span class='ajuda'>Limpa a área de desenho.</span>",
        "eixos();<br><span class='ajuda'>Mostra os eixos x e y.</span>",
        "largura();<br><span class='ajuda'>Obtém a largura área de desenho.</span>",
        "altura();<br><span class='ajuda'>Obtém a altura área de desenho.</span>",

        "lerAno();<br><span class='ajuda'>Retorna o ano atual.</span>",
        "lerMes();<br><span class='ajuda'>Retorna o mês atual iniciando em 0 para Janeiro, 1 para Fevereiro e assim por diante.</span>",
        "lerDia();<br><span class='ajuda'>Retorna o dia da semana iniciando em 0 para domingo, 1 para sefunda e assim por diante.</span>",
        "lerData();<br><span class='ajuda'>Retorna a data do dia atual.</span>",
        "lerHoras();<br><span class='ajuda'>Retorna as horas de acordo com o relógio do computador.</span>",
        "lerMinutos();<br><span class='ajuda'>Retorna os minutos de acordo com o relógio do computador.</span>",
        "lerSegundos();<br><span class='ajuda'>Retorna os segundos de acordo com o relógio do computador</span>",

        "Constantes de cor:<br><span class='ajuda'>PRETO, BRANCO, AZUL, VERMELHO, VERDE, AMARELO, CIANO e  ROSA.</span>",
        "mover(x, y);<br><span class='ajuda'>Posiciona o lapís na posição x,y</span>",
        "desenhar(x, y, cor);<br><span class='ajuda'>Desenha uma linha reta com a cor especificada da posição atual do lápis até a posição x,y. Caso a cor não seja definida PRETO sera escolhida.</span>",
        "retangulo(x, y, largura, altura, cor);<br><span class='ajuda'>Desenha um retângulo com a cor especificada na posição x,y com a largura e altura especificadas. Caso a cor não seja definida PRETO sera escolhida.</span>",
        "circulo(x, y, raio, cor);<br><span class='ajuda'>Desenha um círculo com a cor especificada com centro na posição x,y e raio especificado.</span>",
        "-----------------------------------"
    ].join("<br><br>");
    imprimir(info);
}

function iniciarLoop(funcao, tempo = 1000) {
    clearInterval(idLoop);
    idLoop = setInterval(funcao, tempo);
    if (typeof loop == "function") {
        //idLoop = setInterval(loop, tempo);
    } else {
        //alert("Função loop não definida.");
    }

}

function pararLoop() {
    clearInterval(idLoop);
}

function lerHoras() {
    var agora = new Date();
    return agora.getHours();
}

function lerMinutos() {
    var agora = new Date();
    return agora.getMinutes();
}

function lerSegundos() {
    var agora = new Date();
    return agora.getSeconds();
}

function lerDia() {
    var agora = new Date();
    return agora.getDay();
}

function lerData() {
    var agora = new Date();
    return agora.getDate();
}

function lerMes() {
    var agora = new Date();
    return agora.getMonth();
}

function lerAno() {
    var agora = new Date();
    return agora.getFullYear();
}

function lerSegundos() {
    var agora = new Date();
    return agora.getSeconds();
}

function ler(titulo = "Digite um valor") {
    return prompt(titulo);
}

function limparConsole() {
    var c = $('#console-text')
    c.text("");
}

/*
* repetir (comando, 10);
* */
function repetir(comando, nVezes) {
    for (var i = 0; i < nVezes; i++) {
        comando(i, nVezes);
    }
}

function animar(comando, nVezes, velocidade) {
    var contador = 0;
    idAnimacao = setInterval(
        function() {
            comando(contador, nVezes);
            if (contador == nVezes) {
                clearInterval(idAnimacao);
            }
            contador++;
        },
        1000//velocidade
    )
}

function mover(px, py) {
    moveTo(px, py);
}
function desenhar(px, py, cor) {
    lineTo(px, py, cor);
}

function mostrarGrade(gap, color) {
    var board = $("#board");
    var xg = board.width() / gap;
    var yg = board.height() / gap;
    for (var i = 0; i < xg; i++) {
        moveTo(gap * i, 0);
        lineTo(gap * i, board.height(), color, gridCanvas);
    }
    for (var j = 0; j < yg; j++) {
        moveTo(0, gap * j);
        lineTo  (board.width(), gap * j, color, gridCanvas);
    }
}

function circulo(centroX, centroY, raio, cor) {
    var pxIni = centroX;
    var pyIni = centroY;
    var rad = Math.PI / 180 * 0;
    var px = Math.cos(rad) * raio + pxIni;
    var py = Math.sin(rad) * raio + pyIni;
    mover(px, py);
    for (var i = 0; i < 360; i++) {
        rad = Math.PI / 180 * i;
        px = Math.cos(rad) * raio + pxIni;
        py = Math.sin(rad) * raio + pyIni;
        desenhar(px, py, cor);
    }
}

function retangulo(px, py, w, h, cor) {
    mover(px, py);
    desenhar(px, py + h, cor);
    desenhar(px + w, py + h, cor);
    desenhar(px + w, py, cor);
    desenhar(px, py, cor);
}

function mouseX() {
    return stage.mouseX;
}

function mouseY() {
    return stage.mouseY;
}



/*

var pxIni = 200;
var pyIni = 200;
var raio = 50;
var ang = 0;
var rad = Math.PI / 180 * ang;
var px = Math.cos(rad) * raio + pxIni;
var py = Math.sin(rad) * raio + pyIni;
moveTo(px, py);

idInterval = setInterval (
	function () {
    	rad = Math.PI / 180 * ang;
      	ang += 360 / 8;
      	px = Math.cos(rad) * raio + pxIni;
		py = Math.sin(rad) * raio + pyIni;
      	lineTo(ang/2, py);
      	if (ang > 360 * 3) {
        	clearInterval(idInterval);
        }
    },
	100
);

var pxIni = 200;
var pyIni = 200;
var raio = 50;
var rad = Math.PI / 180 * 0;
var px = Math.cos(rad) * raio + pxIni;
var py = Math.sin(rad) * raio + pyIni;
mover(px, py);
for (var i = 0; i < 360; i++) {
    rad = Math.PI / 180 * i;
    px = Math.cos(rad) * raio + pxIni;
    py = Math.sin(rad) * raio + pyIni;
    desenhar(px, py);
    if (ang > 360 * 3) {
        clearInterval(idInterval);
    }
}

*/

