import { useEffect, useState } from 'react';

const assetsModuleEager = import.meta.glob(
  '@/assets/**/*.{png,jpg,jpeg,svg,webp,webm,mp4,mov}',
  {
    eager: true,
    import: 'default',
  },
) as Record<string, string>;

const assetsModuleLazy = import.meta.glob(
  '@/assets/**/*.{png,jpg,jpeg,svg,webp,webm,mp4,mov}',
  {
    import: 'default',
  },
) as Record<string, () => Promise<string>>;

export const useDynamicImport = (path: string, isLazy: boolean = true) => {
  const [assetSrc, setAssetSrc] = useState<string>();

  useEffect(() => {
    if (!path) return;

    if (isLazy) {
      assetsModuleLazy[path]()
        .then((module: string) => setAssetSrc(module))
        .catch((error: unknown) =>
          console.error(`Failed to load file: ${path}`, error),
        );
    } else {
      setAssetSrc(assetsModuleEager[path]);
    }
  }, [path, isLazy]);

  return assetSrc;
};
