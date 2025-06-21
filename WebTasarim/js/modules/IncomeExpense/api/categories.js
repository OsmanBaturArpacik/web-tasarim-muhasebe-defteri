const BASE_URL = 'http://localhost:3000';

export async function fetchCategories(userId) {
    const res = await fetch(`${BASE_URL}/categories`);
    const data = await res.json();
    return data.filter(c => c.user_id === userId);
}

export async function addCategory(category) {
    const res = await fetch(`${BASE_URL}/categories`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(category)
    });

    if (res.status === 409) {
        const data = await res.json();
        throw new Error(data.error);
    }
}

export async function deleteCategory(id) {
    await fetch(`${BASE_URL}/categories/${id}`, { method: 'DELETE' });
}
