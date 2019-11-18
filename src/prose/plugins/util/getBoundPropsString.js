const propsBindAndStringifiers = [
  {
    templateType: 'jsx',
    toString: props => `{ ...${JSON.stringify(props)} }`
  },
  {
    templateType: 'vue',
    toString: props => `v-bind="${JSON.stringify(props)}"`
  },
  {
    templateType: 'svelte',
    toString: props => `{ ...${JSON.stringify(props)} }`
  }
]

export default function(props, templateType) {
  return propsBindAndStringifiers.find(({ templateType: t }) => t === templateType).bindAndStringify(props)
}
