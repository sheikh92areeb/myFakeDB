console.log("Play with some scripting");

// ---------------- APIs URL ---------------- //
const categoryApi = "http://localhost:3000/category";
const projectApi = "http://localhost:3000/projects";

// ---------------- CATEGORY SECTION ---------------- //

// Variables
const categoryForm = document.getElementById("category-form");
const categoryNameInput = document.getElementById("category");
const categoryIdInput = document.getElementById("category-id");
const categoryList = document.getElementById("list");

// Fetch categories
async function fetchCategories() {
  try {
    const res = await fetch(categoryApi);
    if (!res.ok) throw new Error("Failed to fetch categories");
    return await res.json();
  } catch (err) {
    console.error("Error fetching categories:", err);
    return [];
  }
}

// Render categories
function renderCategories(categories) {
  categoryList.innerHTML = "";

  categories.forEach((category) => {
    const li = document.createElement("li");

    const name = document.createElement("p");
    name.textContent = category.categoryName;

    const actions = document.createElement("span");
    actions.classList.add("actions");

    const editBtn = document.createElement("button");
    editBtn.textContent = "Edit";
    editBtn.onclick = () => editCategory(category.id);

    const delBtn = document.createElement("button");
    delBtn.textContent = "Delete";
    delBtn.onclick = () => deleteCategory(category.id);

    actions.appendChild(editBtn);
    actions.appendChild(delBtn);

    li.appendChild(name);
    li.appendChild(actions);
    categoryList.appendChild(li);
  });
};

// Load categories
async function loadCategories() {
  const categories = await fetchCategories();
  renderCategories(categories);
  renderCategorySelect(); // refresh dropdown as well
};

// Add/Update category
categoryForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const categoryName = categoryNameInput.value.trim();
  const categoryId = categoryIdInput.value;

  if (!categoryName) return alert("Category name is required!");

  const body = { categoryName };

  try {
    if (categoryId) {
      await fetch(`${categoryApi}/${categoryId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
    } else {
      await fetch(categoryApi, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
    };

    categoryForm.reset();
    categoryIdInput.value = "";
    await loadCategories();
  } catch (err) {
    console.error("Error saving category:", err);
    alert("⚠️ Something went wrong while saving category.");
  }
});

// Edit category
async function editCategory(id) {
  try {
    const res = await fetch(`${categoryApi}/${id}`);
    const data = await res.json();
    categoryIdInput.value = data.id;
    categoryNameInput.value = data.categoryName;
  } catch (err) {
    console.error("Error editing category:", err);
  }
}

// Delete category
async function deleteCategory(id) {
  if (!confirm("Are you sure you want to delete this category?")) return;
  try {
    await fetch(`${categoryApi}/${id}`, { method: "DELETE" });
    await loadCategories();
  } catch (err) {
    console.error("Error deleting category:", err);
  }
}

// ---------------- PROJECT SECTION ---------------- //

// Variables
const projectList = document.getElementById("project-list");
const projectForm = document.getElementById("project-form");
const categorySelect = document.getElementById("categorySelect");

const projectId = document.getElementById("projectId");
const projectTitle = document.getElementById("title");
const projectShortDesc = document.getElementById("short_description");
const projectDesc = document.getElementById("description");
const projectSelect = document.getElementById("categorySelect");
const projectTags = document.getElementById("tags");
const projectFeatures = document.getElementById("features");
const projectStack = document.getElementById("tech_stack");
const projectImgs = document.getElementById("images");
const projectGithub = document.getElementById("github");
const projectLive = document.getElementById("live");

// Utility: split comma string into array
function toArray(str) {
  return str.split(",").map((s) => s.trim()).filter(Boolean);
}

// Render category dropdown
async function renderCategorySelect() {
  categorySelect.innerHTML = '<option value="" disabled selected>Select Category</option>';

  const categories = await fetchCategories();
  categories.forEach((category) => {
    const option = document.createElement("option");
    option.value = category.categoryName;
    option.textContent = category.categoryName;
    categorySelect.appendChild(option);
  });
}

// Fetch projects
async function fetchProjects() {
  try {
    const res = await fetch(projectApi);
    if (!res.ok) throw new Error("Failed to fetch projects");
    return await res.json();
  } catch (err) {
    console.error("Error fetching projects:", err);
    return [];
  }
}

// Render projects
function renderProjects(projects) {
  projectList.innerHTML = "";

  projects.forEach((project) => {
    const li = document.createElement("li");
    li.innerHTML = `
      <div class="card">
        <div class="card-img">
          <img src="${ project.images?.[0] || "default.jpg" }" alt="Project Image">
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

// Load projects
async function loadProjects() {
  const projects = await fetchProjects();
  renderProjects(projects);
}

// Submit project form
projectForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const id = projectId.value;

  const data = {
    title: projectTitle.value.trim(),
    short_description: projectShortDesc.value.trim(),
    description: projectDesc.value.trim(),
    category: projectSelect.value,
    tags: toArray(projectTags.value),
    features: toArray(projectFeatures.value),
    techStack: toArray(projectStack.value),
    images: toArray(projectImgs.value),
    links: {
      github: projectGithub.value.trim(),
      live: projectLive.value.trim()
    }
  };

  if (!data.title || !data.short_description || !data.description || !data.category) {
    return alert("⚠️ Please fill all required fields!");
  }

  try {
    const res = await fetch(id ? `${projectApi}/${id}` : projectApi, {
      method: id ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (res.ok) {
      await res.json();
      alert("✅ Project saved successfully!");
      projectForm.reset();
      projectId.value = "";
      await loadProjects();
    }
  } catch (err) {
    console.error("Error saving project:", err);
    alert("⚠️ Something went wrong while saving project.");
  }
});

// Edit project
async function editProject(id) {
  try {
    const res = await fetch(`${projectApi}/${id}`);
    const data = await res.json();

    projectId.value = data.id;
    projectTitle.value = data.title;
    projectShortDesc.value = data.short_description;
    projectDesc.value = data.description;
    projectSelect.value = data.category;
    projectTags.value = (data.tags || []).join(", ");
    projectFeatures.value = (data.features || []).join(", ");
    projectStack.value = (data.techStack || []).join(", ");
    projectImgs.value = (data.images || []).join(", ");
    projectGithub.value = data.links.github,
    projectLive.value = data.links.live
  } catch (err) {
    console.error("Error editing project:", err);
  }
}

// Delete project
async function deleteProject(id) {
  if (!confirm("Are you sure you want to delete this project?")) return;
  try {
    await fetch(`${projectApi}/${id}`, { method: "DELETE" });
    await loadProjects();
  } catch (err) {
    console.error("Error deleting project:", err);
  }
}

// ---------------- INIT ---------------- //
loadCategories();
loadProjects();