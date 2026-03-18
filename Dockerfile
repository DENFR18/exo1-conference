# ─────────────────────────────────────────
# Stage 1 : Installation des dépendances
# ─────────────────────────────────────────
FROM node:20-alpine AS deps
WORKDIR /app

# Copier uniquement les fichiers de dépendances d'abord
# → exploite le cache Docker : si package.json n'a pas changé,
#   cette couche n'est pas reconstruite
COPY package*.json ./
RUN npm ci --omit=dev

# ─────────────────────────────────────────
# Stage 2 : Runtime (image finale légère)
# ─────────────────────────────────────────
FROM node:20-alpine AS runtime
WORKDIR /app

# Sécurité : créer un utilisateur non-root
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

# Copier les dépendances installées depuis le stage précédent
COPY --from=deps /app/node_modules ./node_modules

# Copier le code source
COPY src/ ./src/

# Indiquer que l'app tourne dans un conteneur
ENV NODE_ENV=production
ENV CONTAINERIZED=true
ENV PORT=3000

# Passer à l'utilisateur non-root
USER appuser

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget -qO- http://localhost:3000/health || exit 1

CMD ["node", "src/index.js"]
