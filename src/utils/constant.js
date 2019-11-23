export const characterNameMap = {
  '1': '一花',
  '2': '二乃',
  '3': '三玖',
  '4': '四葉',
  '5': '五月'
}

export const info = {
  updatedTime: '2019/11/16',
  url: 'https://twitter.com/ppy951',
  github: 'https://github.com/miksin/5hanayome-twitter-user-analysis',
  twitter: 'https://twitter.com/ppy951',
  pixiv: 'https://www.pixiv.net/member.php?id=3774481'
}

export const colorMap = {
  'none': '#607d8b',
  'multiple': '#795548',
  '1': '#FCDD51',
  '2': '#C6ABD4',
  '3': '#95C1E6',
  '4': '#A5CD6C',
  '5': '#EE8893'
}

export function rgbaColorMap (alpha = 1.0) {
  const map = {}
  Object.keys(colorMap).forEach(key => {
    const r = parseInt(colorMap[key].slice(1, 3), 16)
    const g = parseInt(colorMap[key].slice(3, 5), 16)
    const b = parseInt(colorMap[key].slice(5, 7), 16)
    map[key] = `rgba(${r}, ${g}, ${b}, ${alpha})`
  })
  return map
}
