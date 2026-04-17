import { useEffect, useState, useRef } from 'react';
import { useNavigate, Link } from 'react-router';
import {
  fetchPlaygroundItems,
  createPlaygroundItem,
  updatePlaygroundItem,
  deletePlaygroundItem,
  fetchSettings,
  updateSettings,
  uploadImage
} from '../../../models/adminApi';
import { isPlaygroundDirectImageUrl } from '../../../models/playgroundImage';
import { DEFAULT_SHOWCASE_SLIDES, type ShowcaseSlide } from '../../../models/showcaseDefaults';

interface PlaygroundItem {
  _id: string;
  id?: string;
  title: string;
  type: string;
  image: string;
  description: string;
  tools: string[];
  year: string;
}

const EMPTY_ITEM: Omit<PlaygroundItem, '_id'> = {
  title: '',
  type: '',
  image: '',
  description: '',
  tools: [],
  year: new Date().getFullYear().toString()
};

type ActiveSection = 'playground' | 'hero' | 'showcase' | 'profile';

export function AdminDashboardPage() {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState<ActiveSection>('playground');
  const [items, setItems] = useState<PlaygroundItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [adminUser, setAdminUser] = useState<any>(null);
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState<PlaygroundItem | null>(null);
  const [formData, setFormData] = useState(EMPTY_ITEM);
  const [toolInput, setToolInput] = useState('');
  const [saving, setSaving] = useState(false);
  const [notification, setNotification] = useState<{ type: string; message: string } | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  // Hero settings state
  const [heroImage, setHeroImage] = useState('');
  const [heroImageType, setHeroImageType] = useState('local');
  const [heroSaving, setHeroSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [modalImageUploading, setModalImageUploading] = useState(false);
  const [modalDragOver, setModalDragOver] = useState(false);
  const playgroundFileInputRef = useRef<HTMLInputElement>(null);

  // Admin Profile state
  const [adminProfileImage, setAdminProfileImage] = useState('');
  const [profileUploading, setProfileUploading] = useState(false);
  const [profileDragOver, setProfileDragOver] = useState(false);
  const profileFileInputRef = useRef<HTMLInputElement>(null);
  const [profileSaving, setProfileSaving] = useState(false);

  const [showcaseSlides, setShowcaseSlides] = useState<ShowcaseSlide[]>(() =>
    DEFAULT_SHOWCASE_SLIDES.map((s) => ({ ...s }))
  );
  const [showcaseSaving, setShowcaseSaving] = useState(false);
  const [showcaseUploadIndex, setShowcaseUploadIndex] = useState<number | null>(null);
  const showcaseFileRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    const user = localStorage.getItem('adminUser');
    if (!token) {
      navigate('/admin/login');
      return;
    }
    if (user) setAdminUser(JSON.parse(user));
    loadItems();
    loadSettings();
  }, []);

  const showNotification = (type: string, message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 3000);
  };

  const loadItems = async () => {
    try {
      const data = await fetchPlaygroundItems();
      setItems(data);
    } catch (err: any) {
      if (err.message.includes('Not authorized')) {
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminUser');
        navigate('/admin/login');
      }
      showNotification('error', err.message);
    } finally {
      setLoading(false);
    }
  };

  const loadSettings = async () => {
    try {
      const data = await fetchSettings();
      setHeroImage(data.heroImage || '');
      setHeroImageType(data.heroImageType || 'url');
      setAdminProfileImage(data.adminProfileImage || '');
      const slides = data.showcaseSlides;
      if (Array.isArray(slides) && slides.length > 0) {
        setShowcaseSlides(
          slides.map((s: ShowcaseSlide) => ({
            url: (s.url || '').trim(),
            alt: (s.alt || 'Showcase').trim() || 'Showcase'
          }))
        );
      } else {
        setShowcaseSlides(DEFAULT_SHOWCASE_SLIDES.map((s) => ({ ...s })));
      }
    } catch (err: any) {
      // silently fail — settings are optional
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    navigate('/admin/login');
  };

  const openAddModal = () => {
    setEditingItem(null);
    setFormData(EMPTY_ITEM);
    setToolInput('');
    setShowModal(true);
  };

  const openEditModal = (item: PlaygroundItem) => {
    setEditingItem(item);
    setFormData({
      title: item.title,
      type: item.type,
      image: item.image,
      description: item.description,
      tools: [...item.tools],
      year: item.year
    });
    setToolInput('');
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingItem(null);
    setFormData(EMPTY_ITEM);
    setToolInput('');
  };

  const addTool = () => {
    const tool = toolInput.trim();
    if (tool && !formData.tools.includes(tool)) {
      setFormData({ ...formData, tools: [...formData.tools, tool] });
      setToolInput('');
    }
  };

  const removeTool = (index: number) => {
    setFormData({ ...formData, tools: formData.tools.filter((_, i) => i !== index) });
  };

  const handleSave = async () => {
    if (!formData.title || !formData.type) {
      showNotification('error', 'Title and type are required');
      return;
    }

    setSaving(true);
    try {
      if (editingItem) {
        const updated = await updatePlaygroundItem(editingItem._id, formData);
        setItems(items.map(i => i._id === editingItem._id ? updated : i));
        showNotification('success', 'Item updated successfully');
      } else {
        const newItem = await createPlaygroundItem(formData);
        setItems([...items, newItem]);
        showNotification('success', 'Item created successfully');
      }
      closeModal();
    } catch (err: any) {
      showNotification('error', err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deletePlaygroundItem(id);
      setItems(items.filter(i => i._id !== id));
      setDeleteConfirm(null);
      showNotification('success', 'Item deleted successfully');
    } catch (err: any) {
      showNotification('error', err.message);
    }
  };

  const handleHeroSave = async () => {
    setHeroSaving(true);
    try {
      await updateSettings({ heroImage, heroImageType });
      showNotification('success', 'Hero image updated successfully');
    } catch (err: any) {
      showNotification('error', err.message);
    } finally {
      setHeroSaving(false);
    }
  };

  const handleProfileImageUpload = async (file: File) => {
    setProfileUploading(true);
    try {
      const data = await uploadImage(file, 'admin-profile');
      setAdminProfileImage(data.url);
      showNotification('success', 'Profile image uploaded to Cloudinary');
    } catch (err: any) {
      showNotification('error', err.message);
    } finally {
      setProfileUploading(false);
    }
  };

  const handleProfileDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setProfileDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      handleProfileImageUpload(file);
    }
  };

  const handleProfileFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleProfileImageUpload(file);
  };

  const handleProfileSave = async () => {
    if (!adminProfileImage) {
      showNotification('error', 'Please upload a profile image first');
      return;
    }
    setProfileSaving(true);
    try {
      await updateSettings({ adminProfileImage });
      showNotification('success', 'Profile image saved successfully');
    } catch (err: any) {
      showNotification('error', err.message);
    } finally {
      setProfileSaving(false);
    }
  };

  const handleShowcaseSave = async () => {
    const valid = showcaseSlides.filter((s) => s.url.trim());
    if (valid.length === 0) {
      showNotification('error', 'Add at least one image URL');
      return;
    }
    setShowcaseSaving(true);
    try {
      await updateSettings({ showcaseSlides: valid });
      setShowcaseSlides(valid);
      showNotification('success', 'Showcase photos saved');
    } catch (err: any) {
      showNotification('error', err.message);
    } finally {
      setShowcaseSaving(false);
    }
  };

  const handleShowcaseUpload = async (index: number, file: File) => {
    setShowcaseUploadIndex(index);
    try {
      const data = await uploadImage(file, 'showcase');
      setShowcaseSlides((prev) =>
        prev.map((s, i) => (i === index ? { ...s, url: data.url } : s))
      );
      showNotification('success', 'Slide image uploaded');
    } catch (err: any) {
      showNotification('error', err.message);
    } finally {
      setShowcaseUploadIndex(null);
    }
  };

  const addShowcaseSlide = () => {
    if (showcaseSlides.length >= 12) {
      showNotification('error', 'Maximum 12 slides');
      return;
    }
    setShowcaseSlides((prev) => [
      ...prev,
      { url: '', alt: `Slide ${prev.length + 1}` }
    ]);
  };

  const removeShowcaseSlide = (index: number) => {
    if (showcaseSlides.length <= 1) {
      showNotification('error', 'Keep at least one slide');
      return;
    }
    setShowcaseSlides((prev) => prev.filter((_, i) => i !== index));
  };

  const handleImageUpload = async (file: File) => {
    setUploading(true);
    try {
      const data = await uploadImage(file, 'hero');
      setHeroImage(data.url);
      setHeroImageType('url');
      showNotification('success', 'Image uploaded to Cloudinary');
    } catch (err: any) {
      showNotification('error', err.message);
    } finally {
      setUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      handleImageUpload(file);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleImageUpload(file);
  };

  const handlePlaygroundImageUpload = async (file: File) => {
    setModalImageUploading(true);
    try {
      const data = await uploadImage(file, 'playground');
      setFormData((prev) => ({ ...prev, image: data.url }));
      showNotification('success', 'Image uploaded to Cloudinary');
    } catch (err: any) {
      showNotification('error', err.message);
    } finally {
      setModalImageUploading(false);
    }
  };

  const handleModalDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setModalDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      handlePlaygroundImageUpload(file);
    }
  };

  const handleModalFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handlePlaygroundImageUpload(file);
    e.target.value = '';
  };

  // Sidebar navigation items
  const sidebarItems = [
    { id: 'playground' as ActiveSection, label: 'Playground', icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <rect x="3" y="3" width="7" height="7" rx="1" />
        <rect x="14" y="3" width="7" height="7" rx="1" />
        <rect x="3" y="14" width="7" height="7" rx="1" />
        <rect x="14" y="14" width="7" height="7" rx="1" />
      </svg>
    )},
    { id: 'hero' as ActiveSection, label: 'Hero Section', icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
        <circle cx="8.5" cy="8.5" r="1.5" />
        <polyline points="21 15 16 10 5 21" />
      </svg>
    )},
    { id: 'showcase' as ActiveSection, label: 'About showcase', icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <rect x="3" y="3" width="7" height="7" rx="1" />
        <rect x="14" y="3" width="7" height="7" rx="1" />
        <rect x="3" y="14" width="18" height="7" rx="1" />
      </svg>
    )},
    { id: 'profile' as ActiveSection, label: 'Admin Profile', icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
      </svg>
    )}
  ];

  return (
    <div className="admin-dashboard">
      {/* Notification */}
      {notification && (
        <div className={`admin-notification ${notification.type}`}>
          <span>{notification.type === 'success' ? '✓' : '✕'}</span>
          {notification.message}
        </div>
      )}

      {/* Top Bar */}
      <header className="admin-topbar">
        <div className="admin-topbar-left">
          <Link to="/" className="admin-topbar-logo">AT</Link>
          <span className="admin-topbar-title">Admin Panel</span>
        </div>
        <div className="admin-topbar-right">
          <span className="admin-topbar-user">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
            {adminUser?.username}
          </span>
          <button onClick={handleLogout} className="admin-logout-btn">Logout</button>
        </div>
      </header>

      <div className="admin-layout">
        {/* Sidebar */}
        <aside className="admin-sidebar">
          <div className="admin-sidebar-section-label">MANAGE</div>
          {sidebarItems.map(item => (
            <button
              key={item.id}
              className={`admin-sidebar-item ${activeSection === item.id ? 'active' : ''}`}
              onClick={() => setActiveSection(item.id)}
            >
              {item.icon}
              <span>{item.label}</span>
            </button>
          ))}

          <div className="admin-sidebar-divider" />

          <div className="admin-sidebar-section-label">LINKS</div>
          <a href="/" target="_blank" rel="noreferrer" className="admin-sidebar-item">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
              <polyline points="15 3 21 3 21 9" />
              <line x1="10" y1="14" x2="21" y2="3" />
            </svg>
            <span>View Site</span>
          </a>
        </aside>

        {/* Main Content */}
        <main className="admin-main">
          {/* ═══ PLAYGROUND SECTION ═══ */}
          {activeSection === 'playground' && (
            <>
              <div className="admin-section-header">
                <div>
                  <h1>Playground Items</h1>
                  <p className="admin-subtitle">{items.length} items in your playground</p>
                </div>
                <button onClick={openAddModal} className="admin-add-btn">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="12" y1="5" x2="12" y2="19" />
                    <line x1="5" y1="12" x2="19" y2="12" />
                  </svg>
                  Add New Item
                </button>
              </div>

              {loading ? (
                <div className="admin-loading">
                  <span className="admin-spinner large" />
                  <p>Loading items...</p>
                </div>
              ) : items.length === 0 ? (
                <div className="admin-empty">
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                    <line x1="12" y1="8" x2="12" y2="16" />
                    <line x1="8" y1="12" x2="16" y2="12" />
                  </svg>
                  <h3>No playground items yet</h3>
                  <p>Click "Add New Item" to get started</p>
                </div>
              ) : (
                <div className="admin-items-grid">
                  {items.map((item) => (
                    <div key={item._id} className="admin-item-card">
                      {isPlaygroundDirectImageUrl(item.image) && (
                        <div className="admin-item-thumb">
                          <img src={item.image.trim()} alt="" />
                        </div>
                      )}
                      <div className="admin-item-header">
                        <span className="admin-item-type">{item.type}</span>
                        <span className="admin-item-year">{item.year}</span>
                      </div>
                      <h3 className="admin-item-title">{item.title}</h3>
                      <p className="admin-item-desc">{item.description?.substring(0, 100)}{item.description?.length > 100 ? '...' : ''}</p>
                      {item.tools.length > 0 && (
                        <div className="admin-item-tools">
                          {item.tools.map((tool, i) => (
                            <span key={i} className="admin-tool-chip">{tool}</span>
                          ))}
                        </div>
                      )}
                      <div className="admin-item-actions">
                        <button onClick={() => openEditModal(item)} className="admin-edit-btn">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                          </svg>
                          Edit
                        </button>
                        {deleteConfirm === item._id ? (
                          <div className="admin-delete-confirm">
                            <span>Sure?</span>
                            <button onClick={() => handleDelete(item._id)} className="admin-confirm-yes">Yes</button>
                            <button onClick={() => setDeleteConfirm(null)} className="admin-confirm-no">No</button>
                          </div>
                        ) : (
                          <button onClick={() => setDeleteConfirm(item._id)} className="admin-delete-btn">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <polyline points="3 6 5 6 21 6" />
                              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                            </svg>
                            Delete
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}

          {/* ═══ HERO SECTION SETTINGS ═══ */}
          {activeSection === 'hero' && (
            <>
              <div className="admin-section-header">
                <div>
                  <h1>Hero Section</h1>
                  <p className="admin-subtitle">Manage the hero background photo</p>
                </div>
              </div>

              <div className="admin-hero-settings">
                <div className="admin-settings-card">
                  <div className="admin-settings-card-header">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                      <circle cx="8.5" cy="8.5" r="1.5" />
                      <polyline points="21 15 16 10 5 21" />
                    </svg>
                    <h3>Background Photo</h3>
                  </div>

                  <div className="admin-hero-form">
                    {/* Upload Drop Zone */}
                    <div className="admin-form-group">
                      <label>Upload Image</label>
                      <div
                        className={`admin-dropzone ${dragOver ? 'dragover' : ''} ${uploading ? 'uploading' : ''}`}
                        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                        onDragLeave={() => setDragOver(false)}
                        onDrop={handleDrop}
                        onClick={() => fileInputRef.current?.click()}
                      >
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="image/*"
                          onChange={handleFileSelect}
                          style={{ display: 'none' }}
                        />
                        {uploading ? (
                          <>
                            <span className="admin-spinner" />
                            <p>Uploading to Cloudinary...</p>
                          </>
                        ) : (
                          <>
                            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                              <polyline points="17 8 12 3 7 8" />
                              <line x1="12" y1="3" x2="12" y2="15" />
                            </svg>
                            <p>Drag & drop an image here, or <strong>click to browse</strong></p>
                            <span className="admin-dropzone-hint">JPG, PNG, WebP — Max 10MB</span>
                          </>
                        )}
                      </div>
                    </div>

                    <div className="admin-form-divider">
                      <span>or enter URL manually</span>
                    </div>

                    <div className="admin-form-group">
                      <label>Image URL</label>
                      <input
                        type="text"
                        value={heroImage}
                        onChange={(e) => { setHeroImage(e.target.value); setHeroImageType('url'); }}
                        placeholder="https://images.unsplash.com/photo-..."
                      />
                    </div>

                    {/* Preview */}
                    {heroImage && (
                      <div className="admin-hero-preview">
                        <label>Preview</label>
                        <div className="admin-hero-preview-box">
                          <img
                            src={heroImage}
                            alt="Hero preview"
                            onError={(e) => {
                              (e.target as HTMLImageElement).style.display = 'none';
                            }}
                          />
                          <div className="admin-hero-preview-overlay">
                            <span>HI THERE</span>
                            <span className="admin-hero-preview-big">I AM AMBADI</span>
                          </div>
                        </div>
                      </div>
                    )}

                    <button onClick={handleHeroSave} className="admin-save-btn" disabled={heroSaving} style={{ alignSelf: 'flex-start', marginTop: '8px' }}>
                      {heroSaving ? <span className="admin-spinner" /> : 'Save Changes'}
                    </button>
                  </div>
                </div>
              </div>
            </>
          )}

          {activeSection === 'showcase' && (
            <>
              <div className="admin-section-header">
                <div>
                  <h1>About section carousel</h1>
                  <p className="admin-subtitle">Photos in the rounded carousel on the homepage (About bento)</p>
                </div>
                <button type="button" onClick={addShowcaseSlide} className="admin-add-btn">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="12" y1="5" x2="12" y2="19" />
                    <line x1="5" y1="12" x2="19" y2="12" />
                  </svg>
                  Add slide
                </button>
              </div>

              <div className="admin-settings-card">
                <div className="admin-settings-card-header">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <rect x="3" y="3" width="7" height="7" rx="1" />
                    <rect x="14" y="3" width="7" height="7" rx="1" />
                    <rect x="3" y="14" width="18" height="7" rx="1" />
                  </svg>
                  <h3>Slides ({showcaseSlides.length})</h3>
                </div>
                <p className="admin-subtitle" style={{ margin: '0 0 16px', padding: '0 4px' }}>
                  Upload to Cloudinary or paste a URL per slide. Order matches the carousel rotation.
                </p>
                <div className="admin-showcase-list">
                  {showcaseSlides.map((slide, index) => (
                    <div key={index} className="admin-showcase-row">
                      <div className="admin-showcase-thumb">
                        {slide.url.trim() ? (
                          <img src={slide.url.trim()} alt="" onError={(e) => { (e.target as HTMLImageElement).style.opacity = '0.3'; }} />
                        ) : (
                          <span className="admin-showcase-placeholder">No image</span>
                        )}
                      </div>
                      <div className="admin-showcase-fields">
                        <div className="admin-form-row">
                          <div className="admin-form-group" style={{ flex: 1 }}>
                            <label>Image URL</label>
                            <input
                              type="text"
                              value={slide.url}
                              onChange={(e) =>
                                setShowcaseSlides((prev) =>
                                  prev.map((s, i) => (i === index ? { ...s, url: e.target.value } : s))
                                )
                              }
                              placeholder="https://…"
                            />
                          </div>
                          <div className="admin-form-group" style={{ maxWidth: 200 }}>
                            <label>Alt text</label>
                            <input
                              type="text"
                              value={slide.alt}
                              onChange={(e) =>
                                setShowcaseSlides((prev) =>
                                  prev.map((s, i) => (i === index ? { ...s, alt: e.target.value } : s))
                                )
                              }
                            />
                          </div>
                        </div>
                        <div className="admin-showcase-row-actions">
                          <input
                            ref={(el) => { showcaseFileRefs.current[index] = el; }}
                            type="file"
                            accept="image/*"
                            style={{ display: 'none' }}
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) handleShowcaseUpload(index, file);
                              e.target.value = '';
                            }}
                          />
                          <button
                            type="button"
                            className="admin-edit-btn"
                            disabled={showcaseUploadIndex === index}
                            onClick={() => showcaseFileRefs.current[index]?.click()}
                          >
                            {showcaseUploadIndex === index ? <span className="admin-spinner" /> : 'Upload'}
                          </button>
                          <button type="button" className="admin-delete-btn" onClick={() => removeShowcaseSlide(index)}>
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <button onClick={handleShowcaseSave} className="admin-save-btn" disabled={showcaseSaving} style={{ marginTop: 16 }}>
                  {showcaseSaving ? <span className="admin-spinner" /> : 'Save showcase'}
                </button>
              </div>
            </>
          )}

          {/* ═══ ADMIN PROFILE SECTION ═══ */}
          {activeSection === 'profile' && (
            <>
              <div className="admin-section-header">
                <div>
                  <h1>Admin Profile Picture</h1>
                  <p className="admin-subtitle">Upload and manage your profile image</p>
                </div>
              </div>

              <div className="admin-hero-settings">
                <div className="admin-settings-card">
                  <div className="admin-settings-card-header">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                      <circle cx="12" cy="7" r="4" />
                    </svg>
                    <h3>Profile Picture</h3>
                  </div>

                  <div className="admin-hero-form">
                    {/* Upload Drop Zone */}
                    <div className="admin-form-group">
                      <label>Upload Image</label>
                      <div
                        className={`admin-dropzone ${profileDragOver ? 'dragover' : ''} ${profileUploading ? 'uploading' : ''}`}
                        onDragOver={(e) => { e.preventDefault(); setProfileDragOver(true); }}
                        onDragLeave={() => setProfileDragOver(false)}
                        onDrop={handleProfileDrop}
                        onClick={() => profileFileInputRef.current?.click()}
                      >
                        <input
                          ref={profileFileInputRef}
                          type="file"
                          accept="image/*"
                          onChange={handleProfileFileSelect}
                          style={{ display: 'none' }}
                        />
                        {profileUploading ? (
                          <>
                            <span className="admin-spinner" />
                            <p>Uploading to Cloudinary...</p>
                          </>
                        ) : (
                          <>
                            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                              <polyline points="17 8 12 3 7 8" />
                              <line x1="12" y1="3" x2="12" y2="15" />
                            </svg>
                            <p>Drag & drop an image here, or <strong>click to browse</strong></p>
                            <span className="admin-dropzone-hint">JPG, PNG, WebP — Max 10MB</span>
                          </>
                        )}
                      </div>
                    </div>

                    <div className="admin-form-divider">
                      <span>or enter URL manually</span>
                    </div>

                    <div className="admin-form-group">
                      <label>Image URL</label>
                      <input
                        type="text"
                        value={adminProfileImage}
                        onChange={(e) => setAdminProfileImage(e.target.value)}
                        placeholder="https://images.unsplash.com/photo-..."
                      />
                    </div>

                    {/* Preview */}
                    {adminProfileImage && (
                      <div className="admin-hero-preview">
                        <label>Preview</label>
                        <div className="admin-profile-preview-box">
                          <img
                            src={adminProfileImage}
                            alt="Profile preview"
                            onError={(e) => {
                              (e.target as HTMLImageElement).style.display = 'none';
                            }}
                          />
                        </div>
                      </div>
                    )}

                    <button onClick={handleProfileSave} className="admin-save-btn" disabled={profileSaving} style={{ alignSelf: 'flex-start', marginTop: '8px' }}>
                      {profileSaving ? <span className="admin-spinner" /> : 'Save Profile Picture'}
                    </button>
                  </div>
                </div>
              </div>
            </>
          )}
        </main>
      </div>

      {/* Modal — only for playground */}
      {showModal && (
        <div className="admin-modal-overlay" onClick={closeModal}>
          <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal-header">
              <h2>{editingItem ? 'Edit Item' : 'Add New Item'}</h2>
              <button onClick={closeModal} className="admin-modal-close">✕</button>
            </div>

            <div className="admin-modal-body">
              <div className="admin-form-row">
                <div className="admin-form-group">
                  <label>Title *</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="e.g. Abstract Poster Series"
                  />
                </div>
                <div className="admin-form-group">
                  <label>Type *</label>
                  <input
                    type="text"
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    placeholder="e.g. GRAPHIC DESIGN"
                  />
                </div>
              </div>

              <div className="admin-form-row">
                <div className="admin-form-group">
                  <label>Year</label>
                  <input
                    type="text"
                    value={formData.year}
                    onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                    placeholder="2024"
                  />
                </div>
              </div>

              <div className="admin-form-group">
                <label>Image</label>
                <div
                  className={`admin-dropzone admin-dropzone--modal ${modalDragOver ? 'dragover' : ''} ${modalImageUploading ? 'uploading' : ''}`}
                  onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); setModalDragOver(true); }}
                  onDragLeave={() => setModalDragOver(false)}
                  onDrop={handleModalDrop}
                  onClick={() => playgroundFileInputRef.current?.click()}
                >
                  <input
                    ref={playgroundFileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleModalFileSelect}
                    style={{ display: 'none' }}
                  />
                  {modalImageUploading ? (
                    <>
                      <span className="admin-spinner" />
                      <p>Uploading...</p>
                    </>
                  ) : (
                    <>
                      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                        <polyline points="17 8 12 3 7 8" />
                        <line x1="12" y1="3" x2="12" y2="15" />
                      </svg>
                      <p>Drop an image here or <strong>click to upload</strong> (Cloudinary)</p>
                      <span className="admin-dropzone-hint">JPG, PNG, WebP</span>
                    </>
                  )}
                </div>
                {isPlaygroundDirectImageUrl(formData.image) && (
                  <div className="admin-item-thumb" style={{ marginTop: 12 }}>
                    <img src={formData.image.trim()} alt="" />
                  </div>
                )}
                <div className="admin-form-divider" style={{ margin: '16px 0' }}>
                  <span>or paste URL / keyword</span>
                </div>
                <input
                  type="text"
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  placeholder="https://… or short description for placeholder images"
                />
              </div>

              <div className="admin-form-group">
                <label>Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Describe the project..."
                  rows={4}
                />
              </div>

              <div className="admin-form-group">
                <label>Tools</label>
                <div className="admin-tool-input-row">
                  <input
                    type="text"
                    value={toolInput}
                    onChange={(e) => setToolInput(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addTool(); } }}
                    placeholder="e.g. Figma — press Enter to add"
                  />
                  <button type="button" onClick={addTool} className="admin-tool-add-btn">Add</button>
                </div>
                {formData.tools.length > 0 && (
                  <div className="admin-tool-chips">
                    {formData.tools.map((tool, i) => (
                      <span key={i} className="admin-tool-chip removable" onClick={() => removeTool(i)}>
                        {tool} ✕
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="admin-modal-footer">
              <button onClick={closeModal} className="admin-cancel-btn">Cancel</button>
              <button onClick={handleSave} className="admin-save-btn" disabled={saving}>
                {saving ? <span className="admin-spinner" /> : editingItem ? 'Save Changes' : 'Create Item'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
