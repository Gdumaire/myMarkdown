
# Use the official Node.js image as the base image
FROM node:slim as base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN npm install -g corepack --force
RUN corepack enable && corepack prepare pnpm@latest --activate

FROM base AS build
COPY . /usr/src/app
WORKDIR /usr/src/app
RUN pwd && ls -la
RUN cat pnpm-workspace.yaml || true
RUN cat backend/package.json || true
RUN pnpm -v && node -v
RUN pnpm -w list --depth 0 || pnpm list --depth 0
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile
RUN pnpm run -r build
RUN pnpm deploy --filter=my-markdown --prod /prod/backend
RUN ls -La /prod/backend


FROM base AS backend
COPY --from=build /prod/backend /prod/backend
WORKDIR /prod/backend
EXPOSE 3000
CMD [ "pnpm", "start" ]
