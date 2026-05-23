export const orderSensitiveModules = ['traits', 'methods', 'taxonomy', 'locations', 'references', 'datasets', 'data']

export function setOrder (store, order) {
  if (!order) return
  orderSensitiveModules.forEach(m => store.commit(`${m}/setOrder`, { value: order }))
}

export function resetOrderModules (store) {
  orderSensitiveModules.forEach(m => store.commit(`${m}/reset`))
}
