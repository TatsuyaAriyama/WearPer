const products = {
  Men: {
    Tops: {
      title: 'UNIQLO / MUJI の無地トップス',
      reason: '手持ちに混ぜやすく、週の着用回数を伸ばしやすいです。',
      url: 'https://www.uniqlo.com/jp/ja/search?q=T%E3%82%B7%E3%83%A3%E3%83%84',
    },
    Pants: {
      title: 'UNIQLO / GLOBAL WORK のきれいめパンツ',
      reason: '仕事にも休日にも振れて、着回しの土台になります。',
      url: 'https://www.uniqlo.com/jp/ja/search?q=%E3%82%BF%E3%83%83%E3%82%AF%E3%83%AF%E3%82%A4%E3%83%89%E3%83%91%E3%83%B3%E3%83%84',
    },
    Outer: {
      title: 'UNIQLO / H&M の軽量アウター',
      reason: '季節の境目で出番を作りやすく、1回あたりを下げやすいです。',
      url: 'https://www.uniqlo.com/jp/ja/search?q=%E3%82%A2%E3%82%A6%E3%82%BF%E3%83%BC',
    },
    Shoes: {
      title: '黒スニーカー / ローファー',
      reason: '足元は稼働日数が多く、クローゼット全体を整えます。',
      url: 'https://www.gu-global.com/jp/ja/search?q=%E3%82%B7%E3%83%A5%E3%83%BC%E3%82%BA',
    },
    Accessory: {
      title: 'バッグ / ベルト',
      reason: '服を増やさず、既存服の見え方を変えられます。',
      url: 'https://www.muji.com/jp/ja/store',
    },
  },
  Women: {
    Tops: {
      title: 'UNIQLO / GU のベーシックトップス',
      reason: 'インナーにも主役にもなり、着用回数を伸ばしやすいです。',
      url: 'https://www.gu-global.com/jp/ja/search?q=%E3%83%88%E3%83%83%E3%83%97%E3%82%B9',
    },
    Pants: {
      title: 'UNIQLO / GU のワイド・スマートパンツ',
      reason: 'トップスの印象を変えやすく、着回しの幅を作れます。',
      url: 'https://www.uniqlo.com/jp/ja/search?q=%E3%82%B9%E3%83%9E%E3%83%BC%E3%83%88%E3%83%91%E3%83%B3%E3%83%84',
    },
    Outer: {
      title: 'GLOBAL WORK / H&M の軽めジャケット',
      reason: '羽織るだけで投稿映えし、季節の出番も作りやすいです。',
      url: 'https://globalwork.jp/women/',
    },
    Shoes: {
      title: 'GU のローファー・フラットシューズ',
      reason: '価格を抑えつつ、きれいめにもカジュアルにも使えます。',
      url: 'https://www.gu-global.com/jp/ja/search?q=%E3%82%B7%E3%83%A5%E3%83%BC%E3%82%BA',
    },
    Accessory: {
      title: 'バッグ / ベルト / アクセサリー',
      reason: '買い足し点数を増やさず、手持ち服の印象を変えられます。',
      url: 'https://www2.hm.com/ja_jp/ladies.html',
    },
  },
};

export default function Recommendation({ missingCategory, gender = 'Men' }) {
  const item = products[gender]?.[missingCategory] || products.Men.Pants;

  return (
    <section className="analysis-section">
      <div className="section-heading">
        <span>04</span>
        <h2>買うべきアイテム</h2>
      </div>

      <article className="recommend-card">
        <div>
          <span>{gender} / Recommended</span>
          <strong>{item.title}</strong>
          <p>{item.reason}</p>
        </div>
        <a href={item.url} target="_blank" rel="noreferrer">
          購入
        </a>
      </article>
    </section>
  );
}
