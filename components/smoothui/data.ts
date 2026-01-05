export const getAllPeople = () => {
  return [
    {
      name: "Eduardo Calvo",
      role: "CEO & Founder",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Eduardo",
    },
    {
      name: "Sarah Chen",
      role: "Head of Design",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
    },
    {
      name: "Marcus Johnson",
      role: "Lead Developer",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Marcus",
    },
    {
      name: "Emily Rodriguez",
      role: "Product Manager",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Emily",
    },
  ];
};

export const getAvatarUrl = (url: string, size: number) => {
  return url;
};

export const getImageKitUrl = (
  path: string,
  options: { width: number; quality?: number; format?: string }
) => {
  const width = options.width || 600;
  const height = Math.floor((width * 2) / 3);
  
  // Create a simple hash from the path to ensure the same path gets the same random image
  const hash = path.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
  
  return `https://picsum.photos/${width}/${height}?random=${hash}`;
};
