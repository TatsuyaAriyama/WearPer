import { useEffect, useMemo, useState } from 'react';
import { addDoc, collection, getDocs } from 'firebase/firestore';
import {
  ArrowDownUp,
  Bell,
  Home,
  ImagePlus,
  MoveDown,
  MoveUp,
  PlusSquare,
  Search,
  Send,
  Shirt,
  Sparkles,
  User,
} from 'lucide-react';
import ClosetAnalysis from './components/ClosetAnalysis.jsx';
import ClosetForm from './components/ClosetForm.jsx';
import ClothingList from './components/ClothingList.jsx';
import PostForm from './components/PostForm.jsx';
import ProfilePanel from './components/ProfilePanel.jsx';
import { dummyClothes } from './data/dummyClothes.js';
import { db, hasFirebaseConfig } from './firebase/config.js';

const initialProfile = {
  name: 'Tatsuya',
  handle: '@wearper',
  userId: 'wearper',
  gender: 'Men',
  posts: 0,
  followers: 128,
  avatarUrl: '',
};

const storageVersion = 'social-closet-v2';

const tabs = [
  { id: 'feed', label: '投稿', icon: Home },
  { id: 'closet', label: 'Closet', icon: Shirt },
  { id: 'analysis', label: '最適化', icon: Sparkles },
  { id: 'dm', label: 'DM', icon: Send },
  { id: 'search', label: '検索', icon: Search },
  { id: 'profile', label: 'プロフィール', icon: User },
];

const socialUsers = [
  {
    id: 'stylist-1',
    userId: 'minimal_room',
    name: 'Minimal Room',
    handle: '@minimal_room',
    followsMe: true,
    bio: 'ミニマル服と着回しの記録',
  },
  {
    id: 'stylist-2',
    userId: 'urban_daily',
    name: 'Urban Daily',
    handle: '@urban_daily',
    followsMe: true,
    bio: '仕事服と休日服の間を探す人',
  },
  {
    id: 'stylist-3',
    userId: 'clean_closet',
    name: 'Clean Closet',
    handle: '@clean_closet',
    followsMe: false,
    bio: 'クローゼットを少なく、強く',
  },
];

const initialMessages = [
  {
    id: 'stylist-1',
    name: 'Minimal Room',
    text: '白Tなら週3運用いけそう。洗濯耐久だけ見たい。',
    time: '2m',
    chat: [
      { id: 'dm-1-a', from: 'them', type: 'text', text: '白Tなら週3運用いけそう。洗濯耐久だけ見たい。' },
    ],
  },
  {
    id: 'stylist-2',
    name: 'Urban Daily',
    text: 'タックワイドパンツ、黒よりグレーのほうが着回せた。',
    time: '18m',
    chat: [
      { id: 'dm-2-a', from: 'them', type: 'text', text: 'タックワイドパンツ、黒よりグレーのほうが着回せた。' },
    ],
  },
];

function getCostPerWear(item) {
  const wearCount = item.wearCount ?? item.estimatedWearCount ?? 0;
  if (!item.price || !wearCount) return Number.POSITIVE_INFINITY;
  return item.price / wearCount;
}

export default function App() {
  const [activeTab, setActiveTab] = useState('feed');
  const [posts, setPosts] = useState([]);
  const [closetItems, setClosetItems] = useState([]);
  const [sortOrder, setSortOrder] = useState('asc');
  const [isLoading, setIsLoading] = useState(true);
  const [notice, setNotice] = useState('');
  const [profile, setProfile] = useState(initialProfile);
  const [following, setFollowing] = useState(['stylist-1']);
  const [likedIds, setLikedIds] = useState([]);
  const [savedIds, setSavedIds] = useState([]);
  const [repostedIds, setRepostedIds] = useState([]);
  const [commentsById, setCommentsById] = useState({});
  const [messages, setMessages] = useState(initialMessages);
  const [activeMessageId, setActiveMessageId] = useState(initialMessages[0].id);
  const [activeProfileId, setActiveProfileId] = useState(socialUsers[0].id);
  const [dmDraft, setDmDraft] = useState('');
  const [closetCategory, setClosetCategory] = useState('All');
  const [todayOutfitIds, setTodayOutfitIds] = useState([]);
  const [userSearchId, setUserSearchId] = useState('');
  const [followBurstId, setFollowBurstId] = useState('');

  useEffect(() => {
    const savedVersion = localStorage.getItem('wearper-storage-version');
    if (savedVersion !== storageVersion) {
      localStorage.removeItem('wearper-clothes');
      localStorage.removeItem('wearper-posts');
      localStorage.setItem('wearper-storage-version', storageVersion);
    }

    const savedProfile = localStorage.getItem('wearper-profile');
    const savedPosts = localStorage.getItem('wearper-posts');
    const savedCloset = localStorage.getItem('wearper-closet');
    const savedMessages = localStorage.getItem('wearper-messages');
    const savedFollowing = localStorage.getItem('wearper-following');

    if (savedProfile) {
      setProfile(JSON.parse(savedProfile));
    }

    if (savedMessages) {
      setMessages(JSON.parse(savedMessages));
    }

    if (savedFollowing) {
      setFollowing(JSON.parse(savedFollowing));
    }

    if (savedCloset) {
      setClosetItems(
        JSON.parse(savedCloset).map((item, index) => ({
          ...item,
          wearCount: item.wearCount ?? item.estimatedWearCount ?? 0,
          estimatedWearCount: item.wearCount ?? item.estimatedWearCount ?? 0,
          order: item.order ?? index + 1,
        })),
      );
    }

    if (savedPosts) {
      setPosts(JSON.parse(savedPosts));
      setNotice('Saved');
      setIsLoading(false);
      return;
    }

    async function fetchClothes() {
      if (!hasFirebaseConfig || !db) {
        setPosts(dummyClothes);
        setNotice('Demo mode');
        setIsLoading(false);
        return;
      }

      try {
        const snapshot = await getDocs(collection(db, 'posts'));
        const firestoreClothes = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setPosts(firestoreClothes.length > 0 ? firestoreClothes : dummyClothes);
        setNotice(firestoreClothes.length > 0 ? 'Live' : 'Demo mode');
      } catch (error) {
        console.error(error);
        setPosts(dummyClothes);
        setNotice('Demo mode');
      } finally {
        setIsLoading(false);
      }
    }

    fetchClothes();
  }, []);

  useEffect(() => {
    localStorage.setItem('wearper-profile', JSON.stringify(profile));
  }, [profile]);

  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem('wearper-posts', JSON.stringify(posts));
    }
  }, [posts, isLoading]);

  useEffect(() => {
    localStorage.setItem('wearper-closet', JSON.stringify(closetItems));
  }, [closetItems]);

  useEffect(() => {
    localStorage.setItem('wearper-messages', JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    localStorage.setItem('wearper-following', JSON.stringify(following));
  }, [following]);

  const sortedClothes = useMemo(() => {
    const filtered =
      closetCategory === 'All'
        ? closetItems
        : closetItems.filter((item) => item.category === closetCategory);

    return [...filtered].sort((a, b) => {
      if (sortOrder === 'custom') return (a.order || 0) - (b.order || 0);
      const diff = getCostPerWear(a) - getCostPerWear(b);
      return sortOrder === 'asc' ? diff : -diff;
    });
  }, [closetItems, sortOrder, closetCategory]);

  const todayOutfitItems = useMemo(
    () => closetItems.filter((item) => todayOutfitIds.includes(item.id)),
    [closetItems, todayOutfitIds],
  );

  const todayOutfitTotal = useMemo(() => {
    return todayOutfitItems.reduce((sum, item) => {
      const nextWearCount = (item.wearCount || 0) + 1;
      return sum + item.price / nextWearCount;
    }, 0);
  }, [todayOutfitItems]);

  const mutualUsers = useMemo(
    () => socialUsers.filter((user) => user.followsMe && following.includes(user.id)),
    [following],
  );

  const searchedUsers = useMemo(() => {
    const query = userSearchId.trim().replace(/^@/, '').toLowerCase();
    if (!query) return socialUsers;

    return socialUsers.filter((user) =>
      [user.userId, user.handle.replace('@', ''), user.name]
        .join(' ')
        .toLowerCase()
        .includes(query),
    );
  }, [userSearchId]);

  async function handleAddPost(newItem) {
    const temporaryItem = {
      id: crypto.randomUUID(),
      authorName: profile.name,
      authorHandle: `@${profile.userId || 'wearper'}`,
      avatarUrl: profile.avatarUrl,
      postText: newItem.postText || '',
      likes: 0,
      comments: [],
      ...newItem,
    };

    setPosts((current) => [temporaryItem, ...current]);
    setActiveTab('feed');

    if (!hasFirebaseConfig || !db) {
      setNotice('Demo mode');
      return;
    }

    try {
      const docRef = await addDoc(collection(db, 'posts'), temporaryItem);
      setPosts((current) =>
        current.map((item) =>
          item.id === temporaryItem.id ? { ...temporaryItem, id: docRef.id } : item,
        ),
      );
      setNotice('Live');
    } catch (error) {
      console.error(error);
      setNotice('Demo mode');
    }
  }

  async function handleAddClosetItem(item) {
    setClosetItems((current) => [item, ...current]);

    if (!hasFirebaseConfig || !db) return;

    try {
      await addDoc(collection(db, 'clothes'), {
        name: item.name,
        price: item.price,
        wearCount: item.wearCount || 0,
        category: item.category,
        season: item.season,
        imageUrl: item.imageUrl || '',
        order: item.order || Date.now(),
      });
    } catch (error) {
      console.error(error);
    }
  }

  function handleToggleTodayItem(itemId) {
    setTodayOutfitIds((current) =>
      current.includes(itemId) ? current.filter((id) => id !== itemId) : [...current, itemId],
    );
  }

  function handleSaveTodayOutfit() {
    if (todayOutfitIds.length === 0) return;

    setClosetItems((current) =>
      current.map((item) =>
        todayOutfitIds.includes(item.id)
          ? {
              ...item,
              wearCount: (item.wearCount || 0) + 1,
              estimatedWearCount: (item.wearCount || 0) + 1,
              lastWornAt: new Date().toISOString(),
            }
          : item,
      ),
    );
    setTodayOutfitIds([]);
  }

  function handleMoveClosetItem(itemId, direction) {
    const ordered = [...closetItems].sort((a, b) => (a.order || 0) - (b.order || 0));
    const index = ordered.findIndex((item) => item.id === itemId);
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (index < 0 || targetIndex < 0 || targetIndex >= ordered.length) return;

    const next = [...ordered];
    [next[index], next[targetIndex]] = [next[targetIndex], next[index]];
    setClosetItems(next.map((item, itemIndex) => ({ ...item, order: itemIndex + 1 })));
    setSortOrder('custom');
  }

  function handleToggleFollow(userId) {
    setFollowing((current) => {
      if (current.includes(userId)) return current.filter((id) => id !== userId);
      setFollowBurstId(userId);
      window.setTimeout(() => setFollowBurstId(''), 650);
      return [...current, userId];
    });
  }

  function isMutual(userId) {
    const user = socialUsers.find((item) => item.id === userId);
    return Boolean(user?.followsMe && following.includes(userId));
  }

  function openUserProfile(userId) {
    setActiveProfileId(userId);
    setActiveTab('userProfile');
  }

  function openDm(userId) {
    if (!isMutual(userId)) return;
    ensureMessageThread(userId);
    setActiveMessageId(userId);
    setActiveTab('dm');
  }

  function ensureMessageThread(userId) {
    const user = socialUsers.find((item) => item.id === userId);
    if (!user) return;

    setMessages((current) => {
      if (current.some((thread) => thread.id === userId)) return current;
      return [
        ...current,
        {
          id: user.id,
          name: user.name,
          text: '',
          time: 'now',
          chat: [],
        },
      ];
    });
  }

  function toggleId(setter, itemId) {
    setter((current) =>
      current.includes(itemId) ? current.filter((id) => id !== itemId) : [...current, itemId],
    );
  }

  function handleAddComment(itemId, comment) {
    setCommentsById((current) => ({
      ...current,
      [itemId]: [...(current[itemId] || []), comment],
    }));
  }

  function handleSendMessage(text) {
    const message = text.trim();
    if (!message || !activeMessageId) return;

    setMessages((current) =>
      current.map((thread) =>
        thread.id === activeMessageId
          ? {
              ...thread,
              text: message,
              time: 'now',
              chat: [
                ...(thread.chat || []),
                { id: crypto.randomUUID(), from: 'me', type: 'text', text: message },
              ],
            }
          : thread,
      ),
    );
    setDmDraft('');
  }

  function handleSendDmImage(event) {
    const file = event.target.files?.[0];
    if (!file || !activeMessageId) return;

    const reader = new FileReader();
    reader.onload = () => {
      const imageUrl = reader.result;
      setMessages((current) =>
        current.map((thread) =>
          thread.id === activeMessageId
            ? {
                ...thread,
                text: '画像を送信しました',
                time: 'now',
                chat: [
                  ...(thread.chat || []),
                  { id: crypto.randomUUID(), from: 'me', type: 'image', imageUrl },
                ],
              }
            : thread,
        ),
      );
    };
    reader.readAsDataURL(file);
    event.target.value = '';
  }

  function renderFeed() {
    return (
      <section className="screen feed-screen">
        <div className="screen-toolbar">
          <div>
            <h1>WearPer</h1>
            <p>{notice}</p>
          </div>
          <button
            type="button"
            className="icon-text-button"
            onClick={() => setActiveTab('closet')}
            aria-label="Closetを開く"
          >
            <Shirt size={18} />
            Closet
          </button>
        </div>

        <button type="button" className="composer-strip" onClick={() => setActiveTab('post')}>
          {profile.avatarUrl ? (
            <img src={profile.avatarUrl} alt={profile.name} />
          ) : (
            <b>{profile.name.slice(0, 1)}</b>
          )}
          <span>服のコスパ相談を投稿</span>
          <PlusSquare size={20} />
        </button>

        {isLoading ? (
          <p className="empty-message">読み込み中...</p>
        ) : (
          <ClothingList
            clothes={posts}
            likedIds={likedIds}
            savedIds={savedIds}
            repostedIds={repostedIds}
            commentsById={commentsById}
            onToggleLike={(itemId) => toggleId(setLikedIds, itemId)}
            onToggleSave={(itemId) => toggleId(setSavedIds, itemId)}
            onToggleRepost={(itemId) => toggleId(setRepostedIds, itemId)}
            onAddComment={handleAddComment}
          />
        )}
      </section>
    );
  }

  function renderDm() {
    return (
      <section className="screen dm-screen">
        <div className="screen-toolbar">
          <h1>Messages</h1>
          <Bell size={20} />
        </div>
        <label className="search-field">
          <Search size={18} />
          <input placeholder="DMを検索" />
        </label>
        <div className="dm-layout">
          <div className="message-list">
            {mutualUsers.length === 0 ? (
              <p className="empty-message">相互フォローのユーザーのみDMできます。</p>
            ) : mutualUsers.map((user) => {
              const message = messages.find((thread) => thread.id === user.id) || {
                id: user.id,
                name: user.name,
                text: '',
                time: '',
              };

              return (
            <button
              type="button"
              className={`message-row ${activeMessageId === message.id ? 'is-active' : ''}`}
              key={message.id}
              onClick={() => {
                ensureMessageThread(user.id);
                setActiveMessageId(user.id);
              }}
            >
              <span className="message-avatar">{message.name.slice(0, 1)}</span>
              <span>
                <strong>{message.name}</strong>
                <small>{message.text || 'DMを開始'}</small>
              </span>
              <time>{message.time}</time>
            </button>
              );
            })}
          </div>
          <div className="chat-panel">
            {(messages.find((message) => message.id === activeMessageId)?.chat || [
              { id: 'starter-1', from: 'them', type: 'text', text: '気になる服があれば送って。' },
            ]).map((chat) => (
              <div key={chat.id} className={`chat-bubble ${chat.from === 'me' ? 'from-me' : ''}`}>
                {chat.type === 'image' ? <img src={chat.imageUrl} alt="DM画像" /> : chat.text}
              </div>
            ))}
            {dmDraft && (
              <div className="typing-indicator">
                {messages.find((message) => message.id === activeMessageId)?.name || '相手'}が入力しています
              </div>
            )}
            <form
              className="dm-compose"
              onSubmit={(event) => {
                event.preventDefault();
                handleSendMessage(dmDraft);
              }}
            >
              <label className="dm-image-button" aria-label="画像を送信">
                <ImagePlus size={19} />
                <input type="file" accept="image/*" onChange={handleSendDmImage} />
              </label>
              <input
                name="message"
                value={dmDraft}
                onChange={(event) => setDmDraft(event.target.value)}
                placeholder="メッセージを入力"
              />
              <button type="submit">Send</button>
            </form>
          </div>
        </div>
      </section>
    );
  }

  function renderSearch() {
    return (
      <section className="screen search-screen">
        <label className="search-field">
          <Search size={18} />
          <input
            value={userSearchId}
            onChange={(event) => setUserSearchId(event.target.value)}
            placeholder="ユーザーIDで検索"
          />
        </label>
        <div className="explore-grid">
          {posts.length === 0 ? (
            <p className="empty-message">まだ検索できる投稿がありません。</p>
          ) : (
            posts.map((item) => (
              <button type="button" className="explore-tile" key={`search-${item.id}`}>
                {item.imageUrl ? (
                  <img src={item.imageUrl} alt={item.postText || '投稿画像'} />
                ) : (
                  <div className="image-placeholder">No image</div>
                )}
                <span>{item.postText || item.linkedClosetItemName || 'WearPer post'}</span>
              </button>
            ))
          )}
        </div>
        <div className="people-list">
          <div className="people-heading">
            <span>ID Search</span>
            <strong>{searchedUsers.length} users</strong>
          </div>
          {searchedUsers.length === 0 ? (
            <p className="empty-message">該当するユーザーが見つかりません。</p>
          ) : searchedUsers.map((user) => {
            const mutual = isMutual(user.id);
            const isFollowing = following.includes(user.id);
            return (
              <article
                className={`person-row ${isFollowing ? 'is-following' : ''} ${
                  followBurstId === user.id ? 'did-follow' : ''
                }`}
                key={user.id}
              >
                <button type="button" onClick={() => openUserProfile(user.id)}>
                  <span className="message-avatar">{user.name.slice(0, 1)}</span>
                  <span>
                    <strong>{user.name}</strong>
                    <small>@{user.userId}</small>
                  </span>
                </button>
                <button
                  type="button"
                  className={`follow-button ${isFollowing ? 'is-following' : ''}`}
                  onClick={() => handleToggleFollow(user.id)}
                >
                  {isFollowing ? 'フォロー中' : 'フォロー'}
                </button>
                <button
                  type="button"
                  className="profile-icon-button"
                  disabled={!mutual}
                  onClick={() => openDm(user.id)}
                  aria-label="DM"
                >
                  <Send size={19} />
                </button>
              </article>
            );
          })}
        </div>
      </section>
    );
  }

  function renderProfile() {
    return (
      <section className="screen profile-screen">
        <ProfilePanel
          profile={{ ...profile, posts: posts.length }}
          onNameChange={(name) => setProfile((current) => ({ ...current, name }))}
          onUserIdChange={(userId) =>
            setProfile((current) => ({
              ...current,
              userId,
              handle: `@${userId || 'wearper'}`,
            }))
          }
          onGenderChange={(gender) => setProfile((current) => ({ ...current, gender }))}
          onAvatarChange={(avatarUrl) => setProfile((current) => ({ ...current, avatarUrl }))}
          following={following}
          onToggleFollow={handleToggleFollow}
        />
        <div className="closet-map">
          {sortedClothes.length === 0 ? (
            <p className="empty-message">Closetに登録すると、ここにコスパ順のクローゼットマップができます。</p>
          ) : (
            sortedClothes.map((item, index) => {
              const cost = Math.round(getCostPerWear(item));
              const score = Math.max(12, 100 - Math.min(cost / 10, 88));

              return (
                <article className="closet-node" key={`profile-${item.id}`}>
                  <div className="node-rank">{String(index + 1).padStart(2, '0')}</div>
                  <div className="node-media">
                    {item.imageUrl ? (
                      <img src={item.imageUrl} alt={item.name} />
                    ) : (
                      <div className="image-placeholder">No image</div>
                    )}
                  </div>
                  <div className="node-body">
                    <strong>{item.name}</strong>
                    <span>{cost.toLocaleString('ja-JP')}円 / 回</span>
                    <i style={{ width: `${score}%` }} />
                  </div>
                </article>
              );
            })
          )}
        </div>
      </section>
    );
  }

  function renderPost() {
    return (
      <section className="screen post-screen">
        <div className="screen-toolbar">
          <h1>New Post</h1>
          <button type="button" className="ghost-button" onClick={() => setActiveTab('feed')}>
            Cancel
          </button>
        </div>
        <PostForm closetItems={closetItems} onAdd={handleAddPost} />
      </section>
    );
  }

  function renderCloset() {
    return (
      <section className="screen closet-screen">
        <div className="screen-toolbar">
          <div>
            <h1>Closet</h1>
            <p>服の管理とコスパ計算</p>
          </div>
          <button
            type="button"
            className="icon-text-button"
            onClick={() => setSortOrder((current) => (current === 'asc' ? 'desc' : 'asc'))}
          >
            <ArrowDownUp size={18} />
            {sortOrder === 'asc' ? '安い順' : '高い順'}
          </button>
        </div>
        <ClosetForm onAdd={handleAddClosetItem} />
        <section className="outfit-panel">
          <div className="section-heading">
            <span>Today</span>
            <h2>今日のコーデ</h2>
          </div>
          <div className="outfit-summary">
            <div>
              <span>選択中</span>
              <strong>{todayOutfitIds.length}点</strong>
            </div>
            <div>
              <span>今日の合計</span>
              <strong>
                {todayOutfitTotal
                  ? `${Math.round(todayOutfitTotal).toLocaleString('ja-JP')}円`
                  : '-'}
              </strong>
            </div>
          </div>
          <button type="button" className="outfit-save-button" onClick={handleSaveTodayOutfit}>
            着用として記録
          </button>
        </section>
        <div className="closet-filter">
          {['All', 'Tops', 'Outer', 'Pants', 'Shoes', 'Accessory'].map((category) => (
            <button
              key={category}
              type="button"
              className={closetCategory === category ? 'is-active' : ''}
              onClick={() => setClosetCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>
        <div className="closet-list">
          {sortedClothes.length === 0 ? (
            <p className="empty-message">まずは服を登録。投稿はあとで自由に紐付けできます。</p>
          ) : (
            sortedClothes.map((item) => {
              const cost = Math.round(getCostPerWear(item));
              return (
                <article
                  className={`closet-book ${todayOutfitIds.includes(item.id) ? 'is-selected' : ''}`}
                  key={item.id}
                >
                  <button
                    type="button"
                    className="closet-cover"
                    onClick={() => handleToggleTodayItem(item.id)}
                  >
                    {item.imageUrl ? (
                      <img src={item.imageUrl} alt={item.name} />
                    ) : (
                      <span>{item.name.slice(0, 1)}</span>
                    )}
                  </button>
                  <div className="closet-book-body">
                    <strong>{item.name}</strong>
                    <span>{item.category}</span>
                    <dl>
                      <div>
                        <dt>着用</dt>
                        <dd>{item.wearCount || 0}回</dd>
                      </div>
                      <div>
                        <dt>1回</dt>
                        <dd>{Number.isFinite(cost) ? `${cost.toLocaleString('ja-JP')}円` : '-'}</dd>
                      </div>
                    </dl>
                  </div>
                  <div className="closet-move">
                    <button type="button" onClick={() => handleMoveClosetItem(item.id, 'up')} aria-label="上へ">
                      <MoveUp size={15} />
                    </button>
                    <button type="button" onClick={() => handleMoveClosetItem(item.id, 'down')} aria-label="下へ">
                      <MoveDown size={15} />
                    </button>
                  </div>
                </article>
              );
            })
          )}
        </div>
      </section>
    );
  }

  function renderAnalysis() {
    return <ClosetAnalysis fallbackItems={closetItems} gender={profile.gender} />;
  }

  function renderUserProfile() {
    const user = socialUsers.find((item) => item.id === activeProfileId) || socialUsers[0];
    const mutual = isMutual(user.id);
    const isFollowing = following.includes(user.id);

    return (
      <section className="screen other-profile-screen">
        <div className="screen-toolbar">
          <h1>@{user.userId}</h1>
          <button type="button" className="ghost-button" onClick={() => setActiveTab('search')}>
            Back
          </button>
        </div>
        <div className="other-profile-card">
          <span className="profile-large-avatar">{user.name.slice(0, 1)}</span>
          <div>
            <strong>{user.name}</strong>
            <small>{user.bio}</small>
          </div>
          <div className="profile-actions">
            <button
              type="button"
              className={isFollowing ? 'is-active' : ''}
              onClick={() => handleToggleFollow(user.id)}
            >
              {isFollowing ? 'フォロー中' : 'フォロー'}
            </button>
            <button
              type="button"
              className="profile-icon-button"
              disabled={!mutual}
              onClick={() => openDm(user.id)}
              aria-label="DM"
            >
              <Send size={20} />
            </button>
          </div>
        </div>
      </section>
    );
  }

  const screens = {
    feed: renderFeed,
    closet: renderCloset,
    analysis: renderAnalysis,
    post: renderPost,
    dm: renderDm,
    search: renderSearch,
    profile: renderProfile,
    userProfile: renderUserProfile,
  };

  return (
    <main className="app-shell">
      {screens[activeTab]()}

      <nav className="bottom-nav" aria-label="メインナビゲーション">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              type="button"
              className={isActive ? 'is-active' : ''}
              onClick={() => setActiveTab(tab.id)}
            >
              <Icon size={22} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </nav>
    </main>
  );
}
