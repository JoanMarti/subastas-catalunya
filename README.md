# Radar de Subastas · Catalunya

Web para seguir inmuebles de subastas públicas (BOE judicial y notarial, Hacienda, Seguridad Social) y de bancos/servicers en Catalunya: guardarlos, situarlos en el mapa, valorar reforma y riesgo, y estimar la rentabilidad del alquiler o de la venta.

**Demo:** https://joanmarti.github.io/subastas-catalunya/

## Funciones (v0.1)

- Ficha de inmueble: tipo, origen, entidad, referencia, fecha de cierre, estado del proceso.
- Enlace directo a la subasta y enlace secundario (anuncio, catastro…).
- Contactos por inmueble (juzgado, administrador concursal, servicer, agente…).
- Mapa de Catalunya (947 municipios, 4 provincias) con chinchetas coloreadas por riesgo.
- Filtros por provincia, riesgo, precio y estado; orden por cierre, rentabilidad, margen, descuento o riesgo.
- Cálculo de inversión total: puja, ITP catalán por tramos (10/11/12/13 %, 20 % gran tenedor), gastos, reforma por €/m², desalojo, cargas y deudas.
- Rentabilidad bruta y neta, beneficio neto mensual y margen de reforma + venta.
- Puntuación de riesgo 0–100 con sus factores.
- Exportar a JSON / CSV e importar JSON.

## Dónde se guardan los datos

| Dónde se abre | Almacenamiento | Valoración con Claude |
|---|---|---|
| GitHub Pages | `localStorage` del navegador (solo ese navegador) | No disponible |
| Artifact en claude.ai | Base de datos privada por usuario | Sí |

Usa *Exportar → Copiar JSON* para pasar datos entre los dos.

## Estructura

```
index.html            App completa (HTML + CSS + JS, sin build)
catalunya.json        Mapa: provincias, límites municipales y centroides de municipios
scripts/prep-map.mjs  Genera catalunya.json a partir de es-atlas (INE)
```

Regenerar el mapa: `npm install && npm run map`. Servir en local: `npm run dev`.

## Hoja de ruta

1. **Búsqueda automática en el BOE**: tarea diaria (GitHub Actions) que lee el Portal de Subastas para las provincias 08, 17, 25 y 43 y publica un `subastas.json`; la web las muestra como “nuevas” para guardarlas con un clic.
2. **Servicers**: importar fichas de Solvia, Altamira, Aliseda, Servihabitat desde su URL.
3. **Multiusuario**: backend con autenticación y base de datos (p. ej. Supabase/Postgres), alertas por email de subastas que cumplan tus filtros.
4. **Mejores valoraciones**: precios €/m² de venta y alquiler por municipio con datos públicos, comarcas y zonas tensionadas.

> Los cálculos de impuestos y riesgo son orientativos. Revisa siempre el edicto, la certificación de cargas y la fiscalidad con un profesional antes de pujar.
