
class Left {

    constructor(value){
        this.value = value;
    }

    //Não faz nenhuma transformação. Retorna o próprio Left.
    map(fn) {return this;}

    //Não faz nenhuma transformação. Retorna o próprio Left.
    chain(fn) {return this;}

    /*
    Aplica uma função ao this.value se o parâmetro fnLeft for uma 'function',
    ou caso contrário, retorna 'this'.
    */
    resultFunc(fnLeft, fnRight) {
        return typeof fnLeft == 'function' ? fnLeft.call(this, this.value) : this;
    }

    //Retorna 'this.value'.
    result() {return this.value;}
    
     //Confirma que a instância atual é um Left.
    isLeft() {return  true;}

    //Representação do objeto em string para depuração
    toString() {return `Ramo: Left, value: ${this.value}`;}

}

class Right {

    constructor(value){
        this.value = value;
    }
    
    /*
    Podemos usar 'map' para aplicar transformações em this.value 
    e mantê-lo no mesmo Either(Left ou Right) ou 'this'.
    Obsevação: 'map' ALTERA o valor do 'this.value'.
    */
    map(fn) {

        //Espera-se que 'fn' NÃO RETORNE um Either(Left ou Right)
        let result = fn.call(this, this.value);      
        
        //Testando o tipo de retorno de 'fn', contido em result
        let ehEither = result instanceof Right || result instanceof Left;  

        /*
        Se o tipo de 'result' não for um Either(Left ou Right), atualiza-se 'this.value' com 'result',
        e é retornado o próprio 'this'.
        */
        if (ehEither == false) {
            this.value = result;
            return this;
        }   

        //Se chegou até aqui, lançamos uma exceção, pois 'fn' NÃO DEVE RETORNAR um Either(Left ou Right)
        new Error ("Erro: o parâmetro fn de map(fn), no ramo Right, retornou um Either(Left ou Right. " + 
            "'fn' APENAS TRANSFORMA SEM retornar um Either (Left ou Right")
    }

    /* 
    Podemos usar 'chain' se quisermos aplicar uma transformação que retorna outra Either, pois esta 
    transformação pode falhar. Neste caso, a função 'fn' DEVE RETORNAR um Either (Left ou Right)
    Obsevação: 'chain' NÃO ALTERA o valor do 'this.value'.
    */
    chain(fn) {

        //Aplica-se uma transformação em 'this.value' por meio de 'fn'
        //Espera-se, para NÂO ser lançada uma exceção aqui, que 'fn' RETORNE um tipo Either (Left ou Right)
        let resultEither = fn.call(this, this.value);

        //Testando o tipo de retorno de 'fn', contido em result
        let ehEither = resultEither instanceof Right || resultEither instanceof Left;  
        
        return ehEither == true ? resultEither : new Error
            ("Erro: o parâmetro fn de chain(fn), ramo Right, não retorna um Either(Left ou Right");
    
    }

    /*
    Aplica uma função ao this.value se o parâmetro fnRight for uma 'function'.
    Caso contrário, retorna o 'this.value. 'resultFunc' não altera o valor de this.value.
    */
    resultFunc(fnLeft, fnRight) {
        return typeof fnRight == 'function' ? fnRight.call(this, this.value) : this.value;

    }

    //Retorna 'this.value'
    result() {return this.value;}

    //Confirma que a instância atual é um Right
    isLeft() {return false;}

    //Representação do objeto em string para depuração
    toString() {return `Ramo: Right, value: ${this.value}`;}
    
}

module.exports = {Left, Right};
