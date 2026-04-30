import { Camera } from 'lucide-react';

const genderOptions = ['Men', 'Women'];

export default function ProfilePanel({
  profile,
  onNameChange,
  onUserIdChange,
  onGenderChange,
  onAvatarChange,
  following,
  onOpenFollowList,
}) {
  function handleAvatarUpload(event) {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => onAvatarChange(reader.result);
    reader.readAsDataURL(file);
  }

  return (
    <aside className="profile-panel">
      <div className="profile-cover" />

      <div className="profile-main">
        <label className="avatar-picker" aria-label="プロフィール画像を変更">
          {profile.avatarUrl ? (
            <img src={profile.avatarUrl} alt={profile.name} />
          ) : (
            <strong>{profile.name.slice(0, 1).toUpperCase()}</strong>
          )}
          <span>
            <Camera size={16} />
          </span>
          <input type="file" accept="image/*" onChange={handleAvatarUpload} />
        </label>

        <div className="profile-edit">
          <input
            value={profile.name}
            onChange={(event) => onNameChange(event.target.value)}
            aria-label="名前"
          />
          <label className="user-id-field">
            <span>@</span>
            <input
              value={profile.userId || ''}
              onChange={(event) =>
                onUserIdChange(event.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ''))
              }
              placeholder="user_id"
              aria-label="ユーザーID"
            />
          </label>
          <div className="gender-segment" aria-label="性別">
            {genderOptions.map((gender) => (
              <button
                key={gender}
                type="button"
                className={profile.gender === gender ? 'is-active' : ''}
                onClick={() => onGenderChange(gender)}
              >
                {gender}
              </button>
            ))}
          </div>
        </div>

        <div className="profile-stats">
          <div>
            <strong>{profile.posts}</strong>
            <span>Posts</span>
          </div>
          <button type="button" onClick={() => onOpenFollowList('followers')}>
            <strong>{profile.followers}</strong>
            <span>Followers</span>
          </button>
          <button type="button" onClick={() => onOpenFollowList('following')}>
            <strong>{following.length}</strong>
            <span>Following</span>
          </button>
        </div>
      </div>
    </aside>
  );
}
