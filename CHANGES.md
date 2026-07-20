# Mycraft Network Stats - Diseno Final de Implementacion

## 1. Estado del documento

Este documento formaliza el diseno aprobado para renovar Mycraft Network Stats. Reemplaza las propuestas preliminares discutidas durante el analisis y constituye la referencia funcional y tecnica para la implementacion.

Objetivos del proyecto:

- Recuperar el funcionamiento del sitio eliminando la dependencia de las APIs anteriores.
- Consultar directamente las bases MariaDB existentes, sin modificar sus tablas.
- Convertir el sitio en una experiencia competitiva centrada en jugadores, temporadas y clanes.
- Modernizar completamente el diseno, la experiencia responsive y las animaciones.
- Proteger la base de datos mediante SSR cacheado, consultas limitadas y acceso de solo lectura.
- Preparar Survival 26.2 (`smp`) como una modalidad independiente que se incorporara proximamente.

## 2. Alcance aprobado

### RPG

RPG Temporada III sera la modalidad activa. Incluira:

- Rankings de jugadores.
- Perfiles competitivos de jugadores.
- Rankings y perfiles de clanes.
- Estadisticas de combate, KOTH y duelos.
- Skins configuradas mediante SkinRestorer.
- Rangos LuckPerms representados con un sistema visual propio para web.

### Survival 26.2

Survival 26.2 aparecera en la seleccion inicial con estado `En construccion` o `Proximamente`.

- No mostrara rankings ni informacion simulada.
- Tendra identidad visual y descripcion propias.
- No reutilizara forzosamente el modelo de RPG.
- Se implementara posteriormente con schemas, repositories, metricas y perfiles propios.
- Compartira solo capacidades transversales como identidad, rangos, skins, cache y componentes visuales.

La pagina inicial mantendra la seleccion de modalidad. RPG mostrara su estado activo y la identidad `Temporada III`; Survival 26.2 comunicara claramente su proximo lanzamiento.

## 3. Restricciones de datos

- Las bases y tablas pertenecen a plugins en produccion.
- La aplicacion no creara, modificara ni eliminara tablas, columnas, relaciones o datos.
- Drizzle se utilizara como query builder tipado, no como administrador de migraciones.
- No se habilitaran comandos `push`, `migrate` ni equivalentes contra produccion.
- Los datos son eventualmente consistentes porque distintos plugins escriben de forma independiente.
- Una seccion sin registros no debe interpretarse como un fallo de toda la pagina.
- Las coordenadas de bases, cofres, inventarios, permisos internos y datos sensibles nunca se expondran.

## 4. Fuentes de datos RPG

| Dominio | Tablas principales | Uso |
| --- | --- | --- |
| Identidad y rangos | `luckperms_players`, `luckperms_user_permissions`, `luckperms_group_permissions` | UUID, nickname, grupos, herencia, pesos y rangos activos |
| Combate | `DELUXECOMBAT_PLAYERLIST`, `DELUXECOMBAT_STATS` | Kills, deaths, streak, max streak y combat logs |
| Leaderboards | Tablas `ajlb_*` | Valores acumulados y deltas diarios/semanales |
| KOTH | `ajlb_zkothdata_total_wins`, `koth_players`, `koth_stats`, `koth_wins` | Victorias totales, mapas y actividad registrada |
| Duelos | `duels_player_table`, `history_records_table`, `ranking_score_table` | Partidas, resultados, modos, mapas y rachas |
| Clanes | `clans`, `players`, `clans_allies` | Identidad, miembros, aportes, estadisticas y alianzas |
| Skins | `sr_players`, `sr_player_skins`, `sr_url_skins` | Skin seleccionada y textura renderizable |

Decisiones derivadas de las muestras:

- Los UUID utilizados por las fuentes relevantes se encuentran en formato dashed.
- `history_records_table.Status = 1` representa victoria y `Status = -1` derrota.
- `ModeId` representa el modo de duelo, `ArenaId` el mapa y `MatchType` el tipo de partida.
- `LastTimePlayed` y `OtherStats` deben tratarse como JSON defensivo.
- En clanes, `players.ranks = 2` representa lider y `0` miembro. El valor `1` se mostrara como rol elevado una vez definido su nombre publico en el catalogo.
- Las kills y deaths agregadas de los clanes coinciden con las contribuciones de sus miembros en las muestras.
- `pvp`, `exp`, `bank_balance` y `ranking_score_table` todavia no aportan actividad competitiva suficiente.

## 5. Arquitectura de aplicacion

La aplicacion continuara en Astro con el adaptador de Vercel y salida server. No se creara una API publica o servicio intermedio.

Estructura objetivo:

```text
src/
  db/
    clients.ts
    schema/
      rpg.ts
      skins.ts
  modules/
    game-modes/
      registry.ts
    players/
      player.repository.ts
      player.service.ts
      player.types.ts
    rankings/
      ranking.repository.ts
      ranking.service.ts
      ranking.types.ts
    clans/
      clan.repository.ts
      clan.service.ts
      clan.types.ts
    ranks/
      rank.repository.ts
      rank.service.ts
      rank-catalog.ts
    skins/
      skin.repository.ts
      skin.service.ts
      texture-parser.ts
  components/
  pages/
```

Responsabilidades:

- Los schemas Drizzle reflejan solamente las tablas consumidas.
- Los repositories son la unica capa que conoce Drizzle y MariaDB.
- Los services combinan fuentes, normalizan valores y aplican reglas de producto.
- Los componentes reciben modelos listos para presentar y nunca ejecutan SQL.
- El registro de modalidades declara estado y capacidades sin asumir que RPG y SMP comparten estructura.
- Las metricas y tablas seleccionables provienen de mapas cerrados, nunca de parametros SQL proporcionados por usuarios.

## 6. Conexiones y seguridad

Se utilizaran `drizzle-orm` y `mysql2` con dos clientes logicos, uno para RPG y otro para SkinRestorer.

Configuracion base:

- `RPG_DATABASE_URL` y `SKINS_DATABASE_URL` como secretos server-only.
- Pool RPG con un maximo inicial de 2 conexiones por instancia caliente.
- Pool de skins con un maximo inicial de 1 conexion por instancia caliente.
- Pools creados a nivel de modulo para reutilizar instancias calientes.
- Timeout corto de conexion y consulta, cola limitada y errores observables.
- `max_statement_time = 5` por sesion MariaDB para cancelar realmente sentencias lentas; el timeout de `mysql2` se conserva como segunda barrera cliente.
- Las consultas internas se secuencian o agrupan con una concurrencia maxima acorde al pool; no se aumenta el pool para compensar fan-out.
- Usuario MariaDB exclusivo con permisos `SELECT` sobre las tablas aprobadas.
- TLS cuando este disponible en el servidor.
- Sin credenciales, propiedades Base64, firmas o SQL sensible en logs y Sentry.
- Vercel permanece como plataforma; Static IPs no es un requisito para este proyecto.

## 7. Renderizado y cache

Las paginas de datos seran SSR completas. Se eliminara el uso de `server:defer` para leaderboards y perfiles.

Se utilizara Vercel ISR con una expiracion inicial de 15 minutos:

```ts
adapter: vercel({
  isr: {
    expiration: 60 * 15,
  },
});
```

Comportamiento esperado:

- La primera solicitud de cada URL consulta MariaDB y genera el HTML.
- Las siguientes solicitudes reciben el resultado cacheado sin ejecutar la funcion.
- Al vencer, Vercel puede servir contenido stale mientras regenera la pagina.
- Si la regeneracion falla, se conserva el ultimo contenido valido disponible.
- Cada ranking, jugador y clan se cachea naturalmente por ruta.
- Los 404 validos tendran cache corta y los fallos de infraestructura nunca se convertiran en rankings vacios.

No se incorporaran inicialmente Redis, Vercel Runtime Cache ni cron jobs. El middleware dejara de imponer `s-maxage=30` globalmente para no competir con ISR. Como excepcion deliberada de baja cardinalidad, el grafo global de rangos LuckPerms se reutiliza durante 60 segundos por instancia caliente y deduplica cargas simultaneas; ISR sigue siendo la cache durable de paginas.

La configuracion generada por `@astrojs/vercel` debe verificarse en cada actualizacion mayor del adaptador. Para la version actual, el artefacto confirma `expiration: 900` y limita `allowQuery` a los parametros internos de Astro, por lo que query strings arbitrarios no crean variantes de ISR.

ISR no constituye proteccion suficiente contra paths dinamicos siempre nuevos. Vercel Firewall aplicara rate limiting antes de la funcion sobre `/player/*` y perfiles de clan, primero en modo `Log` y luego con respuesta `429` una vez medido el trafico legitimo. La proteccion DDoS automatica no sustituye esta regla contra abuso de aplicacion.

## 8. Rankings de jugadores

Rankings iniciales aprobados:

- Kills.
- Mejor racha.
- Victorias KOTH.

Metricas eliminadas:

- K/D, porque los datos actuales no son fiables y la metrica incentiva muestras pequenas o juego defensivo.
- ELO/points, porque ya no forma parte del producto actual.
- Nivel de jugador, porque no aporta al enfoque competitivo definido.

Reglas:

- Los empates compartiran posicion mediante `DENSE_RANK()`.
- El valor total representara la temporada.
- Los deltas diarios y semanales podran habilitar rankings de actividad cuando tengan datos significativos.
- `daily_delta` y `weekly_delta` se describiran como variacion del valor, no como cambio de posicion.
- Se mostrara la distancia respecto al competidor o puesto inmediatamente superior cuando sea calculable.
- Las consultas y resoluciones de rangos y skins se ejecutaran en batch, sin patron N+1.

## 9. Perfiles de jugadores

El perfil sera una identidad competitiva global con informacion RPG y preparado para futuras secciones por modalidad.

Contenido RPG:

- Nickname canonico y rango web dominante.
- Skin seleccionada.
- Clan actual, rol y enlace al perfil del clan.
- Posicion en kills, mejor racha y KOTH.
- Distancia respecto al siguiente competidor.
- Kills, deaths, streak actual, max streak y combat logs.
- Victorias KOTH totales y por mapa cuando existan.
- Duelos totales, victorias, derrotas, win rate, kills y deaths.
- Rendimiento y ultima actividad por modo de duelo.
- Rachas de duelos obtenidas desde `OtherStats`.
- Contribucion al clan.
- Reconocimientos dinamicos como top 10 o lider de una categoria.

No se mostrara una falsa ultima conexion global. `koth_players.last_seen` solo puede etiquetarse como actividad registrada en KOTH.

## 10. Clanes

Los clanes son una seccion principal del producto RPG.

### Leaderboard

- El ranking inicial sera por kills.
- El nivel se mostrara como progreso secundario.
- PvP y experiencia se habilitaran como rankings cuando contengan actividad real.
- No se creara un power score opaco o ponderado artificialmente.

### Perfil del clan

- Nombre, prefijo, lider y privacidad.
- Miembros actuales, capacidad y ocupacion.
- Kills, deaths, nivel y futuras metricas activas.
- Posiciones del clan por criterio disponible.
- Lista de miembros con rango web, skin, rol, kills, deaths y aporte porcentual.
- Principal contribuidor y distribucion del aporte.
- Comparacion con el clan inmediatamente superior.
- Alianzas registradas.
- Explicacion transparente de por que ocupa su posicion.

No se mostraran coordenadas de `clans_bases`, contenido de `chest`, inventarios ni movimientos bancarios internos. Las estadisticas historicas personales no se atribuiran retroactivamente al clan actual.

## 11. Sistema de rangos web

Cada aparicion visual de un nickname utilizara el rango dominante del jugador.

Resolucion:

1. Obtener `primary_group`.
2. Obtener asignaciones activas `group.*` del usuario.
3. Ignorar nodos negados, expirados o fuera del contexto RPG.
4. Resolver herencia entre grupos.
5. Obtener `weight.N` de los grupos candidatos.
6. Seleccionar el grupo con mayor peso.
7. En empate, priorizar `primary_group` y luego un desempate estable del catalogo web.

La seleccion depende de LuckPerms; la presentacion depende de un catalogo web central:

```ts
interface WebRank {
  id: string;
  label: string;
  shortLabel: string;
  category: "player" | "donor" | "creator" | "staff" | "special";
  theme: string;
  icon?: string;
}
```

El catalogo traducira nombres internos y prefijos heredados a identidades publicas coherentes. Ejemplos confirmados: `elite` se presenta como Deluxe, `mvp+` como Ultra, `titan` como Titanium y `ayudante` como Helper. Los codigos Minecraft `&` no se renderizaran directamente.

Un componente compartido `PlayerIdentity` sera obligatorio en leaderboards, podios, perfiles, miembros de clanes, contribuidores y resultados de busqueda. Mostrara una insignia compacta en listas y una variante destacada en perfiles. Los rangos secundarios, si se muestran, quedaran limitados al detalle del perfil.

## 12. Skins

Alcance aprobado:

- Resolver skins `PLAYER` y `URL`.
- `CUSTOM` queda fuera porque no representa una necesidad actual.
- Si aparece un tipo no soportado o falta su referencia, se utiliza una skin fallback sin romper la pagina.

Flujo:

1. Consultar `sr_players` por UUID.
2. Para `PLAYER`, resolver el UUID de skin seleccionado y su propiedad almacenada cuando este disponible.
3. Para `URL`, consultar `sr_url_skins` usando URL y variante aplicable.
4. Decodificar `value` Base64 exclusivamente en servidor.
5. Validar el JSON y extraer el texture hash de `textures.minecraft.net`.
6. Enviar al navegador solo el identificador renderizable, nunca `value` ni `signature`.
7. Usar un proveedor compatible con texture IDs, con fallback determinista ante datos invalidos o faltantes.

## 13. Rutas y compatibilidad

Rutas RPG principales:

```text
/
/ranking/rpg/kills
/ranking/rpg/maxstreak
/ranking/rpg/koth
/player/[identifier]
/rpg/clans
/rpg/clans/[id]
```

SMP tendra una ruta informativa estable mientras permanezca en construccion. Las rutas anteriores de RPG se conservaran o redirigiran permanentemente. Las URLs historicas de clan con slug redirigiran por ID sin consultar MariaDB; el slug deja de formar parte de la identidad cacheable para impedir cardinalidad arbitraria. Las metricas retiradas redirigiran al indice valido de rankings en lugar de mostrar paginas vacias.

Los parametros de jugadores aceptaran nickname o UUID validos. Los perfiles resolveran el nickname canonico para reducir duplicacion de cache por diferencias de mayusculas.

## 14. Experiencia visual y animaciones

Direccion visual: centro competitivo de temporada, no dashboard corporativo generico.

- Fondo oscuro profundo y contraste alto.
- Identidad visible de modalidad y temporada.
- Oro, plata y bronce reservados para posiciones destacadas.
- Podios compactos y tablas competitivas densas en escritorio.
- Filas adaptadas a tarjetas horizontales en movil.
- Skins y rangos como elementos centrales de identidad.
- Estados de vacio, no encontrado y servicio no disponible claramente diferenciados.

## 15. Errores y observabilidad

Los servicios distinguiran explicitamente:

```ts
type DataResult<T> =
  | { status: "ok"; data: T }
  | { status: "not-found" }
  | { status: "unavailable"; reason: string };
```

- `not-found` genera una experiencia 404 real.
- `unavailable` genera estado degradado o 503, nunca una lista vacia falsa.
- Un fallo de SkinRestorer conserva el perfil con skin fallback.
- La ausencia legitima de datos KOTH o duelos solo vacia esa seccion.
- Sentry registrara operacion, fuente, duracion y tipo de error sin datos sensibles.
- Se mediran consultas lentas, errores de parseo, regeneraciones y agotamiento de pools.

## 16. Estrategia de implementacion

1. Configurar conexiones read-only, schemas Drizzle e ISR.
2. Implementar repositories y contratos `DataResult`.
3. Implementar identidad canonica, resolucion batch de rangos y `PlayerIdentity`.
4. Implementar resolucion de skins y fallback.
5. Migrar rankings RPG a SSR completo.
6. Implementar perfil competitivo del jugador y duelos.
7. Implementar leaderboard, perfil y anatomia de clanes.
8. Renovar la seleccion de modalidad con Survival 26.2 en construccion.
9. Aplicar el nuevo sistema visual, responsive y de animaciones.
10. Retirar servicios y variables de las APIs antiguas.
11. Agregar pruebas, observabilidad y validacion de carga.

## 17. Validacion y criterios de aceptacion

El bloque se considerara terminado cuando:

- No exista consumo de las APIs anteriores.
- Rankings y perfiles se rendericen completamente por SSR con ISR de 15 minutos.
- La aplicacion solo pueda ejecutar `SELECT`.
- Ningun secreto, Base64 o firma de skin llegue al cliente.
- Los rankings de kills, max streak y KOTH funcionen con empates correctos.
- Los rangos activos y de mayor peso aparezcan consistentemente junto a cada nickname.
- Los perfiles de jugadores integren combate, KOTH, duelos, clan y skin sin N+1.
- Los clanes muestren ranking, perfil, miembros y contribuciones verificables.
- Survival 26.2 aparezca como modalidad en construccion sin datos ficticios.
- Un fallo de una fuente produzca degradacion explicita y no informacion enganosa.
- ISR reduzca las consultas repetidas y conserve contenido stale ante fallos de regeneracion.
- No se expongan bases, cofres, inventarios ni informacion sensible.
- La experiencia sea funcional y legible en escritorio y movil.
- Se respeten accesibilidad y reduccion de movimiento.
- Pasen build, pruebas unitarias, integracion, E2E y una prueba de carga controlada.
