// Small shared helpers.

export function clusterKey(cluster = '') {
  const c = String(cluster).toLowerCase()
  if (c.includes('hardware') || c.includes('physical')) return 'hardware'
  if (c.includes('creative') || c.includes('interactive')) return 'creative'
  return 'software'
}

export function clusterClass(cluster) {
  return 'cl-' + clusterKey(cluster)
}

export function diffClass(d = '') {
  const x = String(d).toLowerCase()
  if (x.includes('adv')) return 'diff-advanced'
  if (x.includes('inter')) return 'diff-intermediate'
  return 'diff-beginner'
}

export function resourceCount(domain) {
  const keys = ['freeCourses', 'youtubeChannels', 'articlesAndDocs', 'interactivePractice', 'communities']
  return keys.reduce((n, k) => n + ((domain && domain[k] && domain[k].length) || 0), 0)
}

export function slugify(s = '') {
  return String(s).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
}
