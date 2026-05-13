# Trivy — Frontend (Ionic + Angular)

## Descripción del proyecto
App social móvil para encontrar grupos de personas con intereses en común cerca de tu ubicación. El nombre de la app es **Trivy**.

## Stack tecnológico
- **Framework:** Ionic 8 + Angular 20
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
├── dtos/                         # Todos los DTOs centralizados aquí
│   ├── login.dto.ts              # { email, password }
│   ├── register.dto.ts           # { name, email, password }
│   ├── group.dto.ts              # { id, name, description, category, memberCount, distance, backgroundColor, tags }
│   ├── group-detail.dto.ts       # extends GroupDto + { longDescription, location, nextEvent, createdBy, members[] }
│   ├── my-group.dto.ts           # GroupRole='creator'|'admin'|'member' + MyGroupDto (role reemplaza isAdmin)
│   ├── chat-message.dto.ts       # ChatMessageDto + ChatGroupInfoDto
│   ├── create-group.dto.ts       # JoinPolicy='open'|'approval' + CreateGroupDto
│   └── user-profile.dto.ts       # UserStatsDto + UserProfileDto
├── auth/                         # Módulo de autenticación
│   ├── login/
│   ├── register/
│   ├── auth-routing.module.ts
│   └── auth.module.ts
├── discovery/                    # Pantalla principal (swipe de grupos estilo Tinder)
│   ├── discovery-routing.module.ts
│   ├── discovery.module.ts
│   ├── discovery.page.ts         # GestureController + movedPx guard para tap vs swipe
│   ├── discovery.page.html
│   └── discovery.page.scss
├── group-chat/                   # Chat del grupo (pantalla completa, sin tab bar)
│   ├── group-chat-routing.module.ts
│   ├── group-chat.module.ts
│   ├── group-chat.page.ts        # IonContent scroll + sendMessage dummy
│   ├── group-chat.page.html
│   └── group-chat.page.scss
├── group-detail/                 # Detalle de grupo (pantalla completa, sin tab bar)
│   ├── group-detail-routing.module.ts
│   ├── group-detail.module.ts
│   ├── group-detail.page.ts      # Lee :id de ActivatedRoute, busca en mapa de datos dummy
│   ├── group-detail.page.html
│   └── group-detail.page.scss
├── tabs/                         # Shell de tabs (post-login)
│   ├── tabs.page.html            # Tab bar: Explorar / Mis grupos / Perfil
│   └── tabs.page.scss
├── my-groups/                    # Pantalla "Mis grupos" (listado tipo WhatsApp)
│   ├── my-groups-routing.module.ts
│   ├── my-groups.module.ts
│   ├── my-groups.page.ts         # byRole() → createdGroups / adminGroups / memberGroups; búsqueda por sección
│   ├── my-groups.page.html
│   └── my-groups.page.scss
├── profile/                      # Pantalla de perfil del usuario
│   ├── profile-routing.module.ts
│   ├── profile.module.ts
│   ├── profile.page.ts           # heroGradient, settingsSections, signOut()
│   ├── profile.page.html
│   └── profile.page.scss
└── app-routing.module.ts         # Ruta raíz → /auth/login
```

## Enrutamiento
- `/` → redirige a `/auth`
- `/auth/login` → LoginPage
- `/auth/register` → RegisterPage
- `/tabs/discovery` → DiscoveryPage (tab principal, swipe de grupos)
- `/tabs/my-groups` → MyGroupsPage (listado de grupos con chat)
- `/tabs/profile` → ProfilePage (perfil del usuario, ajustes, cerrar sesión)
- `/group-chat/:id` → GroupChatPage (chat del grupo; header clickeable navega a detalle)
- `/group-detail/:id` → GroupDetailPage (pantalla completa, fuera del shell de tabs)

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

## Backend
- Ubicación: `/Users/vicenteabsehidalgo/Documents/Proyectos personales/tribu-backend`
- Framework: Spring Boot (Java)
- Enums que deben coincidir exactamente con el backend (ya tipados en `src/app/dtos/api.dto.ts`):
  - `GroupCategory`: `DEPORTES | ARTE | CULTURA | TECNOLOGIA | MUSICA | GASTRONOMIA`
  - `GenderPreference`: `MIXED | MEN_ONLY | WOMEN_ONLY`
  - `JoinPolicy`: `OPEN | APPROVAL_REQUIRED`

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
