# API de control de soldadura TIG con límite de solicitudes

Ejercicio práctico de Node.js y Express que simula una pequeña API de fábrica. Su propósito es demostrar cómo proteger una operación de soldadura TIG con un límite de solicitudes HTTP mediante el paquete `express-rate-limit`.

## Objetivo del ejercicio

La API ofrece una consulta para conocer el estado de una máquina y una operación para procesar una pieza mediante soldadura TIG. La operación está protegida para evitar que un cliente envíe demasiadas solicitudes en poco tiempo: se permiten hasta **3 solicitudes por dirección IP durante una ventana de 1 minuto**. Al exceder el límite, la API responde con el estado HTTP `429 Too Many Requests` y un mensaje que representa el enfriamiento de la máquina.

Este ejercicio se centra en el enrutamiento, los controladores y el middleware de limitación. No persiste piezas ni operaciones y no se conecta a una base de datos.

## Requisitos

- Node.js 20 LTS o posterior.
- npm (se instala junto con Node.js).
- Git, si se va a clonar el repositorio.

## Instalación y ejecución

1. Clona el repositorio y entra en el directorio del proyecto:

	```bash
	git clone https://github.com/lestergarcia711/express-rate-limit-welding-process.git
	cd express-rate-limit-welding-process
	```

2. Instala las dependencias indicadas en el archivo de bloqueo:

	```bash
	npm ci
	```

3. Inicia la API en modo desarrollo, con reinicio automático al detectar cambios:

	```bash
	npm run dev
	```

	Para iniciarla sin el modo de observación, ejecuta `npm start`.

El servidor escucha en `http://localhost:3000`. Al iniciarse, muestra en la terminal un mensaje indicando que la fábrica está en funcionamiento. El puerto está definido directamente en la aplicación; no se configura mediante variables de entorno.

## Rutas disponibles

La base de las rutas es `/api/soldadura`.

| Método | Ruta | Descripción | Respuesta esperada |
| --- | --- | --- | --- |
| `GET` | `/api/soldadura/estado` | Consulta el estado de la máquina TIG. | `200 OK` con información de máquina, estado y temperatura. |
| `POST` | `/api/soldadura/tig` | Simula la soldadura de una pieza. Está protegida por el límite de solicitudes. | `200 OK` si la solicitud está dentro del límite; `429` al excederlo. |

### Consultar el estado de la máquina

```bash
curl http://localhost:3000/api/soldadura/estado
```

La respuesta es JSON e incluye el nombre de la máquina, su estado y la temperatura.

### Procesar una pieza

Envía el nombre de la pieza como JSON. El encabezado `Content-Type` debe indicar que el cuerpo es JSON:

```bash
curl -i -X POST http://localhost:3000/api/soldadura/tig \
  -H 'Content-Type: application/json' \
  -d '{"pieza":"soporte metálico"}'
```

La respuesta correcta tiene estado `200` e incluye `status: "success"` y un mensaje con el nombre de la pieza. Si se omite `pieza`, se utiliza `Pieza generica`.

### Comprobar el límite

Envía cuatro solicitudes `POST` seguidas a `/api/soldadura/tig` desde la misma dirección IP. Las primeras tres se procesan; la siguiente recibe `429 Too Many Requests` con un cuerpo similar a:

```json
{
  "status": "error",
  "codigo": "SOBRECALENTAMIENTO",
  "mensaje": " La maquina TIG requiere enfriameinto, Superaste el limite de tres"
}
```

El contador usa una ventana de 60 segundos. Después de que termine la ventana, las solicitudes vuelven a estar disponibles. La ruta `GET /estado` no está limitada por este middleware.

## Organización del proyecto

```text
src/
├── app.js                         # Crea Express, activa JSON y arranca el servidor
├── controllers/
│   └── soldaduraController.js     # Lógica de consulta y simulación de soldadura
├── middlewares/
│   └── rateLimiter.js             # Configuración del límite para soldadura TIG
└── routes/
	 └── soldaduraRoutes.js         # Asociación de rutas, middleware y controladores
```

El flujo de una solicitud de soldadura es: la ruta `POST /tig` aplica primero `tigLimiter`; si el límite lo permite, ejecuta `procesarSoldaduraTig` y devuelve la respuesta.

## Scripts disponibles

| Comando | Función |
| --- | --- |
| `npm run dev` | Inicia `src/app.js` con la opción de observación de Node.js. |
| `npm start` | Inicia `src/app.js` normalmente. |

## Alcance y consideraciones

- El límite utiliza el almacenamiento en memoria predeterminado de `express-rate-limit`: el contador se reinicia al reiniciar el proceso y no se comparte entre varias instancias de la aplicación.
- La dirección IP es la clave predeterminada para contar solicitudes. Detrás de un proxy, la configuración de confianza del proxy debe revisarse antes de desplegar la API para evitar identificar clientes incorrectamente.
- La configuración del límite está pensada para demostrar el middleware en un ejercicio local; un despliegue de producción con varias instancias normalmente requiere almacenamiento compartido y una configuración validada para la infraestructura.
- No hay autenticación, persistencia, pruebas automatizadas ni configuración de despliegue en este ejercicio.

## Tecnologías

- Node.js con módulos ES.
- Express 5.
- `express-rate-limit` 8.
