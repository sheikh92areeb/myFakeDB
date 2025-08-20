console.log("Play with some scripiting");

const categoryApi = "http://localhost:3000/category";
const projectApi = "http://localhost:3000/projects";

const categoryForm = document.getElementById("category-form");
const categoryNameInput = document.getElementById("category");
const categoryIdInput = document.getElementById("category-id")
const categoryList = document.getElementById("list");

// SHOW ALL CATEGORIES
async function fetchCategory() {
    categoryList.innerHTML = '';

    const data = await fetch(categoryApi);
    const response = await data.json();
    
    response.forEach(category => {
        const li = document.createElement("li")
        li.innerHTML = `
            <p>${category.categoryName}</p>
            <span class='actions'>
                <button onclick="editCategory('${category.id}')">Edit</button>
                <button onclick="deleteCategory('${category.id}')">Delete</button>
            </span>`

        categoryList.appendChild(li)
    });
}

// ADD & UPDATE CATEGORY
categoryForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const categoryName = categoryNameInput.value;
    const categoryId = categoryIdInput.value;

    const body = { categoryName };

    if (categoryId) {
        // Update Category
        await fetch(`${categoryApi}/${categoryId}`, {
            method:"PUT",
            headers:  { "Content-Type": "application/json" },
            body: JSON.stringify(body)
        });
    }else {
        // Add Category
        await fetch(categoryApi, {
            method: "POST",
            headers:  { "Content-Type": "application/json" },
            body: JSON.stringify(body)
        });
    }

    categoryForm.reset();
});

// EDIT CATEGORY
async function editCategory(id) {
    const data = await fetch(`${categoryApi}/${id}`);
    const response = await data.json();

    categoryIdInput.value = response.id;
    categoryNameInput.value = response.categoryName;
};

// DELETE CATEGORY
async function deleteCategory(id) {
    await fetch(`${categoryApi}/${id}`, { method:"DELETE" });    
    fetchCategory();
};

// LOAD DATA
fetchCategory();