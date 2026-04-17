export interface ShowcaseSlide {
  url: string;
  alt: string;
}

/** Used when DB has no slides yet, and as the admin form starting point. */
export const DEFAULT_SHOWCASE_SLIDES: ShowcaseSlide[] = [
  { url: 'https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhYnN0cmFjdCUyMGFydHxlbnwxfHx8fDE3NzU3NDM0NzR8MA&ixlib=rb-4.1.0&q=80&w=1080', alt: 'Abstract Art 1' },
  { url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwyfHxhYnN0cmFjdCUyMGFydHxlbnwxfHx8fDE3NzU3NDM0NzR8MA&ixlib=rb-4.1.0&q=80&w=1080', alt: 'Abstract Art 2' },
  { url: 'https://images.unsplash.com/photo-1621506289937-48a4df2405e0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwzfHxhYnN0cmFjdCUyMGFydHxlbnwxfHx8fDE3NzU3NDM0NzR8MA&ixlib=rb-4.1.0&q=80&w=1080', alt: 'Abstract Art 3' },
  { url: 'https://images.unsplash.com/photo-1618005198919-d3d4b5a92ead?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHw0fHxhYnN0cmFjdCUyMGFydHxlbnwxfHx8fDE3NzU3NDM0NzR8MA&ixlib=rb-4.1.0&q=80&w=1080', alt: 'Abstract Art 4' }
];
