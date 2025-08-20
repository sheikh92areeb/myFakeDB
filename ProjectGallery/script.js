console.log("Play with some scripiting");

const categoryApi = "http://localhost:3000/category";
const projectApi = "http://localhost:3000/projects";


// ------ CATEGORY SECTION ------

// Variables
const categoryForm = document.getElementById("category-form");
const categoryNameInput = document.getElementById("category");
const categoryIdInput = document.getElementById("category-id")
const categoryList = document.getElementById("list");

// SHOW ALL CATEGORIES

// Only fetch categories
async function fetchCategories() {
  try {
    const res = await fetch(categoryApi);
    if (!res.ok) throw new Error("Failed to fetch categories");
    return await res.json(); // returns array
  } catch (err) {
    console.error("Error fetching categories:", err);
    return [];
  }
}

// ✅ Render categories into DOM
function renderCategories(categories) {
  categoryList.innerHTML = ""; // clear old list

  categories.forEach(category => {
    const li = document.createElement("li");
    li.innerHTML = `
      <p>${category.categoryName}</p>
      <span class="actions">
        <button onclick="editCategory('${category.id}')">Edit</button>
        <button onclick="deleteCategory('${category.id}')">Delete</button>
      </span>
    `;
    categoryList.appendChild(li);
  });
}

// ✅ Combined usage
async function loadCategories() {
  const categories = await fetchCategories();
  renderCategories(categories);
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

    e.reset();
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
    loadCategories();
};

// LOAD DATA
loadCategories();


// ------ PROJECT SECTION ------

// Variables
const projectList = document.getElementById('project-list');
const projectForm = document.getElementById("project-form");
const categorySelect = document.getElementById('categorySelect');

const projectId = document.getElementById("projectId");
const projectTitle = document.getElementById("title");
const projectShortDesc = document.getElementById("short_description");
const projectDesc = document.getElementById("description");
const projectSelect = document.getElementById("categorySelect");
const projectTags = document.getElementById("tags");
const projectFeatures = document.getElementById("features");
const projectStack = document.getElementById("tech_stack");
const projectImgs = document.getElementById("images");

// utility: split comma string into array
function toArray(str) {
    return str.split(",").map(s => s.trim()).filter(Boolean);
}

// Show Categories in Select
async function renderCategorySelect() {
    categorySelect.innerHTML = '<option value="" disabled selected>Select Category</option>';
    const categories = await fetchCategories(categoryApi);
    categories.forEach(category => {
        const option = document.createElement("option");
        option.innerHTML = `
            <option value="${category.categoryName}">${category.categoryName}</option>
        `;
    categorySelect.appendChild(option);
  });    
}

renderCategorySelect();

// Show Projects
async function fetchProjects() {
  try {
    const res = await fetch(projectApi);
    if (!res.ok) throw new Error("Failed to fetch categories");
    return await res.json(); // returns array
  } catch (err) {
    console.error("Error fetching categories:", err);
    return [];
  }
}

function renderProjects(projects) {
  projectList.innerHTML = ""; // clear old list

  projects.forEach(project => {
    const li = document.createElement("li");
    li.innerHTML = `
        <div class="card">
            <div class="card-img">
                <img src="${project.images[0]}" alt="Project Image">
            </div>
            <div class="card-body">
                <h3>${project.title}</h3>
                <p>${project.short_description}</p>
                <div class="buttons">
                  <button onclick="editProject('${project.id}')">Edit</button>
                  <button onclick="deleteProject('${project.id}')">Delete</button>
                </div>
            </div>
        </div>
    `;
    projectList.appendChild(li);
  });
}

// ✅ Combined usage
async function loadProjects() {
  const projects = await fetchProjects();
  renderProjects(projects);
}


// Submit Form 
projectForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const id = projectId.value;

    const data = {
        title: projectTitle.value,
        short_description: projectShortDesc.value,
        description: projectDesc.value,
        category: projectSelect.value,
        tags: toArray(projectTags.value),
        features: toArray(projectFeatures.value),
        techStack: toArray(projectStack.value),
        images: toArray(projectImgs.value),
      };

    if (id) {
        try {
            const res = await fetch(`${projectApi}/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });

            if (res.ok) {
                const result = await res.json();
                alert("✅ Project submitted successfully!");
                console.log("Server response:", result);
                e.target.reset();
            }

        } catch (err) {
            console.error(err);
            alert("⚠️ Something went wrong while submitting.");
        }    
    } else {
        try {
            const res = await fetch(projectApi, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });

            if (res.ok) {
                const result = await res.json();
                alert("✅ Project submitted successfully!");
                console.log("Server response:", result);
                e.target.reset();
            }

        } catch (err) {
            console.error(err);
            alert("⚠️ Something went wrong while submitting.");
        }
    }
})

// Edit Project 
async function editProject(id) {
  const data = await fetch(`${projectApi}/${id}`);
  const response = await data.json();

  projectId.value = response.id;
  projectTitle.value = response.title;
  projectShortDesc.value = response.short_description;
  projectDesc.value = response.description;
  projectSelect.value = response.category;
  projectTags.value = response.tags.toString();
  projectFeatures.value = response.features.toString();
  projectStack.value = response.techStack.toString();
  projectImgs.value = response.images.toString();  
};

// DELETE Project
async function deleteProject(id) {
    await fetch(`${projectApi}/${id}`, { method:"DELETE" });    
    loadProjects();
};

// Load Projects
loadProjects();