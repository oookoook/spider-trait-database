export const orderSensitiveModules = ['traits', 'methods', 'taxonomy', 'locations', 'references', 'datasets', 'data']

export function setOrder (store, order) {
  if (!order) return
  orderSensitiveModules.forEach(m => store.commit(`${m}/setOrder`, { value: order }))
}

export function resetOrderModules (store) {
  orderSensitiveModules.forEach(m => store.commit(`${m}/reset`))
}

export function normalizeOrderName (order) {
    if(!order) {
        return null;
    }
    let normalizedOrder = order.toLowerCase().replace(/ /g, '_');
    // first letter uppercase
    normalizedOrder = normalizedOrder.charAt(0).toUpperCase() + normalizedOrder.slice(1);
    return normalizedOrder;
}