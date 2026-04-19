export type TCodebaseIcons = Record<
  string,
  { default: React.FC<React.SVGProps<SVGSVGElement>> }
>;

export type TCodebaseNewIcons = Record<
  string,
  { component: React.FC; name: string; path: string }
>;
