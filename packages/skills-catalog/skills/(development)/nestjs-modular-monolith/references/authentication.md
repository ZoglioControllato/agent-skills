# Autenticação

## Índice

1. Opção A: Passaporte + JWT (linha ~15)
2. Opção B: Better Auth (linha ~120)
3. Escolhendo entre opções (linha ~230)

---

## 1. Opção A: Passaporte + JWT

O padrão de autenticação mais estabelecido no ecossistema NestJS. Melhor para equipes já familiarizadas com estratégias Passport e fluxos JWT padrão.

### Estratégia JWT```typescript

// libs/identity/infrastructure/strategies/jwt.strategy.ts
import { Injectable } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy } from 'passport-jwt'
import { ConfigService } from '@nestjs/config'

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
constructor(private config: ConfigService) {
super({
jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
ignoreExpiration: false,
secretOrKey: config.getOrThrow('JWT_SECRET'),
})
}

async validate(payload: { sub: string; email: string; role: string }) {
return { userId: payload.sub, email: payload.email, role: payload.role }
}
}

````
### Autenticação Guarda```typescript
// libs/shared/infrastructure/guards/jwt-auth.guard.ts
import { Injectable, ExecutionContext, UnauthorizedException } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { Reflector } from '@nestjs/core'
import { IS_PUBLIC_KEY } from '../decorators/public.decorator'

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super()
  }

  canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ])
    if (isPublic) return true
    return super.canActivate(context)
  }

  handleRequest(err: unknown, user: unknown) {
    if (err || !user) {
      throw err || new UnauthorizedException('Invalid or missing token')
    }
    return user
  }
}
````

### Decoradores```typescript

// libs/shared/infrastructure/decorators/public.decorator.ts
import { SetMetadata } from '@nestjs/common'

export const IS_PUBLIC_KEY = 'isPublic'
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true)

// libs/shared/infrastructure/decorators/roles.decorator.ts
export const ROLES_KEY = 'roles'
export const Roles = (...roles: string[]) => SetMetadata(ROLES_KEY, roles)

````
### Funções Guarda```typescript
// libs/shared/infrastructure/guards/roles.guard.ts
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ])
    if (!requiredRoles) return true

    const { user } = context.switchToHttp().getRequest()
    return requiredRoles.includes(user.role)
  }
}
````

### Configuração do módulo de autenticação```typescript

// libs/identity/identity.module.ts
@Module({
imports: [
PassportModule.register({ defaultStrategy: 'jwt' }),
JwtModule.registerAsync({
inject: [ConfigService],
useFactory: (config: ConfigService) => ({
secret: config.getOrThrow('JWT_SECRET'),
signOptions: { expiresIn: '15m' },
}),
}),
],
providers: [AuthService, JwtStrategy],
exports: [AuthService],
})
export class IdentityModule {}

````
### Aplicar proteções globalmente```typescript
// apps/api/src/app.module.ts
@Module({
  providers: [
    { provide: APP_GUARD, useClass: JwtAuthGuard },
    { provide: APP_GUARD, useClass: RolesGuard },
  ],
})
export class AppModule {}
````

### Uso em controladores```typescript

@Controller('billing/plans')
@UseGuards(JwtAuthGuard, RolesGuard)
export class BillingPlanController {
@Post()
@Roles('admin')
create(@Body() dto: CreateBillingPlanDto) {
/_ ... _/
}

@Get()
@Public()
findAll() {
/_ ... _/
}
}

````
---

## 2. Opção B: Melhor autenticação

Uma biblioteca de autenticação moderna e independente de estrutura para TypeScript com um ecossistema de plugins. Bom para equipes que desejam uma solução de autenticação com baterias incluídas e com menos clichês. Usa o pacote `@thallesp/nestjs-better-auth` para integração NestJS.

### Melhor instância de autenticação```typescript
// libs/identity/infrastructure/auth/auth.config.ts
import { betterAuth } from 'better-auth'
import { Pool } from 'pg'

export const auth = betterAuth({
  database: new Pool({
    connectionString: process.env.DATABASE_URL,
  }),
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
    minPasswordLength: 8,
    maxPasswordLength: 128,
    sendResetPassword: async ({ user, url, token }) => {
      // Implement password reset email
    },
  },
  emailVerification: {
    sendVerificationEmail: async ({ user, url }) => {
      // Implement verification email
    },
  },
  session: {
    expiresIn: 604800, // 7 days
    updateAge: 86400, // 1 day (refresh window)
    cookieCache: {
      enabled: true,
      maxAge: 300, // 5 min cache
    },
  },
})
````

### Provedores sociais (opcional)```typescript

// libs/identity/infrastructure/auth/auth.config.ts
export const auth = betterAuth({
// ...base config above
socialProviders: {
google: {
clientId: process.env.GOOGLE_CLIENT_ID!,
clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
},
github: {
clientId: process.env.GITHUB_CLIENT_ID!,
clientSecret: process.env.GITHUB_CLIENT_SECRET!,
},
},
})

````
### Integração do módulo NestJS```typescript
// libs/identity/identity.module.ts
import { Module } from '@nestjs/common'
import { AuthModule } from '@thallesp/nestjs-better-auth'
import { auth } from './infrastructure/auth/auth.config'

@Module({
  imports: [AuthModule.forRoot({ auth })],
  exports: [AuthModule],
})
export class IdentityModule {}

// apps/api/src/app.module.ts
import { Module } from '@nestjs/common'
import { IdentityModule } from '@project/identity'

@Module({
  imports: [IdentityModule],
})
export class AppModule {}
````

### Proteção de rota com melhor autenticação

A integração NestJS do Better Auth registra um `AuthGuard` globalmente por padrão. Todas as rotas são protegidas, a menos que sejam explicitamente canceladas.```typescript
import { Controller, Get } from '@nestjs/common'
import { Session, UserSession, AllowAnonymous, OptionalAuth } from '@thallesp/nestjs-better-auth'

@Controller('billing/plans')
export class BillingPlanController {
// Protected route — session is guaranteed
@Get('me')
async getMyPlans(@Session() session: UserSession) {
return this.planService.findByUser(session.user.id)
}

// Public route — no auth required
@Get('public')
@AllowAnonymous()
async getPublicPlans() {
return this.planService.findPublic()
}

// Optional auth — session may be null
@Get('featured')
@OptionalAuth()
async getFeatured(@Session() session: UserSession | null) {
const plans = await this.planService.findFeatured()
return { plans, isAuthenticated: !!session }
}
}

````
### Melhor autenticação com plug-ins

Better Auth oferece suporte a plug-ins para funcionalidade estendida:```typescript
import { betterAuth } from 'better-auth'
import { admin, twoFactor } from 'better-auth/plugins'

export const auth = betterAuth({
  // ...base config
  plugins: [
    admin(), // Admin dashboard capabilities
    twoFactor(), // Two-factor authentication
  ],
})
````

---

## 3. Escolhendo entre opções

| Critérios             | Passaporte/JWT                       | Melhor autenticação               |
| --------------------- | ------------------------------------ | --------------------------------- |
| **Maturidade**        | Testado em batalha, anos em produção | Ecossistema mais novo e crescente |
| **Integração NestJS** | Nativo, primário                     |

| Adaptador de terceiros (`@thallesp/nestjs-better-auth`) |
| **Complexidade de configuração** | Mais clichê, mais controle | Menos clichê, baseado em convenções |
| **Login social** | Via passaporte-google, passaporte-github, etc. | Configuração de provedores sociais integrados |
| **Gerenciamento de sessões** | Manual (tokens JWT) | Integrado com cache de cookies

|
| **2FA / Administrador** | Requer implementação personalizada | Baseado em plug-in (uma linha) |
| **Lógica personalizada** | Controle total sobre cada etapa | Ganchos e manipuladores personalizados |
| **Banco de dados** | Você gerencia tabelas de usuários/sessões | Gerencia automaticamente tabelas de autenticação |
| **Agilize a compatibilidade** | Requer `

Adaptador @nestjs/platform-fastify` | Funciona com ambos os adaptadores |

**Recomendação:** use **Passport/JWT** quando precisar de controle total, tiver infraestrutura de autenticação existente ou a equipe já estiver confortável com as estratégias do Passport. Use **Better Auth** quando desejar configuração rápida, recursos integrados (login social, 2FA, sessões) e preferir convenção em vez de configuração.

### Referência Rápida — Comparação de Decoradores

| Ação          | Passaporte/JWT              | Melhor autenticação                |
| ------------- | --------------------------- | ---------------------------------- |
| Proteger rota | `@UseGuards(JwtAuthGuard)`  | Automático (guarda global)         |
| Via pública   | `@Público()`                | `@AllowAnonymous()`                |
| Obter usuário | `@Request() req → req.user` | `@Session() sessão → session.user` |
| Exigir função | `@                          |

Funções('admin')`| Guarda personalizada ou plugin |
| Autenticação opcional | Guarda personalizada |`@OptionalAuth()` |
