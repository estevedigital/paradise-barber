# Paradise Barber

Aplicación de reservas para barbería construida con React + Vite.

Incluye:
- Autenticación con OTP mock (demo local).
- Flujo de reserva por pasos.
- Dashboard con próxima cita.
- Gestión de citas (editar/cancelar).
- Persistencia local con `localStorage` (sin backend).

## Requisitos

- Node.js 18+ (recomendado 20+)
- npm 9+

## Instalación

```bash
git clone https://github.com/estevedigital/paradise-barber.git
cd paradise-barber
npm install
```

## Ejecutar en local

```bash
npm run dev
```

Abre la URL que te muestra Vite (normalmente `http://localhost:5173`).

## Scripts disponibles

```bash
npm run dev      # entorno de desarrollo
npm run build    # build de producción (salida en /dist)
npm run preview  # previsualizar build de producción
npm run lint     # lint con ESLint
npm run deploy   # despliegue a GitHub Pages (usa /dist)
```

## Flujo funcional

1. Entrar en `/auth`.
2. Elegir invitado, registro o login.
3. Si vas por OTP, el código demo es `123456`.
4. Reservar cita en `/booking`.
5. Confirmar en `/booking/summary`.
6. Ver resultado en `/booking/confirmation` y `/dashboard`.

## Estructura del proyecto

```txt
src/
  components/   # componentes reutilizables UI
  pages/        # pantallas y rutas
  services/     # lógica de citas y OTP (mock)
  store/        # contexto de autenticación
  theme/        # tema MUI (estilo global)
```

## Datos locales (localStorage)

La app guarda datos en el navegador con estas claves:
- `paradise_barber_auth`
- `paradise_registered_users`
- `paradise_barber_appointments`
- `paradise_otp_data`

Si quieres resetear el estado demo, borra esas claves en el navegador.

## Tecnologías

- React 18
- Vite 5
- Material UI
- React Router
- Framer Motion
- React Hook Form + Zod
- date-fns

## Despliegue en GitHub Pages

El proyecto ya tiene scripts para deploy con `gh-pages`:

```bash
npm run deploy
```

Esto ejecuta primero `npm run build` y publica `dist/`.
