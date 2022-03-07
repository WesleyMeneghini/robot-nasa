import { Request, Response } from 'express'

const commandIsValid = (command: string) => {
  const commandRegex = /^[!M!R!L]+$/gi
  return (command.trim().search(commandRegex))
}

const rotationRobot = (orientacao: string, command: string) => {
  const orientation = ['N', 'E', 'S', 'W']
  let rotacao = 0

  const indexAtual = orientation.findIndex(e => e === orientacao)
  if (command === 'R') {
    rotacao = 1
  } else {
    rotacao = -1
  }

  let calculaRotacao = indexAtual + rotacao

  if (calculaRotacao === -1) {
    calculaRotacao = orientation.length - 1
  } else if (calculaRotacao === orientation.length) {
    calculaRotacao = 0
  }

  return orientation[calculaRotacao]
}

const moveRobot = (x, y, foco) => {
  const grid = 4
  switch (foco) {
    case 'N':
      y += 1
      break
    case 'S':
      y -= 1
      break
    case 'E':
      x += 1
      break
    case 'W':
      x -= 1
      break
  }

  if (x > grid || y > grid || y < 0 || x < 0) {
    return false
  }

  return [x, y]
}

class RoboController {
  public async index (req: Request, res: Response): Promise<Response> {
    const command: string = req.body.command.toUpperCase()
    let { x, y } = req.body
    let foco = req.body.orientation
    const result = commandIsValid(command)
    if (result === -1) {
      return res.status(400).json(
        {
          error: 'command invalid',
          message: `Command '${req.body.command}' is not valid!`
        }
      )
    }

    const arrayCommand = command.split('')
    arrayCommand.forEach(e => {
      if (e != 'M') {
        foco = rotationRobot(foco, e)
      } else {
        const resMoveRobot = moveRobot(x, y, foco)
        if (!resMoveRobot) {
          return res.status(400).json(
            {
              error: 'outside the perimeter',
              message: `Command '${req.body.command}' is not valid! Outside the perimeter`
            }
          )
        }
        x = resMoveRobot[0]
        y = resMoveRobot[1]
      }
    })

    return res.json({
      positionFinal: {
        x: x,
        y: y,
        orientation: foco
      }
    })
  }
}

export default new RoboController()
