# Easy Forecast

Esta es una aplicación de pronóstico del tiempo que utiliza la API de OpenWeatherMap para obtener y mostrar el pronóstico del tiempo de los próximos días para una ubicación específica. Los usuarios pueden buscar el pronóstico del tiempo ingresando el nombre de una ciudad o utilizando su ubicación actual.

## Características

- Buscar pronóstico del tiempo por nombre de ciudad.
- Utilizar la ubicación actual del usuario para obtener el pronóstico del tiempo.
- Mostrar la temperatura, sensación térmica, humedad, velocidad y dirección del viento, y visibilidad.
- Diseño responsivo y atractivo con fondo de nubes.

## Requisitos

- Node.js
- npm (Node Package Manager)
- React + Vite

## Instalación

1. Clona este repositorio en tu máquina local:

    ```bash
    git clone https://github.com/tu-usuario/tu-repositorio.git
    cd tu-repositorio
    ```

2. Instala las dependencias del proyecto:

    ```bash
    npm install
    ```

3. Crea un archivo `.env` en la raíz del proyecto y añade tu clave de API de OpenWeatherMap:

    ```env
    VITE_SOME_VALUE=tu_clave_de_api
    ```

4. Inicia la aplicación:

    ```bash
    npm run dev
    ```

5. Abre tu navegador y navega a `http://localhost:3000`.

## Uso

### Buscar por Nombre de Ciudad

1. Ingresa el nombre de una ciudad en el campo de texto.
2. Haz clic en el botón "Search".
3. La aplicación mostrará el pronóstico del tiempo para los próximos días en la ciudad especificada.

### Usar la Ubicación Actual

1. Haz clic en el botón "Use My Location".
2. La aplicación solicitará permiso para acceder a tu ubicación.
3. Si otorgas el permiso, la aplicación mostrará el pronóstico del tiempo para tu ubicación actual.

## Personalización

Puedes personalizar el estilo y la apariencia de la aplicación modificando el archivo `styles.css`.

## Recursos

- [OpenWeatherMap API](https://openweathermap.org/api)
- [React](https://reactjs.org/)
- [Axios](https://github.com/axios/axios)
- [uuid](https://www.npmjs.com/package/uuid)

## Contribuir

Si deseas contribuir a este proyecto, por favor sigue estos pasos:

1. Haz un fork de este repositorio.
2. Crea una nueva rama (`git checkout -b feature/nueva-funcionalidad`).
3. Realiza tus cambios y haz commit (`git commit -am 'Añadir nueva funcionalidad'`).
4. Sube los cambios a tu rama (`git push origin feature/nueva-funcionalidad`).
5. Abre un Pull Request.

## Licencia

Este proyecto está bajo la Licencia MIT. Consulta el archivo `LICENSE` para más detalles.

## Autor
Eduardo Fatou.
