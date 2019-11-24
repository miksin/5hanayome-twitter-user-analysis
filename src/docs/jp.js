import { deepRemoveNewLine } from './preprocess'

const title = `五等分の花嫁 - ツイッターユーザー分析`

const introduction = `
五等分の花嫁の公式ツイッター
(<a target="blank" href="https://twitter.com/5hanayome" class="font-color primary">@5Hanayome</a>)
のフォロワーたちに名前やタイムラインなどデータを収集して、分析すること。
`

const chartInfo = {
  'distribution-five': {
    title: `フォロワーたちは誰を推している`,
    description: `プロフィールに推しのキャラ名を表示しているフォロワーたちの分布状況
      <br><span class="font-color danger">(noneとmultipleが除外)</span>`
  },
  'distribution-all': {
    title: `フォロワーたちは誰を推している`,
    description: `
      プロフィールに推しのキャラ名を表示しているフォロワーたちの分布状況
      <br><span class="font-color danger">(全体)</span>
      <br>(凡例をクリックして表示・非表示できる)
    `
  },
  'behavior-entire': {
    title: `キーワードを含めるツイッター数`,
    description: `フォロワーのタイムラインに各派のキーワードを含めるツイート数
      <span class="font-color danger">(全体)</span>`
  },
  'behavior-five': {
    title: `キーワードを含めるツイッター数`,
    description: `フォロワーのタイムラインに各派のキーワードを含めるツイート数
      <span class="font-color danger">(各派)</span>
      <br>(凡例をクリックして表示・非表示できる)`
  },
  'behavior-five-chord': {
    title: `キーワードを含めるツイッター数・Chord Diagram`,
    description: `フォロワーのタイムラインに各派のキーワードを含めるツイート数
      <span class="font-color danger">(各派)</span>`
  },
  'mentioned-users': {
    title: `キーワードをツイートしたフォロワー数`,
    description: `一度以上各派のキーワードをツイートしたフォロワー数
      <br>(同一ユーザからの重複カウントの可能性もあります)`
  },
  'locations': {
    title: `地域ワードクラウド`,
    description: `フォロワーたちのプロフィールの地域`
  },
  'user-pattern': {
    title: `ユーザーパターン`,
    description: `ユーザーパターン<br>(詳細はApproachに)`
  },
  'user-pattern-partisan': {
    title: `ユーザーパターン({{ name }}が含めるパターンのみ)`,
    description: `{{ name }}が含めるパターンに
      [<span class="font-color danger">{{ pattern }}</span>]のフォロワーは一番多い`
  },
  'distribution-five-partisan': {
    title: `五人に対する{{ name }}派ユーザーの比率`,
    description: `比率は<span class="font-color danger">{{ portion }}%<span>
      ，ランクは<span class="font-color danger">{{ rank }}</span>`
  },
  'behavior-compare-partisan': {
    title: `{{ name }}派ユーザーからのツイート数と<span class="font-color danger">平均値</span>と比べる`,
    description: `{{ name }}派ユーザーからのツイート数と平均値（加重平均）と比べる`
  }
}

const approach = `
<h3>データソース</h3>
<p>
公式ツイッターアカウント
<a target="blank" href="https://twitter.com/5hanayome" class="font-color primary">@5Hanayome</a>
のフォロワーから公開、有効な{{ followers }}ユーザーアカウントを収集して、
そのユーザー名、地域やタイムラインなど資料をまとめている。
</p>
<p>収集時間：{{ updatedTime }}</p>

<h3>ユーザーは誰が推しのを判定すること</h3>
<p>
ユーザーのプロフィールにユーザー名と自己紹介から特定のキーワードを含んでいるのか。
そのキーワードは：
<ul>
<li><span class="font-color ichika">■</span> 一花派：一花、ichika</li>
<li><span class="font-color nino">■</span> 二乃派：二乃、nino</li>
<li><span class="font-color miku">■</span> 三玖派：三玖、miku</li>
<li><span class="font-color yotsuba">■</span> 四葉派：四葉、yotsuba</li>
<li><span class="font-color itsuki">■</span> 五月派：五月、itsuki</li>
</ul>
フォロワーの推しキャラはカウント数が一番多いキーワードから判定することになります。
同時に複数派に判定されたの場合は、「multiple」というクラスに分類されます。
ちなみに、すべてのキーワードを一度も言わなかったのは「none」。
</p>

<h3>単一ツイートの判定</h3>
<p>
ユーザーの最新200個の（リ）ツイートから一つずつチャックして、
一度キーワードが出ると対応の派に分類されます。
だから一つツイートが複数の派に分類されかもしれません。
</p>

<h3>推文模式判定ユーザーパターン</h3>
<p>
最新200個のツイートを「単一ツイートの判定」を実行して、各派に対してそのツイート数がカウントできます。例：
<ul>
<li><span class="font-color ichika">■</span> 一花：10回</li>
<li><span class="font-color nino">■</span> 二乃：0回</li>
<li><span class="font-color miku">■</span> 三玖：9回</li>
<li><span class="font-color yotsuba">■</span> 四葉：14回</li>
<li><span class="font-color itsuki">■</span> 五月：0回</li>
</ul>
</p>
一回以上ツイートしたら、ユーザーパターンにその派を追加します。
例えばこちらの方は「1+3+4」というユーザーパターンになります。

<h3>地域の判定</h3>
<p>
ユーザーの実際のところは手に入れないが、
こちらはプロフィールの「地域」からそのテキストを整理して、
ワードクラウドで表示します。
</p>
`

export default deepRemoveNewLine({
  title,
  introduction,
  chartInfo,
  approach
})
