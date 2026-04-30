import { Bookmark, Heart, MessageCircle, Repeat2, Send } from 'lucide-react';

export default function ClothingCard({
  item,
  isLiked,
  isSaved,
  isReposted,
  comments = [],
  onToggleLike,
  onToggleSave,
  onToggleRepost,
  onAddComment,
}) {
  const visibleComments = [...(item.comments || []), ...comments].slice(-1);

  return (
    <article className="clothing-card">
      <div className="card-image-wrap">
        {item.imageUrl ? (
          <img src={item.imageUrl} alt={item.postText || '投稿画像'} className="card-image" />
        ) : (
          <div className="image-placeholder">No image</div>
        )}
        {item.linkedClosetItemName && <span className="closet-link-badge">{item.linkedClosetItemName}</span>}
      </div>

      <div className="card-body">
        <div className="post-user">
          {item.avatarUrl ? (
            <img src={item.avatarUrl} alt={item.authorName} className="mini-avatar-image" />
          ) : (
            <span className="mini-avatar">{(item.authorName || item.category).slice(0, 1)}</span>
          )}
          <div>
            <strong>{item.authorName || 'WearPer Closet'}</strong>
            <small>{item.authorHandle || item.season}</small>
          </div>
        </div>

        {item.postText && <p className="post-text">{item.postText}</p>}

        <div className="social-actions">
          <button
            type="button"
            className={`like-action ${isLiked ? 'is-active' : ''}`}
            onClick={() => onToggleLike(item.id)}
            aria-label="いいね"
          >
            <Heart size={19} />
          </button>
          <button type="button" aria-label="コメント">
            <MessageCircle size={19} />
          </button>
          <button
            type="button"
            className={`repost-action ${isReposted ? 'is-active' : ''}`}
            onClick={() => onToggleRepost(item.id)}
            aria-label="拡散"
          >
            <Repeat2 size={19} />
          </button>
          <button type="button" aria-label="DMで送る">
            <Send size={19} />
          </button>
          <button
            type="button"
            className={`save-action ${isSaved ? 'is-active' : ''}`}
            onClick={() => onToggleSave(item.id)}
            aria-label="保存"
          >
            <Bookmark size={19} />
          </button>
        </div>

        <div className="engagement-row">
          <strong>{(item.likes || 0) + (isLiked ? 1 : 0)} likes</strong>
          <span>{(item.reposts || 0) + (isReposted ? 1 : 0)} reposts</span>
          <span>{visibleComments.length} comments</span>
        </div>

        <div className="comment-list">
          {visibleComments.map((comment, index) => (
            <p key={`${item.id}-comment-${index}`}>{comment}</p>
          ))}
        </div>

        <form
          className="comment-form"
          onSubmit={(event) => {
            event.preventDefault();
            const formData = new FormData(event.currentTarget);
            const comment = String(formData.get('comment') || '').trim();
            if (!comment) return;
            onAddComment(item.id, comment);
            event.currentTarget.reset();
          }}
        >
          <input name="comment" placeholder="コメントする" />
          <button type="submit">Post</button>
        </form>
      </div>
    </article>
  );
}
