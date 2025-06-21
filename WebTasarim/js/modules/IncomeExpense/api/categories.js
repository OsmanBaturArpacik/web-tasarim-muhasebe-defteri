const BASE_URL = 'http://localhost:3000';

export async function fetchCategories(userId) {
    const res = await fetch(`${BASE_URL}/categories`);
    const categories = await res.json();
    return categories.filter(c => c.user_id === userId);
}

export async function addCategory(newCategory) {
    const res = await fetch(`${BASE_URL}/categories`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newCategory),
    });
    if (res.status === 409) {
        const data = await res.json();
        throw new Error(data.error);
    }
}

export async function deleteCategory(id) {
    await fetch(`${BASE_URL}/categories/${id}`, { method: 'DELETE' });
}
