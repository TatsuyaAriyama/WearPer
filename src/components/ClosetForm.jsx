import { useState } from 'react';
import { ImagePlus, Plus, X } from 'lucide-react';

export default function ClosetForm({ onAdd }) {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('Tops');
  const [season, setSeason] = useState('All season');
  const [imageUrl, setImageUrl] = useState('');

  function handleImageUpload(event) {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => setImageUrl(reader.result);
    reader.readAsDataURL(file);
  }

  function handleSubmit(event) {
    event.preventDefault();
    if (!name || Number(price) <= 0) return;

    onAdd({
      id: crypto.randomUUID(),
      name,
      price: Number(price),
      wearCount: 0,
      estimatedWearCount: 0,
      category,
      season,
      imageUrl,
      order: Date.now(),
    });

    setName('');
    setPrice('');
    setCategory('Tops');
    setSeason('All season');
    setImageUrl('');
  }

  return (
    <form className="closet-form" onSubmit={handleSubmit}>
      <label className={`closet-upload ${imageUrl ? 'has-image' : ''}`}>
        {imageUrl ? (
          <>
            <img src={imageUrl} alt="服のプレビュー" />
            <button
              type="button"
              aria-label="画像を削除"
              onClick={(event) => {
                event.preventDefault();
                setImageUrl('');
              }}
            >
              <X size={16} />
            </button>
          </>
        ) : (
          <span>
            <ImagePlus size={20} />
          </span>
        )}
        <input type="file" accept="image/*" onChange={handleImageUpload} />
      </label>
      <input value={name} onChange={(event) => setName(event.target.value)} placeholder="服の名前" />
      <input
        type="number"
        min="0"
        value={price}
        onChange={(event) => setPrice(event.target.value)}
        placeholder="価格"
      />
      <div className="form-row">
        <select value={category} onChange={(event) => setCategory(event.target.value)}>
          <option>Tops</option>
          <option>Outer</option>
          <option>Pants</option>
          <option>Shoes</option>
          <option>Accessory</option>
        </select>
        <select value={season} onChange={(event) => setSeason(event.target.value)}>
          <option>All season</option>
          <option>Spring / Summer</option>
          <option>Autumn / Winter</option>
          <option>Special occasion</option>
        </select>
      </div>
      <button type="submit">
        <Plus size={18} />
        追加
      </button>
    </form>
  );
}
