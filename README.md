# darksky-api
Darksky API Proyect using ReactJS and ES6

Proyecto en el cual se utiliza la API de [Darksky.net](https://darksky.net/dev), para poder obtener información sobre el clima de algunos países, y el tiempo en que ocurren estos.

Se encuentra desarrollado utilizando Node.js, React.js, Redis, ES6, Websockets y Webpack.

Demo: [https://darksky-app-react.herokuapp.com/](https://darksky-app-react.herokuapp.com/)

## Instrucciones Deploy

* Primero que nada, es necesario tener instalado los paquetes de NodeJs dentro de su servidor.
* Posteriormente, se tiene que tener instalado Webpack y Webpack-cli. Instalar con el comando "npm install -g webpack webpack-cli" dentro de la máquina.
* Clonar el repositorio.
* Ejecutar el comando "npm install", para instalar los paquetes requeridos.
* Luego de la instalación, ejecutar comando "npm run build", para compilar el código con Webpack.
* Dentro del archivo oculto ".env", colocar los valores para las variables de "DARKSKY_APIKEY" (llave secreta de Darksky.net) y "REDIS_URL" (servidor Redis)
* Ejecutar el comando "npm start" para iniciar el servidor.
* Listo!, la aplicación se encuentra lista para su uso.


## Deploy en Heroku

El deploy sigue unos pasos similares a los anteriores, pero se reduce los procedimientos:

* Crear una nueva app en Heroku tipo NodeJs.
* Posteriormente, se muestra un menú que comienza en la sección "Deploy". Apretar, o seguir esta sección.
* En "Deployment Method", seleccionar GitHub, y seleccionar este repositorio. O ver alguna forma de clonar este, y utilizar su propia cuenta de GitHub.
* Abajo, en sección "Manual Deploy", colocar la rama "Master", y apretar "Deploy Branch".
* Heroku ejecutará automáticamente los comandos "npm run build" y "npm start" en el deploy.
* Presionar pestaña "Resources". Apretar en "Find More Addons", y seleccionar "Heroku Redis". Con ello, se agrega el servidor Redis necesario.
* Apretar en Settings, y colocar "Reveal Config Vars" en sección "Config Vars". Colocar la llave de Darksky.net, con KEY=DARKSKY_APIKEY, con el valor otorgado por la API Darksky.
* Guardar cambios. El servidor de reiniciará una vez que la llave sea cambiada.
* Listo!, acceder a la aplicación apretando en "Open App".
