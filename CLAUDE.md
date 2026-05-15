# CLAUDE.md — tribu-frontend (Trivy)

App social móvil para encontrar y unirse a grupos con intereses en común. Nombre de la app: **Trivy**.

## Stack

- **Ionic 8 + Angular 20**, NgModule-based (NO standalone components)
- **Formularios:** Reactive Forms (`ReactiveFormsModule`)
- **Navegación:** Angular Router con lazy loading por módulo
- **Plataforma nativa:** Capacitor 8

## Comandos

```bash
ionic serve          # Dev server en localhost
ionic build          # Build de producción
```

## Regla crítica de arquitectura

Siempre NgModule. Los componentes **nunca** tienen `standalone: true`. Cada página tiene:
- `*.page.ts` + `*.page.html` + `*.page.scss`
- `*.module.ts` — declara el componente e importa `IonicModule`, `CommonModule`, etc.
- `*-routing.module.ts` — define la ruta del módulo

## Backend

- Ubicación: `/Users/vicenteabsehidalgo/Documents/Proyectos personales/tribu-backend`
- URL local: `http://localhost:8080`
- Configuración en `src/environments/environment.ts` → `apiUrl`
- Todos los calls pasan por `src/app/services/api.service.ts`
- DTOs centralizados en `src/app/dtos/api.dto.ts`

## Autenticación

- JWT guardado en `AuthService` (`src/app/services/auth.service.ts`)
- `AuthInterceptor` agrega el header `Authorization: Bearer <token>` a cada request
- Login → `/auth/login`, Registro → `/auth/register`
- Al cerrar sesión se limpia el token y se navega a `/auth/login` con `replaceUrl: true`

## Enrutamiento

```
/                   → redirige a /auth/login
/auth/login         → LoginPage
/auth/register      → RegisterPage

/tabs/discovery     → DiscoveryPage      (tab 1 — swipe de grupos)
/tabs/my-groups     → MyGroupsPage       (tab 2 — listado estilo WhatsApp)
/tabs/profile       → ProfilePage        (tab 3 — perfil y ajustes)
/tabs/profile/edit-profile → EditProfilePage

/group-chat/:id     → GroupChatPage      (fuera de tabs)
/group-detail/:id   → GroupDetailPage    (fuera de tabs)
/group-admin/:id    → GroupAdminPage     (fuera de tabs)
/create-group       → CreateGroupPage    (fuera de tabs)
/change-password    → ChangePasswordPage (fuera de tabs)
/report-problem     → ReportProblemPage  (fuera de tabs)
```

## Páginas y estado actual

| Página | Estado | Notas |
|---|---|---|
| LoginPage | Conectada | JWT guardado en AuthService |
| RegisterPage | Conectada | Incluye género y fecha de nacimiento |
| DiscoveryPage | Conectada | Swipe gestual (GestureController); filtra por ubicación y categoría |
| MyGroupsPage | Conectada | Usa `getMyGroups()`; muestra imagen de portada si existe |
| GroupChatPage | Conectada | Skeleton durante carga; imagen en header; `sendMessage()` real |
| GroupDetailPage | Conectada | Hero con imagen de portada; botón admin para OWNER/ADMIN |
| GroupAdminPage | Conectada | Carga perfil propio para determinar myRole (OWNER vs ADMIN) |
| ProfilePage | Conectada | Upload de avatar con file picker → base64 |
| EditProfilePage | Conectada | Nombre, descripción, radio de búsqueda |
| CreateGroupPage | Conectada | Incluye joinPolicy, categoría, geolocalización |
| ChangePasswordPage | Conectada | Muestra error si contraseña actual es incorrecta |
| ReportProblemPage | Conectada | Envía a `/support/reports` |

## Sistema de roles

`OWNER > ADMIN > MEMBER` (tipado en `api.dto.ts` como `GroupMemberRole`)

- **OWNER:** creador del grupo. Puede promover/degradar admins, expulsar/silenciar a todos
- **ADMIN:** puede crear eventos, gestionar join requests, expulsar/silenciar MEMBERs
- **MEMBER:** solo chat

En el frontend, `isAdmin` siempre incluye tanto OWNER como ADMIN:
```typescript
this.isAdmin = myMembership?.role === 'ADMIN' || myMembership?.role === 'OWNER';
```

En `my-groups` y `group-admin`, OWNER y ADMIN se muestran en la sección "Grupos que administro".

## Imágenes (base64)

Las imágenes se envían y reciben como strings base64. Patrón para mostrar:
```html
<img [src]="'data:image/jpeg;base64,' + imageBase64" />
```

Patrón para subir (file picker → base64):
```typescript
const reader = new FileReader();
reader.onload = () => {
  const base64 = (reader.result as string).split(',')[1];
  // llamar API con base64
};
reader.readAsDataURL(file);
```

Imágenes en uso:
- `UserProfile.avatarBase64` → avatar circular en ProfilePage
- `GroupDetail.coverImageBase64` / `GroupDiscovery.coverImageBase64` / `GroupSummary.coverImageBase64` → portada del grupo en chat header, my-groups, group-detail hero

## Skeleton loading

Patrón usado en GroupChatPage (y recomendado en general): siempre renderizar el `ion-header` para que la animación de navegación tenga algo sobre lo que animar. Usar `isLoading` para mostrar skeletons en el contenido mientras llega la API.

```typescript
isLoading = true;
// en .then(): isLoading = false;
```

## Convenciones

- Templates: nueva sintaxis de control flow Angular (`@if`, `@for`, en lugar de `*ngIf`, `*ngFor`)
- UI en español
- SCSS por componente; variables globales en `src/theme/variables.scss`
- Sin comentarios salvo que el motivo sea no obvio
- `Promise.all()` para cargas paralelas de API en `ngOnInit` / `ionViewWillEnter`
- `ViewWillEnter` (no `OnInit`) cuando la página debe refrescar datos al volver atrás

## Variables de tema

En `src/theme/variables.scss`:
- `--trivy-purple: #6C63FF`
- `--trivy-pink: #FF6584`
- `--trivy-dark: #1a1a3e`
- Paleta de colores de grupos: `['#4ECDC4', '#FF6584', '#6C63FF', '#F7B731', '#A55EEA', '#FC5C65', '#26de81', '#45AAB8', '#f7797d']`
- Color de grupo se deriva como `GROUP_COLORS[group.id % GROUP_COLORS.length]`
