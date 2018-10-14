class Queue {
	constructor() {
		this.data = [];
	}

	add(item) {
		if (item) {
			this.data.unshift(item);
		}
	}

	remove() {
		if (this.size() > 0) {
			this.data.pop();
		}
	}

	first() {
		return this.data[0];
	}

	last() {
		return this.data[this.data.length - 1];
	}

	size() {
		return this.data.length;
	}
}

// let q = new Queue();

// q.add(1);
// q.add(2);
// q.add(3);

// console.log(q.data);

// q.remove();

// console.log(q.data);