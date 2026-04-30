import { useState } from 'react';
import { ImagePlus, Plus, X } from 'lucide-react';

export default function ClothingForm({ onAdd }) {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [weeklyWear, setWeeklyWear] = useState('');
  const [category, setCategory] = useState('Tops');
  const [season, setSeason] = useState('All season');
  const [versatility, setVersatility] = useState('Medium');
  const [postText, setPostText] = useState('');
  const [imageUrl, setImageUrl] = useState('');

  const estimatedWearCount = Math.max(0, Math.round(Number(weeklyWear || 0) * 52));
  const costPerWear =
    Number(price) > 0 && estimatedWearCount > 0
      ? Math.round(Number(price) / estimatedWearCount)
      : 0;

  function handleImageUpload(event) {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => setImageUrl(reader.result);
    reader.readAsDataURL(file);
  }

  function handleSubmit(event) {
    event.preventDefault();

    if (!name || Number(price) <= 0 || estimatedWearCount <= 0 || !imageUrl) return;

    onAdd({
      name,
      price: Number(price),
      estimatedWearCount,
      category,
      season,
      versatility,
      postText,
      imageUrl,
    });

    setName('');
    setPrice('');
    setWeeklyWear('');
    setCategory('Tops');
    setSeason('All season');
    setVersatility('Medium');
    setPostText('');
    setImageUrl('');
  }

  return (
    <form className="form-panel" onSubmit={handleSubmit}>
      <div className="form-title">
        <h2>New Post</h2>
      </div>

      <label className={`upload-drop ${imageUrl ? 'has-image' : ''}`}>
        {imageUrl ? (
          <>
            <img src={imageUrl} alt="投稿プレビュー" />
            <button
              type="button"
              aria-label="画像を削除"
              onClick={(event) => {
                event.preventDefault();
                setImageUrl('');
              }}
            >
              <X size={18} />
            </button>
          </>
        ) : (
          <span>
            <ImagePlus size={26} />
            画像を選択
          </span>
        )}
        <input type="file" accept="image/*" onChange={handleImageUpload} />
      </label>

      <label>
        キャプション
        <textarea
          value={postText}
          onChange={(event) => setPostText(event.target.value)}
          placeholder="着回し、迷っている点、買ってよかった理由など"
        />
      </label>

      <label>
        商品名
        <input
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="例：黒のセットアップ"
        />
      </label>

      <div className="form-row">
        <label>
          価格
          <input
            type="number"
            min="0"
            value={price}
            onChange={(event) => setPrice(event.target.value)}
            placeholder="18000"
          />
        </label>

        <label>
          着用頻度 / 週
          <input
            type="number"
            min="0"
            step="0.5"
            value={weeklyWear}
            onChange={(event) => setWeeklyWear(event.target.value)}
            placeholder="2"
          />
        </label>
      </div>

      <div className="form-row">
        <label>
          カテゴリ
          <select value={category} onChange={(event) => setCategory(event.target.value)}>
            <option>Tops</option>
            <option>Outer</option>
            <option>Pants</option>
            <option>Shoes</option>
            <option>Accessory</option>
          </select>
        </label>

        <label>
          季節
          <select value={season} onChange={(event) => setSeason(event.target.value)}>
            <option>All season</option>
            <option>Spring / Summer</option>
            <option>Autumn / Winter</option>
            <option>Special occasion</option>
          </select>
        </label>
      </div>

      <label>
        汎用性
        <select value={versatility} onChange={(event) => setVersatility(event.target.value)}>
          <option>High</option>
          <option>Medium</option>
          <option>Low</option>
        </select>
      </label>

      <div className="preview-box">
        <span>年間想定着用回数</span>
        <strong>{estimatedWearCount}回</strong>
        <span>1回あたり</span>
        <strong>{costPerWear.toLocaleString('ja-JP')}円</strong>
      </div>

      <button type="submit" className="submit-button">
        <Plus size={18} />
        投稿する
      </button>
    </form>
  );
}
