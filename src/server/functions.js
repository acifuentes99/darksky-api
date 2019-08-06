const request = require('request')

export class Functions {
	/**
	 * Variables de las funciones
	 */
	constructor(redisClient, env){
		this.redisClient = redisClient
		this.env = env
	}

	/**
	 * Envía a Redis las variables de latitud y longitud definidas en
	 * la configuración incial
	 *
	 * @param {redisClient} Cliente de Redis configurado
	 */
	setRedis() {
		const that = this;
		console.log("Setting redis")
		that.env.cities.forEach((city) => {
			that.redisClient.set(city.name+'-lat', city.lat)
			that.redisClient.set(city.name+'-long', city.long)
		})
	}

	/**
	 * Obtiene las coordenadas de una ciudad, desde el servidor de Redis 
	 * configurado en la plataforma
	 *
	 * @param {name} Nombre de la ciudad, la cual se utiliza como key
	 * @returns {Array} Retorna las coordenadas de la forma [latitud, longitud]
	 */
	getCity(name) {
		const that = this;
		let promise = new Promise((res, rej) => {
			var mult = that.redisClient.multi()
			mult.get(name+"-lat")
			mult.get(name+"-long")
			mult.exec((err, data) => {
				return res(data)
			})
		})
		return promise
	}

	/**
	 * Realiza un llamado a la API de darksky.net, incluyendo también una simulación
	 * de un error de un 10% al momento de hacer una consulta.
	 * De ocurrir esto, se registra en Redis el error, y se reintenta realizar la llamada
	 * a la API invocando nuevamente esta función
	 *
	 * @param {city} Array de las coordenadas enviadas
	 * @returns {Object} Retorna la información entregada por la API de darksky
	 */
	APICall(city) {
		const that = this;
		try {
			if (Math.random(0, 1) < 0.1) {
				throw new Error('How unfortunate! The API Request Failed') 
			}
			let url = that.env.darksky.url+that.env.darksky.secretkey+
				"/"+city[0]+","+city[1]+"?units=si"
			let promise = new Promise((res, rej) => {
				request(url, {json: true}, (err, response, body) => {
					return res(body)
				})
			})
			return promise
		}
		catch (error){
			let timestamp = Date.now()
			that.redisClient.hset("api.errors", timestamp, 'Error de fallo 10%')
			return that.APICall(city)
		}
	}

	/**
	 * Función que encapsula el procedimiento de realizar llamadas a la API
	 * de Darksky, para todas las ciudades registradas en la plataforma.
	 * Primero, obtiene las coordenadas de una ciudad con el método getCity.
	 * Posteriormente, estas coordenadas son utilizadas para realizar un llamado
	 * a la API de darksky.
	 * Finalmente, se retorna un arreglo con las promesas, para poder ser utilizado
	 *
	 * returns {Array} - Arreglo de Promesas de las llamadas de API de ciudad
	 */
	getData() {
		const that = this;
		var promises = []
		that.env.cities.forEach((city) => {
			let promise = new Promise((res, rej) => {
				that.getCity(city.name)
					.then((citycoord) => that.APICall(citycoord)
						.then((data) => {
							let temp = data.currently.temperature
							let time = new Date(data.currently.time*1000).toLocaleTimeString("en-US", {timeZone: data.timezone})
							let dict = {
								city: city.name,
								iso: city.iso,
								temp: temp,
								time: time,
								flags: data.flags.units
							}
							res(dict)
						})
					)})
			promises.push(promise)
		})
		return Promise.all(promises)
	}
}
