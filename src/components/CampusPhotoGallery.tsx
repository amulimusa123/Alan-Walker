import React, { useState, useEffect, useMemo } from 'react';
import { GalleryItem, UserRole } from '../types';
import { 
  getStoredGalleryItems, 
  addGalleryPhoto, 
  deleteGalleryPhoto, 
  resetGalleryShowcase, 
  GALLERY_UPDATED_EVENT 
} from '../services/galleryStorage';
import { 
  Camera, 
  Upload, 
  Trash2, 
  Search, 
  Filter, 
  X, 
  Check, 
  AlertCircle, 
  CheckCircle2, 
  Sparkles, 
  Calendar, 
  Tag, 
  MapPin, 
  User, 
  ShieldCheck, 
  Lock, 
  ChevronLeft, 
  ChevronRight, 
  Maximize2, 
  RefreshCw,
  Image as ImageIcon,
  Grid3X3,
  ListFilter,
  Eye,
  SlidersHorizontal,
  Flame
} from 'lucide-react';

interface CampusPhotoGalleryProps {
  currentUser?: { name: string; role: UserRole } | null;
  onOpenLogin?: () => void;
}

export const CampusPhotoGallery: React.FC<CampusPhotoGalleryProps> = ({
  currentUser,
  onOpenLogin,
}) => {
  const isAdmin = currentUser?.role === 'admin';

  // Gallery Data
  const [items, setItems] = useState<GalleryItem[]>(getStoredGalleryItems());
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<'all' | 'facility' | 'activity'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  // Lightbox Modal State
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  // Admin Upload Modal State
  const [showUploadModal, setShowUploadModal] = useState<boolean>(false);
  const [showUnauthorizedNotice, setShowUnauthorizedNotice] = useState<boolean>(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // New Photo Form Data
  const [formData, setFormData] = useState<{
    title: string;
    category: string;
    itemType: 'facility' | 'activity';
    facilityOrActivity: string;
    description: string;
    image: string;
    dateCaptured: string;
    tagsInput: string;
    featured: boolean;
  }>({
    title: '',
    category: 'labs',
    itemType: 'facility',
    facilityOrActivity: '',
    description: '',
    image: '',
    dateCaptured: new Date().toISOString().split('T')[0],
    tagsInput: '',
    featured: false,
  });

  // Listen for storage events
  useEffect(() => {
    const handleUpdate = () => {
      setItems(getStoredGalleryItems());
    };
    window.addEventListener(GALLERY_UPDATED_EVENT, handleUpdate);
    return () => window.removeEventListener(GALLERY_UPDATED_EVENT, handleUpdate);
  }, []);

  // Filtered Items Calculation
  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      // 1. Type Filter (facility vs activity)
      if (typeFilter !== 'all') {
        const itemType = item.itemType || (item.category === 'clubs' ? 'activity' : 'facility');
        if (itemType !== typeFilter) return false;
      }

      // 2. Category Filter
      if (activeCategory !== 'all') {
        if (item.category !== activeCategory) return false;
      }

      // 3. Tag Filter
      if (selectedTag) {
        if (!item.tags?.includes(selectedTag)) return false;
      }

      // 4. Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = item.title.toLowerCase().includes(q);
        const matchesDesc = item.description.toLowerCase().includes(q);
        const matchesLocation = (item.facilityOrActivity || '').toLowerCase().includes(q);
        const matchesTags = item.tags?.some((t) => t.toLowerCase().includes(q));
        if (!matchesTitle && !matchesDesc && !matchesLocation && !matchesTags) {
          return false;
        }
      }

      return true;
    });
  }, [items, activeCategory, typeFilter, selectedTag, searchQuery]);

  // Extract all distinct tags
  const allTags = useMemo(() => {
    const set = new Set<string>();
    items.forEach((item) => {
      item.tags?.forEach((tag) => set.add(tag));
    });
    return Array.from(set).slice(0, 14);
  }, [items]);

  // Lightbox keyboard controls
  useEffect(() => {
    if (lightboxIndex === null) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setLightboxIndex(null);
      } else if (e.key === 'ArrowRight') {
        setLightboxIndex((prev) => (prev !== null && prev < filteredItems.length - 1 ? prev + 1 : 0));
      } else if (e.key === 'ArrowLeft') {
        setLightboxIndex((prev) => (prev !== null && prev > 0 ? prev - 1 : filteredItems.length - 1));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxIndex, filteredItems.length]);

  // Handle Image File Selection (converts to base64)
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setUploadError('Please select a valid image file (JPEG, PNG, WebP).');
      return;
    }

    if (file.size > 8 * 1024 * 1024) {
      setUploadError('Image size exceeds 8MB. Please select a smaller photo or compress it.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      setFormData((prev) => ({ ...prev, image: result }));
      setUploadError(null);
    };
    reader.readAsDataURL(file);
  };

  // Preset Image Options for fast Admin Upload demo
  const samplePhotoPresets = [
    {
      label: 'Biology Lab Titration',
      url: 'https://images.unsplash.com/photo-1579154204601-01588f351e67?auto=format&fit=crop&q=80&w=1200',
      title: 'Senior Four Biology Practical Dissection Class',
      category: 'labs',
      itemType: 'facility' as const,
      facility: 'Biology Laboratory Wing',
      desc: 'Students observing specimen slides under compound microscopes in preparation for UNEB examinations.'
    },
    {
      label: 'Robotics Workshop',
      url: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&q=80&w=1200',
      title: 'Secondary Science Club Arduino & Solar Workshop',
      category: 'clubs',
      itemType: 'activity' as const,
      facility: 'Innovation Lab',
      desc: 'Learners assembling automated solar tracking components during weekend extracurricular sessions.'
    },
    {
      label: 'Campus Lawn & Compound',
      url: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&q=80&w=1200',
      title: 'Main Academic Quadrangle & Landscaped Compound',
      category: 'classrooms',
      itemType: 'facility' as const,
      facility: 'Main Campus Quad',
      desc: 'Serene tree-lined campus environment in Nyamitanga providing a quiet atmosphere conducive to deep study.'
    },
    {
      label: 'Athletics & Track Meet',
      url: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&q=80&w=1200',
      title: 'District Secondary Schools Athletics Sprint Final',
      category: 'sports',
      itemType: 'activity' as const,
      facility: 'School Running Track',
      desc: 'Shuhadae sprinters competing in the 100m and 400m dash at the Mbarara inter-schools athletics championship.'
    }
  ];

  // Submit Admin Upload
  const handleUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setUploadError(null);
    setUploadSuccess(null);

    if (!isAdmin) {
      setUploadError('Access Denied: Only authenticated school administrators have authority to upload photos.');
      return;
    }

    if (!formData.title.trim()) {
      setUploadError('Please provide a photo title.');
      return;
    }
    if (!formData.image.trim()) {
      setUploadError('Please choose an image file or provide an image URL.');
      return;
    }

    setIsSubmitting(true);

    const tags = formData.tagsInput
      .split(',')
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    const res = addGalleryPhoto(
      {
        title: formData.title,
        category: formData.category,
        itemType: formData.itemType,
        facilityOrActivity: formData.facilityOrActivity || formData.title,
        description: formData.description,
        image: formData.image,
        dateCaptured: formData.dateCaptured,
        featured: formData.featured,
        tags: tags.length > 0 ? tags : [formData.category, formData.itemType],
      },
      currentUser
    );

    setIsSubmitting(false);

    if (!res.success) {
      setUploadError(res.message);
      return;
    }

    setUploadSuccess(res.message);
    setItems(getStoredGalleryItems());

    // Reset Form
    setTimeout(() => {
      setShowUploadModal(false);
      setUploadSuccess(null);
      setFormData({
        title: '',
        category: 'labs',
        itemType: 'facility',
        facilityOrActivity: '',
        description: '',
        image: '',
        dateCaptured: new Date().toISOString().split('T')[0],
        tagsInput: '',
        featured: false,
      });
    }, 1200);
  };

  // Delete Photo Action
  const handleDeletePhoto = (id: string, title: string) => {
    if (!isAdmin) {
      alert('Only authenticated administrators can remove photos from the gallery.');
      return;
    }

    if (window.confirm(`Permanently remove "${title}" from the campus photo gallery?`)) {
      const res = deleteGalleryPhoto(id, currentUser);
      if (res.success) {
        setItems(getStoredGalleryItems());
        if (lightboxIndex !== null) {
          setLightboxIndex(null);
        }
      } else {
        alert(res.message);
      }
    }
  };

  // Reset Gallery Showcase to Default
  const handleResetShowcase = () => {
    if (!isAdmin) return;
    if (window.confirm('Reset the campus photo gallery back to the curated official school showcase? Custom uploaded photos will be replaced.')) {
      const res = resetGalleryShowcase(currentUser);
      if (res.success) {
        setItems(res.items);
      }
    }
  };

  const activePhoto = lightboxIndex !== null ? filteredItems[lightboxIndex] : null;

  return (
    <div className="space-y-8">
      {/* Top Controls Bar: Sub-type filters, Search, and Admin Upload button */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-7 border border-slate-200/90 dark:border-slate-800 shadow-sm space-y-5 transition-colors">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-emerald-800 dark:text-emerald-400 font-extrabold text-xs uppercase tracking-widest flex items-center gap-1.5">
                <Camera className="w-3.5 h-3.5 text-amber-500" />
                <span>Visual Campus Tour</span>
              </span>
              <span className="text-slate-300 dark:text-slate-700">|</span>
              <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                {filteredItems.length} {filteredItems.length === 1 ? 'Photograph' : 'Photographs'} Available
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mt-1">
              Campus Facilities & Extracurricular Gallery
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-1 max-w-2xl leading-relaxed">
              Explore high-resolution visual records of science laboratories, computer suites, boarding dormitories, 
              sports derbies, and spiritual Quranic milestones in Nyamitanga.
            </p>
          </div>

          {/* Admin Upload / Access Badge */}
          <div className="flex items-center gap-2.5 flex-wrap w-full lg:w-auto justify-start lg:justify-end">
            {isAdmin ? (
              <div className="flex items-center gap-2 flex-wrap">
                <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-900 dark:text-purple-300 border border-purple-200 dark:border-purple-800 text-xs font-bold">
                  <ShieldCheck className="w-4 h-4 text-purple-700 dark:text-purple-400" />
                  <span>Admin Upload Privileges Active</span>
                </div>
                <button
                  onClick={() => setShowUploadModal(true)}
                  className="px-4 py-2.5 bg-emerald-800 hover:bg-emerald-900 dark:bg-emerald-700 dark:hover:bg-emerald-600 text-white font-bold rounded-xl text-xs flex items-center gap-2 shadow-md hover:shadow-lg transition-all active:scale-98 cursor-pointer"
                >
                  <Upload className="w-4 h-4 text-amber-300" />
                  <span>Upload Campus Photo</span>
                </button>
                <button
                  onClick={handleResetShowcase}
                  className="p-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl transition-colors cursor-pointer border border-transparent dark:border-slate-700"
                  title="Reset showcase to official photos"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2 flex-wrap">
                <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 text-xs font-medium">
                  <Lock className="w-3.5 h-3.5 text-slate-400" />
                  <span>Admin-Auth Upload Enforced</span>
                </div>
                <button
                  onClick={() => setShowUnauthorizedNotice(true)}
                  className="px-3.5 py-2 bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 dark:hover:bg-slate-700 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer border border-transparent dark:border-slate-700"
                  title="Click to learn about admin upload authorization"
                >
                  <Upload className="w-3.5 h-3.5 text-amber-300" />
                  <span>Admin Upload</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Filter Toolbar: Facilities vs Activities + Categories */}
        <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          {/* Broad Scope Toggle (All vs Facilities vs Activities) */}
          <div className="inline-flex p-1 bg-slate-100 dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 text-xs font-bold self-start">
            <button
              onClick={() => {
                setTypeFilter('all');
                setSelectedTag(null);
              }}
              className={`px-3.5 py-1.5 rounded-xl transition-all cursor-pointer ${
                typeFilter === 'all'
                  ? 'bg-white dark:bg-slate-700 text-emerald-950 dark:text-emerald-200 shadow-xs'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              All Campus Photos
            </button>
            <button
              onClick={() => {
                setTypeFilter('facility');
                setSelectedTag(null);
              }}
              className={`px-3.5 py-1.5 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer ${
                typeFilter === 'facility'
                  ? 'bg-emerald-800 dark:bg-emerald-700 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <MapPin className="w-3 h-3 text-amber-300" />
              <span>Facilities Only</span>
            </button>
            <button
              onClick={() => {
                setTypeFilter('activity');
                setSelectedTag(null);
              }}
              className={`px-3.5 py-1.5 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer ${
                typeFilter === 'activity'
                  ? 'bg-amber-600 dark:bg-amber-500 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Sparkles className="w-3 h-3 text-amber-200" />
              <span>Extracurricular Activities</span>
            </button>
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by facility, club, or keyword..."
              className="w-full pl-9 pr-8 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-xs bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:bg-white dark:focus:bg-slate-800 focus:outline-hidden focus:ring-2 focus:ring-emerald-600 font-medium"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Detailed Category Chips */}
        <div className="flex items-center gap-1.5 flex-wrap text-xs pt-1">
          {[
            { id: 'all', label: 'All Categories' },
            { id: 'labs', label: 'Science & ICT Labs' },
            { id: 'classrooms', label: 'Classrooms & Library' },
            { id: 'dormitories', label: 'Boarding Hostels' },
            { id: 'dining', label: 'Halal Dining & Kitchen' },
            { id: 'sports', label: 'Sports & Athletics' },
            { id: 'clubs', label: 'Clubs & Societies' },
            { id: 'islamic', label: 'Islamic Traditions & Hafla' },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => {
                setActiveCategory(cat.id);
                setSelectedTag(null);
              }}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
                activeCategory === cat.id
                  ? 'bg-slate-900 dark:bg-emerald-700 text-amber-300 dark:text-white shadow-xs'
                  : 'bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Popular Tags Strip */}
        {allTags.length > 0 && (
          <div className="flex items-center gap-1.5 flex-wrap text-[11px] text-slate-500 dark:text-slate-400 pt-1">
            <span className="font-semibold text-slate-400 dark:text-slate-500 flex items-center gap-1">
              <Tag className="w-3 h-3" />
              <span>Tags:</span>
            </span>
            {allTags.map((tag) => (
              <button
                key={tag}
                onClick={() => setSelectedTag(selectedTag === tag ? null : tag)}
                className={`px-2 py-0.5 rounded-lg border transition-all cursor-pointer ${
                  selectedTag === tag
                    ? 'bg-emerald-700 dark:bg-emerald-600 text-white border-emerald-700 font-bold'
                    : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-emerald-400'
                }`}
              >
                #{tag}
              </button>
            ))}
            {selectedTag && (
              <button
                onClick={() => setSelectedTag(null)}
                className="text-red-600 dark:text-red-400 hover:underline font-bold ml-1 cursor-pointer"
              >
                Clear Tag
              </button>
            )}
          </div>
        )}
      </div>

      {/* GALLERY GRID */}
      {filteredItems.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-12 text-center border border-slate-200 dark:border-slate-800 max-w-xl mx-auto shadow-sm transition-colors">
          <div className="w-14 h-14 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 flex items-center justify-center mx-auto mb-3">
            <ImageIcon className="w-7 h-7" />
          </div>
          <h3 className="font-extrabold text-base text-slate-800 dark:text-slate-200">No matching campus photos found</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto">
            Try adjusting your search query, selecting another category, or clearing the selected tag.
          </p>
          <div className="mt-4 flex items-center justify-center gap-2">
            <button
              onClick={() => {
                setActiveCategory('all');
                setTypeFilter('all');
                setSearchQuery('');
                setSelectedTag(null);
              }}
              className="px-4 py-2 bg-emerald-800 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs transition-colors cursor-pointer"
            >
              Reset Filters
            </button>
            {isAdmin && (
              <button
                onClick={() => setShowUploadModal(true)}
                className="px-4 py-2 bg-slate-900 dark:bg-slate-800 text-amber-300 font-bold rounded-xl text-xs hover:bg-slate-800 dark:hover:bg-slate-700 transition-colors cursor-pointer border border-transparent dark:border-slate-700"
              >
                + Upload New Photo
              </button>
            )}
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item, index) => {
            const isActivity = item.itemType === 'activity' || item.category === 'clubs';

            return (
              <div
                key={item.id}
                className="bg-white dark:bg-slate-900 rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-xs hover:shadow-xl transition-all duration-300 group flex flex-col justify-between hover:border-emerald-600/50 dark:hover:border-emerald-500"
              >
                {/* Photo Image Card */}
                <div 
                  onClick={() => setLightboxIndex(index)}
                  className="relative h-60 overflow-hidden bg-slate-900 cursor-pointer"
                >
                  <img
                    src={item.image}
                    alt={item.title}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  
                  {/* Subtle Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-black/30 opacity-70 group-hover:opacity-85 transition-opacity" />

                  {/* Top Badges */}
                  <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2 pointer-events-none">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider backdrop-blur-md shadow-xs ${
                      isActivity
                        ? 'bg-amber-500/90 text-slate-950'
                        : 'bg-emerald-900/90 text-emerald-100'
                    }`}>
                      {isActivity ? 'Activity' : 'Facility'}
                    </span>

                    <span className="px-2 py-0.5 rounded-md bg-black/60 text-slate-200 text-[10px] font-mono backdrop-blur-md">
                      {item.category.toUpperCase()}
                    </span>
                  </div>

                  {/* Bottom Image Hover Prompt */}
                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white text-xs">
                    <span className="flex items-center gap-1 font-semibold text-amber-300 text-[11px] truncate max-w-[80%]">
                      <MapPin className="w-3.5 h-3.5 shrink-0" />
                      <span>{item.facilityOrActivity || 'Shuhadae Campus'}</span>
                    </span>
                    <span className="p-1.5 rounded-lg bg-white/20 backdrop-blur-md group-hover:bg-amber-400 group-hover:text-slate-950 transition-colors">
                      <Maximize2 className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>

                {/* Content & Metadata */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <h3 
                      onClick={() => setLightboxIndex(index)}
                      className="font-extrabold text-base text-slate-900 dark:text-white hover:text-emerald-800 dark:hover:text-emerald-400 transition-colors cursor-pointer line-clamp-1"
                    >
                      {item.title}
                    </h3>
                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mt-1.5 line-clamp-2">
                      {item.description}
                    </p>
                  </div>

                  {/* Tags and Admin Controls */}
                  <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2 text-[11px]">
                    <div className="flex items-center gap-1.5 flex-wrap truncate text-slate-500 dark:text-slate-400">
                      {item.tags?.slice(0, 2).map((tag) => (
                        <span key={tag} className="text-[10px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-2 py-0.5 rounded-md border border-transparent dark:border-slate-700">
                          #{tag}
                        </span>
                      ))}
                      {item.dateCaptured && (
                        <span className="text-[10px] text-slate-400 dark:text-slate-500">
                          {item.dateCaptured}
                        </span>
                      )}
                    </div>

                    {/* Admin Delete Action */}
                    {isAdmin && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeletePhoto(item.id, item.title);
                        }}
                        className="text-red-500 hover:text-red-700 p-1 rounded-md hover:bg-red-50 dark:hover:bg-red-950/60 transition-colors cursor-pointer shrink-0"
                        title="Delete photo (Admin only)"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ========================================================================= */}
      {/* 1. INTERACTIVE FULL-SCREEN LIGHTBOX MODAL */}
      {/* ========================================================================= */}
      {activePhoto && lightboxIndex !== null && (
        <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex flex-col justify-between p-4 sm:p-6 animate-fade-in">
          {/* Lightbox Header Bar */}
          <div className="flex items-center justify-between text-white z-10 pb-3 border-b border-white/10">
            <div className="flex items-center gap-3">
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-800 text-amber-300 font-bold text-xs uppercase tracking-wider">
                {activePhoto.category}
              </span>
              <span className="text-xs text-slate-400 font-mono">
                Photo {lightboxIndex + 1} of {filteredItems.length}
              </span>
            </div>

            <div className="flex items-center gap-3">
              {isAdmin && (
                <button
                  onClick={() => handleDeletePhoto(activePhoto.id, activePhoto.title)}
                  className="px-3 py-1.5 bg-red-600/80 hover:bg-red-600 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete Photo (Admin)</span>
                </button>
              )}
              <button
                onClick={() => setLightboxIndex(null)}
                className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
                title="Close Lightbox (ESC)"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Center: Image Display with Previous / Next Arrows */}
          <div className="relative flex-1 flex items-center justify-center my-4 overflow-hidden">
            {/* Prev Button */}
            <button
              onClick={() => setLightboxIndex(lightboxIndex > 0 ? lightboxIndex - 1 : filteredItems.length - 1)}
              className="absolute left-2 sm:left-6 z-20 p-3 rounded-full bg-black/60 hover:bg-black/90 text-white border border-white/20 backdrop-blur-md transition-transform hover:scale-110 cursor-pointer"
              title="Previous Photo (Left Arrow)"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            {/* Main Lightbox Image */}
            <div className="max-w-5xl max-h-[70vh] flex items-center justify-center">
              <img
                src={activePhoto.image}
                alt={activePhoto.title}
                className="max-h-[70vh] max-w-full object-contain rounded-2xl shadow-2xl border border-white/10"
              />
            </div>

            {/* Next Button */}
            <button
              onClick={() => setLightboxIndex(lightboxIndex < filteredItems.length - 1 ? lightboxIndex + 1 : 0)}
              className="absolute right-2 sm:right-6 z-20 p-3 rounded-full bg-black/60 hover:bg-black/90 text-white border border-white/20 backdrop-blur-md transition-transform hover:scale-110 cursor-pointer"
              title="Next Photo (Right Arrow)"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>

          {/* Lightbox Footer Bar: Details & Location */}
          <div className="bg-slate-900/90 text-white p-4 sm:p-5 rounded-2xl border border-white/10 max-w-4xl mx-auto w-full flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <h4 className="text-base sm:text-lg font-black text-white">
                {activePhoto.title}
              </h4>
              <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
                {activePhoto.description}
              </p>
              <div className="flex items-center gap-3 text-xs text-amber-300 pt-1 flex-wrap">
                <span className="flex items-center gap-1 font-semibold">
                  <MapPin className="w-3.5 h-3.5" />
                  <span>{activePhoto.facilityOrActivity || 'Shuhadae Islamic SS Campus'}</span>
                </span>
                {activePhoto.dateCaptured && (
                  <span className="flex items-center gap-1 text-slate-400">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>Captured: {activePhoto.dateCaptured}</span>
                  </span>
                )}
                {activePhoto.uploadedBy && (
                  <span className="flex items-center gap-1 text-slate-400">
                    <User className="w-3.5 h-3.5" />
                    <span>Uploaded by: {activePhoto.uploadedBy}</span>
                  </span>
                )}
              </div>
            </div>

            {/* Tags Strip */}
            {activePhoto.tags && activePhoto.tags.length > 0 && (
              <div className="flex items-center gap-1.5 flex-wrap shrink-0">
                {activePhoto.tags.map((tag) => (
                  <span key={tag} className="text-[10px] font-mono bg-white/10 px-2 py-0.5 rounded-md text-slate-200">
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. ADMIN ONLY UPLOAD MODAL */}
      {/* ========================================================================= */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-2xl w-full p-6 sm:p-7 shadow-2xl border border-slate-200 dark:border-slate-800 my-8 space-y-5 transition-colors">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-emerald-800 text-amber-300 flex items-center justify-center font-bold">
                  <Upload className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-slate-900 dark:text-white">
                    Admin Photo Upload & Archive
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Only authorized administrators can publish photographs to the campus showcase.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowUploadModal(false)}
                className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Error Notification */}
            {uploadError && (
              <div className="p-3 bg-red-50 dark:bg-red-950/60 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 text-xs rounded-xl flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{uploadError}</span>
              </div>
            )}

            {/* Success Notification */}
            {uploadSuccess && (
              <div className="p-3 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs rounded-xl flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
                <span>{uploadSuccess}</span>
              </div>
            )}

            {/* Quick Demo Photo Presets */}
            <div className="bg-slate-50 dark:bg-slate-800/70 p-3.5 rounded-2xl border border-slate-200 dark:border-slate-700">
              <span className="text-[11px] font-bold text-slate-600 dark:text-slate-300 block mb-2">
                Quick Photography Presets (Click to autofill high-res facility / activity):
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {samplePhotoPresets.map((preset, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setFormData((prev) => ({
                        ...prev,
                        title: preset.title,
                        category: preset.category,
                        itemType: preset.itemType,
                        facilityOrActivity: preset.facility,
                        description: preset.desc,
                        image: preset.url,
                      }));
                      setUploadError(null);
                    }}
                    className="p-2 text-left rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 hover:border-emerald-600 dark:hover:border-emerald-500 text-[10px] font-semibold text-slate-800 dark:text-slate-200 shadow-2xs hover:bg-emerald-50/50 dark:hover:bg-slate-800 transition-all cursor-pointer"
                  >
                    <span className="font-bold text-emerald-800 dark:text-emerald-400 block truncate">{preset.label}</span>
                    <span className="text-slate-400 dark:text-slate-500 block truncate">{preset.itemType}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Upload Form */}
            <form onSubmit={handleUploadSubmit} className="space-y-4 text-xs">
              {/* Photo Title */}
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Photo Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. Senior Four Chemistry Titration Practical"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:bg-white dark:focus:bg-slate-800 focus:outline-hidden focus:ring-2 focus:ring-emerald-600 font-medium"
                />
              </div>

              {/* Scope & Category Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Showcase Type <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.itemType}
                    onChange={(e) => setFormData({ ...formData, itemType: e.target.value as 'facility' | 'activity' })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:bg-white dark:focus:bg-slate-800 focus:outline-hidden focus:ring-2 focus:ring-emerald-600 font-semibold"
                  >
                    <option value="facility">School Facility (Lab, Dorm, Class, Mosque)</option>
                    <option value="activity">Extracurricular Activity (Debate, Sports, Club, Hafla)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Specific Category <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:bg-white dark:focus:bg-slate-800 focus:outline-hidden focus:ring-2 focus:ring-emerald-600 font-semibold"
                  >
                    <option value="labs">Science & ICT Laboratories</option>
                    <option value="classrooms">Classrooms & Library</option>
                    <option value="dormitories">Boarding Hostels</option>
                    <option value="dining">Dining & Halal Kitchen</option>
                    <option value="sports">Sports Grounds & Athletics</option>
                    <option value="clubs">Clubs & Societies</option>
                    <option value="islamic">Islamic Traditions & Hafla</option>
                  </select>
                </div>
              </div>

              {/* Facility / Specific Activity Name */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Facility or Activity Name
                  </label>
                  <input
                    type="text"
                    value={formData.facilityOrActivity}
                    onChange={(e) => setFormData({ ...formData, facilityOrActivity: e.target.value })}
                    placeholder="e.g. Science Complex (Block B)"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:bg-white dark:focus:bg-slate-800 focus:outline-hidden focus:ring-2 focus:ring-emerald-600 font-medium"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Date Captured
                  </label>
                  <input
                    type="date"
                    value={formData.dateCaptured}
                    onChange={(e) => setFormData({ ...formData, dateCaptured: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:bg-white dark:focus:bg-slate-800 focus:outline-hidden focus:ring-2 focus:ring-emerald-600 font-medium"
                  />
                </div>
              </div>

              {/* Image Input: File Upload OR Direct URL */}
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Image Source (Choose local photo file OR enter image URL) <span className="text-red-500">*</span>
                </label>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <label className="px-3 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold rounded-xl border border-slate-300 dark:border-slate-700 cursor-pointer transition-colors inline-flex items-center gap-1.5 shrink-0">
                      <ImageIcon className="w-4 h-4 text-emerald-700 dark:text-emerald-400" />
                      <span>Browse Image File</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="hidden"
                      />
                    </label>
                    <span className="text-slate-400 dark:text-slate-500 font-bold">OR</span>
                    <input
                      type="url"
                      value={formData.image.startsWith('data:') ? '' : formData.image}
                      onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                      placeholder="Paste high-res image URL (https://...)"
                      className="flex-1 px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:bg-white dark:focus:bg-slate-800 focus:outline-hidden focus:ring-2 focus:ring-emerald-600 font-medium"
                    />
                  </div>

                  {/* Image Live Preview */}
                  {formData.image && (
                    <div className="relative rounded-2xl overflow-hidden h-36 bg-slate-900 border border-slate-300 dark:border-slate-700">
                      <img
                        src={formData.image}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                      <span className="absolute bottom-2 right-2 px-2 py-0.5 rounded-md bg-black/70 text-white font-mono text-[10px]">
                        Live Preview Active
                      </span>
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, image: '' })}
                        className="absolute top-2 right-2 p-1.5 rounded-lg bg-black/70 text-white hover:bg-red-600 transition-colors"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Description & Context
                </label>
                <textarea
                  rows={2}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Provide educational or extracurricular context for this photograph..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:bg-white dark:focus:bg-slate-800 focus:outline-hidden focus:ring-2 focus:ring-emerald-600 font-medium"
                />
              </div>

              {/* Tags Input */}
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Search Tags (Comma separated)
                </label>
                <input
                  type="text"
                  value={formData.tagsInput}
                  onChange={(e) => setFormData({ ...formData, tagsInput: e.target.value })}
                  placeholder="e.g. Science, Biology, UNEB Practicals, Senior Four"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:bg-white dark:focus:bg-slate-800 focus:outline-hidden focus:ring-2 focus:ring-emerald-600 font-medium"
                />
              </div>

              {/* Buttons */}
              <div className="pt-2 flex items-center justify-end gap-3 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-bold hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white font-bold rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer disabled:opacity-75"
                >
                  {isSubmitting ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <>
                      <ShieldCheck className="w-4 h-4 text-amber-300" />
                      <span>Publish to Campus Gallery</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. UNAUTHORIZED NON-ADMIN NOTIFICATION MODAL */}
      {/* ========================================================================= */}
      {showUnauthorizedNotice && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-md w-full p-6 sm:p-7 shadow-2xl border border-slate-200 dark:border-slate-800 text-center space-y-4 transition-colors">
            <div className="w-14 h-14 rounded-2xl bg-amber-100 dark:bg-amber-950/80 text-amber-700 dark:text-amber-300 flex items-center justify-center mx-auto border border-transparent dark:border-amber-800">
              <Lock className="w-7 h-7" />
            </div>

            <div>
              <h3 className="text-lg font-black text-slate-900 dark:text-white">
                Administrator Authentication Required
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 mt-1.5 leading-relaxed">
                To maintain the authenticity of official school records, <strong>only registered school administrators</strong> (Headteacher, Deputy Academics, or IT Custodian) have permission to upload photographs to the Campus Gallery.
              </p>
            </div>

            <div className="p-3 bg-slate-50 dark:bg-slate-800/80 rounded-2xl border border-slate-200 dark:border-slate-700 text-xs text-slate-700 dark:text-slate-300 text-left space-y-1">
              <p className="font-bold text-slate-900 dark:text-white">Are you a school administrator?</p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Please log in to your administrator account on the School Portal with your authorized credentials.
              </p>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                onClick={() => setShowUnauthorizedNotice(false)}
                className="flex-1 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              >
                Continue Browsing
              </button>
              {onOpenLogin && (
                <button
                  onClick={() => {
                    setShowUnauthorizedNotice(false);
                    onOpenLogin();
                  }}
                  className="flex-1 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <ShieldCheck className="w-4 h-4 text-amber-300" />
                  <span>Admin Login Gateway</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
