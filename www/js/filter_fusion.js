/*
This class implements a fusion filter

*/

class Filter {
  constructor(init_state=math.matrix([[7, 1], [-2, 3]]), init_process_noise=math.matrix([[7, 1], [-2, 3]]), init_measurement_noise=math.matrix([[7, 1], [-2, 3]])) {

    this.state = init_state;
    this.process_noise = init_process_noise;
    this.measurement_noise = init_measurement_noise;
	
	// create an array and a matrix
	const array = [[2, 0], [-1, 3]]               // Array
	const matrix = math.matrix([[7, 1], [-2, 3]]) // Matrix

	// perform a calculation on an array and matrix
	let a = math.square(array)                            // Array,  [[4, 0], [1, 9]]
	let b = math.square(matrix)                           // Matrix, [[49, 1], [4, 9]]

	// perform calculations with mixed array and matrix input
	let c = math.add(array, matrix)                       // Matrix, [[9, 1], [-3, 6]]
	let d = math.multiply(array, matrix)                  // Matrix, [[14, 2], [-13, 8]]

	// create a matrix. Type of output of function ones is determined by the
	// configuration option `matrix`
	let e = math.ones(2, 3)                               // Matrix, [[1, 1, 1], [1, 1, 1]]
	console.log(`a = ` + a)
	console.log(`b = ` + b)
	console.log(`c = ` + c)
	console.log(`d = ` + d)
	console.log(`e = ` + e)
  }

  state() {
    console.log(`Hi! I'm ${this.state}`);
  };

  farewell() {
    console.log(`${this.state} has left the building. Bye for now!`);
  };
}







