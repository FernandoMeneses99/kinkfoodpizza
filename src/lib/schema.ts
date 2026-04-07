export const restaurantSchema = {
  "@context": "https://schema.org",
  "@type": "Restaurant",
  "name": "Krokori",
  "image": "https://krokori.com/images/logo-198x662.png",
  "url": "https://krokori.com",
  "telephone": "+57-300-904-7298",
  "email": "info@Krokori.org",
  "address": {
    "@type": "PostalAddress",
    "addressLocality": "Bogotá",
    "addressCountry": "CO"
  },
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": "4.6097",
    "longitude": "-74.0817"
  },
  "openingHoursSpecification": [
    {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
      "opens": "10:00",
      "closes": "22:00"
    }
  ],
  "servesCuisine": ["Pizza", "Italian", "Fast Food", "Hamburgers"],
  "priceRange": "$$",
  "acceptsReservations": "False",
  "hasMenu": {
    "@type": "Menu",
    "name": "Menú Krokori",
    "url": "https://krokori.com/menu"
  },
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.9",
    "reviewCount": "50000"
  },
  "sameAs": [
    "https://www.facebook.com/krokori",
    "https://www.instagram.com/krokori",
    "https://wa.me/573009047298"
  ]
};

export const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Krokori",
  "url": "https://krokori.com",
  "logo": "https://krokori.com/images/logo-198x662.png",
  "contactPoint": {
    "@type": "ContactPoint",
    "telephone": "+57-300-904-7298",
    "contactType": "customer service",
    "availableLanguage": ["Spanish", "English"]
  }
};

export const localBusinessSchema = {
  "@context": "https://schema.org",
  "@type": "FastFoodRestaurant",
  "name": "Krokori",
  "image": "https://krokori.com/images/logo-198x662.png",
  "servesCuisine": ["Pizza", "Italian", "Fast Food", "Hamburgers"],
  "priceRange": "$$",
  "address": {
    "@type": "PostalAddress",
    "addressLocality": "Bogotá",
    "addressRegion": "Cundinamarca",
    "addressCountry": "CO"
  },
  "openingHours": "Mo-Su 10:00-22:00",
  "telephone": "+57-300-904-7298",
  "acceptsReservations": "False"
};

export const productSchema = (products: Array<{
  id: number;
  nombre: string;
  descripcion: string;
  precio: number;
  categoria_nombre: string;
}>) => ({
  "@context": "https://schema.org",
  "@type": "ItemList",
  "itemListElement": products.slice(0, 10).map((product, index) => ({
    "@type": "Product",
    "position": index + 1,
    "name": product.nombre,
    "description": product.descripcion,
    "offers": {
      "@type": "Offer",
      "price": product.precio,
      "priceCurrency": "COP",
      "availability": "https://schema.org/InStock"
    },
    "category": product.categoria_nombre
  }))
});
