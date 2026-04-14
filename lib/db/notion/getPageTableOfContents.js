import { getTextContent } from 'notion-utils'

const indentLevels = {
  header: 0,
  sub_header: 1,
  sub_sub_header: 2
}

export const getPageTableOfContents = (page, recordMap) => {
  try {
    const contents = page.content ?? []
    const toc = getBlockHeader(contents, recordMap)
    const indentLevelStack = [{ actual: -1, effective: -1 }]

    for (const tocItem of toc) {
      const actual = tocItem.indentLevel || 0
      let resolved = false

      while (indentLevelStack.length > 0 && !resolved) {
        const prevIndent = indentLevelStack[indentLevelStack.length - 1] || {}
        const prevActual = prevIndent.actual ?? 0
        const prevEffective = prevIndent.effective ?? 0

        if (actual > prevActual) {
          tocItem.indentLevel = prevEffective + 1
          indentLevelStack.push({ actual, effective: tocItem.indentLevel })
          resolved = true
        } else if (actual === prevActual) {
          tocItem.indentLevel = prevEffective
          resolved = true
        } else {
          indentLevelStack.pop()
        }
      }

      if (!resolved) {
        tocItem.indentLevel = 0
        indentLevelStack.push({ actual, effective: 0 })
      }
    }

    return toc
  } catch (e) {
    console.warn('TOC 生成失败', e)
    return []
  }
}

function getBlockHeader(contents, recordMap, toc) {
  if (!toc) toc = []
  if (!contents) return toc

  for (const blockId of contents) {
    try {
      const block = recordMap.block[blockId]?.value
      if (!block) continue

      const { type } = block
      if (block.content?.length) {
        getBlockHeader(block.content, recordMap, toc)
      }

      if (type.includes('header')) {
        const exist = toc.find(i => i.id === blockId)
        if (!exist) {
          toc.push({
            id: blockId,
            type,
            text: getTextContent(block.properties?.title),
            indentLevel: indentLevels[type] || 0
          })
        }
      }
    } catch (e) {}
  }

  return toc
}