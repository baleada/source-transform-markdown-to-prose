// ::: ...props
import MarkdownItContainer from 'markdown-it-container'
import guessContainerType from './util/guessContainerType'
import toProps from './util/toProps'

export default function(md, options = {}) {
  const { framework } = options

  md.use(MarkdownItContainer, 'prose', {
    render: renderProseContainer(md, framework),
    marker: ':'
  })
}

function renderProseContainer (md, framework) {
  return (tokens, index) => {
    const { info, nesting } = tokens[index],
          nextType = tokens[index + 1].type,
          containerType = guessContainerType({ info, nesting, nextType }),
          props = toProps(info, containerType),
          boundPropsString = getBoundPropsString(props, framework)

    return nesting === 1
      ? `<${containerType} ${boundPropsString}>\n`
      : `</${containerType}>`
  }
}
