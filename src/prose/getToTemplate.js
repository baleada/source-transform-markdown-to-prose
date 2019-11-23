import fs from 'fs'
import fm from 'front-matter'
import MarkdownIt from 'markdown-it'
import MarkdownItProseContainer from '@baleada/markdown-it-prose-container'
import getTemplate from './templateGetters'

// Options: {
//   templateType: 'vue' | 'svelte' | 'jsx',
// }

const validTemplateTypes = ['jsx', 'svelte', 'vue'],
      defaultOptions = {
        plugins: []
      }

export default function(templateType, options) {
  try {
    templateType = templateType.toLowerCase()
  } catch (error) {
    throw error
  }

  if (!validTemplateTypes.includes(templateType)) {
    throw new Error('invalid templateType')
  }

  options = {
    ...defaultOptions,
    ...options
  }

  const { plugins: rawPlugins } = options,
        proseContainerPlugin = { plugin: MarkdownItProseContainer, params: [templateType] },
        plugins = [proseContainerPlugin, ...resolvePlugins(rawPlugins)],
        markdownItOptions = (({ plugins, ...rest }) => ({ ...rest }))(options)

  return (markdown, filePath) => {
    const { attributes, body } = fm(filePath),
          stats = fs.statSync(filePath),
          md = new MarkdownIt(markdownItOptions)

    plugins.forEach(({ plugin, params }) => md.use(plugin, ...params))

    const markup = md.render(body),
          template = getTemplate(templateType, { markup, attributes, stats })

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
