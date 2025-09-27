const API_KEY = "5b2089efc01349a2a0ac54b1912d2b8d";
const BASE_URL = "https://newsapi.org/v2";

export type Article = {
  title: string;
  description: string;
  url: string;
  urlToImage: string;
  content: string;
};


const translateText = async (text: string): Promise<string> => {
  if (!text || text.trim().length === 0) return "";
  
  try {
    
    const response = await fetch(
      `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=es&dt=t&q=${encodeURIComponent(text)}`
    );
    
    if (!response.ok) {
      throw new Error(`HTTP error: ${response.status}`);
    }
    
    const data = await response.json();
    
    
    if (data && data[0] && data[0][0] && data[0][0][0]) {
      return data[0][0][0];
    }
    
    return text; 
    
  } catch (error) {
    console.warn("Error en traducción Google:", error);
    return text; 
  }
};


const translateWithMicrosoft = async (text: string): Promise<string> => {
  try {
    const response = await fetch(
      `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=en|es`
    );
    
    const data = await response.json();
    
    if (data.responseStatus === 200 && data.responseData) {
      return data.responseData.translatedText;
    }
    
    return text;
  } catch (error) {
    console.warn("Error en traducción Microsoft:", error);
    return text;
  }
};

const isValidArticle = (article: any): boolean => {
  return article &&
         article.title &&
         article.title !== '[Removed]' &&
         article.title.length > 10 &&
         article.description &&
         article.description.length > 10;
};

export const getTopHeadlines = async (): Promise<Article[]> => {
  try {
    console.log("📡 Obteniendo noticias...");
    
    const response = await fetch(
      `${BASE_URL}/top-headlines?country=us&pageSize=10&apiKey=${API_KEY}`
    );
    
    const data = await response.json();
    
    if (!data.articles) {
      console.log(" No hay artículos en la respuesta");
      return [];
    }

    const validArticles = data.articles.filter(isValidArticle).slice(0, 6);
    console.log(` ${validArticles.length} artículos válidos encontrados`);

    // Traducir artículos
    const translatedArticles = [];
    
    for (let i = 0; i < validArticles.length; i++) {
      const article = validArticles[i];
      
      console.log(` Traduciendo artículo ${i + 1}...`);
      
      try {
        // Usar Google Translate como primera opción
        const [translatedTitle, translatedDescription] = await Promise.all([
          translateText(article.title),
          translateText(article.description.substring(0, 200)) // Limitar longitud
        ]);

        translatedArticles.push({
          ...article,
          title: translatedTitle,
          description: translatedDescription,
          urlToImage: article.urlToImage || 'https://images.unsplash.com/photo-1586339949916-3e9457bef6d3?w=400'
        });
        
        console.log(`✓ Artículo ${i + 1} traducido`);
        
      } catch (error) {
        console.warn(`✗ Error traduciendo artículo ${i + 1}:`, error);
        
        translatedArticles.push({
          ...article,
          urlToImage: article.urlToImage || 'https://images.unsplash.com/photo-1586339949916-3e9457bef6d3?w=400'
        });
      }
      
      
      if (i < validArticles.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }

    console.log(" Traducción completada");
    return translatedArticles;
    
  } catch (error) {
    console.error(" Error general:", error);
    return [];
  }
};


export const getNewsSimple = async (): Promise<Article[]> => {
  try {
    const response = await fetch(
      `${BASE_URL}/top-headlines?country=us&pageSize=6&apiKey=${API_KEY}`
    );
    
    const data = await response.json();
    
    if (!data.articles) return [];

    return data.articles
      .filter(isValidArticle)
      .map((article: any) => ({
        title: article.title,
        description: article.description,
        url: article.url,
        urlToImage: article.urlToImage || 'https://images.unsplash.com/photo-1586339949916-3e9457bef6d3?w=400',
        content: article.content || article.description
      }));
      
  } catch (error) {
    console.error("Error in getNewsSimple:", error);
    return [];
  }
};

export const searchNews = async (query: string): Promise<Article[]> => {
  try {
    const response = await fetch(
      `${BASE_URL}/everything?q=${encodeURIComponent(query)}&language=es&pageSize=10&apiKey=${API_KEY}`
    );

    const data = await response.json();

    if (!data.articles) return [];

    return data.articles
      .filter(isValidArticle)
      .map((article: any) => ({
        title: article.title,
        description: article.description,
        url: article.url,
        urlToImage: article.urlToImage || 'https://images.unsplash.com/photo-1586339949916-3e9457bef6d3?w=400',
        content: article.content || article.description
      }));
  } catch (error) {
    console.error("Error en búsqueda API:", error);
    return [];
  }
};
