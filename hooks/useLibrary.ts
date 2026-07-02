import { useState, useEffect, useCallback } from 'react';
import { libraryService } from '@/services/library.service';
import { useAuthContext } from '@/contexts/AuthContext';

export function useLibrary() {
    const [books, setBooks] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { user } = useAuthContext();

    const fetchBooks = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await libraryService.getBooks();
            setBooks(Array.isArray(data) ? data : []);
        } catch (err: any) {
            setError(err.message || 'Failed to fetch library books');
        } finally {
            setLoading(false);
        }
    }, []);

    const addBook = async (bookData: any) => {
        try {
            const newBook = await libraryService.createBook(bookData);
            setBooks(prev => [newBook, ...prev]);
            return { success: true };
        } catch (err: any) {
            return { success: false, error: err.message || 'Failed to add book' };
        }
    };

    const deleteBook = async (id: string) => {
        try {
            await libraryService.deleteBook(id);
            setBooks(prev => prev.filter(b => b.id !== id));
            return { success: true };
        } catch (err: any) {
            return { success: false, error: err.message || 'Failed to delete book' };
        }
    };

    useEffect(() => {
        if (user) {
            fetchBooks();
        }
    }, [user, fetchBooks]);

    return {
        books,
        loading,
        error,
        refresh: fetchBooks,
        addBook,
        deleteBook,
        // Mock statistics until backend provides them
        stats: {
            totalBooks: books.length,
            issuedBooks: Math.floor(books.length * 0.1), // Mock
            overdueBooks: 0, // Mock
            newArrivals: books.slice(0, 5)
        }
    };
}
