export const API_URL = import.meta.env.VITE_API_URL;

export const apiClient = {
    get: (path: string) => 
        fetch(`${API_URL}${path}`, {
            headers: {
                'Content-Type': 'application/json',
            },
        }),
    
    post: (path: string, body: any) => 
        fetch(`${API_URL}${path}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
        }),
    
    delete: (path: string) => 
        fetch(`${API_URL}${path}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
        }),
}; 