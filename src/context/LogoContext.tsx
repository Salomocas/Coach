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
        const docRef = doc(db, 'system_settings', 'branding');
        const snap = await getDoc(docRef);
        if (snap.exists()) {
          const data = snap.data();
          if (data?.logoUrl) {
            setLogoUrl(data.logoUrl);
            try {
              localStorage.setItem('coach_cunha_custom_logo', data.logoUrl);
            } catch (e) {}
          }
          if (data?.logoDetails) {
            setLogoDetails(data.logoDetails);
          }
        }
      } catch (err) {
        console.warn('Could not fetch remote branding doc:', err);
      }
    };
    fetchRemoteBranding();
  }, []);

  const updateLogo = async (dataUrl: string, fileName: string = 'Logo.jpeg', sizeBytes?: number) => {
    setLogoUrl(dataUrl);
    const details = {
      fileName,
      updatedAt: new Date().toISOString(),
      fileSizeKb: sizeBytes ? Math.round(sizeBytes / 1024) : Math.round(dataUrl.length / 1370)
    };
    setLogoDetails(details);

    try {
      localStorage.setItem('coach_cunha_custom_logo', dataUrl);
      localStorage.setItem('coach_cunha_logo_details', JSON.stringify(details));
    } catch (e) {
      console.warn('Could not save logo to localStorage:', e);
    }

    // Add to assets gallery as well
    const newAsset: AssetImage = {
      id: 'logo-' + Date.now(),
      name: fileName,
      url: dataUrl,
      sizeBytes,
      uploadedAt: new Date().toISOString(),
      category: 'logo'
    };
    const updatedAssets = [newAsset, ...assets.filter(a => a.id !== newAsset.id)];
    setAssets(updatedAssets);
    try {
      localStorage.setItem('coach_cunha_assets_gallery', JSON.stringify(updatedAssets));
    } catch (e) {}

    // Firestore sync
    try {
      await setDoc(doc(db, 'system_settings', 'branding'), {
        logoUrl: dataUrl,
        logoDetails: details,
        updatedAt: new Date().toISOString()
      }, { merge: true });
    } catch (e) {
      console.warn('Could not sync logo to Firestore branding:', e);
    }
  };

  const resetToDefaultLogo = async () => {
    setLogoUrl(DEFAULT_LOGO);
    setLogoDetails(null);
    try {
      localStorage.removeItem('coach_cunha_custom_logo');
      localStorage.removeItem('coach_cunha_logo_details');
    } catch (e) {}

    try {
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
      removeAsset
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
