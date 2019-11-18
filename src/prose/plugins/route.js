const frameworkLinks = [
  {
    name: 'nuxt',
    link_open: href => `<NuxtLink to="${href}">`,
    link_close: () => `</NuxtLink>`,
  },
  {
    name: 'vue',
    link_open: href => `<RouterLink to="${href}">`,
    link_close: () => `</RouterLink>`,
  },
  {
    name: 'next',
    link_open: href => `<Link href="${href}"><a>`,
    link_close: () => `</a></Link>`,
  },
  {
    name: 'sapper',
    link_open: href => `<a href="${href}">`,
    link_close: () => `</a>`,
  },
]

export default function(md, options) {
  const { framework } = options

  md.renderer.rules.link_open = renderLinkOpen(md, framework)
  md.renderer.rules.link_close = renderLinkClose(md, framework)
}

function renderLinkOpen (md, framework) {
  return (tokens, index) => {
    const href = tokens[index].attrs.find(([ name ]) => name === 'href')[1],
          isRoute = /^\//.test(href),
          frameworkLink = frameworkLinks.find(link => link.name === framework)

    return (frameworkLink && isRoute)
      ? frameworkLink.link_open(href)
      : `<a href="${href}">`
  }
}

function renderLinkClose (md, framework) {
  return (tokens, index) => {
    const linkOpenToken = getLinkOpenToken(tokens, index),
          href = linkOpenToken.attrs.find(([ name ]) => name === 'href')[1],
          isRoute = /^\//.test(href),
          frameworkLink = frameworkLinks.find(link => link.name === framework)

    return (frameworkLink && isRoute)
      ? frameworkLink.link_close()
      : `</a>`
  }
}

function getLinkOpenToken (tokens, index) {
  return tokens
    .slice(0, index)
    .reverse()
    .find(({ type }) => type === 'link_open')
}
