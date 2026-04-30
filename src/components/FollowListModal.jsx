import { X } from 'lucide-react';

export default function FollowListModal({ title, users, following, onToggleFollow, onClose }) {
  return (
    <div className="modal-backdrop">
      <section className="follow-modal">
        <div className="modal-heading">
          <h2>{title}</h2>
          <button type="button" onClick={onClose} aria-label="閉じる">
            <X size={20} />
          </button>
        </div>

        <div className="follow-list">
          {users.map((user) => {
            const isFollowing = following.includes(user.id);
            return (
              <article key={user.id}>
                <span className="message-avatar">{user.name.slice(0, 1)}</span>
                <div>
                  <strong>{user.name}</strong>
                  <small>@{user.userId}</small>
                </div>
                <button
                  type="button"
                  className={isFollowing ? 'is-following' : ''}
                  onClick={() => onToggleFollow(user.id)}
                >
                  {isFollowing ? 'フォロー中' : 'フォロー'}
                </button>
              </article>
            );
          })}
        </div>
      </section>
    </div>
  );
}
