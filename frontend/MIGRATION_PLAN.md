MIGRATION PLAN — Issue #3: Zustand incremental migration

Objetivo
- Migrar el manejo de estado a una solución escalable (Zustand) de forma incremental, minimizando cambios y manteniendo la cobertura de tests.

Contracto pequeño
- Inputs: UI events (login, logout, cargar páginas de imágenes, acciones sobre imágenes).
- Outputs: estado compartido (user, images, page, loading, error) y acciones (login, logout, setImages, appendImages, setPage, setLoading, setError).
- Errores: errores de red y validación deben propagarse y quedar testeables.

Checklist (pasos mínimos, marcar al completar)
- [x] Crear rama `feat/issue-3-zustand-migration` y añadir `useAppStore.ts` (estado base).  
- [x] Añadir mejoras en CI y badge README (ya hecho).  
- [ ] Añadir este `MIGRATION_PLAN.md` a la rama (actual).  
- [ ] Migrar `useLoginForm` a `useAppStore.login` y añadir tests unitarios.  
- [ ] Migrar `useDashboard` para leer/escribir imágenes desde el store y añadir tests que verifiquen append/replace behavior.  
- [ ] Actualizar `Header` para leer `user` y `logout` desde el store; añadir test de integración simple.  
- [ ] Añadir persistencia opcional (localStorage) con rehidratación en el store (feature toggle).  
- [ ] Crear pruebas e2e mínimas (playwright or cypress) para login + dashboard pagination (opcional, siguiente PR).

Edge cases y decisiones técnicas
- Duplicados al montar componentes en React Strict Mode: siempre reemplazar lista cuando page === 1, y usar append sólo cuando page > 1.
- Respuestas de API no-JSON o errores 401: mantener la lógica de parseo seguro y propagar errores testables.
- Concurrency: bloquear `isLoading` por tipo de request (opcional si aparecen carreras de estado).

Pruebas recomendadas (mínimas)
- Unit: store actions (setUser, setImages, appendImages, login, logout).  
- Unit: hooks migrados que ahora delegan en el store.  
- Integration: componente `Header` muestra username y llama `logout` (mock SessionService).  

Notas de implementación
- Mantener los `src/services/*` con validación Zod (ya presente).  
- Mantener tests existentes verdes antes de cada merge.  
- Hacer PRs pequeños e incrementalmente; objetivo: 1-2 componentes por PR.

Siguiente paso sugerido
- (Actual) Confirmar que quieres que cree el PR automáticamente con este plan en el body; puedo abrir el PR desde la rama actual y rellenar el checklist.

Fecha: 2025-08-15
