# Either

Após muita pesquisa sobre o que é um Either ou Monad:
1. [Fantasy Land Specification](https://github.com/fantasyland/fantasy-land);
2. [Handling errors with Either](https://dev.to/avalander/handling-errors-with-either-2i7j) [Autor(a) AVALANDER];
3. [Lidando com dados inesperados em JavaScript](https://dev.to/khaosdoctor/lidando-com-dados-inesperados-em-javascript-1n2i) [Autor: SANTOS, LUCAS];
4. [A Gentle Introduction to Monads in JavaScript](https://modernweb.com/a-gentle-introduction-to-monads-in-javascript/) [Autor: VOISEN, SEAN];
5. [Otavio Lemos <Clean Architecture + DDD: Erros por camada e uso do Either >](https://www.youtube.com/watch?v=PXVcs5BrTSQ);
6. [Expressive error handling in TypeScript and benefits for domain-driven design](https://medium.com/inato/expressive-error-handling-in-typescript-and-benefits-for-domain-driven-design-70726e061c86) [Autor: VEGREVILLE, BRUNO].

Resolvi, com base nestas referências (acessadas em fevereiro de 2021), criar a minha própria implementação de Either, bem como um exemplo de caso de uso, em nível de 1º Semestre do curso de Análise e Desenvolvimento de Sistemas.

## Descrição das classes *Left* e *Right*

Ambas as classes *Left* e *Right* usam a mesma "interface" de métodos. Para cada instância de *Left* e *Right* em execução há um comportamento diferente.

Os comentários abaixo são bastante explicativos.

```javascript

//Left: classe que representa qualquer erro
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
    ou caso contrário, retorna o próprio Left ('this').
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

//Right: classe que representa o valor correto
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
        e é retornado o próprio  Right('this').
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
    Aplica uma função ao this.value se o parâmetro fnRight for uma 'function',
    ou caso contrário, retorna o 'this.value'. 'resultFunc' não altera o valor de 'this.value'.
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

```

---

Observe que toda função que aplica uma transformação em ```this.value``` passa o seu contexto```this``` (*Left* ou *Right*), para [fn.call](https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Reference/Global_Objects/Function/Call).

Os nomes dos métodos ```map``` e ```chain``` bem como o motivo de uso foram derivados do *post* de [AVALANDER](https://dev.to/avalander/handling-errors-with-either-2i7j). No lugar de ```fold```, alterei o nome do método para ```resultFunc```, pois o considero mais expressivo para o que ele realmente faz.

Já os métodos ```isLeft```e ```result``` foram derivados dos *posts* de [VEGREVILLE](https://medium.com/inato/expressive-error-handling-in-typescript-and-benefits-for-domain-driven-design-70726e061c86) e [VOISEN](https://modernweb.com/a-gentle-introduction-to-monads-in-javascript/). Por VOISEN, ao usar o método ```Val``` (equivalente ao meu ```result```) é lançada uma exceção se a instância em execução for do tipo *Left*.


O método ```chain``` pode ser usado para testar diversas condições de erro, em parâmetros de entrada de função ou em construtores, de modo encadeado. Exemplo:

```javascript

const Either = require('Either');

function createAluno(nome, email){

    let this.erroOuNome = new Either.Right(nome)     //supomos que o 'nome' é um valor válido
        .chain(testeErroNome1)      //Agora encadeamos diversos testes, por meio de funções.
        .chain(testeErroNome2);

    let this.erroOuEmail = new Either.Right(email).chain(testeErroEmail);

}

/*
Como esta função será usada com o método 'chain', ela DEVE retornar um Either,
caso contrário, será lançada uma exceção.
*/

SeuErro => Uma classe que extende 'Error'
class SeuErro extends Error {
    constructor({message, name}){
        super(message);
        this.name = name;
    }
}

SuaListaDeErros = {
    ErroNome: {
        ErroNomeTipo1: {name: "MeuErroNomeTipo1", message: "Erro: nome inválido - tipo 1"},
        ErroNomeTipo2: {name: "MeuErroNomeTipo2", message: "Erro: nome inválido - tipo 2"},
    },

    ErroEmail: {
        ErroEmaillTipo1: {name: "MeuEroEmailTipo1", message: "Erro: e-mail inválido - tipo 1"},
    }
}

function testeErroNome1(nome){

    if ( /*nome é um valor válido*/ ){
        return this;    //por conta da chamada de fn.call(this_Either, value), este this_Either refere-se a 
                        //ao this de quem o chamou
    }else{
        //Sua lista de erros personalizados pode ser criadaa aqui
        return new Either.Left(new SeuErro(SuaListaDeErros.ErroNome.ErroNomeTipo1));
    }
}

function testeErroNome2(nome){

    if ( /*nome é um valor válido*/ ){
        return this;    //por conta da chamada de fn.call(this_Either, value), este this_Either refere-se a 
                        //ao this de quem o chamou
    }else{
        //Sua lista de erros personalizados pode ser criadaa aqui
        return new Either.Left(new SeuErro(SuaListaDeErros.ErroNome.ErroNomeTipo2));
    }
}

function testeErroEmail(email){

    if ( /*email é um valor válido*/ ){
        return this;    //por conta da chamada de fn.call(this_Either, value), este this_Either refere-se a 
                        //ao this de quem o chamou
    }else{
        //Sua lista de erros personalizados pode ser criadaa aqui
        return new Either.Left(new SeuErro(SuaListaDeErros.ErroEmail.ErroEmaillTipo1));
    }
}


```


