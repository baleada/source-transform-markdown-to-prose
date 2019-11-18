function vue ({ markup, attributes, stats }) {
  const { title } = attributes,
        { mtime } = stats

  // TODO: Remove heading and mtime once Vue supports fragments, then wrap markup in a fragment
  return `\
<template lang="html">\
<section class="contents">\
  <ProseHeading :level="1">${title}</ProseHeading>\
  <ProseMTime mtime="${mtime}" />\
  ${markup}\
</section>\
</template>\n\
\n\
<script>\n\
import { inject } from '@vue/composition-api'\n\
import { useSymbol } from '@baleada/prose/vue/composition'\n\
\n\
export default {\n\
  setup () {\n\
    const setFrontmatter = inject(useSymbol('article', 'setFrontmatter')),\n\
          setStats = inject(useSymbol('article', 'setStats'))\n\
\n\
    setFrontmatter(${JSON.stringify(attributes)})\n\
    setStats(${JSON.stringify(stats)})\n\
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

const templateGetters = {
  vue,
  jsx,
  svelte,
}

export default function(templateType, data) {
  return templateGetters[templateType](data)
}
