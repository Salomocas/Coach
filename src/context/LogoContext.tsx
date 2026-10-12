import React, { createContext, useContext, useState, useEffect } from 'react';
import { db, doc, getDoc, setDoc, onSnapshot } from '../firebase';

export interface AssetImage {
  id: string;
  name: string;
  url: string;
  sizeBytes?: number;
  uploadedAt: string;
  category: 'logo' | 'hero' | 'athlete' | 'exercise' | 'nutrition';
}

interface LogoContextType {
  logoUrl: string;
  isCustomLogo: boolean;
  isLogoRemoved: boolean;
  showAuthLogo: boolean;
  logoDetails: {
    fileName: string;
    updatedAt: string;
    fileSizeKb?: number;
  } | null;
  assets: AssetImage[];
  updateLogo: (dataUrl: string, fileName?: string, sizeBytes?: number) => Promise<void>;
  resetToDefaultLogo: () => Promise<void>;
  removeLogoCompletely: () => Promise<void>;
  toggleAuthLogo: (show: boolean) => Promise<void>;
  addAsset: (asset: Omit<AssetImage, 'id' | 'uploadedAt'>) => Promise<void>;
  removeAsset: (id: string) => Promise<void>;
}

const DEFAULT_LOGO = '/logo.svg';

/**
 * Optimizes logo images using canvas to prevent exceeding localStorage quota (~5MB)
 * and ensure lightning-fast loading across all devices. Preserves alpha transparency.
 */
export const compressImageForLogo = (dataUrl: string, maxWidth = 384, maxHeight = 384): Promise<string> => {
  return new Promise((resolve) => {
    if (dataUrl.startsWith('data:image/svg+xml') || dataUrl.endsWith('.svg')) {
      resolve(dataUrl);
      return;
    }
    const img = new Image();
    img.onload = () => {
      let width = img.width;
      let height = img.height;

      if (width > maxWidth || height > maxHeight) {
        if (width > height) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        } else {
          width = Math.round((width * maxHeight) / height);
          height = maxHeight;
        }
      }

      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        resolve(dataUrl);
        return;
      }
      ctx.drawImage(img, 0, 0, width, height);
      try {
        const compressed = canvas.toDataURL('image/webp', 0.88);
        if (compressed && compressed.length > 20 && compressed.startsWith('data:image/webp')) {
          resolve(compressed);
        } else {
          resolve(canvas.toDataURL('image/png'));
        }
      } catch (e) {
        resolve(dataUrl);
      }
    };
    img.onerror = () => resolve(dataUrl);
    img.src = dataUrl;
  });
};

const LogoContext = createContext<LogoContextType | undefined>(undefined);

export const LogoProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isLogoRemoved, setIsLogoRemoved] = useState<boolean>(() => {
    try {
      const explicit = localStorage.getItem('coach_cunha_logo_removed');
      if (explicit !== null) return explicit === 'true';
      // User requested to remove the initial logo: default to true so it stays clean
      return true;
    } catch {
      return true;
    }
  });

  const [showAuthLogo, setShowAuthLogo] = useState<boolean>(() => {
    try {
      const removed = localStorage.getItem('coach_cunha_logo_removed');
      if (removed === 'true' || removed === null) return false;
      const val = localStorage.getItem('coach_cunha_show_auth_logo');
      return val === 'true';
    } catch {
      return false;
    }
  });

  const [logoUrl, setLogoUrl] = useState<string>(() => {
    try {
      const removed = localStorage.getItem('coach_cunha_logo_removed');
      if (removed === 'true' || removed === null) return '';
      const saved = localStorage.getItem('coach_cunha_custom_logo');
      if (saved) return saved;
    } catch (e) {
      console.warn('Could not read cached logo from localStorage:', e);
    }
    return '';
  });

  const [logoDetails, setLogoDetails] = useState<{
    fileName: string;
    updatedAt: string;
    fileSizeKb?: number;
  } | null>(() => {
    try {
      const saved = localStorage.getItem('coach_cunha_logo_details');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return null;
  });

  const [assets, setAssets] = useState<AssetImage[]>(() => {
    try {
      const saved = localStorage.getItem('coach_cunha_assets_gallery');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return [
      {
        id: 'default-logo-badge',
        name: 'Logo Oficial Coach Cunha (Emblema Dourado)',
        url: DEFAULT_LOGO,
        uploadedAt: new Date().toISOString(),
        category: 'logo'
      }
    ];
  });

  // Real-time synchronization with Firestore app_settings/branding
  useEffect(() => {
    const unsub = onSnapshot(doc(db, 'app_settings', 'branding'), (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.data();
        if (data) {
          const removed = data.isLogoRemoved === true || data.logoUrl === '' || data.logoUrl === null;
          const showAuth = data.showAuthLogo !== false && !removed;
          
          setIsLogoRemoved(removed);
          setShowAuthLogo(showAuth);

          if (removed) {
            setLogoUrl('');
            setLogoDetails(null);
            try {
              localStorage.setItem('coach_cunha_logo_removed', 'true');
              localStorage.setItem('coach_cunha_show_auth_logo', 'false');
              localStorage.removeItem('coach_cunha_custom_logo');
              localStorage.removeItem('coach_cunha_logo_details');
            } catch (e) {}
          } else {
            const effectiveUrl = data.logoUrl || DEFAULT_LOGO;
            setLogoUrl(effectiveUrl);
            setLogoDetails(data.logoDetails || null);
            try {
              localStorage.removeItem('coach_cunha_logo_removed');
              localStorage.setItem('coach_cunha_show_auth_logo', showAuth ? 'true' : 'false');
              localStorage.setItem('coach_cunha_custom_logo', effectiveUrl);
              if (data.logoDetails) {
                localStorage.setItem('coach_cunha_logo_details', JSON.stringify(data.logoDetails));
              } else {
                localStorage.removeItem('coach_cunha_logo_details');
              }
            } catch (e) {}
          }
        }
      }
    }, (error) => {
      console.warn('Real-time branding subscription warning (using local/cached):', error);
    });

    return () => unsub();
  }, []);

  const updateLogo = async (rawDataUrl: string, fileName: string = 'Logo.png', sizeBytes?: number) => {
    const optimizedUrl = await compressImageForLogo(rawDataUrl);
    setLogoUrl(optimizedUrl);
    setIsLogoRemoved(false);
    setShowAuthLogo(true);

    const details = {
      fileName,
      updatedAt: new Date().toISOString(),
      fileSizeKb: Math.max(1, Math.round(optimizedUrl.length / 1370))
    };
    setLogoDetails(details);

    try {
      localStorage.removeItem('coach_cunha_logo_removed');
      localStorage.setItem('coach_cunha_show_auth_logo', 'true');
      localStorage.setItem('coach_cunha_custom_logo', optimizedUrl);
      localStorage.setItem('coach_cunha_logo_details', JSON.stringify(details));
    } catch (e) {
      console.warn('Could not save logo to localStorage:', e);
    }

    // Add to assets gallery
    const newAsset: AssetImage = {
      id: 'logo-' + Date.now(),
      name: fileName,
      url: optimizedUrl,
      sizeBytes,
      uploadedAt: new Date().toISOString(),
      category: 'logo'
    };
    setAssets(prev => {
      const updated = [newAsset, ...prev.filter(a => a.name !== fileName)];
      try {
        localStorage.setItem('coach_cunha_assets_gallery', JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });

    // Firestore sync to both app_settings and system_settings
    const brandingPayload = {
      logoUrl: optimizedUrl,
      isLogoRemoved: false,
      showAuthLogo: true,
      logoDetails: details,
      updatedAt: new Date().toISOString()
    };
    try {
      await setDoc(doc(db, 'app_settings', 'branding'), brandingPayload, { merge: true });
    } catch (e) {
      console.error('Failed writing branding to Firestore app_settings:', e);
    }
    try {
      await setDoc(doc(db, 'system_settings', 'branding'), brandingPayload, { merge: true });
    } catch (e) {}
  };

  const removeLogoCompletely = async () => {
    setLogoUrl('');
    setIsLogoRemoved(true);
    setShowAuthLogo(false);
    setLogoDetails(null);

    try {
      localStorage.setItem('coach_cunha_logo_removed', 'true');
      localStorage.setItem('coach_cunha_show_auth_logo', 'false');
      localStorage.removeItem('coach_cunha_custom_logo');
      localStorage.removeItem('coach_cunha_logo_details');
    } catch (e) {}

    const payload = {
      logoUrl: '',
      isLogoRemoved: true,
      showAuthLogo: false,
      logoDetails: null,
      updatedAt: new Date().toISOString()
    };
    try {
      await setDoc(doc(db, 'app_settings', 'branding'), payload, { merge: true });
    } catch (e) {
      console.error('Failed to save removeLogo to Firestore app_settings:', e);
    }
    try {
      await setDoc(doc(db, 'system_settings', 'branding'), payload, { merge: true });
    } catch (e) {}
  };

  const toggleAuthLogo = async (show: boolean) => {
    setShowAuthLogo(show);
    try {
      localStorage.setItem('coach_cunha_show_auth_logo', show ? 'true' : 'false');
    } catch (e) {}

    const payload = {
      showAuthLogo: show,
      updatedAt: new Date().toISOString()
    };
    try {
      await setDoc(doc(db, 'app_settings', 'branding'), payload, { merge: true });
    } catch (e) {}
    try {
      await setDoc(doc(db, 'system_settings', 'branding'), payload, { merge: true });
    } catch (e) {}
  };

  const resetToDefaultLogo = async () => {
    setLogoUrl(DEFAULT_LOGO);
    setIsLogoRemoved(false);
    setShowAuthLogo(true);
    setLogoDetails(null);

    try {
      localStorage.removeItem('coach_cunha_logo_removed');
      localStorage.setItem('coach_cunha_show_auth_logo', 'true');
      localStorage.removeItem('coach_cunha_custom_logo');
      localStorage.removeItem('coach_cunha_logo_details');
    } catch (e) {}

    const payload = {
      logoUrl: DEFAULT_LOGO,
      isLogoRemoved: false,
      showAuthLogo: true,
      logoDetails: null,
      updatedAt: new Date().toISOString()
    };
    try {
      await setDoc(doc(db, 'app_settings', 'branding'), payload, { merge: true });
    } catch (e) {}
    try {
      await setDoc(doc(db, 'system_settings', 'branding'), payload, { merge: true });
    } catch (e) {}
  };

  const addAsset = async (assetData: Omit<AssetImage, 'id' | 'uploadedAt'>) => {
    const item: AssetImage = {
      ...assetData,
      id: 'asset-' + Date.now(),
      uploadedAt: new Date().toISOString()
    };
    const updated = [item, ...assets];
    setAssets(updated);
    try {
      localStorage.setItem('coach_cunha_assets_gallery', JSON.stringify(updated));
    } catch (e) {}
  };

  const removeAsset = async (id: string) => {
    const updated = assets.filter(a => a.id !== id);
    setAssets(updated);
    try {
      localStorage.setItem('coach_cunha_assets_gallery', JSON.stringify(updated));
    } catch (e) {}
  };

  return (
    <LogoContext.Provider value={{
      logoUrl,
      isCustomLogo: !isLogoRemoved && logoUrl !== '' && logoUrl !== DEFAULT_LOGO,
      isLogoRemoved,
      showAuthLogo,
      logoDetails,
      assets,
      updateLogo,
      resetToDefaultLogo,
      removeLogoCompletely,
      toggleAuthLogo,
      addAsset,
      removeAsset,
    }}>
      {children}
    </LogoContext.Provider>
  );
};

export const useLogo = () => {
  const context = useContext(LogoContext);
  if (!context) {
    throw new Error('useLogo must be used within a LogoProvider');
  }
  return context;
};
