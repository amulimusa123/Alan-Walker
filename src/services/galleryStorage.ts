import { GalleryItem } from '../types';

const GALLERY_STORAGE_KEY = 'shuhadae_campus_gallery_v2';
export const GALLERY_UPDATED_EVENT = 'shuhadae_gallery_updated';

export const DEFAULT_GALLERY_ITEMS: GalleryItem[] = [
  // -----------------------------------------------------------------
  // 1. FACILITIES
  // -----------------------------------------------------------------
  {
    id: 'gal-fac-1',
    title: 'Advanced Biology & Chemistry Science Laboratories',
    category: 'labs',
    itemType: 'facility',
    facilityOrActivity: 'Science Complex (Block B)',
    description: 'Fully equipped 40-workstation science laboratory with specialized fume chambers, optical microscopes, and analytical reagents for UNEB UCE and UACE practicals.',
    image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&q=80&w=1200',
    dateCaptured: '2026-03-12',
    uploadedBy: 'School Administrator',
    featured: true,
    tags: ['Chemistry', 'Biology', 'UNEB Practicals', 'Science Complex']
  },
  {
    id: 'gal-fac-2',
    title: 'Modern ICT & Digital Computer Lab',
    category: 'labs',
    itemType: 'facility',
    facilityOrActivity: 'Digital Learning Centre',
    description: 'State-of-the-art computer room equipped with high-speed fiber internet, multimedia projectors, and software environments for Sub-Math and ICT (840) instruction.',
    image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=1200',
    dateCaptured: '2026-02-18',
    uploadedBy: 'School Administrator',
    featured: true,
    tags: ['ICT Lab', 'Coding', 'Computers', 'Digital Learning']
  },
  {
    id: 'gal-fac-3',
    title: 'Ibn Khaldun Memorial Library & Reference Wing',
    category: 'classrooms',
    itemType: 'facility',
    facilityOrActivity: 'Main Library Block',
    description: 'Quiet study sanctum housing over 8,500 curriculum textbooks, national examination revision papers, Islamic reference manuscripts, and individual study carrels.',
    image: 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&q=80&w=1200',
    dateCaptured: '2026-01-25',
    uploadedBy: 'School Administrator',
    featured: false,
    tags: ['Library', 'Quiet Study', 'Textbooks', 'Research']
  },
  {
    id: 'gal-fac-4',
    title: 'Modern Ventilated O-Level & A-Level Classrooms',
    category: 'classrooms',
    itemType: 'facility',
    facilityOrActivity: 'Academic Wings (Blocks A & C)',
    description: 'Bright, acoustically treated classrooms built for the New Lower Secondary Curriculum with movable group project desks, whiteboards, and natural lighting.',
    image: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&q=80&w=1200',
    dateCaptured: '2026-02-04',
    uploadedBy: 'School Administrator',
    featured: true,
    tags: ['Classrooms', 'Candidate Wing', 'Senior Four', 'Senior Six']
  },
  {
    id: 'gal-fac-5',
    title: 'Umar & Aisha Boarding Hostels',
    category: 'dormitories',
    itemType: 'facility',
    facilityOrActivity: 'Residential Boarding Compound',
    description: 'Spacious self-contained boarding dormitories featuring solar backup lighting, high-pressure treated water, individual lockable metal wardrobes, and 24/7 security.',
    image: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&q=80&w=1200',
    dateCaptured: '2026-02-15',
    uploadedBy: 'School Administrator',
    featured: false,
    tags: ['Hostels', 'Boarding', 'Security', 'Solar Lighting']
  },
  {
    id: 'gal-fac-6',
    title: 'Al-Shuhadae Campus Mosque & Tahfiz Hall',
    category: 'islamic',
    itemType: 'facility',
    facilityOrActivity: 'Central School Mosque',
    description: 'Grand prayer sanctuary accommodating up to 700 learners for five daily congregational prayers, Friday Jummah prayers, and morning/evening Quran Hifz circles.',
    image: 'https://images.unsplash.com/photo-1542816417-0983c9c9ad53?auto=format&fit=crop&q=80&w=1200',
    dateCaptured: '2026-01-10',
    uploadedBy: 'School Administrator',
    featured: true,
    tags: ['Mosque', 'Salah', 'Jummah', 'Islamic Values']
  },
  {
    id: 'gal-fac-7',
    title: 'Dining Hall & Clean Halal Catering Kitchen',
    category: 'dining',
    itemType: 'facility',
    facilityOrActivity: 'Nutrition & Catering Center',
    description: 'Hygienic community dining hall offering hot, wholesome, strictly Halal balanced meals prepared under strict sanitary guidelines, including special Friday meat meals.',
    image: 'https://images.unsplash.com/photo-1577495508048-b635879837f1?auto=format&fit=crop&q=80&w=1200',
    dateCaptured: '2026-02-28',
    uploadedBy: 'School Administrator',
    featured: false,
    tags: ['Dining', 'Halal Food', 'Nutrition', 'Kitchen']
  },
  {
    id: 'gal-fac-8',
    title: 'Nyamitanga Campus Sports Field & Athletics Track',
    category: 'sports',
    itemType: 'facility',
    facilityOrActivity: 'Main Sports Complex',
    description: 'Standard grass football pitch, volleyball and netball courts with panoramic vistas across Mbarara City, hosting inter-house tournaments and friendly school leagues.',
    image: 'https://images.unsplash.com/photo-1526232761682-d26e03ac148e?auto=format&fit=crop&q=80&w=1200',
    dateCaptured: '2026-03-05',
    uploadedBy: 'School Administrator',
    featured: false,
    tags: ['Sports Grounds', 'Football', 'Netball', 'Athletics']
  },

  // -----------------------------------------------------------------
  // 2. EXTRACURRICULAR ACTIVITIES
  // -----------------------------------------------------------------
  {
    id: 'gal-act-1',
    title: 'Annual Hafla & Khatma Quran Graduation Ceremony',
    category: 'islamic',
    itemType: 'activity',
    facilityOrActivity: 'Annual Hafla Speech Day',
    description: 'Commemorating students who completed the memorization of the Holy Quran, presented with ceremonial awards by Islamic scholars, Sheikhs, and Ministry dignitaries.',
    image: 'https://images.unsplash.com/photo-1584281722572-c516bcfa1c91?auto=format&fit=crop&q=80&w=1200',
    dateCaptured: '2026-04-10',
    uploadedBy: 'School Administrator',
    featured: true,
    tags: ['Hafla', 'Quran Hifz', 'Graduation', 'Speech Day']
  },
  {
    id: 'gal-act-2',
    title: 'National Inter-School Debate & Public Speaking Derby',
    category: 'clubs',
    itemType: 'activity',
    facilityOrActivity: 'Debating Society Assembly',
    description: 'Shuhadae debate team in spirited action, tackling motions on regional economic integration, scientific ethics, and constitutional law.',
    image: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&q=80&w=1200',
    dateCaptured: '2026-03-22',
    uploadedBy: 'School Administrator',
    featured: true,
    tags: ['Debate', 'Public Speaking', 'Critical Thinking', 'Tournament']
  },
  {
    id: 'gal-act-3',
    title: 'Science & Robotics Innovators Exhibition',
    category: 'clubs',
    itemType: 'activity',
    facilityOrActivity: 'Science Club Fair',
    description: 'Students demonstrating hands-on solar water heating prototypes, organic pest control formulations, and circuit automation systems.',
    image: 'https://images.unsplash.com/photo-1507413245164-6160d8298b31?auto=format&fit=crop&q=80&w=1200',
    dateCaptured: '2026-03-15',
    uploadedBy: 'School Administrator',
    featured: false,
    tags: ['Science Fair', 'Robotics', 'Innovation', 'Inventions']
  },
  {
    id: 'gal-act-4',
    title: 'Inter-House Sports Derby: Umar vs Abubakar Cup',
    category: 'sports',
    itemType: 'activity',
    facilityOrActivity: 'Inter-House Sports Gala',
    description: 'High-energy championship soccer match with students and patrons cheering their respective houses for the prestigious Term Two school sports cup.',
    image: 'https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?auto=format&fit=crop&q=80&w=1200',
    dateCaptured: '2026-03-01',
    uploadedBy: 'School Administrator',
    featured: false,
    tags: ['Football Match', 'Inter-House Derby', 'Sports Trophy']
  },
  {
    id: 'gal-act-5',
    title: 'Red Cross First Aid Drills & Health Outreach',
    category: 'clubs',
    itemType: 'activity',
    facilityOrActivity: 'Uganda Red Cross Cadet Corps',
    description: 'Learners practicing CPR, emergency stretcher carries, fracture management, and community hygiene sensitization for surrounding Nyamitanga villages.',
    image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&q=80&w=1200',
    dateCaptured: '2026-02-12',
    uploadedBy: 'School Administrator',
    featured: false,
    tags: ['Red Cross', 'First Aid', 'Community Health', 'Volunteerism']
  },
  {
    id: 'gal-act-6',
    title: 'Shuhadae Scout Troop Camping & Wilderness Leadership',
    category: 'clubs',
    itemType: 'activity',
    facilityOrActivity: 'Uganda Scouts Association',
    description: 'Outdoor survival drills, bridge-knotting, compass orienteering, and campfire camaraderie fostering endurance and discipline in young learners.',
    image: 'https://images.unsplash.com/photo-1523987355523-c7b5b0dd90a7?auto=format&fit=crop&q=80&w=1200',
    dateCaptured: '2026-01-30',
    uploadedBy: 'School Administrator',
    featured: false,
    tags: ['Scouts', 'Outdoor Camping', 'Leadership', 'Discipline']
  }
];

/**
 * Retrieves all stored campus gallery items.
 */
export function getStoredGalleryItems(): GalleryItem[] {
  try {
    const raw = localStorage.getItem(GALLERY_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.error('Failed to read campus gallery storage', e);
  }

  saveStoredGalleryItems(DEFAULT_GALLERY_ITEMS);
  return DEFAULT_GALLERY_ITEMS;
}

/**
 * Persists gallery items to localStorage and dispatches sync event.
 */
export function saveStoredGalleryItems(items: GalleryItem[]): void {
  try {
    localStorage.setItem(GALLERY_STORAGE_KEY, JSON.stringify(items));
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent(GALLERY_UPDATED_EVENT, { detail: items }));
    }
  } catch (e) {
    console.error('Failed to persist campus gallery items', e);
  }
}

/**
 * Adds a new photo item to the campus gallery.
 * STRICT ENFORCEMENT: Only authenticated admin accounts can upload.
 */
export function addGalleryPhoto(
  photoData: Omit<GalleryItem, 'id'>,
  user: { name: string; role: string } | null
): { success: boolean; message: string; item?: GalleryItem } {
  if (!user || user.role !== 'admin') {
    return {
      success: false,
      message: 'Access Denied: Only authenticated school administrators have authority to upload photos to the campus gallery.'
    };
  }

  if (!photoData.title?.trim()) {
    return { success: false, message: 'Photo title is required.' };
  }
  if (!photoData.image?.trim()) {
    return { success: false, message: 'A valid image file or image URL is required.' };
  }

  const current = getStoredGalleryItems();
  const newItem: GalleryItem = {
    ...photoData,
    id: `gal_user_${Date.now()}_${Math.floor(100 + Math.random() * 900)}`,
    title: photoData.title.trim(),
    description: photoData.description?.trim() || '',
    category: photoData.category || 'facilities',
    itemType: photoData.itemType || 'facility',
    facilityOrActivity: photoData.facilityOrActivity?.trim() || photoData.title.trim(),
    dateCaptured: photoData.dateCaptured || new Date().toISOString().split('T')[0],
    uploadedBy: user.name || 'School Administrator',
    featured: photoData.featured ?? false,
    tags: Array.isArray(photoData.tags) && photoData.tags.length > 0
      ? photoData.tags
      : [photoData.category, photoData.itemType || 'facility']
  };

  const updated = [newItem, ...current];
  saveStoredGalleryItems(updated);

  return {
    success: true,
    message: `Photo "${newItem.title}" was successfully uploaded by ${user.name}.`,
    item: newItem
  };
}

/**
 * Deletes a photo from the campus gallery.
 * STRICT ENFORCEMENT: Only authenticated admin accounts can delete.
 */
export function deleteGalleryPhoto(
  id: string,
  user: { name: string; role: string } | null
): { success: boolean; message: string } {
  if (!user || user.role !== 'admin') {
    return {
      success: false,
      message: 'Access Denied: Only authenticated school administrators have authority to delete photos from the campus gallery.'
    };
  }

  const current = getStoredGalleryItems();
  const target = current.find((item) => item.id === id);
  if (!target) {
    return { success: false, message: 'Photo item was not found.' };
  }

  const updated = current.filter((item) => item.id !== id);
  saveStoredGalleryItems(updated);

  return {
    success: true,
    message: `Photo "${target.title}" was permanently removed from the campus gallery.`
  };
}

/**
 * Updates an existing photo item.
 * STRICT ENFORCEMENT: Only authenticated admin accounts can edit.
 */
export function updateGalleryPhoto(
  id: string,
  updates: Partial<GalleryItem>,
  user: { name: string; role: string } | null
): { success: boolean; message: string; item?: GalleryItem } {
  if (!user || user.role !== 'admin') {
    return {
      success: false,
      message: 'Access Denied: Only authenticated school administrators can edit gallery photos.'
    };
  }

  const current = getStoredGalleryItems();
  const idx = current.findIndex((item) => item.id === id);
  if (idx === -1) {
    return { success: false, message: 'Photo was not found.' };
  }

  const updatedItem: GalleryItem = {
    ...current[idx],
    ...updates,
    id: current[idx].id
  };

  current[idx] = updatedItem;
  saveStoredGalleryItems(current);

  return {
    success: true,
    message: `Photo "${updatedItem.title}" updated successfully.`,
    item: updatedItem
  };
}

/**
 * Resets the gallery to the official initial school showcase.
 */
export function resetGalleryShowcase(
  user: { name: string; role: string } | null
): { success: boolean; message: string; items: GalleryItem[] } {
  if (!user || user.role !== 'admin') {
    return {
      success: false,
      message: 'Access Denied: Only authenticated school administrators can reset the gallery showcase.',
      items: getStoredGalleryItems()
    };
  }

  saveStoredGalleryItems(DEFAULT_GALLERY_ITEMS);
  return {
    success: true,
    message: 'Campus photo gallery reset to default curated showcase.',
    items: DEFAULT_GALLERY_ITEMS
  };
}
