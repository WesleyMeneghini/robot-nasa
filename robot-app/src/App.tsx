import { Button, Container, Row, Col, Form, Table } from "react-bootstrap"
import { render } from "react-dom";
import { useState } from "react";

import axios from 'axios'

import './App.css'

import setaImg from './img/seta.png'

function App() {

  const grade = [0, 1, 2, 3, 4];

  var [comandoInput, setComandoInput] = useState({ comando: '' })
  var [seta, setSeta] = useState("0")
  var [msgError, setMsgError] = useState("")
  var [position, setPosition] = useState({ x: 0, y: 0, orientation: 'N' })


  const handleChange = (e) => {
    const { name, value } = e.target;
    setComandoInput({ [name]: value })
  }

  const setaOrientation = (s) => {
    console.log(s)
    let graus = '0'
    switch (s) {
      case 'E':
        graus = '90';
        break;
      case 'S':
        graus = '180';
        break;
      case 'W':
        graus = '270';
        break;

    }
    console.log("Graus: " + graus)

    setSeta(graus)

  }



  const enviaDados = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:3001/robo', {
        command: comandoInput.comando,
        x: position.x,
        y: position.y,
        orientation: position.orientation
      })

      console.log(res.status)

      if (res.status == 200) {
        let { positionFinal } = res.data
        setPosition({
          x: positionFinal.x,
          y: positionFinal.y,
          orientation: positionFinal.orientation
        })
        setaOrientation(positionFinal.orientation)
        setMsgError("")
      }
    } catch (error) {
      console.log(error.response.data.error)
      let erroRes = error.response.data.error
      if (erroRes == "command invalid") {
        setMsgError("Comando Inválido (" + comandoInput.comando + "), verifique a legenda!")
      } else if (erroRes == "outside the perimeter") {
        setMsgError("Comando inválido, pois está fora do perímetro permitido!")
      }
    } finally {
      setComandoInput({ comando: "" })

    }
  }

  const reseta = () => {
    setPosition({
      x: 0, y: 0, orientation: 'N'
    })
    setSeta("0")
    setMsgError("")
  }


  return (
    <Container className="mt-5">
      <Row>
        <Col xs={3}>
          <Form onSubmit={enviaDados}>
            <Form.Group className="mb-3" controlId="formBasicMoviment">
              <p>Legenda</p>
              <Form.Text className="text-muted">
                <p>
                  M - Movimenta o robo <br />
                  R - Gira 90° a direita <br />
                  L - Gira 90° a esquerda
                </p>
              </Form.Text>

              <Form.Label>Comando</Form.Label>
              <Form.Control
                type="text"
                placeholder="Digite seu comando..."
                onChange={handleChange}
                value={comandoInput.comando}
                name="comando"
                required />

            </Form.Group>
            <Row>
              <Col>
                <Button variant="danger" onClick={reseta}>
                  Resetar
                </Button>
              </Col>
              <Col>
                <Button variant="primary" type="submit">
                  Submit
                </Button>
              </Col>
            </Row>

          </Form>
        </Col>
        <Col xs={9}>
          {msgError != "" ? <div className="alert alert-danger">
            {msgError}
          </div> : "" }
          <Table bordered >
            <tbody>
              {
                grade.map(y => (
                  <tr y={y}>
                    {grade.map(n => (
                      <td x={n}>
                        {n == position.x && y == position.y
                          ? <img src={setaImg} style={{ transform: `rotate(${seta}deg)` }} alt='' />
                          : ''}
                      </td>
                    ))}
                  </tr>

                )).reverse()
              }
            </tbody>
          </Table>
        </Col>
      </Row>

    </Container>
  )
}

export default App
