import { Client, Databases, ID, Query } from 'appwrite';

// Konfigurimi i Appwrite
const PROJECT_ID = import.meta.env.VITE_APPWRITE_PROJECT_ID;
const DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID;
const COLLECTION_ID = import.meta.env.VITE_APPWRITE_COLLECTION_ID;
const ENDPOINT = import.meta.env.VITE_APPWRITE_ENDPOINT || 'https://cloud.appwrite.io/v1';

// Appwrite eshte opsional: pa keto variabla, aplikacioni punon pa "Trending"
const isConfigured = Boolean(PROJECT_ID && DATABASE_ID && COLLECTION_ID);

const database = isConfigured
    ? new Databases(new Client().setEndpoint(ENDPOINT).setProject(PROJECT_ID))
    : null;

// Funksioni për të përditësuar ose shtuar kërkimet në Appwrite
export const updateSearchCount = async (searchTerm, movie) => {
    if (!database) return;
    try {
        // Kontrollo nëse searchTerm ekziston
        const result = await database.listDocuments(DATABASE_ID, COLLECTION_ID, [
            Query.equal('searchTerm', searchTerm),
        ]);

        if (result.documents.length > 0) {
            const doc = result.documents[0];

            // Nëse ekziston, përditëso count
            await database.updateDocument(DATABASE_ID, COLLECTION_ID, doc.$id, {
                count: doc.count + 1,
            });
        } else {
            // Nëse nuk ekziston, krijo dokument të ri
            await database.createDocument(DATABASE_ID, COLLECTION_ID, ID.unique(), {
                searchTerm,
                count: 1,
                movie_id: movie.id,
                title: movie.title, // ⬅️ E shtojmë për shfaqje në UI
                poster_url: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
            });
        }
    } catch (error) {
        console.error('Error updating search count:', error);
    }
};

// Funksioni për të marrë trending movies sipas count-it
export const getTrendingMovies = async () => {
    if (!database) return [];
    try {
        const result = await database.listDocuments(DATABASE_ID, COLLECTION_ID, [
            Query.limit(5),
            Query.orderDesc("count")
        ]);

        return result.documents;
    } catch (error) {
        console.error('Error fetching trending movies:', error);
        return [];
    }
};
