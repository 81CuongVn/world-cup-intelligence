import type { NewsArticle } from '../../lib/api';

type Size = 'medium' | 'large';

const sizeClass: Record<Size, string> = {
  medium: 'h-36 w-full md:h-40',
  large: 'h-44 w-full md:h-52',
};

type Props = {
  article: Pick<NewsArticle, 'title' | 'thumbnail_url'>;
  size?: Size;
  className?: string;
};

export function NewsThumbnail({ article, size = 'medium', className = '' }: Props) {
  const box = `relative overflow-hidden rounded-lg bg-panel2 ${sizeClass[size]} ${className}`;

  const src = article.thumbnail_url?.startsWith('/')
    ? article.thumbnail_url
    : article.thumbnail_url;

  if (src) {
    return (
      <div className={box}>
        <img
          src={src}
          alt=""
          loading="lazy"
          decoding="async"
          fetchPriority="low"
          className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.03]"
          onError={(e) => {
            e.currentTarget.style.display = 'none';
            e.currentTarget.parentElement?.classList.add('news-thumb-fallback');
          }}
        />
      </div>
    );
  }

  return (
    <div
      className={`${box} flex items-center justify-center bg-gradient-to-br from-pressing/25 via-panel2 to-receiving/20`}
      aria-hidden
    >
      <span className="text-3xl opacity-40">⚽</span>
    </div>
  );
}
