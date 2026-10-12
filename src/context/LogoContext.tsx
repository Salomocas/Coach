import React, { createContext, useContext, useState, useEffect } from 'react';
import { db, doc, getDoc, setDoc } from '../firebase';

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
  logoDetails: {
    fileName: string;
    updatedAt: string;
    fileSizeKb?: number;
  } | null;
  assets: AssetImage[];
  updateLogo: (dataUrl: string, fileName?: string, sizeBytes?: number) => Promise<void>;
  resetToDefaultLogo: () => Promise<void>;
  addAsset: (asset: Omit<AssetImage, 'id' | 'uploadedAt'>) => Promise<void>;
  removeAsset: (id: string) => Promise<void>;
}

const DEFAULT_LOGO = '/logo.svg';

/**
 * Optimizes logo images using canvas to prevent exceeding localStorage quota (~5MB)
 * and ensure lightning-fast loading across all devices. Preserves PNG alpha transparency.
 */
export const compressImageForLogo = (dataUrl: string, maxWidth = 512, maxHeight = 512): Promise<string> => {
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
        const compressed = canvas.toDataURL('image/png');
        resolve(compressed);
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
  const [logoUrl, setLogoUrl] = useState<string>(() => {
    try {
      const saved = localStorage.getItem('coach_cunha_custom_logo');
      if (saved) return saved;
    } catch (e) {
      console.warn('Could not read cached logo from localStorage:', e);
    }
    return DEFAULT_LOGO;
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

  // Sync with Firestore branding config if available
  useEffect(() => {
    const fetchRemoteBranding = async () => {
      try {
        let docSnap = await getDoc(doc(db, 'app_settings', 'branding')).catch(() => null);
        if (!docSnap || !docSnap.exists()) {
          docSnap = await getDoc(doc(db, 'system_settings', 'branding')).catch(() => null);
        }
        if (docSnap && docSnap.exists()) {
          const data = docSnap.data();
          // Only overwrite if remote has a custom logo defined
          if (data?.logoUrl && data.logoUrl !== DEFAULT_LOGO) {
            setLogoUrl(data.logoUrl);
            try {
              localStorage.setItem('coach_cunha_custom_logo', data.logoUrl);
            } catch (e) {}
          }
          if (data?.logoDetails) {
            setLogoDetails(data.logoDetails);
            try {
              localStorage.setItem('coach_cunha_logo_details', JSON.stringify(data.logoDetails));
            } catch (e) {}
          }
        }
      } catch (err) {
        console.warn('Could not fetch remote branding doc:', err);
      }
    };
    fetchRemoteBranding();
  }, []);

  const updateLogo = async (rawDataUrl: string, fileName: string = 'Logo.png', sizeBytes?: number) => {
    const optimizedUrl = await compressImageForLogo(rawDataUrl);
    setLogoUrl(optimizedUrl);

    const details = {
      fileName,
      updatedAt: new Date().toISOString(),
      fileSizeKb: Math.round(optimizedUrl.length / 1370)
    };
    setLogoDetails(details);

    try {
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
      logoDetails: details,
      updatedAt: new Date().toISOString()
    };
    try {
      await setDoc(doc(db, 'app_settings', 'branding'), brandingPayload, { merge: true });
    } catch (e) {}
    try {
      await setDoc(doc(db, 'system_settings', 'branding'), brandingPayload, { merge: true });
    } catch (e) {}
  };

  const resetToDefaultLogo = async () => {
    setLogoUrl(DEFAULT_LOGO);
    setLogoDetails(null);
    try {
      localStorage.removeItem('coach_cunha_custom_logo');
      localStorage.removeItem('coach_cunha_logo_details');
    } catch (e) {}

    try {
      await setDoc(doc(db, 'app_settings', 'branding'), {
        logoUrl: DEFAULT_LOGO,
        logoDetails: null,
        updatedAt: new Date().toISOString()
      }, { merge: true });
      await setDoc(doc(db, 'system_settings', 'branding'), {
        logoUrl: DEFAULT_LOGO,
        logoDetails: null,
        updatedAt: new Date().toISOString()
      }, { merge: true });
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
      isCustomLogo: logoUrl !== DEFAULT_LOGO,
      logoDetails,
      assets,
      updateLogo,
      resetToDefaultLogo,
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
