// --- STATE ---
let allLinks = [];
let filteredLinks = [];

// --- DOM ELEMENTS ---
const linksContainer = document.getElementById('links-container');
const searchInput = document.getElementById('search-input');
const searchForm = document.getElementById('search-form');
const emptyState = document.getElementById('empty-state');
const emptyStateTitle = document.getElementById('empty-state-title');
const emptyStatePrefix = document.getElementById('empty-state-prefix');
const addLinkBtn = document.getElementById('add-link-btn');
const emptyStateAddLinkBtn = document.getElementById('empty-state-add-link');

// Modal Elements
const modal = document.getElementById('modal');
const modalContent = document.getElementById('modal-content');
const modalForm = document.getElementById('modal-form');
const modalTitle = document.getElementById('modal-title');
const modalError = document.getElementById('modal-error');
const modalCancelBtn = document.getElementById('modal-cancel-btn');
const linkIdInput = document.getElementById('link-id');
const titleInput = document.getElementById('title');
const urlInput = document.getElementById('url');
const categoryInput = document.getElementById('category');

// --- UTILITY FUNCTIONS ---
const getHostname = (url) => {
    try {
        return new URL(url).hostname.replace('www.', '');
    } catch (error) {
        return '';
    }
};

// --- RENDER FUNCTION ---
const renderLinks = () => {
    linksContainer.innerHTML = ''; // Clear existing links

    if (filteredLinks.length === 0) {
        const searchTerm = searchInput.value.trim();
        emptyState.classList.remove('hidden');
        linksContainer.classList.add('hidden');
        if (searchTerm) {
            emptyStateTitle.textContent = "No matching links found";
            emptyStatePrefix.textContent = "Try a different search or ";
        } else {
            emptyStateTitle.textContent = "No links yet.";
            emptyStatePrefix.textContent = "";
        }
    } else {
        emptyState.classList.add('hidden');
        linksContainer.classList.remove('hidden');
        const fragment = document.createDocumentFragment();
        filteredLinks.forEach(link => {
            const linkCard = createLinkCard(link);
            fragment.appendChild(linkCard);
        });
        linksContainer.appendChild(fragment);
    }
};

const createLinkCard = (link) => {
    const hostname = getHostname(link.url);
    const faviconUrl = hostname ? `https://www.google.com/s2/favicons?domain=${hostname}&sz=32` : 'https://picsum.photos/32';

    const card = document.createElement('div');
    card.className = "group relative block bg-white rounded-lg shadow-md p-4 transition-all duration-300 h-full border border-gray-200 hover:shadow-lg hover:border-blue-500 transform hover:-translate-y-1";
    card.setAttribute('aria-label', link.title);
    card.dataset.id = link.id;

    card.innerHTML = `
        <div class="flex flex-col justify-between h-full">
            <div class="flex items-center justify-between mb-3">
                <div class="flex items-center gap-2">
                    <img src="${faviconUrl}" alt="" class="w-6 h-6 rounded-full bg-gray-100" />
                    <span class="text-xs font-semibold text-blue-800 bg-blue-100 px-2 py-0.5 rounded-full">${link.category}</span>
                </div>
            </div>
            <div class="flex-grow my-2">
                <h3 class="text-md font-bold text-gray-900 break-words leading-tight">${link.title}</h3>
            </div>
            <div class="flex justify-between items-center mt-auto pt-2 border-t border-gray-100">
                <p class="text-xs text-gray-500 break-all w-2/3">${hostname}</p>
                <a href="${link.url}" target="_blank" rel="noopener noreferrer" class="visit-link-btn inline-flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800 font-semibold hover:underline" aria-label="Visit ${link.title}">
                    Visit
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                </a>
            </div>
        </div>
        <div class="absolute top-2 right-2 flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <button data-action="edit" class="text-gray-400 hover:text-yellow-500 transition-colors p-1.5 rounded-full bg-white/50 backdrop-blur-sm hover:bg-gray-100" aria-label="Edit ${link.title}">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.5L15.232 5.232z" />
                </svg>
            </button>
            <button data-action="delete" class="text-gray-400 hover:text-red-500 transition-colors p-1.5 rounded-full bg-white/50 backdrop-blur-sm hover:bg-gray-100" aria-label="Delete ${link.title}">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
            </button>
        </div>
    `;
    return card;
};

// --- EVENT HANDLERS & LOGIC ---

const filterLinks = () => {
    const searchTerm = searchInput.value.toLowerCase().trim();
    if (!searchTerm) {
        filteredLinks = [...allLinks];
    } else {
        filteredLinks = allLinks.filter(link =>
            link.title.toLowerCase().includes(searchTerm) ||
            link.category.toLowerCase().includes(searchTerm) ||
            link.url.toLowerCase().includes(searchTerm)
        );
    }
    renderLinks();
};

const handleSearchSubmit = (e) => {
    e.preventDefault();
    const searchTerm = searchInput.value.trim();
    if (searchTerm) {
        const googleSearchUrl = `https://www.google.com/search?q=${encodeURIComponent(searchTerm)}`;
        window.open(googleSearchUrl, '_blank', 'noopener,noreferrer');
    }
};

const openModal = (link = null) => {
    modalForm.reset();
    modalError.textContent = '';
    if (link) {
        modalTitle.textContent = 'Edit Link';
        linkIdInput.value = link.id;
        titleInput.value = link.title;
        urlInput.value = link.url;
        categoryInput.value = link.category;
    } else {
        modalTitle.textContent = 'Add New Link';
        linkIdInput.value = '';
    }
    modal.classList.remove('hidden');
};

const closeModal = () => {
    modal.classList.add('hidden');
};

const handleModalFormSubmit = (e) => {
    e.preventDefault();
    modalError.textContent = '';

    const id = linkIdInput.value;
    const title = titleInput.value.trim();
    const url = urlInput.value.trim();
    const category = categoryInput.value.trim();

    if (!title || !url || !category) return;

    try {
        new URL(url);
    } catch (_) {
        modalError.textContent = "Please enter a valid URL.";
        return;
    }

    if (id) {
        // Update existing link
        allLinks = allLinks.map(l => (l.id === id ? { id, title, url, category } : l));
    } else {
        // Add new link
        const newLink = { id: Date.now().toString(), title, url, category };
        allLinks.push(newLink);
    }
    
    closeModal();
    filterLinks(); // Re-filter and render to show the changes
};

const handleLinksContainerClick = (e) => {
    const button = e.target.closest('button');
    if (!button) return;

    const action = button.dataset.action;
    if (!action) return;

    const card = e.target.closest('[data-id]');
    const linkId = card.dataset.id;
    const link = allLinks.find(l => l.id === linkId);
    if (!link) return;

    if (action === 'edit') {
        openModal(link);
    } else if (action === 'delete') {
        if (confirm(`Are you sure you want to delete "${link.title}"?`)) {
            allLinks = allLinks.filter(l => l.id !== linkId);
            filterLinks();
        }
    }
};

// --- INITIALIZATION ---
const init = async () => {
    // Setup event listeners
    searchInput.addEventListener('input', filterLinks);
    searchForm.addEventListener('submit', handleSearchSubmit);
    addLinkBtn.addEventListener('click', () => openModal());
    emptyStateAddLinkBtn.addEventListener('click', () => openModal());
    
    // Modal listeners
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });
    modalCancelBtn.addEventListener('click', closeModal);
    modalForm.addEventListener('submit', handleModalFormSubmit);

    // Link card action listeners (using event delegation)
    linksContainer.addEventListener('click', handleLinksContainerClick);
    
    // Fetch initial data
    try {
        const response = await fetch('/links.json');
        if (!response.ok) throw new Error('Failed to load links.');
        const data = await response.json();
        allLinks = data;
        filterLinks();
    } catch (error) {
        console.error("Error fetching links:", error);
        allLinks = [];
        filterLinks();
    }
};

document.addEventListener('DOMContentLoaded', init);
