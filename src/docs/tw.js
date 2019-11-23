import { deepRemoveNewLine } from './preprocess'

const title = `五等分的新娘推特用戶分析`

const introduction = `
收集五等分の花嫁官方推特
(<a target="blank" href="https://twitter.com/5hanayome" class="font-color primary">@5Hanayome</a>)
的追隨者用戶，包含名稱、時間軸等資訊在內等資料分析。
`

const chartInfo = {
  'distribution-five': {
    title: `追隨者派別分布圓餅圖`,
    description: `在名稱或詳細中標明派別的使用者數於<span class="font-color danger">五個派別</span>中的分布比例`
  },
  'distribution-all': {
    title: `追隨者派別分布圓餅圖`,
    description: `
      在名稱或詳細中標明派別的使用者數於<span class="font-color danger">整體</span>中的分布比例
      <br>(點擊圖標可展開/摺疊)
    `
  },
  'behavior-entire': {
    title: `關鍵字推文總量長條圖`,
    description: `追隨者的時間軸中含有關鍵字發言的推文/轉推數量加總
      <span class="font-color danger">(不分派別)</span>`
  },
  'behavior-five': {
    title: `各派關鍵字推文數量雷達圖`,
    description: `追隨者的時間軸中含有關鍵字發言的推文/轉推數量加總
      <span class="font-color danger">(五派分別)</span>
      <br>(點擊圖標可展開/摺疊)`
  },
  'behavior-five-chord': {
    title: `各派關鍵字推文數量Chord Diagram`,
    description: `追隨者的時間軸中含有關鍵字發言的推文/轉推數量加總
      <span class="font-color danger">(五派分別)</span>`
  },
  'mentioned-users': {
    title: `提過關鍵字的追隨者總數長條圖`,
    description: `至少提過一次關鍵字的追隨者數量<br>(都有提過的追隨者可能被重複計算)`
  },
  'locations': {
    title: `追隨者地點分布文字雲`,
    description: `追隨者個人頁面的標示地點`
  },
  'user-pattern': {
    title: `發言模式追隨者數長條圖`,
    description: `追隨者的發言模式分類統整數量<br>(詳情可見Approach)`
  },
  'user-pattern-partisan': {
    title: `推文模式追隨者數長條圖(僅包含出現{{ name }}的發言模式)`,
    description: `在包含{{ name }}的推文模式為
      [<span class="font-color danger">{{ pattern }}</span>]的人是最多的`
  },
  'distribution-five-partisan': {
    title: `{{ name }}派在姊妹中的分佈比例`,
    description: `比例為<span class="font-color danger">{{ portion }}%<span>
      ，排名為<span class="font-color danger">{{ rank }}</span>`
  },
  'behavior-compare-partisan': {
    title: `{{ name }}派的關鍵字推文數量與<span class="font-color danger">平均值</span>對照`,
    description: `{{ name }}派對於各角色的推文數與平均值(使用人數的加權平均)的對照`
  }
}

const approach = `
<h3>資料來源</h3>
<p>
從官方推特帳號
<a target="blank" href="https://twitter.com/5hanayome" class="font-color primary">@5Hanayome</a>
的追隨者中爬取其中的公開、有效的{{ followers }}名使用者帳號。取得其使用者名稱、自我介紹、位置及時間軸等資訊。
</p>
<p>資料取得日期：{{ updatedTime }}</p>

<h3>使用者黨派判定</h3>
<p>
從使用者的個人資料頁面中，取得其使用者名稱及自我介紹，從其中尋找是否含有派系的關鍵字：
<ul>
<li><span class="font-color ichika">■</span> 一花派：一花、ichika</li>
<li><span class="font-color nino">■</span> 二乃派：二乃、nino</li>
<li><span class="font-color miku">■</span> 三玖派：三玖、miku</li>
<li><span class="font-color yotsuba">■</span> 四葉派：四葉、yotsuba</li>
<li><span class="font-color itsuki">■</span> 五月派：五月、itsuki</li>
</ul>
從其關鍵字的數量中尋找出現次數最多的判定為黨派，而若有複數同時最高特別歸為「multiple」，
都沒有提到任何關鍵字的就是無黨派。
</p>

<h3>單一推文黨派判定</h3>
<p>
從使用者最近的200則推/轉推文中針對每一則進行文字比對，
有出現一次以上關鍵字(同上)的即被歸為該派別，
因此同一則推文可能會被判定為多個派別。
</p>

<h3>推文模式判定</h3>
<p>
針對每一個使用者的「單一推文黨派判定」可得到該使用者近200則發文提到過的關鍵字推文次數，例如以下
<ul>
<li><span class="font-color ichika">■</span> 一花：10次</li>
<li><span class="font-color nino">■</span> 二乃：0次</li>
<li><span class="font-color miku">■</span> 三玖：9次</li>
<li><span class="font-color yotsuba">■</span> 四葉：14次</li>
<li><span class="font-color itsuki">■</span> 五月：0次</li>
</ul>
</p>
我們取至少一次發言過當作判斷，則這個使用者將會被判定為「1+3+4」這樣的推文模式使用者。
這裡是想知道喜歡什麼角色的可能同時也喜歡另外哪個角色(CP?)，
當然，也是有非常多的使用者只針對單一角色發過推文。

<h3>使用者帳號地點判定</h3>
<p>
目前使用者實際所處的地點沒有辦法確實地取得。
從使用者頁面中的「地點」中的文字加以計數統整。
此處為自我申報制且關鍵字並不統一，因此這裡使用文字雲來呈現。
</p>
`

export default deepRemoveNewLine({
  title,
  introduction,
  chartInfo,
  approach
})
