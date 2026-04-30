import { useEffect, useMemo, useState } from 'react';
import { collection, onSnapshot } from 'firebase/firestore';
import { Send, Sparkles } from 'lucide-react';
import { db, hasFirebaseConfig } from '../firebase/config.js';
import Recommendation from './Recommendation.jsx';
import Stats from './Stats.jsx';

const yen = new Intl.NumberFormat('ja-JP', {
  style: 'currency',
  currency: 'JPY',
  maximumFractionDigits: 0,
});

const categories = ['Tops', 'Pants', 'Outer', 'Shoes', 'Accessory'];

const recommendationCatalog = {
  Men: {
    Tops: [
    {
      brand: 'UNIQLO',
      name: 'エアリズムコットン系トップス',
      reason: '1枚でもインナーでも使いやすく、着用回数を伸ばしやすいです。',
      url: 'https://www.uniqlo.com/jp/ja/search?q=%E3%82%A8%E3%82%A2%E3%83%AA%E3%82%BA%E3%83%A0%20%E3%82%B3%E3%83%83%E3%83%88%E3%83%B3',
    },
    {
      brand: 'GU',
      name: 'ベーシックT・カットソー',
      reason: '価格を抑えながら、投稿にも日常にも回しやすい候補です。',
      url: 'https://www.gu-global.com/jp/ja/search?q=T%E3%82%B7%E3%83%A3%E3%83%84',
    },
  ],
    Pants: [
    {
      brand: 'UNIQLO',
      name: 'タックワイドパンツ / スマートパンツ',
      reason: 'トップスを選びにくく、仕事と休日の両方で稼働しやすいです。',
      url: 'https://www.uniqlo.com/jp/ja/search?q=%E3%82%BF%E3%83%83%E3%82%AF%E3%83%AF%E3%82%A4%E3%83%89%E3%83%91%E3%83%B3%E3%83%84',
    },
    {
      brand: 'GU',
      name: 'ワイドパンツ / バレルレッグ系',
      reason: '少ない買い足しでシルエットを変えられ、着回しの幅が出ます。',
      url: 'https://www.gu-global.com/jp/ja/search?q=%E3%83%AF%E3%82%A4%E3%83%89%E3%83%91%E3%83%B3%E3%83%84',
    },
    {
      brand: 'GLOBAL WORK',
      name: 'きれいめイージーパンツ',
      reason: '清潔感を保ちつつ、普段使いの回数を稼ぎやすいです。',
      url: 'https://globalwork.jp/men/',
    },
  ],
    Outer: [
    {
      brand: 'UNIQLO',
      name: '感動ジャケット / 軽量アウター',
      reason: 'きれいめにも寄せやすく、季節の境目で出番を作れます。',
      url: 'https://www.uniqlo.com/jp/ja/search?q=%E6%84%9F%E5%8B%95%E3%82%B8%E3%83%A3%E3%82%B1%E3%83%83%E3%83%88',
    },
    {
      brand: 'GU',
      name: 'ライトアウター',
      reason: '価格を抑えて、今の服に重ねる選択肢を増やせます。',
      url: 'https://www.gu-global.com/jp/ja/search?q=%E3%82%A2%E3%82%A6%E3%82%BF%E3%83%BC',
    },
    {
      brand: 'H&M',
      name: 'ライトジャケット',
      reason: '低予算で季節感を足しやすく、投稿にも変化を出せます。',
      url: 'https://www2.hm.com/ja_jp/men.html',
    },
  ],
    Shoes: [
    {
      brand: 'UNIQLO',
      name: 'シンプルなスニーカー・サンダル',
      reason: '毎日の稼働率が高く、1回あたりコストを下げやすいです。',
      url: 'https://www.uniqlo.com/jp/ja/search?q=%E3%82%B7%E3%83%A5%E3%83%BC%E3%82%BA',
    },
    {
      brand: 'GU',
      name: '黒スニーカー / ローファー',
      reason: '足元を整えると、手持ち服の見え方が一気にまとまります。',
      url: 'https://www.gu-global.com/jp/ja/search?q=%E3%82%B7%E3%83%A5%E3%83%BC%E3%82%BA',
    },
  ],
    Accessory: [
    {
      brand: 'UNIQLO',
      name: 'バッグ / ベルト',
      reason: '服を増やさず、既存コーデの見え方を変えられます。',
      url: 'https://www.uniqlo.com/jp/ja/search?q=%E3%83%90%E3%83%83%E3%82%B0',
    },
    {
      brand: 'GU',
      name: '小物・バッグ',
      reason: '低予算で変化を出しやすく、失敗時のダメージも小さめです。',
      url: 'https://www.gu-global.com/jp/ja/search?q=%E3%83%90%E3%83%83%E3%82%B0',
    },
  ],
  },
  Women: {
    Tops: [
      {
        brand: 'UNIQLO',
        name: 'リブ・エアリズム系トップス',
        reason: '1枚でも重ね着でも使いやすく、着用回数が伸びやすいです。',
        url: 'https://www.uniqlo.com/jp/ja/search?q=%E3%83%AA%E3%83%96%20%E3%83%88%E3%83%83%E3%83%97%E3%82%B9',
      },
      {
        brand: 'GU',
        name: 'コンパクトT / シアートップス',
        reason: '価格を抑えつつ、手持ちボトムスの印象を変えられます。',
        url: 'https://www.gu-global.com/jp/ja/search?q=%E3%83%88%E3%83%83%E3%83%97%E3%82%B9',
      },
      {
        brand: 'H&M',
        name: 'ベーシックトップス',
        reason: '色や形の選択肢が広く、足りない雰囲気を補いやすいです。',
        url: 'https://www2.hm.com/ja_jp/ladies.html',
      },
    ],
    Pants: [
      {
        brand: 'UNIQLO',
        name: 'スマートパンツ / ワイドパンツ',
        reason: 'オンオフ兼用しやすく、トップスの稼働率も上げてくれます。',
        url: 'https://www.uniqlo.com/jp/ja/search?q=%E3%82%B9%E3%83%9E%E3%83%BC%E3%83%88%E3%83%91%E3%83%B3%E3%83%84',
      },
      {
        brand: 'GU',
        name: 'バレルレッグ / ワイドパンツ',
        reason: '少ない投資でシルエットに変化が出ます。',
        url: 'https://www.gu-global.com/jp/ja/search?q=%E3%83%AF%E3%82%A4%E3%83%89%E3%83%91%E3%83%B3%E3%83%84',
      },
    ],
    Outer: [
      {
        brand: 'GLOBAL WORK',
        name: '軽めジャケット / カーディガン',
        reason: '日常に馴染みやすく、季節の境目に着用回数を稼げます。',
        url: 'https://globalwork.jp/women/',
      },
      {
        brand: 'H&M',
        name: 'ライトアウター',
        reason: 'トレンド感を低予算で足しやすい候補です。',
        url: 'https://www2.hm.com/ja_jp/ladies.html',
      },
    ],
    Shoes: [
      {
        brand: 'GU',
        name: 'ローファー / フラットシューズ',
        reason: 'きれいめにもカジュアルにも振れて、出番を作りやすいです。',
        url: 'https://www.gu-global.com/jp/ja/search?q=%E3%82%B7%E3%83%A5%E3%83%BC%E3%82%BA',
      },
      {
        brand: 'H&M',
        name: 'ベーシックシューズ',
        reason: 'コーデの印象を変えやすく、投稿の見え方も整います。',
        url: 'https://www2.hm.com/ja_jp/ladies.html',
      },
    ],
    Accessory: [
      {
        brand: 'GU',
        name: 'バッグ / ベルト',
        reason: '服を増やしすぎず、既存コーデを更新できます。',
        url: 'https://www.gu-global.com/jp/ja/search?q=%E3%83%90%E3%83%83%E3%82%B0',
      },
      {
        brand: 'MUJI',
        name: 'シンプルなバッグ・小物',
        reason: '主張が少なく、日常の稼働率を上げやすいです。',
        url: 'https://www.muji.com/jp/ja/store',
      },
    ],
  },
};

function normalizeItem(item) {
  const wearCount = Number(item.wearCount ?? item.estimatedWearCount ?? 0);
  const price = Number(item.price ?? 0);

  return {
    ...item,
    wearCount,
    estimatedWearCount: wearCount,
    price,
    costPerWear: wearCount > 0 ? price / wearCount : Number.POSITIVE_INFINITY,
  };
}

function analyzeCloset(items) {
  const normalized = items.map(normalizeItem).filter((item) => item.name);
  const ranked = [...normalized].sort((a, b) => a.costPerWear - b.costPerWear);
  const categoryCounts = normalized.reduce((acc, item) => {
    acc[item.category || 'Other'] = (acc[item.category || 'Other'] || 0) + 1;
    return acc;
  }, {});
  const categoryEntries = Object.entries(categoryCounts).sort((a, b) => b[1] - a[1]);
  const missingCategory =
    categories
      .map((category) => [category, categoryCounts[category] || 0])
      .sort((a, b) => a[1] - b[1])[0]?.[0] || 'Pants';
  const finiteCosts = normalized.filter((item) => Number.isFinite(item.costPerWear));
  const averageCost =
    finiteCosts.reduce((sum, item) => sum + item.costPerWear, 0) / Math.max(finiteCosts.length, 1);

  return {
    totalItems: normalized.length,
    ranked,
    bestItems: ranked.slice(0, 3),
    worstItems: [...ranked].reverse().slice(0, 3),
    lowUseItems: normalized
      .filter((item) => item.wearCount <= 20)
      .sort((a, b) => a.wearCount - b.wearCount)
      .slice(0, 3),
    coreItems: normalized
      .filter((item) => item.wearCount >= 80)
      .sort((a, b) => b.wearCount - a.wearCount)
      .slice(0, 3),
    categoryEntries,
    missingCategory,
    averageCost,
  };
}

function createConciergeAdvice(analysis) {
  if (analysis.totalItems === 0) {
    return [
      ['まずはClosetに3点だけ登録しましょう。', 'トップス、パンツ、靴が入ると、買い足し判断の精度が上がります。'],
      ['価格だけではなく、着用回数を見ていきましょう。', 'よく着る服を基準にすると、次の買い物が整います。'],
    ];
  }

  const worst = analysis.worstItems[0];
  const core = analysis.coreItems[0] || analysis.bestItems[0];

  return [
    [
      `${analysis.missingCategory} が少し薄めです。`,
      `次の買い物は、手持ちに合わせやすい ${analysis.missingCategory} から見るのがよさそうです。`,
    ],
    worst
      ? [
          `${worst.name} は1回あたり ${yen.format(Math.round(worst.costPerWear))} です。`,
          '出番を増やせないなら、似た用途の買い足しは一度止めてよさそうです。',
        ]
      : ['今のところ、大きく無駄な服は見当たりません。'],
    core
      ? [
          `${core.name} は稼働率が高いコアアイテムです。`,
          'この服に合うものだけを足すと、クローゼット全体のコスパが上がります。',
        ]
      : ['コアアイテムがまだ見えていません。', '週2回以上着る服を増やしていきましょう。'],
  ];
}

function answerQuestion(question, analysis, gender) {
  const text = question.toLowerCase();
  const lowerJapanese = question;
  const wantsRecommendation =
    text.includes('recommend') ||
    lowerJapanese.includes('おすすめ') ||
    lowerJapanese.includes('買') ||
    lowerJapanese.includes('不足') ||
    lowerJapanese.includes('提案');

  if (wantsRecommendation) {
    const links =
      recommendationCatalog[gender]?.[analysis.missingCategory] ||
      recommendationCatalog.Men.Pants;
    return {
      text: `今のClosetなら、次は ${analysis.missingCategory} を見るのがよさそうです。\n\n${gender} 向けでは、まずベーシック寄りのブランドから選ぶと失敗しにくいです。\nUNIQLO・GUを軸に、MUJI、H&M、GLOBAL WORKも候補に入れましょう。`,
      links,
    };
  }
  if (lowerJapanese.includes('無駄') || lowerJapanese.includes('減ら') || lowerJapanese.includes('捨て')) {
    const item = analysis.worstItems[0] || analysis.lowUseItems[0];
    return {
      text: item
        ? `${item.name} は優先的に見直しましょう。\n\n着用回数に対してコストが重めです。\n手放す前に、まずは「あと3回着る場面」を作れるか見てください。作れないなら、似た用途の買い足しは止めてよさそうです。`
        : '現時点では、明確に減らすべき服はまだ見えていません。\n\nもう少しClosetに登録すると、判断の精度が上がります。',
    };
  }
  if (lowerJapanese.includes('使') || lowerJapanese.includes('着回') || lowerJapanese.includes('活用')) {
    const core = analysis.coreItems[0] || analysis.bestItems[0];
    return {
      text: core
        ? `${core.name} を軸に考えるのがよさそうです。\n\nこの服は稼働率が高いので、合わせるトップス・パンツ・靴を増やすと、クローゼット全体のコスパが上がります。`
        : 'まずは週2回以上着ている服をClosetに登録しましょう。\n\nそこから、あなたのコアアイテムを見つけていきます。',
    };
  }
  if (lowerJapanese.includes('ランキング') || lowerJapanese.includes('一番') || lowerJapanese.includes('高い')) {
    const best = analysis.bestItems[0];
    const worst = analysis.worstItems[0];
    return {
      text: best && worst
        ? `一番優秀なのは ${best.name} です。\n1回あたり ${yen.format(Math.round(best.costPerWear))} まで下がっています。\n\n反対に、見直し候補は ${worst.name} です。\n1回あたり ${yen.format(Math.round(worst.costPerWear))} なので、出番を作れるか確認しましょう。`
        : 'ランキングを出すには、まず服を2点以上登録しましょう。',
    };
  }
  const core = analysis.coreItems[0] || analysis.bestItems[0];
  return {
    text: core
      ? `${core.name} を軸に見てみましょう。\n\n今は「よく着る服に合うものだけを足す」方針が合っています。\n気になる買い物があれば、カテゴリ名や商品名で聞いてください。`
      : 'まずはClosetに服を登録しましょう。\n\n価格と着用回数が入ると、減らす服・使うべき服・次に買う服まで一緒に整理できます。',
  };
}

function ItemList({ title, number, items, empty }) {
  return (
    <section className="analysis-section">
      <div className="section-heading">
        <span>{number}</span>
        <h2>{title}</h2>
      </div>
      <div className="analysis-card-list">
        {items.length === 0 ? (
          <p className="empty-message">{empty}</p>
        ) : (
          items.map((item) => (
            <article className="analysis-item-card" key={item.id}>
              <div>
                <strong>{item.name}</strong>
                <span>{item.category || 'Other'} / {item.wearCount}回</span>
              </div>
              <b>{Number.isFinite(item.costPerWear) ? yen.format(Math.round(item.costPerWear)) : '-'}</b>
            </article>
          ))
        )}
      </div>
    </section>
  );
}

export default function ClosetAnalysis({ fallbackItems, gender = 'Men' }) {
  const [items, setItems] = useState(fallbackItems);
  const [isLive, setIsLive] = useState(false);
  const [question, setQuestion] = useState('');
  const [conversation, setConversation] = useState([]);
  const [isThinking, setIsThinking] = useState(false);

  useEffect(() => {
    if (!hasFirebaseConfig || !db) {
      setItems(fallbackItems);
      setIsLive(false);
      return undefined;
    }

    const unsubscribe = onSnapshot(collection(db, 'clothes'), (snapshot) => {
      setItems(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
      setIsLive(true);
    });

    return unsubscribe;
  }, [fallbackItems]);

  const analysis = useMemo(() => analyzeCloset(items), [items]);
  const advice = useMemo(() => createConciergeAdvice(analysis), [analysis]);

  function handleAsk(event) {
    event.preventDefault();
    const trimmed = question.trim();
    if (!trimmed || isThinking) return;

    setConversation((current) => [
      ...current,
      { id: crypto.randomUUID(), from: 'me', text: trimmed },
    ]);
    setQuestion('');
    setIsThinking(true);

    window.setTimeout(() => {
      const response = answerQuestion(trimmed, analysis, gender);
      setConversation((current) => [
        ...current,
        { id: crypto.randomUUID(), from: 'ai', ...response },
      ]);
      setIsThinking(false);
    }, 900);
  }

  return (
    <section className="screen analysis-screen">
      <div className="screen-toolbar">
        <div>
          <h1>Optimize</h1>
          <p>{isLive ? 'Firestore live' : 'Local closet'}</p>
        </div>
        <Sparkles size={21} />
      </div>

      <Stats analysis={analysis} />

      <section className="analysis-section concierge-section">
        <div className="section-heading">
          <span>AI</span>
          <h2>コンシェルジュ</h2>
        </div>
        <div className="concierge-card">
          {advice.map((message, index) => (
            <div className="concierge-bubble" key={`${message.join('')}-${index}`}>
              {message.map((line) => (
                <p key={line}>{line}</p>
              ))}
            </div>
          ))}
        </div>
        <div className="analysis-chat">
          {conversation.map((message) => (
            <div key={message.id} className={message.from === 'me' ? 'from-me' : ''}>
              <p>{message.text}</p>
              {message.links && (
                <div className="chat-link-list">
                  {message.links.map((link) => (
                    <a href={link.url} target="_blank" rel="noreferrer" key={`${link.brand}-${link.name}`}>
                      <span>{link.brand}</span>
                      <strong>{link.name}</strong>
                      <small>{link.reason}</small>
                    </a>
                  ))}
                </div>
              )}
            </div>
          ))}
          {isThinking && (
            <div className="thinking-bubble">
              <span />
              <span />
              <span />
            </div>
          )}
        </div>
        <form className="analysis-ask" onSubmit={handleAsk}>
          <input
            value={question}
            onChange={(event) => setQuestion(event.target.value)}
            placeholder="買い足しや減らす服を相談"
          />
          <button type="submit">
            <Send size={18} />
          </button>
        </form>
      </section>

      <ItemList
        number="02"
        title="無駄な服"
        items={analysis.lowUseItems.length ? analysis.lowUseItems : analysis.worstItems}
        empty="まだ判断できる服がありません。"
      />

      <ItemList
        number="03"
        title="よく使う服"
        items={analysis.coreItems.length ? analysis.coreItems : analysis.bestItems}
        empty="コアアイテムが見えるまで、もう少し着用回数を登録しましょう。"
      />

      <Recommendation missingCategory={analysis.missingCategory} gender={gender} />

      <section className="analysis-section">
        <div className="section-heading">
          <span>Rank</span>
          <h2>コスパランキング</h2>
        </div>
        <div className="ranking-columns">
          <ItemList number="Top" title="上位" items={analysis.bestItems} empty="データなし" />
          <ItemList number="Low" title="下位" items={analysis.worstItems} empty="データなし" />
        </div>
      </section>
    </section>
  );
}
