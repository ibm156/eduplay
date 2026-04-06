// ─── API Switch ───────────────────────────────────────────────────────────────
// While the Django backend is not ready, all imports go through mockApi.
// When your backend is ready, swap these three exports:
//   export { authApi }                from './auth'
//   export { subjectsApi, topicsApi } from './subjects'
//   export { gamesApi }               from './games'

export { authApi }                from './mockApi'
export { subjectsApi, topicsApi } from './mockApi'
export { gamesApi }               from './mockApi'
