import ClothingCard from './ClothingCard.jsx';

export default function ClothingList({
  clothes,
  likedIds,
  savedIds,
  repostedIds,
  commentsById,
  onToggleLike,
  onToggleSave,
  onToggleRepost,
  onAddComment,
}) {
  if (clothes.length === 0) {
    return <p className="empty-message">まだ投稿がありません。写真を投稿してフィードを作りましょう。</p>;
  }

  return (
    <section className="clothing-grid" aria-label="服一覧">
      {clothes.map((item) => (
        <ClothingCard
          key={item.id}
          item={item}
          isLiked={likedIds.includes(item.id)}
          isSaved={savedIds.includes(item.id)}
          isReposted={repostedIds.includes(item.id)}
          comments={commentsById[item.id]}
          onToggleLike={onToggleLike}
          onToggleSave={onToggleSave}
          onToggleRepost={onToggleRepost}
          onAddComment={onAddComment}
        />
      ))}
    </section>
  );
}
