function vue ({ markup, frontMatter, stats, filePath }) {
  // TODO: use a fragment here when support comes with Vue 3
  return `\
<template lang="html">\
<section class="contents">\
  ${markup}\
</section>\
</template>\n\
\n\
<script>\n\
import { inject } from '@vue/composition-api'\n\
import { useSymbol } from '@baleada/vue-prose'\n\
\n\
export default {\n\
  setup () {\n\
    const frontMatter = inject(useSymbol('article', 'frontMatter')),\n\
          stats = inject(useSymbol('article', 'stats')),\n\
          filePath = inject(useSymbol('article', 'filePath'))\n\
\n\
    frontMatter.value = ${singleQuoteStringify(frontMatter)}\n\
    stats.value = ${singleQuoteStringify(stats)}\n\
    filePath.value = '${filePath}'\n\
  }\n\
}\n\
</script>`
}

function jsx ({ markup, frontMatter, stats }) {
  throw new Error('jsx template is a work in progress')
}

function svelte ({ markup, frontMatter, stats }) {
  throw new Error('svelte template is a work in progress')
}

function singleQuoteStringify (props) {
  return JSON.stringify(props).replace(/"/g, '\'')
}

const templateGetters = {
  vue,
  jsx,
  svelte,
}

export default function(templateType, data) {
  return templateGetters[templateType](data)
}
