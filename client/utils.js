function titleCase(string) {
  const sentence = string.toLowerCase().split(' ')
  return sentence.map((w) => w[0].toUpperCase() + w.slice(1)).join(' ')
}
export const unslugify = (slug) => titleCase(slug.replace('_', ' '))
