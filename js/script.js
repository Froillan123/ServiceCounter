const allSideMenu = document.querySelectorAll('#sidebar .side-menu.top li a');

allSideMenu.forEach(item=> {
	const li = item.parentElement;

	item.addEventListener('click', function () {
		allSideMenu.forEach(i=> {
			i.parentElement.classList.remove('active');
		})
		li.classList.add('active');
	})
});




// TOGGLE SIDEBAR
const menuBar = document.querySelector('#content nav .bx.bx-menu');
const sidebar = document.getElementById('sidebar');

menuBar.addEventListener('click', function () {
	sidebar.classList.toggle('hide');
})







const searchButton = document.querySelector('#content nav form .form-input button');
const searchButtonIcon = document.querySelector('#content nav form .form-input button .bx');
const searchForm = document.querySelector('#content nav form');

searchButton.addEventListener('click', function (e) {
	if(window.innerWidth < 576) {
		e.preventDefault();
		searchForm.classList.toggle('show');
		if(searchForm.classList.contains('show')) {
			searchButtonIcon.classList.replace('bx-search', 'bx-x');
		} else {
			searchButtonIcon.classList.replace('bx-x', 'bx-search');
		}
	}
})





if(window.innerWidth < 768) {
	sidebar.classList.add('hide');
} else if(window.innerWidth > 576) {
	searchButtonIcon.classList.replace('bx-x', 'bx-search');
	searchForm.classList.remove('show');
}


window.addEventListener('resize', function () {
	if(this.innerWidth > 576) {
		searchButtonIcon.classList.replace('bx-x', 'bx-search');
		searchForm.classList.remove('show');
	}
})



const switchMode = document.getElementById('switch-mode');

switchMode.addEventListener('change', function () {
	if(this.checked) {
		document.body.classList.add('dark');
	} else {
		document.body.classList.remove('dark');
	}
})

const MAX_QUEUE_SIZE = 5;
let queue = new Array(MAX_QUEUE_SIZE).fill(null);
let front = -1;
let rear = -1;

function isEmpty() {
    return front === -1 && rear === -1;
}

function isFull() {
    return (rear + 1) % MAX_QUEUE_SIZE === front;
}

function enqueue(customer) {
    if (isFull()) {
        alert("Queue is full. Cannot add more customers.");
        return;
    }

    if (isEmpty()) {
        front = 0;
        rear = 0;
    } else {
        rear = (rear + 1) % MAX_QUEUE_SIZE;
    }

    queue[rear] = customer;
    displayQueue();
}

function displayQueue() {
    const queueContainer = document.getElementById("queue-box");
    queueContainer.innerHTML = '';

    for (let i = 0; i < MAX_QUEUE_SIZE; i++) {
        let customerIndex = (front + i) % MAX_QUEUE_SIZE;
        let customer = queue[customerIndex];

        if (customer !== null) {
            let newBox = document.createElement('div');
            newBox.className = 'box';
            newBox.style.cssText = `
                font-size: 1.5rem;
                font-weight: bold;
                color: white;
                line-height: 1.5;
                background: #3C91E6;
                padding: 2rem;
                border-radius: .5rem;
                margin-right: 2rem; /* Adjust the margin-right as needed for the gap */
            `;
            newBox.innerHTML = `<p>Priority: ${customer.priority}<br> Name: ${customer.name}</p>`;
            queueContainer.appendChild(newBox);
        }
    }
}

function addCustomer() {
    const name = prompt("Enter customer name:");
    const priority = prompt("Enter priority (1-5):");

    if (name !== null && priority !== null) {
        const customer = {
            name: name,
            priority: priority,
        };
        enqueue(customer);
    } else {
        alert("Customer addition canceled.");
    }
}

function addCustomerWithPriority() {
    const name = prompt("Enter customer name:");
    const priority = prompt("Enter priority (1-5):");

    if (name !== null && priority !== null) {
        const customerWithPriority = {
            name: name,
            priority: priority,
            age: '', // Add age property if needed
            message: '' // Add message property if needed
        };
        enqueue(customerWithPriority);
    } else {
        alert("Customer addition canceled.");
    }
}




function moveToCounter(counterId) {
    if (!isEmpty()) {
        const customer = queue[front];
        queue[front] = null;  // Remove the customer from the queue

        // Move front and rear pointers accordingly
        front = -1;
        rear = -1;

        // Display the updated queue
        displayQueue();

        // Add the customer information to the corresponding counter
        updateCustomerBoxes(counterId, customer);
    } else {
        alert("Queue is empty. No customer to move.");
    }
}

function updateCustomerBoxes(counterId, customer) {
    let queueContainer = document.querySelector(`.box-info li:nth-child(${counterId}) .text .queue`);

    let newBox = document.createElement('div');
    newBox.className = 'box';
    newBox.style.cssText = `
        font-size: 1.5rem;
        font-weight: bold;
        color: black;
        line-height: 1.5;
        background: #3C91E6;
        padding: 2rem;
        border-radius: .5rem;
        margin-right: 2rem; /* Adjust the margin-right as needed for the gap */
    `;
    newBox.innerHTML = `<p>Priority: ${customer.priority}<br> Name: ${customer.name}</p>`;

    queueContainer.appendChild(newBox);
}

// Event listeners for the counter buttons
document.getElementById("toCounter1").addEventListener("click", function () {
    moveToCounter(1);
});

document.getElementById("toCounter2").addEventListener("click", function () {
    moveToCounter(2);
});

document.getElementById("toCounter3").addEventListener("click", function () {
    moveToCounter(3);
});