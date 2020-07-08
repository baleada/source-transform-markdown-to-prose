import fs from 'fs'
import fm from 'front-matter'
import MarkdownIt from 'markdown-it'
import MarkdownItProseContainer from '@baleada/markdown-it-prose-container'
import getTemplate from './templateGetters'

export default function getTransform (required, options) {
  const { templateType } = required,
        { proseContainer: proseContainerOptions, markdownIt: markdownItOptions, before, after } = options,
        proseContainerRequired = required,
        proseContainerPlugin = { plugin: MarkdownItProseContainer, params: [proseContainerRequired, proseContainerOptions] },
        { plugins: rawPlugins } = markdownItOptions || {},
        resolvablePlugins = rawPlugins || [],
        plugins = [proseContainerPlugin, ...resolvePlugins(resolvablePlugins)]

  return (markdown, filePath) => {
    const { attributes: frontMatter, body } = fm(markdown),
          stats = fs.statSync(filePath),
          md = new MarkdownIt(markdownItOptions),
          bodyBefore = before ? before({ frontMatter, stats, filePath }) : '',
          bodyAfter = after ? after({ frontMatter, stats, filePath }) : ''

    plugins.forEach(({ plugin, params }) => md.use(plugin, ...params))

    const markup = md.render(`${bodyBefore}${body}${bodyAfter}`),
          template = getTemplate(templateType, { markup, frontMatter, stats, filePath })

    return template
  }
}

function resolvePlugins (plugins) {
  return plugins.map(plugin => {
    return (typeof plugin === 'function' && { plugin, params: [] }) ||
      (Array.isArray(plugin) && { plugin: plugin[0], params: plugin.slice(1) }) ||
      {}
  })
}
