import { useState } from 'react';
import { ImagePlus, Plus, X } from 'lucide-react';

export default function PostForm({ closetItems, onAdd }) {
  const [caption, setCaption] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [closetItemId, setClosetItemId] = useState('');

  function handleImageUpload(event) {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => setImageUrl(reader.result);
    reader.readAsDataURL(file);
  }

  function handleSubmit(event) {
    event.preventDefault();
    if (!imageUrl) return;

    const linkedItem = closetItems.find((item) => item.id === closetItemId);

    onAdd({
      imageUrl,
      postText: caption,
      linkedClosetItemId: closetItemId,
      linkedClosetItemName: linkedItem?.name || '',
    });

    setCaption('');
    setImageUrl('');
    setClosetItemId('');
  }

  return (
    <form className="form-panel" onSubmit={handleSubmit}>
      <div className="form-title">
        <h2>New Post</h2>
      </div>

      <label className={`upload-drop post-upload ${imageUrl ? 'has-image' : ''}`}>
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
            写真を選択
          </span>
        )}
        <input type="file" accept="image/*" onChange={handleImageUpload} />
      </label>

      <label>
        キャプション
        <textarea
          value={caption}
          onChange={(event) => setCaption(event.target.value)}
          placeholder="今日の服、買ってよかった理由、相談したいこと"
        />
      </label>

      <label>
        Closetと紐付け
        <select value={closetItemId} onChange={(event) => setClosetItemId(event.target.value)}>
          <option value="">紐付けなし</option>
          {closetItems.map((item) => (
            <option key={item.id} value={item.id}>
              {item.name}
            </option>
          ))}
        </select>
      </label>

      <button type="submit" className="submit-button">
        <Plus size={18} />
        投稿する
      </button>
    </form>
  );
}
