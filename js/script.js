const allSideMenu = document.querySelectorAll('#sidebar .side-menu.top li a');

allSideMenu.forEach(item => {
    const li = item.parentElement;

    item.addEventListener('click', function () {
        allSideMenu.forEach(i => {
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
});

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



document.addEventListener('DOMContentLoaded', function () {
	const switchMode = document.getElementById('switch-mode');
	
	// Check if the theme preference is stored in local storage
	const savedTheme = localStorage.getItem('theme');
	if (savedTheme) {
		document.body.classList.add(savedTheme);
		switchMode.checked = savedTheme === 'light';
	}
	
	switchMode.addEventListener('change', function () {
		if (this.checked) {
			document.body.classList.add('light');
			localStorage.setItem('theme', 'light');
		} else {
			document.body.classList.remove('light');
			localStorage.setItem('theme', 'dark');
		}
	});
});




function createCircularQueue(maxSize) {
	return {
		array: new Array(maxSize),
		maxSize: maxSize,
		front: 0,
		rear: -1,
		size: 0,
	};
}

let counter1Queue = createCircularQueue(3);
let counter2Queue = createCircularQueue(3);
let counter3Queue = createCircularQueue(3);

function isEmpty(queue) {
	return queue.size === 0;
}

function isFull(queue) {
	return queue.size === queue.maxSize;
}

function handleQueueUpdate(counterId) 
{
	updateCustomerBoxes(counterId);
}


function addToCounter(counterId) {
    let customerName = document.getElementById('name').value;
    let customerAge = parseInt(document.getElementById('age').value);
    let customerPriority = parseInt(document.getElementById('Prio').value);

    if (!isFormFilled(customerName, customerAge) || isNaN(customerPriority) || customerPriority < 1 || customerPriority > 5) {
        Swal.fire({
            icon: 'warning',
            title: 'Invalid Input',
            text: 'Please enter valid customer information and priority (1-5) before proceeding to the counter.'
        });
        return;
    }

    if (isFull(getCounterQueue(counterId))) {
        Swal.fire({
            icon: 'warning',
            title: 'Counter Full',
            text: 'This counter is already at maximum capacity.'
        });
        return;
    }

    if (isNameDuplicate(customerName)) {
        Swal.fire({
            icon: 'warning',
            title: 'Duplicate Name',
            text: 'A customer with the same name already exists in the queue.'
        });
        return;
    }

    let newCustomer = {
        name: customerName,
        age: customerAge,
        priority: customerPriority,
    };

    let queue = getCounterQueue(counterId);

    enqueue(queue, newCustomer);

	queueSort(queue);

    handleQueueUpdate(counterId);

    resetFormFields();
}



function resetFormFields() {
    document.getElementById('name').value = '';
    document.getElementById('age').value = '';
	document.getElementById('Prio').value = '';
}


function updateCustomerBoxes(counterId) {
	let queue = getCounterQueue(counterId);
	let counterBoxes = document.getElementById(`counter${counterId}Boxes`);

	counterBoxes.innerHTML = '';

	for (let i = 0; i < queue.size; i++) {
		let customerIndex = (queue.front + i) % queue.maxSize;
		let customer = queue.array[customerIndex];

		let newBox = document.createElement('div');
		newBox.className = 'box';
		newBox.innerHTML = `<p style="font-size: 1.5rem; font-weight: bold; color: black; line-height: 1.5; background: #CFE8FF; margin-top: 3rem; border-radius: 1rem; padding: 1.5rem; width: 100%; text-align: center;" >Priority: ${customer.priority},<br> Name: ${customer.name}<br> Age:${customer.age}</p>`;
		counterBoxes.appendChild(newBox);
	}
}



function isFormFilled(name, age) {
    return name.trim() !== '' && age > 0;
}


function isNameDuplicate(name) {
	for (let counterId = 1; counterId <= 3; counterId++) {
		let queue = getCounterQueue(counterId);
		for (let i = 0; i < queue.size; i++) {
			let customerIndex = (queue.front + i) % queue.maxSize;
			let customer = queue.array[customerIndex];
			if (customer.name === name) {
				return true;
			}
		}
	}
	return false;
}


function getCounterQueue(counterId) {
	switch (counterId) {
		case 1:
			return counter1Queue;
		case 2:
			return counter2Queue;
		case 3:
			return counter3Queue;
		default:
			return {};
	}
}


    function dequeueCustomer(queue, counterId) {
        if (isEmpty(queue)) {
            
            Swal.fire({
                icon: 'warning',
                title: 'No Customers',
                text: 'There are no customers in the queue.',
            });
        } 
        else {
            let servedCustomer = dequeue(queue);
            Swal.fire({
                icon: 'info',
                title: 'Customer Served',
                html: `<p style="font-size: 1.5rem;">Priority: ${servedCustomer.priority}<br> Name: ${servedCustomer.name}<br> Age:${servedCustomer.age} <br> Message: ${servedCustomer.message}</p>`,
            });
            handleQueueUpdate(counterId);
        }
    }

function dequeue(queue) {
        if (isEmpty(queue)) {
            Swal.fire({
                icon: 'warning',
                title: 'No Customers',
                text: 'There are no customers in the queue.',
            });
            return null;
        }

        let removedElement = queue.array[queue.front];
        queue.front = (queue.front + 1) % queue.maxSize;
        queue.size--;

        return removedElement;
    }



function enqueue(queue, element) {
        if (isFull(queue)) {
            Swal.fire({
                icon: 'warning',
                title: 'Counter Full',
                text: 'This counter is already at maximum capacity.'
            });
            return;
        }

        queue.rear = (queue.rear + 1) % queue.maxSize;
        queue.array[queue.rear] = element;
        queue.size++;
    }

function dequeue(queue) {
	if (isEmpty(queue)) {
		Swal.fire({
			icon: 'warning',
			title: 'No Customers',
			text: 'There are no customers in the queue.',
		});
		return null;
	}

	let removedElement = queue.array[queue.front];
	queue.front = (queue.front + 1) % queue.maxSize;
	queue.size--;

	return removedElement;
}

function queueSort(queue) {
	let customerArray = Array.from(queue.array)
	  .slice(queue.front, queue.front + queue.size)
	  .filter((customer) => customer !== undefined);
  
	customerArray.sort((a, b) => {
	  
	  if (b.priority !== a.priority) {
		return b.priority - a.priority;
	  }

	  return (queue.front + customerArray.indexOf(a)) - (queue.front + customerArray.indexOf(b));
	});
  
	for (let i = 0; i < queue.size; i++) {
	  let customerIndex = (queue.front + i) % queue.maxSize;
	  queue.array[customerIndex] = customerArray[i];
	}
  }
  
  
  


document.getElementById('toCounter1').addEventListener('click', function () {
	addToCounter(1);
});

document.getElementById('toCounter2').addEventListener('click', function () {
	addToCounter(2);
});

document.getElementById('toCounter3').addEventListener('click', function () {
	addToCounter(3);
});

document.getElementById('queueSection1').addEventListener('click', function () {
	dequeueCustomer(counter1Queue, 1);
});

document.getElementById('queueSection2').addEventListener('click', function () {
	dequeueCustomer(counter2Queue, 2);
});

document.getElementById('queueSection3').addEventListener('click', function () {
	dequeueCustomer(counter3Queue, 3);
});

