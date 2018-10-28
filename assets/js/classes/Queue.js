class Queue {
	constructor() {
		// implemented encapsulaton using closure
		let _data = [];

		this.add = (item) => {
			if (item) {
				_data.unshift(item);
			}
		}

		this.remove = () => {
			if (this.size() > 0) {
				_data.pop();
			}
		}

		this.first = () => _data[0];

		this.last = () => _data[_data.length - 1]

		this.size = () => _data.length
	}
}