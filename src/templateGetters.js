function vue ({ markup, attributes, stats }) {
  // TODO: use a fragment here when support comes with Vue 3
  return `\
<template lang="html">\
<section>\
  ${markup}\
</section>\
</template>\n\
\n\
<script>\n\
import { inject } from '@vue/composition-api'\n\
import { useSymbol } from '@baleada/prose/vue'\n\
\n\
export default {\n\
  setup () {\n\
    const setFrontMatter = inject(useSymbol('article', 'setFrontMatter')),\n\
          setStats = inject(useSymbol('article', 'setStats'))\n\
\n\
    setFrontMatter(${singleQuoteStringify(attributes)})\n\
    setStats(${singleQuoteStringify(stats)})\n\
  }\n\
}\n\
</script>`
}

function jsx ({ markup, attributes, stats }) {
  throw new Error('jsx template is a work in progress')
}

function svelte ({ markup, attributes, stats }) {
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
