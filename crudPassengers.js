// Data (State)
let passengers = [];

// Function to fetch passengers data from the API and render them
async function fetchAndRender() {
    // Fetch the Passengers data from the json-server API
    const passengersResponse = await fetch(`https://${API_KEY}.mockapi.io/api/v1/passengers`);
    const passengersData = await passengersResponse.json();
    
    // Saving the data in state
    passengers = passengersData;
    
    // Rendering based on the state
    renderPassengers();
}

const passengersContainer = document.getElementById("passengers-container");

// Function to render passengers data into the HTML
function renderPassengers() {
    passengersContainer.innerHTML = ""; // Clear previous content

    for (const passenger of passengers) {
        const tr = document.createElement("tr");
        // Populate table row with passenger data
        tr.innerHTML = `
            <td>${passenger.name.firstName}</td>
            <td>${passenger.name.lastName}</td>
            <td>${passenger.from}</td>
            <td>${passenger.to}</td>
            <td>${passenger.id}</td>
            <td><button id="delete-button" class="btn btn-danger">Delete</button></td>
        `;
        
        // Event listener for delete button
        tr.querySelector("#delete-button").addEventListener("click", () => {
            deletePassenger(passenger.id); // Call deletePassenger function
        });

        passengersContainer.appendChild(tr); // Append table row to container
    }
}

// Initial fetch and render
fetchAndRender();

// Event listener when DOM content is loaded
document.addEventListener('DOMContentLoaded', function () {
    const addNewPassengerForm = document.getElementById('addNewPassengerForm');

    // Event listener for form submission to add new passenger
    addNewPassengerForm.addEventListener('submit', async function (event) {
        event.preventDefault(); // Prevent form submission

        // Capture form input values
        const newPassenger = {
            name: {
                firstName: document.getElementById('newFirst').value,
                lastName: document.getElementById('newLast').value
            },
            from: document.getElementById('newOrigin').value,
            to: document.getElementById('newDestination').value,
        };

        try {
            // Send POST request to add new passenger
            const response = await fetch(`https://${API_KEY}.mockapi.io/api/v1/passengers`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(newPassenger)
            });

            if (!response.ok) {
                throw new Error('Failed to add new passenger');
            }

            const createdPassengerWithId = await response.json();
            passengers.push(createdPassengerWithId); // Update frontend state
            renderPassengers(); // Re-render UI
        } catch (error) {
            console.error('Error adding new passenger:', error);
        }
    });
});

// Function to delete a passenger
async function deletePassenger(passengerId) {
    // Delete the passenger on the backend database
    await fetch(`https://${API_KEY}.mockapi.io/api/v1/passengers/` + passengerId, {
        method: "DELETE",
    });

    // Delete the passenger from the frontend state
    const indexToDelete = passengers.findIndex(passenger => passenger.id === passengerId);
    passengers.splice(indexToDelete, 1);

    // Re-render UI because the state (frontend data) has updated
    renderPassengers();
}

// Event listener when DOM content is loaded
document.addEventListener('DOMContentLoaded', function () {
    const updatePassengerForm = document.getElementById('updatePassengerForm');

    // Event listener for form submission to update a passenger
    updatePassengerForm.addEventListener('submit', async function (event) {
        event.preventDefault(); // Prevent form submission

        // Capture form input values for updating passenger
        const updatedPassenger = {
            name: {
                firstName: document.getElementById('updateFirst').value,
                lastName: document.getElementById('updateLast').value
            },
            from: document.getElementById('updateOrigin').value,
            to: document.getElementById('updateDestination').value,
            id: document.getElementById('updateId').value
        };

        try {
            // Send PUT request to update passenger
            const response = await fetch(`https://${API_KEY}.mockapi.io/api/v1/passengers/${updatedPassenger.id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(updatedPassenger)
            });

            if (!response.ok) {
                throw new Error('Failed to update passenger');
            }

            // Optionally handle the response data if needed
            const updatedPassengerData = await response.json();
            console.log(updatedPassengerData);
            // Update frontend state or UI
            const indexToUpdate = passengers.findIndex(passenger => passenger.id === updatedPassengerData.id)
            passengers.splice(indexToUpdate, 1,updatedPassengerData);
            renderPassengers(); // Ensure renderPassengers() completes before continuing
        } catch (error) {
            console.error('Error updating passenger:', error);
        }
    });
});