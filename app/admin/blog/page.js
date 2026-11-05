'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminBlogPage() {
  const router = useRouter();
  const [authed, setAuthed] = useState(false);
  const [checked, setChecked] = useState(false);
  const [posts, setPosts] = useState([]);
  const [view, setView] = useState('list'); // 'list' | 'new' | 'preview' | 'edit'
  const [editPost, setEditPost] = useState(null); // post being edited

  // Form state
  const [topic, setTopic] = useState('');
  const [keyPoints, setKeyPoints] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [generating, setGenerating] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [generated, setGenerated] = useState(null); // the AI result
  const [error, setError] = useState('');
  const fileRef = useRef();

  useEffect(() => {
    if (sessionStorage.getItem('rae-admin-auth') !== '1') {
      router.push('/admin');
      return;
    }
    setAuthed(true);
    setChecked(true);
    loadPosts();
  }, [router]);

  async function loadPosts() {
    try {
      const res = await fetch('/api/admin/blog');
      if (res.ok) setPosts(await res.json());
    } catch { /* ignore */ }
  }

  function handleImageChange(e) {
    const file = e.target.files[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  }

  async function uploadImage() {
    if (!imageFile) return null;
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append('file', imageFile);
      const res = await fetch('/api/admin/blog/upload', { method: 'POST', body: fd });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      return data.url;
    } finally {
      setUploading(false);
    }
  }

  async function handleGenerate() {
    if (!topic.trim()) { setError('Please enter a topic.'); return; }
    setError('');
    setGenerating(true);
    setGenerated(null);

    try {
      // Upload image first if provided
      let imageUrl = null;
      if (imageFile) imageUrl = await uploadImage();

      const res = await fetch('/api/admin/blog/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic, keyPoints, imageUrl }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setGenerated({ ...data, image_url: imageUrl });
      setView('preview');
    } catch (err) {
      setError(err.message);
    } finally {
      setGenerating(false);
    }
  }

  async function handlePublish() {
    if (!generated) return;
    setSaving(true);
    setError('');
    try {
      const res = await fetch('/api/admin/blog', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...generated, topic, key_points: keyPoints, published: true }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      await loadPosts();
      resetForm();
      setView('list');
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  async function handleSaveDraft() {
    if (!generated) return;
    setSaving(true);
    setError('');
    try {
      const res = await fetch('/api/admin/blog', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...generated, topic, key_points: keyPoints, published: false }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      await loadPosts();
      resetForm();
      setView('list');
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  async function togglePublish(post) {
    try {
      await fetch('/api/admin/blog', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: post.id, published: !post.published }),
      });
      await loadPosts();
    } catch { /* ignore */ }
  }

  async function deletePost(id) {
    if (!confirm('Delete this post?')) return;
    try {
      await fetch(`/api/admin/blog?id=${id}`, { method: 'DELETE' });
      await loadPosts();
    } catch { /* ignore */ }
  }

  async function handleUpdate() {
    if (!editPost) return;
    setSaving(true);
    setError('');
    try {
      const res = await fetch('/api/admin/blog', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: editPost.id,
          title: editPost.title,
          excerpt: editPost.excerpt,
          content: editPost.content,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      await loadPosts();
      setEditPost(null);
      setView('list');
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  function resetForm() {
    setTopic('');
    setKeyPoints('');
    setImageFile(null);
    setImagePreview(null);
    setGenerated(null);
    setError('');
    if (fileRef.current) fileRef.current.value = '';
  }

  if (!checked) return null;
  if (!authed) return null;

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* Header */}
      <div className="bg-[#1B3A5C] text-white px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <a href="/admin" className="text-blue-300 hover:text-white text-sm">← Dashboard</a>
          <h1 className="text-xl font-bold">Blog Manager</h1>
        </div>
        {(view === 'list' || view === 'edit') && (
          <button
            onClick={() => { resetForm(); setEditPost(null); setView('new'); }}
            className="bg-[#F59E0B] hover:bg-yellow-500 text-[#1B3A5C] font-bold px-4 py-2 rounded-xl text-sm transition-colors"
          >
            + New Post
          </button>
        )}
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">

        {/* ── LIST VIEW ── */}
        {view === 'list' && (
          <div>
            {posts.length === 0 ? (
              <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center text-gray-400">
                <div className="text-5xl mb-3">✍️</div>
                <p className="mb-4">No blog posts yet.</p>
                <button
                  onClick={() => setView('new')}
                  className="bg-[#1B3A5C] text-white px-6 py-2 rounded-xl font-semibold hover:bg-blue-900 transition-colors"
                >
                  Create Your First Post
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {posts.map((post) => (
                  <div key={post.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
                    {/* Title row */}
                    <div className="flex items-start justify-between gap-2 mb-3">
                      <div className="min-w-0">
                        <div className="font-semibold text-[#1B3A5C] leading-snug">{post.title}</div>
                        <div className="text-xs text-gray-400 mt-1">
                          {new Date(post.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                          {post.topic && <> · {post.topic}</>}
                        </div>
                      </div>
                      <span className={`text-xs px-2 py-1 rounded-full font-semibold shrink-0 ${post.published ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                        {post.published ? 'Published' : 'Draft'}
                      </span>
                    </div>
                    {/* Action buttons row */}
                    <div className="flex items-center gap-2 flex-wrap">
                      <button
                        onClick={() => togglePublish(post)}
                        className="text-xs border border-gray-300 px-3 py-2 rounded-lg hover:border-[#F59E0B] transition-colors"
                      >
                        {post.published ? 'Unpublish' : 'Publish'}
                      </button>
                      <button
                        onClick={() => { setEditPost({ ...post }); setView('edit'); }}
                        className="text-xs text-[#1B3A5C] border border-gray-300 px-3 py-2 rounded-lg hover:border-[#1B3A5C] transition-colors"
                      >
                        Edit
                      </button>
                      <a
                        href={`/blog/${post.slug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-[#1B3A5C] border border-gray-300 px-3 py-2 rounded-lg hover:border-[#1B3A5C] transition-colors"
                      >
                        View
                      </a>
                      <button
                        onClick={() => deletePost(post.id)}
                        className="text-xs text-red-500 border border-red-200 px-3 py-2 rounded-lg hover:bg-red-50 transition-colors ml-auto"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── NEW POST FORM ── */}
        {view === 'new' && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h2 className="text-xl font-bold text-[#1B3A5C] mb-1">Create New Blog Post</h2>
            <p className="text-gray-500 text-sm mb-6">Fill in the details below and Claude will write the full article for you.</p>

            <div className="space-y-5">
              {/* Topic */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Topic <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="e.g. Shirley Heights 2026: What My Clients Love Most"
                  className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#F59E0B]"
                />
              </div>

              {/* Key Points */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Key Points <span className="text-gray-400 font-normal">(one per line — helps Claude write what you want)</span>
                </label>
                <textarea
                  value={keyPoints}
                  onChange={(e) => setKeyPoints(e.target.value)}
                  rows={4}
                  placeholder={"- Best time to visit is Sunday for the party\n- Amazing views of English Harbour\n- My clients always ask me to wait and drive them back\n- Mention the rum punch"}
                  className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#F59E0B] resize-none font-mono text-sm"
                />
              </div>

              {/* Image Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Photo <span className="text-gray-400 font-normal">(take with your phone or upload)</span>
                </label>
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*"
                  capture="environment"
                  onChange={handleImageChange}
                  className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-[#1B3A5C] file:text-white hover:file:bg-blue-900"
                />
                {imagePreview && (
                  <div className="mt-3 relative h-40 rounded-xl overflow-hidden border border-gray-200">
                    <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                    <button
                      onClick={() => { setImageFile(null); setImagePreview(null); if (fileRef.current) fileRef.current.value = ''; }}
                      className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs"
                    >✕</button>
                  </div>
                )}
              </div>

              {error && <p className="text-red-500 text-sm">{error}</p>}

              <div className="flex gap-3">
                <button
                  onClick={handleGenerate}
                  disabled={generating || uploading}
                  className="flex-1 bg-[#1B3A5C] hover:bg-blue-900 disabled:opacity-60 text-white font-bold py-3 rounded-xl transition-colors flex items-center justify-center gap-2"
                >
                  {generating ? (
                    <><span className="animate-spin">⟳</span> Writing article...</>
                  ) : uploading ? (
                    <><span className="animate-spin">⟳</span> Uploading image...</>
                  ) : (
                    <>✨ Generate Article with AI</>
                  )}
                </button>
                <button
                  onClick={() => { resetForm(); setView('list'); }}
                  className="px-5 py-3 border border-gray-300 rounded-xl text-gray-600 hover:border-gray-400 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ── PREVIEW ── */}
        {view === 'preview' && generated && (
          <div>
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-5">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-[#1B3A5C]">Preview & Publish</h2>
                <button
                  onClick={() => setView('new')}
                  className="text-sm text-gray-500 hover:text-gray-700"
                >
                  ← Edit inputs
                </button>
              </div>

              {/* Editable title */}
              <div className="mb-4">
                <label className="block text-xs text-gray-400 mb-1 uppercase tracking-wide">Title</label>
                <input
                  value={generated.title}
                  onChange={(e) => setGenerated({ ...generated, title: e.target.value })}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2 font-bold text-[#1B3A5C] text-lg focus:outline-none focus:ring-2 focus:ring-[#F59E0B]"
                />
              </div>

              {/* Editable excerpt */}
              <div className="mb-4">
                <label className="block text-xs text-gray-400 mb-1 uppercase tracking-wide">Excerpt (SEO description)</label>
                <textarea
                  value={generated.excerpt}
                  onChange={(e) => setGenerated({ ...generated, excerpt: e.target.value })}
                  rows={2}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2 text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-[#F59E0B] resize-none"
                />
              </div>

              {generated.image_url && (
                <div className="relative h-48 rounded-xl overflow-hidden mb-4 border border-gray-100">
                  <img src={generated.image_url} alt="Blog" className="w-full h-full object-cover" />
                </div>
              )}

              {/* Article content preview */}
              <div className="border border-gray-100 rounded-xl p-5 bg-[#F8FAFC]">
                <div
                  className="prose prose-lg max-w-none prose-headings:text-[#1B3A5C] prose-a:text-blue-600 prose-a:underline hover:prose-a:text-blue-800 prose-p:mb-5 prose-p:leading-relaxed prose-headings:mt-8 prose-headings:mb-3 prose-h2:font-bold prose-h2:text-xl prose-strong:text-[#1B3A5C]"
                  dangerouslySetInnerHTML={{ __html: generated.content }}
                />
              </div>
            </div>

            {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

            <div className="flex gap-3">
              <button
                onClick={handlePublish}
                disabled={saving}
                className="flex-1 bg-[#16A34A] hover:bg-green-700 disabled:opacity-60 text-white font-bold py-3 rounded-xl transition-colors"
              >
                {saving ? 'Publishing...' : '🚀 Publish Now'}
              </button>
              <button
                onClick={handleSaveDraft}
                disabled={saving}
                className="flex-1 border-2 border-[#1B3A5C] text-[#1B3A5C] hover:bg-[#1B3A5C] hover:text-white disabled:opacity-60 font-bold py-3 rounded-xl transition-colors"
              >
                Save as Draft
              </button>
              <button
                onClick={() => { resetForm(); setView('list'); }}
                className="px-5 py-3 border border-gray-300 rounded-xl text-gray-600 hover:border-gray-400 transition-colors"
              >
                Discard
              </button>
            </div>
          </div>
        )}

        {/* ── EDIT VIEW ── */}
        {view === 'edit' && editPost && (
          <div>
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-5">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-[#1B3A5C]">Edit Post</h2>
                <button
                  onClick={() => { setEditPost(null); setView('list'); }}
                  className="text-sm text-gray-500 hover:text-gray-700"
                >
                  ← Back to list
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs text-gray-400 mb-1 uppercase tracking-wide">Title</label>
                  <input
                    value={editPost.title}
                    onChange={(e) => setEditPost({ ...editPost, title: e.target.value })}
                    className="w-full border border-gray-200 rounded-xl px-4 py-2 font-bold text-[#1B3A5C] text-lg focus:outline-none focus:ring-2 focus:ring-[#F59E0B]"
                  />
                </div>

                <div>
                  <label className="block text-xs text-gray-400 mb-1 uppercase tracking-wide">Excerpt (SEO description)</label>
                  <textarea
                    value={editPost.excerpt}
                    onChange={(e) => setEditPost({ ...editPost, excerpt: e.target.value })}
                    rows={2}
                    className="w-full border border-gray-200 rounded-xl px-4 py-2 text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-[#F59E0B] resize-none"
                  />
                </div>

                <div>
                  <label className="block text-xs text-gray-400 mb-1 uppercase tracking-wide">Content (HTML)</label>
                  <textarea
                    value={editPost.content}
                    onChange={(e) => setEditPost({ ...editPost, content: e.target.value })}
                    rows={12}
                    className="w-full border border-gray-200 rounded-xl px-4 py-2 text-xs text-gray-600 font-mono focus:outline-none focus:ring-2 focus:ring-[#F59E0B] resize-y"
                  />
                </div>

                <div className="border border-gray-100 rounded-xl p-5 bg-[#F8FAFC]">
                  <p className="text-xs text-gray-400 uppercase tracking-wide mb-3">Preview</p>
                  <div
                    className="prose prose-lg max-w-none prose-headings:text-[#1B3A5C] prose-a:text-blue-600 prose-a:underline hover:prose-a:text-blue-800 prose-p:mb-5 prose-p:leading-relaxed prose-headings:mt-8 prose-headings:mb-3 prose-h2:font-bold prose-h2:text-xl prose-strong:text-[#1B3A5C]"
                    dangerouslySetInnerHTML={{ __html: editPost.content }}
                  />
                </div>
              </div>
            </div>

            {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

            <div className="flex gap-3">
              <button
                onClick={handleUpdate}
                disabled={saving}
                className="flex-1 bg-[#1B3A5C] hover:bg-blue-900 disabled:opacity-60 text-white font-bold py-3 rounded-xl transition-colors"
              >
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
              <button
                onClick={() => { setEditPost(null); setView('list'); }}
                className="px-5 py-3 border border-gray-300 rounded-xl text-gray-600 hover:border-gray-400 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
