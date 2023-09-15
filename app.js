const BASE_URL = "https://staging.iamdave.ai";
const PAGE_SIZE = 10;
let pageNumber = 1;
let isLastPage = false;

// Initialize filter options
let currentFilter = null;

// Function to fetch suppliers with optional filters
function fetchSuppliers() {
    let apiUrl = `${BASE_URL}/list/supply?_page_number=${pageNumber}&_page_size=${PAGE_SIZE}`;

    // Add optional filters if selected
    if (currentFilter) {
        apiUrl += `&${currentFilter}`;
    }

    fetch(apiUrl, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "X-I2CE-ENTERPRISE-ID": "dave_vs_covid",
            "X-I2CE-USER-ID": "ananth+covid@i2ce.in",
            "X-I2CE-API-KEY": "0349234-38472-1209-2837-3432434"
        }
    })
    .then(response => response.json())
    .then(data => {
        const supplierList = document.getElementById("supplierList");

        if (Array.isArray(data.data)) {
            // Clear existing supplier list
            supplierList.innerHTML = "";

            data.data.forEach(supplier => {
                const card = document.createElement("div");
                card.classList.add("supplier-card");
                card.innerHTML = `
                    <p>Category: ${supplier.category}</p>
                    <p>Channel: ${supplier.channel}</p>
                    <p>Request Description: ${supplier.request_description}</p>
                    <p>Contact Numbers: ${supplier.contact_numbers.join(', ')}</p>
                    <p>State: ${supplier.state}</p>
                    <p>Source Time: ${supplier.source_time}</p>
                `;
                supplierList.appendChild(card);
            });

            isLastPage = data.is_last;
            if (!isLastPage) {
                document.getElementById("loadMoreButton").style.display = "block";
            } else {
                document.getElementById("loadMoreButton").style.display = "none";
            }
        } else {
            console.error("Data is not an array:", data);
        }
    })
    .catch(error => console.error(error));
}

// Function to set the current filter based on user selection
function setFilter(filterType, filterValue) {
    if (filterValue) {
        currentFilter = `${filterType}=${filterValue}`;
    } else {
        currentFilter = null; // Clear the filter if no value is selected
    }
    pageNumber = 1; // Reset page number when the filter changes
    fetchSuppliers();
}

function loadMoreSuppliers() {
    if (!isLastPage) {
        pageNumber++;
        fetchSuppliers();
    }
}

document.addEventListener("DOMContentLoaded", () => {
    fetchSuppliers();
    document.getElementById("loadMoreButton").addEventListener("click", loadMoreSuppliers);

    // Add event listeners for filter options (e.g., category, channel, state)
    document.getElementById("categoryFilter").addEventListener("change", event => {
        setFilter("category", event.target.value);
    });

    document.getElementById("channelFilter").addEventListener("change", event => {
        setFilter("channel", event.target.value);
    });

    document.getElementById("stateFilter").addEventListener("change", event => {
        setFilter("state", event.target.value);
    });
});
// Sample supplier data (replace with your actual data)
const supplierData = [
    { name: 'Supplier 1', category: 'electronics', channel: 'online', state: 'delhi' },
    { name: 'Supplier 2', category: 'clothing', channel: 'retail', state: 'tn' },
    // Add more supplier objects...
];


function filterAndDisplaySupplierList(category, channel, state) {
    const filteredSuppliers = supplierData.filter(supplier => {
        if (category !== 'all' && supplier.category !== category) {
            return false;
        }
        if (channel !== 'all' && supplier.channel !== channel) {
            return false;
        }
        if (state !== 'all' && supplier.state !== state) {
            return false;
        }
        return true;
    });

    
    const supplierListContainer = document.getElementById('supplierList');
    supplierListContainer.innerHTML = '';

   
    filteredSuppliers.forEach(supplier => {
        const supplierElement = document.createElement('div');
        supplierElement.textContent = `Name: ${supplier.name}, Category: ${supplier.category}, Channel: ${supplier.channel}, State: ${supplier.state}`;
        supplierListContainer.appendChild(supplierElement);
    });
}


document.getElementById('applyFilters').addEventListener('click', () => {
    const categoryFilter = document.getElementById('categoryFilter').value;
    const channelFilter = document.getElementById('channelFilter').value;
    const stateFilter = document.getElementById('stateFilter').value;

    filterAndDisplaySupplierList(categoryFilter, channelFilter, stateFilter);
});


filterAndDisplaySupplierList('all', 'all', 'all');

document.getElementById('applyFilters').addEventListener('click', (event) => {
    event.preventDefault(); 

    const categoryFilter = document.getElementById('categoryFilter').value;
    const channelFilter = document.getElementById('channelFilter').value;
    const stateFilter = document.getElementById('stateFilter').value;

    filterAndDisplaySupplierList(categoryFilter, channelFilter, stateFilter);
});

