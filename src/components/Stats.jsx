const yen = new Intl.NumberFormat('ja-JP', {
  style: 'currency',
  currency: 'JPY',
  maximumFractionDigits: 0,
});

export default function Stats({ analysis }) {
  const averageCost = Number.isFinite(analysis.averageCost) ? analysis.averageCost : 0;

  return (
    <section className="analysis-section stats-section">
      <div className="section-heading">
        <span>01</span>
        <h2>あなたのクローゼット診断</h2>
      </div>

      <div className="stat-grid">
        <article>
          <span>Total</span>
          <strong>{analysis.totalItems}</strong>
          <small>登録アイテム</small>
        </article>
        <article>
          <span>Avg</span>
          <strong>{yen.format(Math.round(averageCost))}</strong>
          <small>平均 1回あたり</small>
        </article>
        <article>
          <span>Core</span>
          <strong>{analysis.coreItems.length}</strong>
          <small>よく使う服</small>
        </article>
      </div>

      <div className="category-strip">
        {analysis.categoryEntries.map(([category, count]) => (
          <div key={category}>
            <span>{category}</span>
            <i style={{ width: `${Math.max(12, (count / analysis.totalItems) * 100)}%` }} />
            <strong>{count}</strong>
          </div>
        ))}
      </div>
    </section>
  );
}
