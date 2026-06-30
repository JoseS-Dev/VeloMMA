FROM node:22.15-alpine

# 1. Corrección de typo: --no-cache
RUN apk add --no-cache openssl libc6-compat

# 2. Configuración oficial de Corepack y PNPM
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable && corepack prepare pnpm@latest --activate

RUN pnpm config set store-dir /pnpm/store

WORKDIR /app

# 3. Copiamos los archivos de configuración de dependencias
COPY package.json pnpm-lock.yaml* ./
COPY prisma ./prisma/

# 4. Instalamos dependencias y generamos el cliente de Prisma de una vez
RUN pnpm install --frozen-lockfile
RUN pnpm prisma generate

# 5. Copiamos el resto del código fuente
COPY . .

EXPOSE 5300

# 6. Ejecución
CMD ["pnpm", "dev"]