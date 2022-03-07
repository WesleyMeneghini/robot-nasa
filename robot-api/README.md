# Robot Nasa API

## Movimentos do robo

Para mover o robô é preciso mandar os dados da posição atual e o comando para onde deseja ir.

Faça a requisição para a url ```http://localhost:3001/robo``` método ```POST```, enviando um objeto json:

```
{
	"command": "MMR",
	"x": 0,
	"y": 0,
	"orientation": "N"
}
```

Exemplo de responta com sucesso, ```status 200```:

```
{
  "positionFinal": {
    "x": 0,
    "y": 2,
    "orientation": "E"
  }
}
```

Exemplo de responta com erro de sintaxe, ```status 400```:

```
{
  "error": "command invalid",
  "message": "Command 'MMMMRa' is not valid!"
}
```

Exemplo de responta com erro de estar fora do perímetro permitido, ```status 400```:

```
{
  "error": "outside the perimeter",
  "message": "Command 'MMMMMM' is not valid! Outside the perimeter"
}
```