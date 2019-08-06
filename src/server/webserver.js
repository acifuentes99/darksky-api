const express = require('express')
const WebSocket = require('ws')
const redisClient = require("redis")
.createClient(process.env.REDIS_URL, { no_ready_check: true })

import { Functions } from "./functions.js"
import { env } from "./env"
redisClient
.on('ready',() => console.log("Redis is ready"))
.on('error',() => console.log("Error in Redis"))

const func = new Functions(redisClient, env)


export class WebServer {

	constructor() {
		this.app = express()
		this.app.use(express.static('dist/public'))
	}

	/*
		*	Inicio de servidor, conexión a servidor Redis, y inicio
		*	de servidor de WebHooks
		* */
  start () {
    return new Promise((resolve, reject) => {
      try {
				var that = this
        this.server = this.app.listen(env.config.port, function () {
					func.setRedis(redisClient)
					that.wss = new WebSocket.Server({ server: that.server })
					that.webhook(that.wss)
          resolve()
        })
      } catch (e) {
        console.error(e)
				reject(e)
			}
		})
	}

	/**
	 * Websocket funcionando cada 10 segundos (variable milsec), realizando
	 * llamadas a la API a través de funcionalidad implementada
	 * Se utiliza la funcionalidad de "Ping-Pong", donde es necesario que el
	 * servidor reciba un "Pong", para poder realizar la consulta a la API
	 * (Esto, para no superar la capacidad de las llamadas de API)
	 */
	webhook(wss) {
		wss.on('connection', ws => {
			ws.on('pong', (msg) => {
				console.log("Asking API")
				ws.isAlive = true
				let promises = func.getData()
					.then((values) => {
						ws.send(JSON.stringify({"values": values}))
					})
			})
			ws.ping()
			ws.isAlive = false
			let milsec = 10000 //10000 milsec = 10 segundos
			let interval = setInterval(() => {
				if (ws.isAlive === false){
					clearInterval(interval)
					ws.terminate()
					console.log("socket killed")
				}
				ws.ping()
				ws.isAlive = false
			}, milsec)
		})
	}

	stop () {
		return new Promise((resolve, reject) => {
			try {
				this.server.close(() => {
					resolve()
        })
      } catch (e) {
        console.error(e.message)
        reject(e)
      }
    })
  }

}
