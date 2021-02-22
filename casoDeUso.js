const Either = require('./index');
const Aux = require('AuxiliarJS');

//regex para número
const objRegexNumero = new RegExp(/(^[+]?[0-9]*)([0-9]|([.]?([0-9]{1,})))$/);

//regex para e-mail
// const objRegexEmail = new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);


//==========================================================================================
// Parte 1 => Imprimir o menu com as opções
// 
function imprimirMenu(){
    let menu = `
1) Informar o salário
2) Informar percentual de desconto (0.00 até 100.00)
3) Imprimir o salário
4) Imprimir o percentual de desconto 
5) Imprimir o salário com desconto
6) Sair\n
    `;

    console.log(menu);
}

// Fim parte 1
//==========================================================================================

//==========================================================================================
// Parte 2 => função para chegar se a entrada é um número válido
// 
function ehFormatoValido(string_valor, objRegex){

    if (objRegex instanceof RegExp == false){
        throw new Error("Erro: 'objRegex' deve ser do tipo 'RegExp' !!!");
    }

    if (string_valor instanceof String){
        throw new Error("Erro: 'string_valor' deve ser do tipo 'String' !!!");
    }

    let regex_valor = string_valor.match(objRegex);

    if (regex_valor === null){
        return false;
    }

    //compara o número de digitos 'casados'
    if (regex_valor[0].length === string_valor.length){
        return true;
    }

    return false;
}

// Fim parte 2
//==========================================================================================

//==========================================================================================
// Parte 3 => Tipos de erros
//

//Tipos de erros do sistema
//'name' e 'message' são propriedades do objeto 'Error'
const ErrosSistema = {

    erro_naoEhNumero : {
        naoEhNumero: {name: "ErroNaoEhNumerico", message: "\tErro: entre com um número válido"},
    },

    erro_salario: {
        limiteInferior: {name: "ErroSalarioAbaixoInferior", message: "\tErro: o salário é menor do que 1000.00"},
        limiteSuperior: {name: "ErroSalarioAcimaSuperior", message: "\tErro: o salário é maior do que 35.000.00"},
        salarioNaoRegistrado: {name: "ErroSalarioNaoRegistrado", message: "\tErro: o salario não foi registrado na 'Opção 1' !!!"},
    },

    erro_percentual: {
        foraDoLimite : {name: "ErroPercentualForaDoLimite", message: "\tErro: O percentual deve estar entre 0.00 e 100.00"},
        percentualNaoRegistrado: {name: "ErroPercentualNaoRegistrado", message: "\tErro: o percentual não foi registrado na 'Opção 2' !!!"},

    }
}


class TipoDeErro extends Error {

    constructor({message, name}){
        super(message);
        // this.message = message;
        this.name = name;
    }
}

// Fim parte 3
//==========================================================================================


//==========================================================================================
// Parte 4 => Classe Salario, com métodos de verificação de parâmetro
// de entrada
class Salario {

    constructor(strSalario){
        
        this._salario = 0;
    
        this._erroOuSalario = new Either.Right(strSalario)  // assuminos que o parâmetro de entrada est[a correto
            .chain(this.checkErroFormatoInvalido)       // Teste de erros encadeados
            .chain(this.checkErroLimiteInferior)
            .chain(this.checkErroLimiteSuperior);       // AO chegar no último teste, podemos ter um Left ou um Right

    }

    checkErroLimiteSuperior(strSalario){

        const LIMITE_SUPERIOR_SALARIO = 35000.00;

        let salario = parseFloat(strSalario);

        if (salario > LIMITE_SUPERIOR_SALARIO){
            return new Either.Left(new TipoDeErro(ErrosSistema.erro_salario.limiteSuperior));

        }

        return this;
    }

    checkErroLimiteInferior(strSalario){

        const LIMITE_INFERIOR_SALARIO = 1000.00;

        let salario = parseFloat(strSalario);

        if (salario < LIMITE_INFERIOR_SALARIO){
            return new Either.Left(new TipoDeErro(ErrosSistema.erro_salario.limiteInferior));
        }

        return this;
    }

    checkErroFormatoInvalido(strSalario){

        let salarioEhValido = ehFormatoValido(strSalario, objRegexNumero);

        if (salarioEhValido == false){
            return new Either.Left(new TipoDeErro(ErrosSistema.erro_naoEhNumero.naoEhNumero));
        }

        return this;
    }

    //Quem for usar 'Salario' deve primeiro verificar o retorno deste método
    //para saber se foi um Left ou Right
    getErroOuSalario() {
        return this._erroOuSalario;
    }


    //Use apenas se o retorno de 'getErroOuSalario' um Right
    setSalario(salario){
        this._salario = salario;
    }

    //Use 'getSalario' apenas após o uso de 'setSalario' se
    // 'getErroOuSalario' foi um Right
    getSalario(){
        return this._salario;
    }

    //Retorna o salário com desconto
    getSalarioComDesconto(desconto){
        return this._salario*(100.00 - desconto)/100.00;
    }

    //Retrna uma string com o salário formatado
    printSalario() {
        let strSalarioFormatado = new Intl.NumberFormat('pt-br', { style: 'currency', currency: 'BRL' })
            .format(this._salario);

        return `\tSalario: ${strSalarioFormatado}\n` ;
    }

}
// Fim parte 4
//==========================================================================================


//==========================================================================================
// Parte 5 => Classe PercentualDeconto, com métodos de verificação de parâmetro
// de entrada

class PercentualDeconto {

    constructor(strPercentual){
        this._percentual;

        this._erroOuPercentual = new Either.Right(strPercentual) //assuminos que o parâmetro de entrada est[a correto
            .chain(this.checkNumeroValido)      // Teste de erros encadeados
            .chain(this.checkIntervaloValido); // AO chegar no último teste, podemos ter um Left ou um Right

    }

    checkNumeroValido(strPercentual){

        let percentualEhValido = ehFormatoValido(strPercentual, objRegexNumero);

        if (percentualEhValido == false){
            return new Either.Left(new TipoDeErro(ErrosSistema.erro_naoEhNumero.naoEhNumero));
        }

        return new Either.Right(strPercentual);
    }

    checkIntervaloValido(strPercential){
        let percentual = parseFloat(strPercential);

        if (percentual >= 0.00 && percentual <= 100.00){
            return new Either.Right(percentual);
        }

        return new Either.Left(new TipoDeErro(ErrosSistema.erro_percentual.foraDoLimite));
    }


    //Quem for usar 'PercentualDeconto' deve primeiro verificar o retorno deste método
    //para saber se foi um Left ou Right
    getErrorOuPercentual(){
        return this._erroOuPercentual;
    }

    //Use apenas se o retorno de 'getErrorOuPercentual' um Right
    setPercentual(percentual){
        this._percentual = percentual;
    }

    //Use 'getPercentual' apenas após o uso de 'setPercentual' se
    // 'getErrorOuPercentual' foi um Right
    getPercentual(){
        return this._percentual;
    }

    //Retrna uma string com o percentual formatado
    printPercentual(){
        return `\tPercentual de desconto: ${this._percentual.toFixed(2)} %\n`;
    }

}

// Fim parte 5
//==========================================================================================

//==========================================================================================
// Parte 6 => Classe 'App', instancia e usa as classes 'Salario' e 'PercentualDesconto'. 
// Também provê os métodos que respodem as opções escolhidas pelo usuário
//

class App {

    constructor() {

        this.objErroOuSalario = new Either.Left(new TipoDeErro(ErrosSistema.erro_salario.salarioNaoRegistrado));
        this.objSalario = null;

        this.objErroOuPercentual = new Either.Left(new TipoDeErro(ErrosSistema.erro_percentual.percentualNaoRegistrado));
        this.objPercentual = null;

    }

    //Opção 1
     entrarComSalario() {
    
        let strSalario = Aux.prompt("\n\tEntre com o salário: ");
    
        this.objSalario = new Salario(strSalario);
        this.objErroOuSalario = this.objSalario.getErroOuSalario(); 
        
        if (this.objErroOuSalario.isLeft()){
            let objError = this.objErroOuSalario.result();
            console.log(objError.message);
            console.log("\tEntre novamente com um salário válido!\n");
            // return false;  
        }else{
            let salario = this.objErroOuSalario.result();
            this.objSalario.setSalario(salario);
            console.log("\tSalario gravado com sucesso!\n");
        }

    }

    //Opção 2
    entrarPercentualDeconto(){

        let strPercentual = Aux.prompt("\n\tEntre com o percentual de deconto: ");

        this.objPercentual = new PercentualDeconto(strPercentual);
        this.objErroOuPercentual = this.objPercentual.getErrorOuPercentual();

        if (this.objErroOuPercentual.isLeft()){
            let objError = this.objErroOuPercentual.result();
            console.log(objError.message);
            console.log("\tEntre novamente com um percentual válido!\n");
        }else{
            let percentual = this.objErroOuPercentual.result();
            this.objPercentual.setPercentual(percentual);
            console.log("\tPercentual de desconto gravado com sucesso!\n");
        }

    }

    //Opção 3
    printSalario(){

        if (this.objErroOuSalario.isLeft()){

            let objError = this.objErroOuSalario.result();
            console.log(objError.message);
            console.log("\tEntre com um salário válido na 'Opção 1' primeiro!\n");
    
        }else{
            console.log(`${this.objSalario.printSalario()}`);
        }

    }

    //Opção 4
    printPercentual(){

        if (this.objErroOuPercentual.isLeft()){
            let objError = this.objErroOuPercentual.result();
            console.log(objError.message);
            console.log("\tEntre com um percentual válido na 'Opção 2' primeiro!\n");
        }else{
            console.log(`${this.objPercentual.printPercentual()}`);
        }
    }

    //Opção 5
    imprimirSalarioComDesconto() {

        let desconto = 0;

        if (this.objErroOuPercentual.isLeft()){
            let objError = this.objErroOuPercentual.result();
            console.log(objError.message);
            console.log("\tEntre com um percentual válido na 'Opção 2' e depois com um salário válido na 'Opção 1' !!!\n");
        }else{

            desconto = this.objPercentual.getPercentual();

            if (this.objErroOuSalario.isLeft()){

                let objError = this.objErroOuSalario.result();
                console.log(objError.message);
                console.log("\tEntre com um salário válido na 'Opção 1' primeiro!\n");
        
            }else{

                let salarioComDesconto = this.objSalario.getSalarioComDesconto(desconto);
                let salarioFormatado = new Intl.NumberFormat('pt-br', {style: 'currency', currency: 'BRL'}).format(salarioComDesconto);
                let strDesconto = this.objPercentual.printPercentual();

                let salario = this.objSalario.getSalario();
                let valorDoDesconto = salario*desconto/100.00; 

                let strvValorDoDesconto = new Intl.NumberFormat('pt-br', {style: 'currency', currency: 'BRL'}).format(valorDoDesconto);


                Aux.print(`${strDesconto}`);
                Aux.print(`\tValor do desconto: ${strvValorDoDesconto}\n`)
                console.log(`\tSalário com desconto:  ${salarioFormatado}\n`);
            }
    
        }

    }

    //Opção 6
    sair(){
        const SAIR = "Fim de simulação!!!";
        console.log(SAIR);
    }
    
}

//Cada propriedade (1, 2, ..., 6) está associada com uma método de 'App'
const dictOpcoes = {
    
    1: (obj) => obj.entrarComSalario.call(obj),
    2: (obj) => obj.entrarPercentualDeconto.call(obj),
    3: (obj) => obj.printSalario.call(obj),
    4: (obj) => obj.printPercentual.call(obj),
    5: (obj) => obj.imprimirSalarioComDesconto.call(obj),
    6: (obj) => obj.sair.call(obj),
}


const SELECIONE_OPCAO = "Selecione uma opção: ";
const OPCAO_SAIR = "6";

let objApp = new App(); //Objeto que instancia 'Salario' e 'PercentualDesconto'

imprimirMenu();         // imprimir o menu
let strOpcao = "";      // variável que contém a opção selecionada

do{

    strOpcao = Aux.prompt(SELECIONE_OPCAO);

    if (strOpcao != OPCAO_SAIR){

        if (dictOpcoes[strOpcao] == undefined ){
            Aux.print("\tA T E N Ç Ã O: Opção inválida! Selecione uma opção entre 1 e 6.\n");
        }else{
            dictOpcoes[strOpcao](objApp);
        }
    }

}while(strOpcao !== OPCAO_SAIR);
