import fs from 'fs'
import fm from 'front-matter'
import MarkdownIt from 'markdown-it'
import { container } from './plugins'
import getTemplate from './templateGetters'

// Options: {
//   templateType: 'vue' | 'svelte' | 'jsx',
// }

const validTemplateTypes = ['jsx', 'svelte', 'vue'],
      defaultOptions = {
        plugins: []
      }

export default function(options) {
  options = {
    ...defaultOptions,
    ...options
  }

  const { templateType: t } = options,
        templateType = t.toLowerCase ? t.toLowerCase() : t

  if (!validTemplateTypes.includes(templateType)) {
    throw new Error('invalid templateType')
  }

  const { plugins: rawPlugins } = options,
        containerPlugin = { plugin: container, options: { templateType } },
        plugins = [containerPlugin, ...resolvePlugins(rawPlugins)],
        markdownItOptions = (({ plugins, ...rest }) => ({ ...rest }))()

  return (markdown, filePath) => {
    const { attributes, body } = fm(filePath),
          stats = fs.statSync(filePath),
          md = new MarkdownIt({
            ...markdownItOptions,
            ...options
          })

    plugins.forEach(({ plugin, options }) => md.use(plugin, options))

    const markup = md.render(body)

    return getTemplate(templateType, { markup, attributes, stats })
  }
}

function resolvePlugins (plugins) {
  return plugins.map(plugin => {
    return (typeof plugin === 'function' && { plugin, options: {} }) ||
      (Array.isArray(plugin) && { plugin: plugin[0], options: plugin[1] }) ||
      {}
  })
}
