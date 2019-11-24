import { deepRemoveNewLine } from './preprocess'

const title = `The Analysis of 5Hanayome Twitter Followers`

const introduction = `
Gathering and analyzing the followers' information includes username, description, and timelines from the official twitter account
(<a target="blank" href="https://twitter.com/5hanayome" class="font-color primary">@5Hanayome</a>).
`

const chartInfo = {
  'distribution-five': {
    title: `Distribution of Partisans`,
    description: `The portions of followers among <span class="font-color danger">five partisans</span>.`
  },
  'distribution-all': {
    title: `Distribution of Partisans`,
    description: `
      The portions of followers among <span class="font-color danger">entire followers</span>.
      <br>(toggle from clicking legends)
    `
  },
  'behavior-entire': {
    title: `Amount of Tweets with Keywords`,
    description: `The sum of (re)tweets including respective keywords
      <span class="font-color danger">(entirely)</span>.`
  },
  'behavior-five': {
    title: `Amount of Tweets with Keywords Seperated by Partisans`,
    description: `The sum of (re)tweets including respective keywords
      <span class="font-color danger">(seperated by five partisans)</span>
      <br>(toggle from clicking legends)`
  },
  'behavior-five-chord': {
    title: `Chord Diagram of Amount of Tweets with Keywords`,
    description: `The sum of (re)tweets including respective keywords
      <span class="font-color danger">(seperated by five partisans)</span>`
  },
  'mentioned-users': {
    title: `Amount of Followers Mentioned about Keywords`,
    description: `The amount of followers who has mentioned about respective keywords at least one times.
      <br>(The counts of followers might not be mutually exclusive)`
  },
  'locations': {
    title: `Location Wordcloud`,
    description: `Locations in followers' profiles`
  },
  'user-pattern': {
    title: `User Patterns`,
    description: `The counts of each user pattern<br>(See details in Approach)`
  },
  'user-pattern-partisan': {
    title: `User Patterns(appears {{ name }} only)`,
    description: `The most followers' pattern is [<span class="font-color danger">{{ pattern }}</span>]
      in those who mentioned about {{ name }} at least one times.`
  },
  'distribution-five-partisan': {
    title: `The Portion of {{ name }} Partisan`,
    description: `The portion of followers is<span class="font-color danger">{{ portion }}%<span>
      and rank <span class="font-color danger">{{ rank }}</span>`
  },
  'behavior-compare-partisan': {
    title: `Comparisons Between Tweets Mentioned About {{ name }} and <span class="font-color danger">The Average</span>`,
    description: `Comparisons between tweets containing {{ name }} and the average{{ name }} (weighted mean)`
  }
}

const approach = `
<h3>Data Source</h3>
<p>
We retrived twitter users' names, descriptions, timelines, and locations through&nbsp;
gathering public and active accounts from official twitter account,&nbsp;
<a target="blank" href="https://twitter.com/5hanayome" class="font-color primary">@5Hanayome</a>.
</p>
<p>Last updated date：{{ updatedTime }}</p>

<h3>Identifying the Partisan of A User</h3>
<p>
We identified a user's favorite character (hereafter referred to as "Partisan")&nbsp;
through whether some keywords appears in username or description of his or her profile.&nbsp;
The followings are those keywords of each partisan:
<ul>
<li><span class="font-color ichika">■</span> ichika：一花、ichika</li>
<li><span class="font-color nino">■</span> nino：二乃、nino</li>
<li><span class="font-color miku">■</span> miku：三玖、miku</li>
<li><span class="font-color yotsuba">■</span> yotsuba：四葉、yotsuba</li>
<li><span class="font-color itsuki">■</span> itsuki：五月、itsuki</li>
</ul>
We assigned the partisan which its keywords appeared the most times.
If there are more than one partisans, the keywords of which appear in the same times,&nbsp;
we assign the user to the partisan, "multiple".
Definitely, there will be "none" partisan to a user when he or she never mentioned any keyword.
</p>

<h3>Identifying the Partisan of A (Re)Tweet</h3>
<p>
We processed the string matching to the latest 200 (re)tweets from a user.
For each tweet, it will be considered as a specific partisan if it contains the respective keywords.
Thus, one tweet might be classified to multiple partisans.
</p>

<h3>Identifying the User Pattern</h3>
<p>
For each user, we can judge his or her tweets and count them like below:
<ul>
<li><span class="font-color ichika">■</span> ichika：10 times</li>
<li><span class="font-color nino">■</span> nino：0 times</li>
<li><span class="font-color miku">■</span> miku：9 times</li>
<li><span class="font-color yotsuba">■</span> yotsuba：14 times</li>
<li><span class="font-color itsuki">■</span> itsuki：0 times</li>
</ul>
</p>
We counted in the partisan as a user pattern if there are at least once tweets mentioned about the respective keywords.
For this example, the user pattern will be noted as "1+3+4".
Here we just want to know that whether a user which likes a character might favor some others (make couple?).
Certainly, there are still lots of users mentioned about only one character.

<h3>Locations</h3>
<p>
We cannot retrive the exact location for a specific user.
What we can do is aggregating text of the "location" field in their profiles.
At least, we prepared a word cloud to represent the results.
</p>
`

export default deepRemoveNewLine({
  title,
  introduction,
  chartInfo,
  approach
})
