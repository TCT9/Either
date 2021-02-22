
# Exemplo de uso

O objetivo é construir uma aplicação de terminal, constituida por um menu com as opções abaixo:

> 1) Informar o salário
> 2) Informar percentual de desconto (0.00 até 100.00)
> 3) Imprimir o salário
> 4) Imprimir o percentual de desconto 
> 5) Imprimir o salário com desconto
> 6) Sair
> 
> Selecione uma opção:

## Restrições


1. As entradas de salário e percentual de desconto aceitam apenas números;

2. O salário não pode ser menor do que 1000.00 e nem maior do que 35.000.00;

3. O percentual de desconto deve estar entre 0.00 e 100.00.

## Mensagens / Ações

1) Na __Opção 1__: _Informar o salário_

> 1.1 Se o salário for menor do que 1000.00, informar: "Erro: o salário é menor do que 1000.00";

> 1.2 Se o salário for maior do que 35.000,00, informar: "Erro: o salário é maior do que 35.000.00";

> 1.3 Se o salário informado não for um número: "Erro: entre com um número válido";

> 1.4 Se o salario não tiver sido registrado pela ```Opção 1```, e as opções 3 ou 5 forem selecionadas: "Erro: o salário não foi registrado na 'Opção 1' !!!".

2) Na __Opção 2__: _Informar percentual de desconto (0.00 até 100.00)_

> 2.1  Se o percentual de descoto não estiver entre 0.00 e 100.00, informar: "Erro: O percentual deve estar entre 0.00 e 100.00";

> 2.2 Se o percentual informado não for um número: "Erro: entre com um número válido";

> 2.3 Se o percentual não tiver sido registrado pela 'Opção 2' e as opções 4 ou 5 forem selecionadas: "Erro: o percentual não foi registrado na 'Opção 2' !!!".


3) Na __Opção 3__: _Imprimir o salário_

> 3.1 Se o salario não tiver sido registrado pela 'Opção 1': "Erro: o salário não foi registrado na 'Opção 1' !!!";

> 3.2 Ao selecionar a opção 3, deve ser impresso o salário formatado. Se o salário foi 1300.5, informar: "Salário: R$ 1.300,50".

4) Na __Opção 4__: _Imprimir o percentual de desconto_

> 4.1 Se o percentual não tiver sido registrado na 'Opção 2': "Erro: o percentual não foi registrado na 'Opção 2' !!!";

> 4.2 Ao selecionar a opção 4, deve ser impresso o desconto formatado. Se o desconto foi 13.2, informar: "Percentual de desconto: 13,20 %".

5) Na __Opção 5__: _Imprimir o salário com desconto_

> 5.1 Se o percentual não tiver sido registrado na 'Opção 2': "Erro: o percentual não foi registrado na 'Opção 2' !!!";
        
> 5.2 Se o salário não tiver sido registrado pela 'Opção 1': "Erro: o salário não foi registrado na 'Opção 1' !!!";
        
> 5.3 Ao selecionar a opção 5, deve ser impresso o salário já descontado;
            
> 5.4 Se o salário foi 1300.5 e o desconto foi 13.2, então o salário com desconto foi: 1124.9325, logo deve ser informado: "Salário com desconto: R$ 1.125,93";

> 5.5 O salário com desconto deve ter aproximação de duas casas decimais.

6) Na __Opção__ 6: _Sair_

> 6.1 Imprimir a mensagens: "Fim de simulação!!!".
