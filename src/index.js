import fs from 'fs'
import fm from 'front-matter'
import MarkdownIt from 'markdown-it'
import MarkdownItProseContainer from '@baleada/markdown-it-prose-container'
import getTemplate from './templateGetters'

export default function(required, options) {
  const { templateType } = required,
        { proseContainer: proseContainerOptions, markdownIt: markdownItOptions } = options,
        proseContainerRequired = required,
        proseContainerPlugin = { plugin: MarkdownItProseContainer, params: [proseContainerRequired, proseContainerOptions] },
        { plugins: rawPlugins } = markdownItOptions || {},
        resolvablePlugins = rawPlugins || [],
        plugins = [proseContainerPlugin, ...resolvePlugins(resolvablePlugins)]

  return (markdown, filePath) => {
    const { attributes, body } = fm(markdown),
          stats = fs.statSync(filePath),
          md = new MarkdownIt(markdownItOptions)

    plugins.forEach(({ plugin, params }) => md.use(plugin, ...params))

    const markup = md.render(body),
          template = getTemplate(templateType, { markup, attributes, stats, filePath })

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
