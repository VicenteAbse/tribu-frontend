# Trivy — Frontend (Ionic + Angular)

## Descripción del proyecto
App social móvil para encontrar grupos de personas con intereses en común cerca de tu ubicación. El nombre de la app es **Trivy**.

## Stack tecnológico
- **Framework:** Ionic 7 + Angular 20
- **Arquitectura de componentes:** NgModule (NO standalone components)
- **Formularios:** Reactive Forms (`ReactiveFormsModule`)
- **Navegación:** Angular Router con lazy loading por módulo
- **Plataforma nativa:** Capacitor 8

## Regla crítica de arquitectura
Este proyecto usa **NgModule-based architecture**. Los componentes **nunca** deben tener `standalone: true`. Siempre deben:
- Declararse en `declarations: []` de su módulo correspondiente
- El módulo importa las dependencias (`IonicModule`, `CommonModule`, `ReactiveFormsModule`, etc.)
- Cada página tiene su propio módulo (`*.module.ts`) y routing module (`*-routing.module.ts`)

## Estructura de carpetas relevante
```
src/app/
├── auth/                         # Módulo de autenticación
│   ├── dtos/
│   │   ├── login.dto.ts          # { email, password }
│   │   └── register.dto.ts       # { name, email, password }
│   ├── login/                    # Pantalla de login
│   │   ├── login-routing.module.ts
│   │   ├── login.module.ts
│   │   ├── login.page.ts
│   │   ├── login.page.html
│   │   └── login.page.scss
│   ├── register/                 # Pantalla de registro
│   │   ├── register-routing.module.ts
│   │   ├── register.module.ts
│   │   ├── register.page.ts
│   │   ├── register.page.html
│   │   └── register.page.scss
│   ├── auth-routing.module.ts
│   └── auth.module.ts
├── tabs/                         # Shell de tabs (post-login)
├── tab1/, tab2/, tab3/           # Tabs placeholder
└── app-routing.module.ts         # Ruta raíz → /auth/login
```

## Enrutamiento
- `/` → redirige a `/auth`
- `/auth` → redirige a `/auth/login`
- `/auth/login` → LoginPage
- `/auth/register` → RegisterPage
- `/tabs` → tabs shell (disponible post-login)

## Convenciones de código
- Plantillas HTML: usar nueva sintaxis de control flow de Angular (`@if`, `@for`, `@switch`) en lugar de directivas (`*ngIf`, `*ngFor`)
- Idioma de la UI: español
- Estilos: SCSS por componente; variables globales en `src/theme/variables.scss`
- Sin comentarios en el código salvo que el motivo sea no obvio

## Branding / Tema visual
Variables CSS en `src/theme/variables.scss`:
- `--trivy-purple: #6C63FF`
- `--trivy-pink: #FF6584`
- `--trivy-dark: #1a1a3e`
- Login: degradado azul-violeta (`--trivy-gradient-login`)
- Register: degradado rosa-violeta (`--trivy-gradient-register`)
- Ion primary: `#6C63FF`, secondary: `#FF6584`

## Integraciones pendientes
- Autenticación con Google (botón presente, sin implementar)
- Autenticación con Facebook (botón presente, sin implementar)
- Servicio de autenticación con backend (los métodos `onLogin()` y `onRegister()` están listos para conectarse)

## Patrón de módulo de página (template)
```typescript
// *.module.ts
@NgModule({
  declarations: [MiPage],          // ← componente va aquí
  imports: [
    CommonModule,
    ReactiveFormsModule,           // si usa formularios reactivos
    IonicModule,
    MiPageRoutingModule
  ]
})
export class MiPageModule {}
```
