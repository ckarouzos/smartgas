
const request = require('supertest');
const file = require('../server.js')
const server = file.app;


beforeAll(async () => {
 // do something before anything else runs
 console.log('Jest starting!');
});

// close the server after each test
afterAll(() => {
 //db.end();
 //ex.close();
 console.log('server closed!');
});

// GET SINGLE PRODUCT TESTS

describe('Get single product tests', () => {


	// valid id test
 	test('get product with valid id', async () => {
		 const response = await request(server).get('/observatory/api/products/1');
		 expect(response.status).toEqual(200);
		 expect(response.text).toContain('{"id":"1","name":"Βενζίνη","description":"95 οκτανίων","category":"Καύσιμο κίνησης","tags":["απλή αμόλυβδη","απλή","fuelsave"],"withdrawn":false}');
 	});

	// invalid id test (STRING)	
 	test('get product with invalid id (string)', async () => {
		 const response = await request(server).get('/observatory/api/products/a');
		 expect(response.status).toEqual(400);
		 expect(response.text).toContain('{"success":false,"message":"Product id given is not an integer !"}');
 	});

	// invalid id test (float)	
 	test('get product with invalid id (string)', async () => {
		 const response = await request(server).get('/observatory/api/products/2.2');
		 expect(response.status).toEqual(400);
		 expect(response.text).toContain('{"success":false,"message":"Product id given is not an integer !"}');
 	});

 	// inexistent id test
 	test('get product with inexistent id', async () => {
 		const response = await request(server).get('/observatory/api/products/100');
 		expect(response.status).toEqual(404);
 		expect(response.text).toContain('{"success":false,"message":"No matching fuel with the id given !"}');
 	});

	// json valid id test
 	test('get product with valid id', async () => {
		 const response = await request(server).get('/observatory/api/products/1?format=json');
		 expect(response.status).toEqual(200);
		 expect(response.text).toContain('{"id":"1","name":"Βενζίνη","description":"95 οκτανίων","category":"Καύσιμο κίνησης","tags":["απλή αμόλυβδη","απλή","fuelsave"],"withdrawn":false}');
 	});
	
	// xml valid id test
 	test('get product with valid id', async () => {
		 const response = await request(server).get('/observatory/api/products/1?format=xml');
		 expect(response.status).toEqual(400);
		 expect(response.text).toContain('{"success":false,"message":"XML format is not supported !"}');
 	});

	// get huge product id
 	test('delete huge product id ', async () => {
	 	const response = await request(server).get('/observatory/api/products/123213322132');
	 	expect(response.status).toEqual(400);
		expect(response.text).toContain('{"success":false,"message":"Variable product id has exceeded maximum length !"}');

	});

});

// GET MULTIPLE PRODUCT TESTS

describe('Get multiple product tests', () => {

	// default test
 	test('get at most the first 20 products ', async () => {
	 	const response = await request(server).get('/observatory/api/products');
	 	expect(response.status).toEqual(200);
	 	expect(response.text).toContain('{"start":0,"count":7,"total":7,"products":[{"id":"7","name":"Αέριο","description":"CNG","category":"Καύσιμο κίνησης","tags":["απλό"],"withdrawn":true},{"id":"6","name":"Αέριο","description":"LPG","category":"Καύσιμο κίνησης","tags":["απλό"],"withdrawn":true},{"id":"5","name":"Πετρέλαιο","description":"100 οκτανίων","category":"Καύσιμο κίνησης","tags":["Vpower"],"withdrawn":true},{"id":"4","name":"Πετρέλαιο","description":"95 οκτανίων","category":"Καύσιμο κίνησης","tags":["απλό","fuelsave"],"withdrawn":true},{"id":"3","name":"Βενζίνη","description":"100 οκτανίων","category":"Καύσιμο κίνησης","tags":["Racing","Κατοστάρα"],"withdrawn":true},{"id":"2","name":"Βενζίνη","description":"97 οκτανίων","category":"Καύσιμο κίνησης","tags":["Vpower"],"withdrawn":true},{"id":"1","name":"Βενζίνη","description":"95 οκτανίων","category":"Καύσιμο κίνησης","tags":["απλή αμόλυβδη","απλή","fuelsave"],"withdrawn":true}]}');
 	});

	// test start = 2 count = 100 sort = id|ASC status = ALL
 	test('test start = 2 count = 100 sort = id|ASC status = ALL ', async () => {
	 	const response = await request(server).get('/observatory/api/products?start=2&count=100&sort=id|ASC&status=ALL');
	 	expect(response.status).toEqual(200);
	 	expect(response.text).toContain('{"start":2,"count":5,"total":7,"products":[{"id":"3","name":"Βενζίνη","description":"100 οκτανίων","category":"Καύσιμο κίνησης","tags":["Racing","Κατοστάρα"],"withdrawn":true},{"id":"4","name":"Πετρέλαιο","description":"95 οκτανίων","category":"Καύσιμο κίνησης","tags":["απλό","fuelsave"],"withdrawn":true},{"id":"5","name":"Πετρέλαιο","description":"100 οκτανίων","category":"Καύσιμο κίνησης","tags":["Vpower"],"withdrawn":true},{"id":"6","name":"Αέριο","description":"LPG","category":"Καύσιμο κίνησης","tags":["απλό"],"withdrawn":true},{"id":"7","name":"Αέριο","description":"CNG","category":"Καύσιμο κίνησης","tags":["απλό"],"withdrawn":true}]}');
 	});

	// test start = 0 count = 100 sort = id|DESC status = ALL
 	test('test start = 0 count = 100 sort = id|DESC status = ALL ', async () => {
	 	const response = await request(server).get('/observatory/api/products?start=0&count=100&sort=id|DESC&status=ALL');
	 	expect(response.status).toEqual(200);
	 	expect(response.text).toContain('{"start":0,"count":7,"total":7,"products":[{"id":"7","name":"Αέριο","description":"CNG","category":"Καύσιμο κίνησης","tags":["απλό"],"withdrawn":true},{"id":"6","name":"Αέριο","description":"LPG","category":"Καύσιμο κίνησης","tags":["απλό"],"withdrawn":true},{"id":"5","name":"Πετρέλαιο","description":"100 οκτανίων","category":"Καύσιμο κίνησης","tags":["Vpower"],"withdrawn":true},{"id":"4","name":"Πετρέλαιο","description":"95 οκτανίων","category":"Καύσιμο κίνησης","tags":["απλό","fuelsave"],"withdrawn":true},{"id":"3","name":"Βενζίνη","description":"100 οκτανίων","category":"Καύσιμο κίνησης","tags":["Racing","Κατοστάρα"],"withdrawn":true},{"id":"2","name":"Βενζίνη","description":"97 οκτανίων","category":"Καύσιμο κίνησης","tags":["Vpower"],"withdrawn":true},{"id":"1","name":"Βενζίνη","description":"95 οκτανίων","category":"Καύσιμο κίνησης","tags":["απλή αμόλυβδη","απλή","fuelsave"],"withdrawn":true}]}');
 	});

	// test start = 2 count = 100 sort = name|DESC status = ALL
 	test('test start = 2 count = 100 sort = name|DESC status = ALL ', async () => {
	 	const response = await request(server).get('/observatory/api/products?start=2&count=100&sort=name|DESC&status=ALL');
	 	expect(response.status).toEqual(200);
	 	expect(response.text).toContain('{"start":2,"count":5,"total":7,"products":[{"id":"1","name":"Βενζίνη","description":"95 οκτανίων","category":"Καύσιμο κίνησης","tags":["απλή αμόλυβδη","απλή","fuelsave"],"withdrawn":true},{"id":"2","name":"Βενζίνη","description":"97 οκτανίων","category":"Καύσιμο κίνησης","tags":["Vpower"],"withdrawn":true},{"id":"3","name":"Βενζίνη","description":"100 οκτανίων","category":"Καύσιμο κίνησης","tags":["Racing","Κατοστάρα"],"withdrawn":true},{"id":"6","name":"Αέριο","description":"LPG","category":"Καύσιμο κίνησης","tags":["απλό"],"withdrawn":true},{"id":"7","name":"Αέριο","description":"CNG","category":"Καύσιμο κίνησης","tags":["απλό"],"withdrawn":true}]}');
		//console.log(response.text);
 	});

	// test start = 2 count = 100 sort = name|ASC status = ALL
 	test('test start = 2 count = 100 sort = name|ASC status = ALL ', async () => {
	 	const response = await request(server).get('/observatory/api/products?start=2&count=100&sort=name|ASC&status=ALL');
	 	expect(response.status).toEqual(200);
	 	expect(response.text).toContain('{"start":2,"count":5,"total":7,"products":[{"id":"1","name":"Βενζίνη","description":"95 οκτανίων","category":"Καύσιμο κίνησης","tags":["απλή αμόλυβδη","απλή","fuelsave"],"withdrawn":true},{"id":"2","name":"Βενζίνη","description":"97 οκτανίων","category":"Καύσιμο κίνησης","tags":["Vpower"],"withdrawn":true},{"id":"3","name":"Βενζίνη","description":"100 οκτανίων","category":"Καύσιμο κίνησης","tags":["Racing","Κατοστάρα"],"withdrawn":true},{"id":"4","name":"Πετρέλαιο","description":"95 οκτανίων","category":"Καύσιμο κίνησης","tags":["απλό","fuelsave"],"withdrawn":true},{"id":"5","name":"Πετρέλαιο","description":"100 οκτανίων","category":"Καύσιμο κίνησης","tags":["Vpower"],"withdrawn":true}]}');
		//console.log(response.text);
 	});

	// test start = 2 count = 100 sort = nameda|ASCdsa (wrong input) status = ALL
 	test('test start = 2 count = 100 sort = nameda|ASCdsa (wrong input) status = AL', async () => {
	 	const response = await request(server).get('/observatory/api/products?start=2&count=100&sort=nameda|ASCdsa&status=ALL');
	 	expect(response.status).toEqual(400);
	 	expect(response.text).toContain('{"success":false,"message":"Sort variable must be id|DESC or id|ASC or name|ASC or name|DESC !"}');
		//console.log(response.text);
 	});

	// test start = 0 count = 100 sort = id|DESC status = ACTIVE
 	test('test start = 0 count = 100 sort = id|DESC status = ACTIVE ', async () => {
	 	const response = await request(server).get('/observatory/api/products?start=0&count=100&sort=id|DESC&status=ACTIVE');
	 	expect(response.status).toEqual(200);
	 	expect(response.text).toContain('{"start":0,"count":7,"total":7,"products":[{"id":"7","name":"Αέριο","description":"CNG","category":"Καύσιμο κίνησης","tags":["απλό"],"withdrawn":true},{"id":"6","name":"Αέριο","description":"LPG","category":"Καύσιμο κίνησης","tags":["απλό"],"withdrawn":true},{"id":"5","name":"Πετρέλαιο","description":"100 οκτανίων","category":"Καύσιμο κίνησης","tags":["Vpower"],"withdrawn":true},{"id":"4","name":"Πετρέλαιο","description":"95 οκτανίων","category":"Καύσιμο κίνησης","tags":["απλό","fuelsave"],"withdrawn":true},{"id":"3","name":"Βενζίνη","description":"100 οκτανίων","category":"Καύσιμο κίνησης","tags":["Racing","Κατοστάρα"],"withdrawn":true},{"id":"2","name":"Βενζίνη","description":"97 οκτανίων","category":"Καύσιμο κίνησης","tags":["Vpower"],"withdrawn":true},{"id":"1","name":"Βενζίνη","description":"95 οκτανίων","category":"Καύσιμο κίνησης","tags":["απλή αμόλυβδη","απλή","fuelsave"],"withdrawn":true}]}');
 	});

	// test start = 0 count = 100 sort = id|DESC status = WITHDRAWN
 	test('test start = 0 count = 100 sort = id|DESC status = WITHDRAWN ', async () => {
	 	const response = await request(server).get('/observatory/api/products?start=0&count=100&sort=id|DESC&status=WITHDRAWN');
	 	expect(response.status).toEqual(200);
	 	expect(response.text).toContain('{"start":0,"count":0,"total":7,"products":[]}');
 	});

	// test start = 0 count = 100 sort = id|DESC status = WITHDRAWNAS (wrong status)
 	test('test start = 0 count = 100 sort = id|DESC status = WITHDRAWNAS (wrong status) ', async () => {
	 	const response = await request(server).get('/observatory/api/products?start=0&count=100&sort=id|DESC&status=WITHDRAWNAS');
	 	expect(response.status).toEqual(400);
	 	expect(response.text).toContain('{"success":false,"message":"Status variable must be ACTIVE or WITHDRAWN or ALL !"}');
 	});

	// test with start = 2 and count = 2
 	test('get from number 2 at most 2 products ', async () => {
		 const response = await request(server).get('/observatory/api/products?start=2&count=2');
		 expect(response.status).toEqual(200);
		 expect(response.text).toContain('{"start":2,"count":2,"total":7,"products":[{"id":"5","name":"Πετρέλαιο","description":"100 οκτανίων","category":"Καύσιμο κίνησης","tags":["Vpower"],"withdrawn":true},{"id":"4","name":"Πετρέλαιο","description":"95 οκτανίων","category":"Καύσιμο κίνησης","tags":["απλό","fuelsave"],"withdrawn":true}]}');
 	});

	// test with start not a number
 	test('get with start not a number ', async () => {
		 const response = await request(server).get('/observatory/api/products?start=a&count=2');
		 expect(response.status).toEqual(400);
		 expect(response.text).toContain('{"success":false,"message":"Start variable must be an integer !"}');
 	});

	// test with count not a number
 	test('get with count not a number ', async () => {
		 const response = await request(server).get('/observatory/api/products?start=2&count=a');
		 expect(response.status).toEqual(400);
		 expect(response.text).toContain('{"success":false,"message":"Count variable must be an integer !"}');
 	});

	// test with start not an int
 	test('get with start not an int ', async () => {
		 const response = await request(server).get('/observatory/api/products?start=2.2&count=2');
		 expect(response.status).toEqual(400);
		 expect(response.text).toContain('{"success":false,"message":"Start variable must be an integer !"}');
 	});

	// test with count not an int
 	test('get with count not an int ', async () => {
		 const response = await request(server).get('/observatory/api/products?start=2&count=2.2');
		 expect(response.status).toEqual(400);
		 expect(response.text).toContain('{"success":false,"message":"Count variable must be an integer !"}');
 	});

	// xml test , default
	 	test('get at most the first 20 products ', async () => {
	 	const response = await request(server).get('/observatory/api/products?format=xml');
	 	expect(response.status).toEqual(400);
	 	expect(response.text).toContain('{"success":false,"message":"XML format is not supported !"}');
 	});

	// xml test ,start = 0 count = 100 sort = id|DESC status = ACTIVE
 	test('test start = 0 count = 100 sort = id|DESC status = ACTIVE ', async () => {
	 	const response = await request(server).get('/observatory/api/products?start=0&count=100&sort=id|DESC&status=ACTIVE&format=xml');
	 	expect(response.status).toEqual(400);
	 	expect(response.text).toContain('{"success":false,"message":"XML format is not supported !"}');
 	});

	// json default test
 	test('get at most the first 20 products ', async () => {
	 	const response = await request(server).get('/observatory/api/products?format=json');
	 	expect(response.status).toEqual(200);
	 	expect(response.text).toContain('{"start":0,"count":7,"total":7,"products":[{"id":"7","name":"Αέριο","description":"CNG","category":"Καύσιμο κίνησης","tags":["απλό"],"withdrawn":true},{"id":"6","name":"Αέριο","description":"LPG","category":"Καύσιμο κίνησης","tags":["απλό"],"withdrawn":true},{"id":"5","name":"Πετρέλαιο","description":"100 οκτανίων","category":"Καύσιμο κίνησης","tags":["Vpower"],"withdrawn":true},{"id":"4","name":"Πετρέλαιο","description":"95 οκτανίων","category":"Καύσιμο κίνησης","tags":["απλό","fuelsave"],"withdrawn":true},{"id":"3","name":"Βενζίνη","description":"100 οκτανίων","category":"Καύσιμο κίνησης","tags":["Racing","Κατοστάρα"],"withdrawn":true},{"id":"2","name":"Βενζίνη","description":"97 οκτανίων","category":"Καύσιμο κίνησης","tags":["Vpower"],"withdrawn":true},{"id":"1","name":"Βενζίνη","description":"95 οκτανίων","category":"Καύσιμο κίνησης","tags":["απλή αμόλυβδη","απλή","fuelsave"],"withdrawn":true}]}');
 	});

	// json test , start = 2 count = 100 sort = id|ASC status = ALL
 	test('test start = 2 count = 100 sort = id|ASC status = ALL ', async () => {
	 	const response = await request(server).get('/observatory/api/products?start=2&count=100&sort=id|ASC&status=ALL&format=json');
	 	expect(response.status).toEqual(200);
	 	expect(response.text).toContain('{"start":2,"count":5,"total":7,"products":[{"id":"3","name":"Βενζίνη","description":"100 οκτανίων","category":"Καύσιμο κίνησης","tags":["Racing","Κατοστάρα"],"withdrawn":true},{"id":"4","name":"Πετρέλαιο","description":"95 οκτανίων","category":"Καύσιμο κίνησης","tags":["απλό","fuelsave"],"withdrawn":true},{"id":"5","name":"Πετρέλαιο","description":"100 οκτανίων","category":"Καύσιμο κίνησης","tags":["Vpower"],"withdrawn":true},{"id":"6","name":"Αέριο","description":"LPG","category":"Καύσιμο κίνησης","tags":["απλό"],"withdrawn":true},{"id":"7","name":"Αέριο","description":"CNG","category":"Καύσιμο κίνησης","tags":["απλό"],"withdrawn":true}]}');
 	});

	// json test , start = 0 count = 100 sort = id|DESC status = ALL
 	test('test start = 0 count = 100 sort = id|DESC status = ALL ', async () => {
	 	const response = await request(server).get('/observatory/api/products?start=0&count=100&sort=id|DESC&status=ALL&format=json');
	 	expect(response.status).toEqual(200);
	 	expect(response.text).toContain('{"start":0,"count":7,"total":7,"products":[{"id":"7","name":"Αέριο","description":"CNG","category":"Καύσιμο κίνησης","tags":["απλό"],"withdrawn":true},{"id":"6","name":"Αέριο","description":"LPG","category":"Καύσιμο κίνησης","tags":["απλό"],"withdrawn":true},{"id":"5","name":"Πετρέλαιο","description":"100 οκτανίων","category":"Καύσιμο κίνησης","tags":["Vpower"],"withdrawn":true},{"id":"4","name":"Πετρέλαιο","description":"95 οκτανίων","category":"Καύσιμο κίνησης","tags":["απλό","fuelsave"],"withdrawn":true},{"id":"3","name":"Βενζίνη","description":"100 οκτανίων","category":"Καύσιμο κίνησης","tags":["Racing","Κατοστάρα"],"withdrawn":true},{"id":"2","name":"Βενζίνη","description":"97 οκτανίων","category":"Καύσιμο κίνησης","tags":["Vpower"],"withdrawn":true},{"id":"1","name":"Βενζίνη","description":"95 οκτανίων","category":"Καύσιμο κίνησης","tags":["απλή αμόλυβδη","απλή","fuelsave"],"withdrawn":true}]}');
 	});
});

// POST products tests
describe('Post products test', () => {

	var token;
 	test('token in create products ', async () => {
		const response = await request(server).post('/observatory/api/login').set("Content-Type", "application/json").send({"username":"fnp","password":"kodikos"});
		expect(response.status).toEqual(200);
		token = response.body.token;
		//console.log(response.body.token);
 	});

	var id;
	// create product with name = abc  description = abc category = abc tags = ["a"]
 	test('create product with name = abc  description = abc category = abc tags = ["a"] ', async () => {
	 	const response = await request(server).post('/observatory/api/products').set("Content-Type", "application/json").send({"name":"abc","description":"abc", "category":"abc", "tags":["a"]}).set('X-OBSERVATORY-AUTH', token);
	 	expect(response.status).toEqual(200);
		id = response.body.id;
		expect(response.body.name).toEqual("abc");
		expect(response.body.description).toEqual("abc");
		expect(response.body.category).toEqual("abc");
		expect(response.body.tags).toEqual(["a"]);
		expect(response.body.withdrawn).toEqual(false);
		//console.log(response.text);
	});

	// delete product with name = abc  description = abc category = abc tags = ["a"]
 	test('delete product with name = abc  description = abc category = abc tags = ["a"] ', async () => {
	 	const response = await request(server).delete('/observatory/api/products/'+id).set("Content-Type", "application/json").set('X-OBSERVATORY-AUTH', token);
	 	expect(response.status).toEqual(200);
		expect(response.text).toContain('{"message":"OK"}');

	});

	// create product with name = abc  description = abc category = abc tags = ["adsads213dsa","bdsadsa","cdsadsa","ddsadsadsa"]
 	test('create product with name = abc  description = abc category = abc tags = ["adsads213dsa","bdsadsa","cdsadsa","ddsadsadsa"] ', async () => {
	 	const response = await request(server).post('/observatory/api/products').set("Content-Type", "application/json").send({"name":"abc","description":"abc", "category":"abc", "tags":["adsads213dsa","bdsadsa","cdsadsa","ddsadsadsa"]}).set('X-OBSERVATORY-AUTH', token);
	 	expect(response.status).toEqual(200);
		id = response.body.id;
		expect(response.body.name).toEqual("abc");
		expect(response.body.description).toEqual("abc");
		expect(response.body.category).toEqual("abc");
		expect(response.body.tags).toEqual(["adsads213dsa","bdsadsa","cdsadsa","ddsadsadsa"]);
		expect(response.body.withdrawn).toEqual(false);
		//console.log(response.text);
	});

	// delete product with name = abc  description = abc category = abc tags = ["adsads213dsa","bdsadsa","cdsadsa","ddsadsadsa"]
 	test('delete product with name = abc  description = abc category = abc tags = ["adsads213dsa","bdsadsa","cdsadsa","ddsadsadsa"] ', async () => {
	 	const response = await request(server).delete('/observatory/api/products/'+id).set("Content-Type", "application/json").set('X-OBSERVATORY-AUTH', token);
	 	expect(response.status).toEqual(200);
		expect(response.text).toContain('{"message":"OK"}');

	});
	// create product with name = abc  description = abc category = abc tags = [1,"a"] (wrong tags)
	 test('create product with name = abc  description = abc category = abc tags = [1,"a"] ', async () => {
	 	const response = await request(server).post('/observatory/api/products').set("Content-Type", "application/json").send({"name":"abc","description":"abc", "category":"abc", "tags":[1,"a"]}).set('X-OBSERVATORY-AUTH', token);
	 	expect(response.status).toEqual(400);
		expect(response.text).toContain('{"success":false,"message":"Tags must be a list of strings"}');

	});

	// create product with name = abc  description = abc category = abc tags = ["a",1] (wrong tags)
	 test('create product with name = abc  description = abc category = abc tags = ["a",1] ', async () => {
	 	const response = await request(server).post('/observatory/api/products').set("Content-Type", "application/json").send({"name":"abc","description":"abc", "category":"abc", "tags":["a",1]}).set('X-OBSERVATORY-AUTH', token);
	 	expect(response.status).toEqual(400);
		expect(response.text).toContain('{"success":false,"message":"Tags must be a list of strings"}');

	});

	// create product with name = abc  description = abc category = abc tags = ["a","b",1] (wrong tags)
	 test('create product with name = abc  description = abc category = abc tags = ["a","b",1] ', async () => {
	 	const response = await request(server).post('/observatory/api/products').set("Content-Type", "application/json").send({"name":"abc","description":"abc", "category":"abc", "tags":["a","b",1]}).set('X-OBSERVATORY-AUTH', token);
	 	expect(response.status).toEqual(400);
		expect(response.text).toContain('{"success":false,"message":"Tags must be a list of strings"}');

	});

	// create product with name = abc  description = abc category = abc tags = ["a","b",1.2] (wrong tags)
	 test('create product with name = abc  description = abc category = abc tags = ["a","b",1.2] ', async () => {
	 	const response = await request(server).post('/observatory/api/products').set("Content-Type", "application/json").send({"name":"abc","description":"abc", "category":"abc", "tags":["a","b",1.2]}).set('X-OBSERVATORY-AUTH', token);
	 	expect(response.status).toEqual(400);
		expect(response.text).toContain('{"success":false,"message":"Tags must be a list of strings"}');

	});

	// create product with name = abc  description = abc category = abc tags = [1,2] (wrong tags)
	 test('create product with name = abc  description = abc category = abc tags = [1,2] ', async () => {
	 	const response = await request(server).post('/observatory/api/products').set("Content-Type", "application/json").send({"name":"abc","description":"abc", "category":"abc", "tags":[1,2]}).set('X-OBSERVATORY-AUTH', token);
	 	expect(response.status).toEqual(400);
		expect(response.text).toContain('{"success":false,"message":"Tags must be a list of strings"}');

	});

	// create product with name = abc  description = abc category = abc tags = [1] (wrong tags)
	 test('create product with name = abc  description = abc category = abc tags = [1] ', async () => {
	 	const response = await request(server).post('/observatory/api/products').set("Content-Type", "application/json").send({"name":"abc","description":"abc", "category":"abc", "tags":[1]}).set('X-OBSERVATORY-AUTH', token);
	 	expect(response.status).toEqual(400);
		expect(response.text).toContain('{"success":false,"message":"Tags must be a list of strings"}');

	});

	// create product with name = abc  description = abc category = abc tags = [] (wrong tags)
	 test('create product with name = abc  description = abc category = abc tags = [] ', async () => {
	 	const response = await request(server).post('/observatory/api/products').set("Content-Type", "application/json").send({"name":"abc","description":"abc", "category":"abc", "tags":[]}).set('X-OBSERVATORY-AUTH', token);
	 	expect(response.status).toEqual(400);
		expect(response.text).toContain('{"success":false,"message":"Please complete all the mandatory fields !"}');

	});

	// create product with name = abc  description = abc category = abc  (no tags)
	 test('create product with name = abc  description = abc category = abc ', async () => {
	 	const response = await request(server).post('/observatory/api/products').set("Content-Type", "application/json").send({"name":"abc","description":"abc", "category":"abc"}).set('X-OBSERVATORY-AUTH', token);
	 	expect(response.status).toEqual(400);
		expect(response.text).toContain('{"success":false,"message":"Please complete all the mandatory fields !"}');

	});

	// create product with  description = abc category = abc tags = ["a"]  (no name)
	 test('create product with  description = abc category = abc tags = ["a"] ', async () => {
	 	const response = await request(server).post('/observatory/api/products').set("Content-Type", "application/json").send({"description":"abc", "category":"abc","tags":["a"]}).set('X-OBSERVATORY-AUTH', token);
	 	expect(response.status).toEqual(400);
		expect(response.text).toContain('{"success":false,"message":"Please complete all the mandatory fields !"}');

	});

	// create product with name = abc category = abc tags = ["a"]  (no descr)
	 test('create product with name = abc category = abc tags = ["a"] ', async () => {
	 	const response = await request(server).post('/observatory/api/products').set("Content-Type", "application/json").send({"name":"abc", "category":"abc","tags":["a"]}).set('X-OBSERVATORY-AUTH', token);
	 	expect(response.status).toEqual(400);
		expect(response.text).toContain('{"success":false,"message":"Please complete all the mandatory fields !"}');

	});

	// create product with name = abc  description = abc tags = ["a"]  (no category)
	 test('create product with name = abc  description = abc tags = ["a"] ', async () => {
	 	const response = await request(server).post('/observatory/api/products').set("Content-Type", "application/json").send({"name":"abc","description":"abc","tags":["a"]}).set('X-OBSERVATORY-AUTH', token);
	 	expect(response.status).toEqual(400);
		expect(response.text).toContain('{"success":false,"message":"Please complete all the mandatory fields !"}');

	});

	// create product with name = abc  description = abc category = 1 tags = ["a"] (wrong category)
	 test('create product with name = abc  description = abc category = 1 tags = ["a"] ', async () => {
	 	const response = await request(server).post('/observatory/api/products').set("Content-Type", "application/json").send({"name":"abc","description":"abc", "category":1, "tags":["a"]}).set('X-OBSERVATORY-AUTH', token);
	 	expect(response.status).toEqual(400);
		expect(response.text).toContain('{"success":false,"message":"Please provide valid fields !"}');

	});

	// create product with name = abc  description = 1 category = abc tags = ["a"] (wrong descr)
	 test('create product with name = abc  description = 1 category = abc tags = ["a"] ', async () => {
	 	const response = await request(server).post('/observatory/api/products').set("Content-Type", "application/json").send({"name":"abc","description":1, "category":"abc", "tags":["a"]}).set('X-OBSERVATORY-AUTH', token);
	 	expect(response.status).toEqual(400);
		expect(response.text).toContain('{"success":false,"message":"Please provide valid fields !"}');

	});

	// create product with name = 1  description = abc category = abc tags = ["a"] (wrong name)
	 test('create product with name = 1  description = abc category = abc tags = ["a"] ', async () => {
	 	const response = await request(server).post('/observatory/api/products').set("Content-Type", "application/json").send({"name":1,"description":"abc", "category":"abc", "tags":["a"]}).set('X-OBSERVATORY-AUTH', token);
	 	expect(response.status).toEqual(400);
		expect(response.text).toContain('{"success":false,"message":"Please provide valid fields !"}');

	});

	// create product with name = max  description = abc category = abc tags = ["a"] (max name)
	 test('create product with name = max  description = abc category = abc tags = ["a"] ', async () => {
	 	const response = await request(server).post('/observatory/api/products').set("Content-Type", "application/json").send({"name":"1WNQ9uv5ixXTFyUE0WbPv161LedAXgyOGNiLobR1L0UiaxGvcfw7kkptZlWmY6rNV0UtvEv7sYdb4gs2Boot3YJhOuz5Vzdd2FXguIZP9h6Bg3zMGHv1fMyGBArXBoqVv6wZn80PSlOvYpFd62Lfw2eRNZqnTIqxbaiMuIIICR7aaoQMC8wHWAUKdtPl9aePF7aR2UJEt3r7U7wFPFOGnI9vJOtJ8XpkJCFHlxnNBYvu32oViU03uqn6zqJnr4Lc","description":"abc", "category":"abc", "tags":["a"]}).set('X-OBSERVATORY-AUTH', token);
	 	expect(response.status).toEqual(400);
		expect(response.text).toContain('{"success":false,"message":"Please provide compatible input,maximum length exceeded !"}');

	});

	// create product with name = abc  description = abc category = max tags = ["a"] (max category)
	 test('create product with name = abc  description = abc category = max tags = ["a"] ', async () => {
	 	const response = await request(server).post('/observatory/api/products').set("Content-Type", "application/json").send({"name":"abc","description":"abc", "category":"1WNQ9uv5ixXTFyUE0WbPv161LedAXgyOGNiLobR1L0UiaxGvcfw7kkptZlWmY6rNV0UtvEv7sYdb4gs2Boot3YJhOuz5Vzdd2FXguIZP9h6Bg3zMGHv1fMyGBArXBoqVv6wZn80PSlOvYpFd62Lfw2eRNZqnTIqxbaiMuIIICR7aaoQMC8wHWAUKdtPl9aePF7aR2UJEt3r7U7wFPFOGnI9vJOtJ8XpkJCFHlxnNBYvu32oViU03uqn6zqJnr4Lc", "tags":["a"]}).set('X-OBSERVATORY-AUTH', token);
	 	expect(response.status).toEqual(400);
		expect(response.text).toContain('{"success":false,"message":"Please provide compatible input,maximum length exceeded !"}');

	});

	// create product with name = abc  description = max category = abc tags = ["a"] (max descr)
	 test('create product with name = abc  description = max category = abc tags = ["a"] ', async () => {
	 	const response = await request(server).post('/observatory/api/products').set("Content-Type", "application/json").send({"name":"abc","description":"1WNQ9uv5ixXTFyUE0WbPv161LedAXgyOGNiLobR1L0UiaxGvcfw7kkptZlWmY6rNV0UtvEv7sYdb4gs2Boot3YJhOuz5Vzdd2FXguIZP9h6Bg3zMGHv1fMyGBArXBoqVv6wZn80PSlOvYpFd62Lfw2eRNZqnTIqxbaiMuIIICR7aaoQMC8wHWAUKdtPl9aePF7aR2UJEt3r7U7wFPFOGnI9vJOtJ8XpkJCFHlxnNBYvu32oViU03uqn6zqJnr4Lc", "category":"abc", "tags":["a"]}).set('X-OBSERVATORY-AUTH', token);
	 	expect(response.status).toEqual(400);
		expect(response.text).toContain('{"success":false,"message":"Please provide compatible input,maximum length exceeded !"}');

	});

	// create product with name = abc  description = abc category = abc tags = ["max"] (max tags)
	 test('create product with name = abc  description = abc category = abc tags = ["max"] ', async () => {
	 	const response = await request(server).post('/observatory/api/products').set("Content-Type", "application/json").send({"name":"abc","description":"abc", "category":"abc", "tags":["jKOasWVq00mEHdBn20v0DI8FWXTHMBufcBksIi8wKt6NryX7fTBUVWx0OVxLr7S71OER9DslZauZTLxppZUU24gclDpWI8y0SDmiGo4tyt5ID2tlaynwfhvGBeJGf6M8tH83XP7jIA81beBaVO6S4wYh37eWx3JODTmjEMLm1qR3k23V3CtFmSXa8RvJFmSnmptnjHiM4QNXwKmTR119Acu0SNhbooLOuAVrKqX95cS5Y4w0M2KvNZ1mhaJhYlfadf9SrXVshC31TnBCCqkEyTNKO0N8D1wSash46gZ3YsfSkPKyagygrdPTexEgQZ3TG7ALXMsMJvxN0kqzG8bwCmTZnHudinF3EpftNeaqIOSEg271EhK0vTDjcwErk1eQGBg1pXlTvTymZdahtDPGqAKJi1rJPFsU8vfDhYQ8ilQpDfBZ98c23LRaruuNJZ4xGsQy3m6PZvP0FJDgv4nuikD4zp3saygPzFxNjq4Rl7cycS9oeLdBYxB2zfnFWtVFXT81WggQNYuw7fxTjpIluwuk6pheZ9FTktJkOHXMJeOrbGz6yFWKqnbtrt1g6LvgoOtEXI3Tg0FLzt89KsbtNgMWYro9xlKfIQDnvmL08xkYVEknbQ1TF0OgNTAlkmqmIx6ENbEzUdcjI0FBYLwDenBQ76mEm5CX5M5zEh2NhyrnBckbnr4RQcN9lyhjQtdxtomLpVK8otueXI8ygHq4uq4fAq21Nov8nYUP4338X5uf5A3ZG3yK8pqNCGGlars4UnIqjWJLsBrkLxMfhKduYYVOCHeecnczvVdTLKxdxQP6WcH8AWmJVnBPTqBA71MsafyVLhPKWEqRyg00ClrOrLkLtryYxU6mo1VQWSfYjqebzsQgthas2ouIAWYSFtBR1PGFCGLoEzHt3VdsuXVUxp3tGS64opxejL6tYRS7X50Yw3PNHzppqd2GYkN2aJ4YFSg6Zl8n4z9QmWMDF32lJn2Xqtg4eL3HQ2JCnmzpKtrclk2dSvXZoj0bSkBMKhNs7VlEIAqMZmoE0djuWoT0guQep4aS7QNlAFa9z6XC5cpufg9UO5uapzb7FxsoEg3jwHTmPa4dQtPFzNdUFrOn8AL6mfu3Xjq22vWlyRGDZRnVztEScKlQW3JwawUQ46EonF8rXItSk4YrovuHooyC36N3HbXjibT0MVbSnODFfWfJHkxGZ5bvU2IlsCjzSlS8yMixSg0x0GBk02HqHBFfNMc2PpIgUpVPPUye1goYOFuxi0YCIpBLGfVfagQMrQPYmtvehMTAXWgcbjmLCnr8Ia0MDh8cs0cRasd0HDdUdZctDSBvB8aRKJiCW735AdnZYnBicvedYgV0YChYJuF77UN9AeSNdQpk2E9Smheu1NdPO97cfuQouR3c8PYPFITau2bCKDN0wOvaLsSYXcHOORmvvc6caSEpNX4ZEfejgdq2zDucd6Lu8oZFO7RBlqWedaJG5BhMIdNXo73hggxMmRBbDIHQYO1l0u70PZ7qKrTIPHigPjaNuXiwRdGXHlVaeZ0zO6vi7YoEkJhAb3diw9hQBqPTSZMvmN14R2ny8wf7S0FWkXfbMELxPGrLYgBVXiNGj6k2sntyXoxHM1NdDuYqZEAMPYdELwcF3VIpWOE591mQRw0WV1FFjjN9K77ymWitjIRUDUtRzMmfc54hXZkZTjPMZevR98aflzIgZrAzuRE0WGdvbqFjFEnWHp7VwUDwSL8CPYTqS5ydMkMOuJxhZPJrQiVh3hhotnQKPjV94JDAf2XlaDplwrZT2neMJ5Vv9lCQpRTpAvxNY5sRiylfry1uZPErAAiXrp98E56Fl76gON312HaHoooZ0RN6yIi8RJsrPSgH3b5Hb7fTlZdTrOemhMf2PRrKOfVKhtiyWWB1rjIuIhkEdyOPxcHzBv4V542MupsQ3IayTnYJ1LHfnbr7M1aWPRbQnau4pXKDiyjgsDKlWOi55lGlZzcwqFoks4MD96A6oCK3V"]}).set('X-OBSERVATORY-AUTH', token);
	 	expect(response.status).toEqual(400);
		expect(response.text).toContain('{"success":false,"message":"Please provide compatible input,maximum length exceeded !"}');

	});

	// create product with name = abc  description = abc category = abc tags = ["max"] (max tags)
	 test('create product with name = abc  description = abc category = abc tags = ["max"] ', async () => {
	 	const response = await request(server).post('/observatory/api/products').set("Content-Type", "application/json").send({"name":"abc","description":"abc", "category":"abc", "tags":["jKOasWVq00m0v0DI8FWXTHMBufcBksIi8wKt6NryX7fTBUVWx0OVxLr7S71OER9DslZauZTLxppZUU24gclDpWI8y0SDmiGo4tyt5ID2tlaynwfhvGBeJGf6M8tH83XP7jIA81beBaVO6S4wYh37eWx3JODTmjEMLm1qR3k23V3CtFmSXa8RvJFmSnmptnjHiM4QNXwKmTR119Acu0SNhbooLOuAVrKqX95cS5Y4w0M2KvNZ1mhaJhYlfadf9SrXVshC31TnBCCqkEyTNKO0N8D1wSash46gZ3YsfSkPKyagygrdPTexEgQZ3TG7ALXMsMJvxN0kqzG8bwCmTZnHudinF3EpftNeaqIOSEg271EhK0vTDjcwErk1eQGBg1pXlTvTymZdahtDPGqAKJi1rJPFsU8vfDhYQ8ilQpDfBZ98c23LRaruuNJZ4xGsQy3m6PZvP0FJDgv4nuikD4zp3saygPzFxNjq4Rl7cycS9oeLdBYxB2zfnFWtVFXT81WggQNYuw7fxTjpIluwuk6pheZ9FTktJkOHXMJeOrbGz6yFWKqnbtrt1g6LvgoOtEXI3Tg0FLzt89KsbtNgMWYro9xlKfIQDnvmL08xkYVEknbQ1TF0OgNTAlkmqmIx6ENbEzUdcjI0FBYLwDenBQ76mEm5CX5M5zEh2NhyrnBckbnr4RQcN9lyhjQtdxtomLpVK8otueXI8ygHq4uq4fAq21Nov8nYUP4338X5uf5A3ZG3yK8pqNCGGlars4UnIqjWJLsBrkLxMfhKduYYVOCHeecnczvVdTLKxdxQP6WcH8AWmJVnBPTqBA71MsafyVLhPKWEqRyg00ClrOrLkLtryYxU6mo1VQWSfYjqebzsQgthas2ouIAWYSFtBR1PGFCGLoEzHt3VdsuXVUxp3tGS64opxejL6tYRS7X50Yw3PNHzppqd2GYkN2aJ4YFSg6Zl8n4z9QmWMDF32lJn2Xqtg4eL3HQ2JCnmzpKtrclk2dSvXZoj0bSkBMKhNs7VlEIAqMZmoE0djuWoT0guQep4aS7QNlAFa9z6XC5cpufg9UO5uapzb7FxsoEg3jwHTmPa4dQtPFzNdUFrOn8AL6mfu3Xjq22vWlyRGDZRnVztEScKlQW3JwawUQ46EonF8rXItSk4YrovuHooyC36N3HbXjibT0MVbSnODFfWfJHkxGZ5bvU2IlsCjzSlS8yMixSg0x0GBk02HqHBFfNMc2PpIgUpVPPUye1goYOFuxi0YCIpBLGfVfagQMrQPYmtvehMTAXWgcbjmLCnr8Ia0MDh8cs0cRasd0HDdUdZctDSBvB8aRKJiCW735AdnZYnBicvedYgV0YChYJuF77UN9AeSNdQpk2E9Smheu1NdPO97cfuQouR3c8PYPFITau2bCKDN0wOvaLsSYXcHOORmvvc6caSEpNX4ZEfejgdq2zDucd6Lu8oZFO7RBlqWedaJG5BhMIdNXo73hggxMmRBbDIHQYO1l0u70PZ7qKrTIPHigPjaNuXiwRdGXHlVaeZ0zO6vi7YoEkJhAb3diw9hQBqPTSZMvmN14R2ny8wf7S0FWkXfbMELxPGrLYgBVXiNGj6k2sntyXoxHM1NdDuYqZEAMPYdELwcF3VIpWOE591mQRw0WV1FFjjN9K77ymWitjIRUDUtRzMmfc54hXZkZTjPMZevR98aflzIgZrAzuRE0WGdvbqFjFEnWHp7VwUDwSL8CPYTqS5ydMkMOuJxhZPJrQiVh3hhotnQKPjV94JDAf2XlaDplwrZT2neMJ5Vv9lCQpRTpAvxNY5sRiylfry1uZPErAAiXrp98E56Fl76gON312HaHoooZ0RN6yIi8RJsrPSgH3b5Hb7fTlZdTrOemhMf2PRrKOfVKhtiyWWB1rjIuIhkEdyOPxcHzBv4V542MupsQ3IayTnYJ1LHfnbr7M1aWPRbQnau4pXKDiyjgsDKlWOi55lGlZzcwqFoks4MD96A6oCK3V"]}).set('X-OBSERVATORY-AUTH', token);
	 	expect(response.status).toEqual(200);
id = response.body.id;
		expect(response.body.name).toEqual("abc");
		expect(response.body.description).toEqual("abc");
		expect(response.body.category).toEqual("abc");
		expect(response.body.withdrawn).toEqual(false);

	});

	// delete product with name = abc  description = abc category = abc tags = ["huge test"] withdrawn false
 	test('delete product with name = abc  description = abc category = abc tags = ["a"] withdrawn false ', async () => {
	 	const response = await request(server).delete('/observatory/api/products/'+id).set("Content-Type", "application/json").set('X-OBSERVATORY-AUTH', token);
	 	expect(response.status).toEqual(200);
		expect(response.text).toContain('{"message":"OK"}');

	});

	// create product with name = abc  description = abc category = abc tags = ["a"] withdrawn = false
 	test('create product with name = abc  description = abc category = abc tags = ["a"] withdrawn = false ', async () => {
	 	const response = await request(server).post('/observatory/api/products').set("Content-Type", "application/json").send({"name":"abc","description":"abc", "category":"abc", "tags":["a"],"withdrawn":false}).set('X-OBSERVATORY-AUTH', token);
	 	expect(response.status).toEqual(200);
		id = response.body.id;
		expect(response.body.name).toEqual("abc");
		expect(response.body.description).toEqual("abc");
		expect(response.body.category).toEqual("abc");
		expect(response.body.tags).toEqual(["a"]);
		expect(response.body.withdrawn).toEqual(false);
		//console.log(response.text);
	});

	// delete product with name = abc  description = abc category = abc tags = ["a"] withdrawn false
 	test('delete product with name = abc  description = abc category = abc tags = ["a"] withdrawn false ', async () => {
	 	const response = await request(server).delete('/observatory/api/products/'+id).set("Content-Type", "application/json").set('X-OBSERVATORY-AUTH', token);
	 	expect(response.status).toEqual(200);
		expect(response.text).toContain('{"message":"OK"}');

	});

	// create product with name = abc  description = abc category = abc tags = ["a"] withdrawn = true
 	test('create product with name = abc  description = abc category = abc tags = ["a"] withdrawn = true ', async () => {
	 	const response = await request(server).post('/observatory/api/products').set("Content-Type", "application/json").send({"name":"abc","description":"abc", "category":"abc", "tags":["a"],"withdrawn":true}).set('X-OBSERVATORY-AUTH', token);
	 	expect(response.status).toEqual(200);
		id = response.body.id;
		expect(response.body.name).toEqual("abc");
		expect(response.body.description).toEqual("abc");
		expect(response.body.category).toEqual("abc");
		expect(response.body.tags).toEqual(["a"]);
		expect(response.body.withdrawn).toEqual(true);
		//console.log(response.text);
	});

	// delete product with name = abc  description = abc category = abc tags = ["a"] withdrawn true
 	test('delete product with name = abc  description = abc category = abc tags = ["a"] withdrawn true ', async () => {
	 	const response = await request(server).delete('/observatory/api/products/'+id).set("Content-Type", "application/json").set('X-OBSERVATORY-AUTH', token);
	 	expect(response.status).toEqual(200);
		expect(response.text).toContain('{"message":"OK"}');

	});

	// create product with name = abc  description = abc category = abc tags = ["a"] withdrawn = false JSON
 	test('create product with name = abc  description = abc category = abc tags = ["a"] withdrawn = false JSON ', async () => {
	 	const response = await request(server).post('/observatory/api/products?format=json').set("Content-Type", "application/json").send({"name":"abc","description":"abc", "category":"abc", "tags":["a"],"withdrawn":false}).set('X-OBSERVATORY-AUTH', token);
	 	expect(response.status).toEqual(200);
		id = response.body.id;
		expect(response.body.name).toEqual("abc");
		expect(response.body.description).toEqual("abc");
		expect(response.body.category).toEqual("abc");
		expect(response.body.tags).toEqual(["a"]);
		expect(response.body.withdrawn).toEqual(false);
		//console.log(response.text);
	});

	// delete product with name = abc  description = abc category = abc tags = ["a"] withdrawn false JSON
 	test('delete product with name = abc  description = abc category = abc tags = ["a"] withdrawn false JSON ', async () => {
	 	const response = await request(server).delete('/observatory/api/products/'+id).set("Content-Type", "application/json").set('X-OBSERVATORY-AUTH', token);
	 	expect(response.status).toEqual(200);
		expect(response.text).toContain('{"message":"OK"}');

	});

	// create product with name = abc  description = abc category = abc tags = ["a"] withdrawn = false XML
 	test('create product with name = abc  description = abc category = abc tags = ["a"] withdrawn = false XML ', async () => {
	 	const response = await request(server).post('/observatory/api/products?format=xml').set("Content-Type", "application/json").send({"name":"abc","description":"abc", "category":"abc", "tags":["a"],"withdrawn":false}).set('X-OBSERVATORY-AUTH', token);
	 	expect(response.status).toEqual(400);
		expect(response.text).toContain('{"success":false,"message":"XML"}');

	});

	// create product with name = abc  description = abc category = abc tags = ["a"] withdrawn = false JSON NO TOKEN
 	test('create product with name = abc  description = abc category = abc tags = ["a"] withdrawn = false JSON NO TOKEN ', async () => {
	 	const response = await request(server).post('/observatory/api/products?format=json').set("Content-Type", "application/json").send({"name":"abc","description":"abc", "category":"abc", "tags":["a"],"withdrawn":false});
	 	expect(response.status).toEqual(400);
		expect(response.text).toContain('{"success":false,"message":"Please provide a valid authentication token !"}');
		//console.log(response.text);
	});

	// create product with name = abc  description = abc category = abc tags = ["a"] withdrawn = false JSON BAD TOKEN
 	test('create product with name = abc  description = abc category = abc tags = ["a"] withdrawn = false JSON BAD TOKEN ', async () => {
	 	const response = await request(server).post('/observatory/api/products?format=json').set("Content-Type", "application/json").send({"name":"abc","description":"abc", "category":"abc", "tags":["a"],"withdrawn":false}).set('X-OBSERVATORY-AUTH', token+"bad_token");
	 	expect(response.status).toEqual(403);
		expect(response.text).toContain('{"success":false,"message":"Authentication failed !"}');
	});

	 test('logout token in create products ', async () => {
		const response = await request(server).post('/observatory/api/logout').set("Content-Type", "application/json").set('X-OBSERVATORY-AUTH', token);
		expect(response.status).toEqual(200);
		expect(response.text).toContain('{"message":"OK"}');
 	});

	// create product with name = abc  description = abc category = abc tags = ["a"] withdrawn = false JSON LOGOUT TOKEN
 	test('create product with name = abc  description = abc category = abc tags = ["a"] withdrawn = false JSON LOGOUT TOKEN ', async () => {
	 	const response = await request(server).post('/observatory/api/products?format=json').set("Content-Type", "application/json").send({"name":"abc","description":"abc", "category":"abc", "tags":["a"],"withdrawn":false}).set('X-OBSERVATORY-AUTH', token);
	 	expect(response.status).toEqual(403);
		expect(response.text).toContain('{"success":false,"message":"Authentication failed !"}');
	});

});

// DELETE products tests
describe('DELETE products test', () => {

	var token;
 	test('token in delete products ', async () => {
		const response = await request(server).post('/observatory/api/login').set("Content-Type", "application/json").send({"username":"fnp","password":"kodikos"});
		expect(response.status).toEqual(200);
		token = response.body.token;
		//console.log(response.body.token);
 	});

	var id;
	// create product with name = abc  description = abc category = abc tags = ["a"]
 	test('create product with name = abc  description = abc category = abc tags = ["a"] ', async () => {
	 	const response = await request(server).post('/observatory/api/products').set("Content-Type", "application/json").send({"name":"abc","description":"abc", "category":"abc", "tags":["a"]}).set('X-OBSERVATORY-AUTH', token);
	 	expect(response.status).toEqual(200);
		id = response.body.id;
		expect(response.body.name).toEqual("abc");
		expect(response.body.description).toEqual("abc");
		expect(response.body.category).toEqual("abc");
		expect(response.body.tags).toEqual(["a"]);
		expect(response.body.withdrawn).toEqual(false);
		//console.log(response.text);
	});

	// delete product with name = abc  description = abc category = abc tags = ["a"]
 	test('delete product with name = abc  description = abc category = abc tags = ["a"] ', async () => {
	 	const response = await request(server).delete('/observatory/api/products/'+id).set("Content-Type", "application/json").set('X-OBSERVATORY-AUTH', token);
	 	expect(response.status).toEqual(200);
		expect(response.text).toContain('{"message":"OK"}');

	});
	
	// inexistent id test after deletion
 	test('get product with inexistent id after deletion', async () => {
 		const response = await request(server).get('/observatory/api/products/'+id);
 		expect(response.status).toEqual(404);
 		expect(response.text).toContain('{"success":false,"message":"No matching fuel with the id given !"}');
 	});
	
	// delete non existent product
 	test('delete non existent product ', async () => {
	 	const response = await request(server).delete('/observatory/api/products/100').set("Content-Type", "application/json").set('X-OBSERVATORY-AUTH', token);
	 	expect(response.status).toEqual(404);
		expect(response.text).toContain('{"sucess":false,"message":"Product id does not exist in database !"}');

	});

	// delete float product id
 	test('delete float product id ', async () => {
	 	const response = await request(server).delete('/observatory/api/products/2.2').set("Content-Type", "application/json").set('X-OBSERVATORY-AUTH', token);
	 	expect(response.status).toEqual(400);
		expect(response.text).toContain('{"success":false,"message":"Product id given is not an integer !"}');

	});

	// delete string product id
 	test('delete string product id ', async () => {
	 	const response = await request(server).delete('/observatory/api/products/a').set("Content-Type", "application/json").set('X-OBSERVATORY-AUTH', token);
	 	expect(response.status).toEqual(400);
		expect(response.text).toContain('{"success":false,"message":"Product id given is not an integer !"}');

	});

	// delete huge product id
 	test('delete huge product id ', async () => {
	 	const response = await request(server).delete('/observatory/api/products/1213213213213213213').set("Content-Type", "application/json").set('X-OBSERVATORY-AUTH', token);
	 	expect(response.status).toEqual(400);
		expect(response.text).toContain('{"success":false,"message":"Variable product id has exceeded maximum length !"}');

	});

	// delete NO TOKEN
 	test('delete NO TOKEN', async () => {
 		const response = await request(server).delete('/observatory/api/products/'+id).set("Content-Type", "application/json");
 		expect(response.status).toEqual(400);
 		expect(response.text).toContain('{"success":false,"message":"Please provide a valid authentication token !"}');
 	});

	// delete BAD TOKEN
 	test('delete BAD TOKEN', async () => {
 		const response = await request(server).delete('/observatory/api/products/'+id).set("Content-Type", "application/json").set('X-OBSERVATORY-AUTH', token+"bad_token");
 		expect(response.status).toEqual(403);
 		expect(response.text).toContain('{"success":false,"message":"Authentication failed !"}');
 	});

	// logout token in delete products
	test('logout token in delete products ', async () => {
		const response = await request(server).post('/observatory/api/logout').set("Content-Type", "application/json").set('X-OBSERVATORY-AUTH', token);
		expect(response.status).toEqual(200);
		expect(response.text).toContain('{"message":"OK"}');
 	 });

	// delete after LOGOUT
 	test('delete after LOGOUT', async () => {
 		const response = await request(server).delete('/observatory/api/products/'+id).set("Content-Type", "application/json").set('X-OBSERVATORY-AUTH', token);
 		expect(response.status).toEqual(403);
 		expect(response.text).toContain('{"success":false,"message":"Authentication failed !"}');
 	});

	var token2 ;

	test('token2 in delete products ', async () => {
		const response = await request(server).post('/observatory/api/login').set("Content-Type", "application/json").send({"username":"fnp","password":"kodikos"});
		expect(response.status).toEqual(200);
		token = response.body.token;
		token2 = token;
		//console.log(response.body.token);
 	});
	
	

	// create product with name = abc  description = abc category = abc tags = ["a"] JSON
 	test('create product with name = abc  description = abc category = abc tags = ["a"] JSON', async () => {
	 	const response = await request(server).post('/observatory/api/products').set("Content-Type", "application/json").send({"name":"abc","description":"abc", "category":"abc", "tags":["a"]}).set('X-OBSERVATORY-AUTH', token);
	 	expect(response.status).toEqual(200);
		id = response.body.id;
		expect(response.body.name).toEqual("abc");
		expect(response.body.description).toEqual("abc");
		expect(response.body.category).toEqual("abc");
		expect(response.body.tags).toEqual(["a"]);
		expect(response.body.withdrawn).toEqual(false);
		//console.log(response.text);
	});

	// delete JSON
 	test('delete JSON ', async () => {
	 	const response = await request(server).delete('/observatory/api/products/'+id+"?format=json").set("Content-Type", "application/json").set('X-OBSERVATORY-AUTH', token);
	 	expect(response.status).toEqual(200);
		expect(response.text).toContain('{"message":"OK"}');

	});
	
	// inexistent id test after JSON deletion
 	test('get product with inexistent id after JSON deletion', async () => {
 		const response = await request(server).get('/observatory/api/products/'+id);
 		expect(response.status).toEqual(404);
 		expect(response.text).toContain('{"success":false,"message":"No matching fuel with the id given !"}');
 	});
	// delete XML
 	test('delete XML ', async () => {
	 	const response = await request(server).delete('/observatory/api/products/1?format=xml').set("Content-Type", "application/json").set('X-OBSERVATORY-AUTH', token);
	 	expect(response.status).toEqual(400);
		expect(response.text).toContain('{"success":false,"message":"XML format is not supported !"}');

	});

 	test('token in delete products for notadmin1 ', async () => {
		const response = await request(server).post('/observatory/api/login').set("Content-Type", "application/json").send({"username":"notadmin1","password":"kodikos"});
		expect(response.status).toEqual(200);
		token = response.body.token;
		//console.log(response.body.token);
 	});

	// create product with name = abc  description = abc category = abc tags = ["a"]
 	test('create product with name = abc  description = abc category = abc tags = ["a"]  notadmin1', async () => {
	 	const response = await request(server).post('/observatory/api/products').set("Content-Type", "application/json").send({"name":"abc","description":"abc", "category":"abc", "tags":["a"]}).set('X-OBSERVATORY-AUTH', token);
	 	expect(response.status).toEqual(200);
		id = response.body.id;
		expect(response.body.name).toEqual("abc");
		expect(response.body.description).toEqual("abc");
		expect(response.body.category).toEqual("abc");
		expect(response.body.tags).toEqual(["a"]);
		expect(response.body.withdrawn).toEqual(false);
		//console.log(response.text);
	});

	// delete product with name = abc  description = abc category = abc tags = ["a"]
 	test('delete product with name = abc  description = abc category = abc tags = ["a"] notadmin1 first ', async () => {
	 	const response = await request(server).delete('/observatory/api/products/'+id).set("Content-Type", "application/json").set('X-OBSERVATORY-AUTH', token);
	 	expect(response.status).toEqual(200);
		expect(response.text).toContain('{"message":"OK"}');

	});

	// delete product with name = abc  description = abc category = abc tags = ["a"]
 	test('delete product with name = abc  description = abc category = abc tags = ["a"] notadmin1 second', async () => {
	 	const response = await request(server).delete('/observatory/api/products/'+id).set("Content-Type", "application/json").set('X-OBSERVATORY-AUTH', token);
	 	expect(response.status).toEqual(200);
		expect(response.text).toContain('{"message":"Product is already withdrawn"}');

	});
	
	// inexistent id test after deletion
 	test('get product with withdrawn = true notadmin1', async () => {
 		const response = await request(server).get('/observatory/api/products/'+id);
 		expect(response.status).toEqual(200);
		//console.log(response.text);
		expect(response.body.id).toEqual(""+id+"");
 		expect(response.body.name).toEqual("abc");
		expect(response.body.description).toEqual("abc");
		expect(response.body.category).toEqual("abc");
		expect(response.body.tags).toEqual(["a"]);
		expect(response.body.withdrawn).toEqual(true)
 	});

	// delete product with name = abc  description = abc category = abc tags = ["a"] ADMIN
 	test('delete product with name = abc  description = abc category = abc tags = ["a"] ADMIN ', async () => {
	 	const response = await request(server).delete('/observatory/api/products/'+id).set("Content-Type", "application/json").set('X-OBSERVATORY-AUTH', token2);
	 	expect(response.status).toEqual(200);
		expect(response.text).toContain('{"message":"OK"}');

	});

	// delete product with name = abc  description = abc category = abc tags = ["a"]
 	test('delete product with name = abc  description = abc category = abc tags = ["a"] notadmin1 AFTER ADMIN', async () => {
	 	const response = await request(server).delete('/observatory/api/products/'+id).set("Content-Type", "application/json").set('X-OBSERVATORY-AUTH', token);
	 	expect(response.status).toEqual(404);
		expect(response.text).toContain('{"sucess":false,"message":"Product id does not exist in database !"}');

	});

	// delete product with name = abc  description = abc category = abc tags = ["a"] ADMIN
 	test('delete product with name = abc  description = abc category = abc tags = ["a"] ADMIN AFTER ADMIN', async () => {
	 	const response = await request(server).delete('/observatory/api/products/'+id).set("Content-Type", "application/json").set('X-OBSERVATORY-AUTH', token2);
	 	expect(response.status).toEqual(404);
		expect(response.text).toContain('{"sucess":false,"message":"Product id does not exist in database !"}');

	});


});

// users login
describe('Users login', () => {

	test('fnp login ', async () => {
		const response = await request(server).post('/observatory/api/login').set("Content-Type", "application/json").send({"username":"fnp","password":"kodikos"});
		expect(response.status).toEqual(200);
		expect(response.body.success).toEqual(true);
 	});

	test('wrong username login ', async () => {
		const response = await request(server).post('/observatory/api/login').set("Content-Type", "application/json").send({"username":"notfnp","password":"kodikos"});
		expect(response.status).toEqual(404);
		expect(response.text).toEqual('{"success":false,"message":"Invalid username!"}');
 	});

	test('wrong password login ', async () => {
		const response = await request(server).post('/observatory/api/login').set("Content-Type", "application/json").send({"username":"fnp","password":"notkodikos"});
		expect(response.status).toEqual(403);
		expect(response.text).toEqual('{"success":false,"message":"Invalid password !"}');
 	});

	test('no username login ', async () => {
		const response = await request(server).post('/observatory/api/login').set("Content-Type", "application/json").send({"password":"kodikos"});
		expect(response.status).toEqual(400);
		expect(response.text).toEqual('{"success":false,"message":"Please complete all the mandatory fields !"}');
 	});
	
	test('no password login ', async () => {
		const response = await request(server).post('/observatory/api/login').set("Content-Type", "application/json").send({"username":"fnp"});
		expect(response.status).toEqual(400);
		expect(response.text).toEqual('{"success":false,"message":"Please complete all the mandatory fields !"}');
 	});

	test('bad username type login ', async () => {
		const response = await request(server).post('/observatory/api/login').set("Content-Type", "application/json").send({"username":12,"password":"kodikos"});
		expect(response.status).toEqual(400);
		expect(response.text).toEqual('{"success":false,"message":"One or more fields are not valid !"}');
 	});

	test('bad password type login ', async () => {
		const response = await request(server).post('/observatory/api/login').set("Content-Type", "application/json").send({"username":"as","password":21});
		expect(response.status).toEqual(400);
		expect(response.text).toEqual('{"success":false,"message":"One or more fields are not valid !"}');
 	});

	test('bad username type login 2', async () => {
		const response = await request(server).post('/observatory/api/login').set("Content-Type", "application/json").send({"username":[],"password":"kodikos"});
		expect(response.status).toEqual(400);
		expect(response.text).toEqual('{"success":false,"message":"One or more fields are not valid !"}');
 	});

	test('bad password type login 2', async () => {
		const response = await request(server).post('/observatory/api/login').set("Content-Type", "application/json").send({"username":"as","password":[]});
		expect(response.status).toEqual(400);
		expect(response.text).toEqual('{"success":false,"message":"One or more fields are not valid !"}');
 	});

	test('big username login ', async () => {
		const response = await request(server).post('/observatory/api/login').set("Content-Type", "application/json").send({"username":"1WNQ9uv5ixXTFyUE0WbPv161LedAXgyOGNiLobR1L0UiaxGvcfw7kkptZlWmY6rNV0UtvEv7sYdb4gs2Boot3YJhOuz5Vzdd2FXguIZP9h6Bg3zMGHv1fMyGBArXBoqVv6wZn80PSlOvYpFd62Lfw2eRNZqnTIqxbaiMuIIICR7aaoQMC8wHWAUKdtPl9aePF7aR2UJEt3r7U7wFPFOGnI9vJOtJ8XpkJCFHlxnNBYvu32oViU03uqn6zqJnr4Lc","password":"kodikos"});
		expect(response.status).toEqual(400);
		expect(response.text).toEqual('{"success":false,"message":"One or more fields are not valid !"}');
 	});

	test('fnp login XML ', async () => {
		const response = await request(server).post('/observatory/api/login?format=xml').set("Content-Type", "application/json").send({"username":"fnp","password":"kodikos"});
		expect(response.status).toEqual(400);
		expect(response.text).toEqual('{"success":false,"message":"XML"}');
 	});

	test('fnp login JSON', async () => {
		const response = await request(server).post('/observatory/api/login?format=json').set("Content-Type", "application/json").send({"username":"fnp","password":"kodikos"});
		expect(response.status).toEqual(200);
		expect(response.body.success).toEqual(true);
 	});


});

// users logout
describe('Users logout', () => {

	test('logout no token given ', async () => {
		const response = await request(server).post('/observatory/api/logout').set("Content-Type", "application/json");
		expect(response.status).toEqual(400);
		expect(response.text).toEqual('{"success":false,"message":"Please provide a valid authentication token !"}');
 	 });

	var token ;
	test('fnp login to retrieve token ', async () => {
		const response = await request(server).post('/observatory/api/login').set("Content-Type", "application/json").send({"username":"fnp","password":"kodikos"});
		expect(response.status).toEqual(200);
		expect(response.body.success).toEqual(true);
		token = response.body.token;
 	});
	
	test('logout bad token given ', async () => {
		const response = await request(server).post('/observatory/api/logout').set("Content-Type", "application/json").set('X-OBSERVATORY-AUTH', token+"bad_token");
		expect(response.status).toEqual(403);
		expect(response.text).toEqual('{"success":false,"message":"Authentication failed !"}');
 	 });
	test('logout good token given ', async () => {
		const response = await request(server).post('/observatory/api/logout').set("Content-Type", "application/json").set('X-OBSERVATORY-AUTH', token);
		expect(response.status).toEqual(200);
		expect(response.text).toEqual('{"message":"OK"}');
 	 });
	

});

// users signup 
describe('Users signup', () => {

	test('create new user0023 ', async () => {
		const response = await request(server).post('/observatory/api/users/signup').set("Content-Type", "application/json").send({"username":"user0023","psswd":"kodikos","mail":"test@mail.com","admin":0,"ipath":"sda"});
		expect(response.status).toEqual(200);
		expect(response.text).toEqual('{"success":true,"message":"Welcome, user0023 !"}');
 	});

	test('create new user0024 ', async () => {
		const response = await request(server).post('/observatory/api/users/signup').set("Content-Type", "application/json").send({"username":"user0024","psswd":"kodikos","mail":"test2@mail.com","admin":0});
		expect(response.status).toEqual(200);
		expect(response.text).toEqual('{"success":true,"message":"Welcome, user0024 !"}');
 	});

	test('create new user0025 ', async () => {
		const response = await request(server).post('/observatory/api/users/signup').set("Content-Type", "application/json").send({"username":"user0025","psswd":"kodikos","mail":"test3@mail.com"});
		expect(response.status).toEqual(200);
		expect(response.text).toEqual('{"success":true,"message":"Welcome, user0025 !"}');
 	});

	test('create new user0025 duplicate email and username ', async () => {
		const response = await request(server).post('/observatory/api/users/signup').set("Content-Type", "application/json").send({"username":"user0025","psswd":"kodikos","mail":"test3@mail.com"});
		expect(response.status).toEqual(200);
		expect(response.text).toEqual('{"success":false,"message":"Email and username are already in use."}');
 	});

	test('create new user0026 duplicate email ', async () => {
		const response = await request(server).post('/observatory/api/users/signup').set("Content-Type", "application/json").send({"username":"user0026","psswd":"kodikos","mail":"test3@mail.com"});
		expect(response.status).toEqual(200);
		expect(response.text).toEqual('{"success":false,"message":"Email is already in use."}');
 	});

	test('create new user0025 duplicate username ', async () => {
		const response = await request(server).post('/observatory/api/users/signup').set("Content-Type", "application/json").send({"username":"user0025","psswd":"kodikos","mail":"testa3@mail.com"});
		expect(response.status).toEqual(200);
		expect(response.text).toEqual('{"success":false,"message":"Username is already in use."}');
 	});


	test('delete user0023 ', async () => {
		const response = await request(server).delete('/observatory/api/users/user0023/delete').set("Content-Type", "application/json").send({"psswd":"kodikos"});
		expect(response.status).toEqual(200);
		expect(response.text).toEqual('{"success":true,"message":"We will miss you user0023"}');
 	});

	test('delete user0024 ', async () => {
		const response = await request(server).delete('/observatory/api/users/user0024/delete').set("Content-Type", "application/json").send({"psswd":"kodikos"});
		expect(response.status).toEqual(200);
		expect(response.text).toEqual('{"success":true,"message":"We will miss you user0024"}');
 	});

	test('delete user0025 ', async () => {
		const response = await request(server).delete('/observatory/api/users/user0025/delete').set("Content-Type", "application/json").send({"psswd":"kodikos"});
		expect(response.status).toEqual(200);
		expect(response.text).toEqual('{"success":true,"message":"We will miss you user0025"}');
 	});

	test('create user no username ', async () => {
		const response = await request(server).post('/observatory/api/users/signup').set("Content-Type", "application/json").send({"psswd":"kodikos","mail":"test@mail.com"});
		expect(response.status).toEqual(400);
		expect(response.text).toEqual('{"success":false,"message":"Please complete all the mandatory fields !"}');
 	});

	test('create user no password ', async () => {
		const response = await request(server).post('/observatory/api/users/signup').set("Content-Type", "application/json").send({"username":"user0023","mail":"test@mail.com"});
		expect(response.status).toEqual(400);
		expect(response.text).toEqual('{"success":false,"message":"Please complete all the mandatory fields !"}');
 	});

	test('create user no email address ', async () => {
		const response = await request(server).post('/observatory/api/users/signup').set("Content-Type", "application/json").send({"username":"user0023","psswd":"kodikos"});
		expect(response.status).toEqual(400);
		expect(response.text).toEqual('{"success":false,"message":"Please complete all the mandatory fields !"}');
 	});

	test('create new user0023 XML', async () => {
		const response = await request(server).post('/observatory/api/users/signup?format=xml').set("Content-Type", "application/json").send({"username":"user0023","psswd":"kodikos","mail":"test@mail.com","admin":0,"ipath":"sda"});
		expect(response.status).toEqual(400);
		expect(response.text).toEqual('{"success":false,"message":"XML"}');
 	});

	test('create user bad email address ', async () => {
		const response = await request(server).post('/observatory/api/users/signup').set("Content-Type", "application/json").send({"username":"user0023","psswd":"kodikos","mail":"ads"});
		expect(response.status).toEqual(400);
		expect(response.text).toEqual('{"success":false,"message":"Email adrress must be in a valid form !"}');
 	});

	test('create user bad email address 2 ', async () => {
		const response = await request(server).post('/observatory/api/users/signup').set("Content-Type", "application/json").send({"username":"user0023","psswd":"kodikos","mail":2});
		expect(response.status).toEqual(400);
		expect(response.text).toEqual('{"success":false,"message":"One or more fields are not valid !"}');
 	});

	test('create user bad username ', async () => {
		const response = await request(server).post('/observatory/api/users/signup').set("Content-Type", "application/json").send({"username":21,"psswd":"kodikos","mail":"a@mail.com"});
		expect(response.status).toEqual(400);
		expect(response.text).toEqual('{"success":false,"message":"One or more fields are not valid !"}');
 	});

	test('create user bad password ', async () => {
		const response = await request(server).post('/observatory/api/users/signup').set("Content-Type", "application/json").send({"username":"user0023","psswd":1,"mail":"a@mail.com"});
		expect(response.status).toEqual(400);
		expect(response.text).toEqual('{"success":false,"message":"One or more fields are not valid !"}');
 	});

	test('create user bad email address 3 ', async () => {
		const response = await request(server).post('/observatory/api/users/signup').set("Content-Type", "application/json").send({"username":"user0023","psswd":"kodikos","mail":[]});
		expect(response.status).toEqual(400);
		expect(response.text).toEqual('{"success":false,"message":"One or more fields are not valid !"}');
 	});

	test('create user bad username 2', async () => {
		const response = await request(server).post('/observatory/api/users/signup').set("Content-Type", "application/json").send({"username":[],"psswd":"kodikos","mail":"a@mail.com"});
		expect(response.status).toEqual(400);
		expect(response.text).toEqual('{"success":false,"message":"One or more fields are not valid !"}');
 	});

	test('create user bad password 2 ', async () => {
		const response = await request(server).post('/observatory/api/users/signup').set("Content-Type", "application/json").send({"username":"user0023","psswd":[],"mail":"a@mail.com"});
		expect(response.status).toEqual(400);
		expect(response.text).toEqual('{"success":false,"message":"One or more fields are not valid !"}');
 	});

});

// users delete
describe('Users delete', () => {

	test('create new user0023 ', async () => {
		const response = await request(server).post('/observatory/api/users/signup').set("Content-Type", "application/json").send({"username":"user0023","psswd":"kodikos","mail":"test@mail.com","admin":0,"ipath":"sda"});
		expect(response.status).toEqual(200);
		expect(response.text).toEqual('{"success":true,"message":"Welcome, user0023 !"}');
 	});

	test('delete no valid username', async () => {
		const response = await request(server).delete('/observatory/api/users/1/delete').set("Content-Type", "application/json").send({"psswd":"kodikos"});
		expect(response.status).toEqual(404);
		expect(response.text).toEqual('{"success":false,"message":"Invalid username!"}');
 	});

	test('delete user0023 no password', async () => {
		const response = await request(server).delete('/observatory/api/users/user0023/delete').set("Content-Type", "application/json");
		expect(response.status).toEqual(400);
		expect(response.text).toEqual('{"success":false,"message":"Please complete all the mandatory fields !"}');
 	});

	test('delete user0023 wrong password', async () => {
		const response = await request(server).delete('/observatory/api/users/user0023/delete').set("Content-Type", "application/json").send({"psswd":"kodikos_bad"});
		expect(response.status).toEqual(200);
		expect(response.text).toEqual('{"success":true,"message":"Invalid password !"}');
 	});

	test('delete user0023 ', async () => {
		const response = await request(server).delete('/observatory/api/users/user0023/delete').set("Content-Type", "application/json").send({"psswd":"kodikos"});
		expect(response.status).toEqual(200);
		expect(response.text).toEqual('{"success":true,"message":"We will miss you user0023"}');
 	});

	test('delete XML', async () => {
		const response = await request(server).delete('/observatory/api/users/user0023/delete?format=xml').set("Content-Type", "application/json").send({"psswd":"kodikos"});
		expect(response.status).toEqual(400);
		expect(response.text).toEqual('{"success":false,"message":"XML"}');
 	});
});

//users get profile
describe('Get user profile', () => {

	var token;
 	test('token in get profile ', async () => {
		const response = await request(server).post('/observatory/api/login').set("Content-Type", "application/json").send({"username":"fnp","password":"kodikos"});
		expect(response.status).toEqual(200);
		token = response.body.token;
		//console.log(response.body.token);
 	});

	test('get my profile (OK) ', async () => {
		const response = await request(server).get('/observatory/api/users/fnp').set("Content-Type", "application/json").set('X-OBSERVATORY-AUTH', token);
		expect(response.status).toEqual(200);
 		expect(response.body.user.username).toEqual("fnp");
		expect(response.body.user.mail).toEqual("lkanav@yahoo.com");
		expect(response.body.user.nposts).toEqual(0);
		expect(response.body.user.reputation).toEqual(0);
 	});

	test('get my profile (bad token) ', async () => {
		const response = await request(server).get('/observatory/api/users/fnp').set("Content-Type", "application/json").set('X-OBSERVATORY-AUTH', token+"bad_token");
		expect(response.status).toEqual(403);
		expect(response.text).toEqual('{"success":false,"message":"Authentication failed !"}');

 	});

	test('get my profile (no token) ', async () => {
		const response = await request(server).get('/observatory/api/users/fnp').set("Content-Type", "application/json");
		expect(response.status).toEqual(400);
		expect(response.text).toEqual('{"success":false,"message":"Please provide a valid authentication token !"}');

 	});

	test('get my profile (OK) ', async () => {
		const response = await request(server).get('/observatory/api/users/notfnp').set("Content-Type", "application/json").set('X-OBSERVATORY-AUTH', token);
		expect(response.status).toEqual(404);
		expect(response.text).toEqual('{"success":false,"message":"No matching user with the username given !"}');
 	});

	test('get my profile XML ', async () => {
		const response = await request(server).get('/observatory/api/users/fnp?format=xml').set("Content-Type", "application/json");
		expect(response.status).toEqual(400);
 		expect(response.text).toEqual('{"success":false,"message":"XML"}');
 	});

});

//UPDATE user tests
describe('UPDATE user test', () => {

	// UPDATE username

	var token;
 	test('login in order to update ', async () => {
		const response = await request(server).post('/observatory/api/login').set("Content-Type", "application/json").send({"username":"manzar","password":"kodikos"});
		expect(response.status).toEqual(200);
		token = response.body.token;
		//console.log(response.body.token);
 	});

	test('update username of manzar to manzar2 ', async () => {
		const response = await request(server).put('/observatory/api/users/manzar/newname').set("Content-Type", "application/json").send({"username":"manzar2"}).set('X-OBSERVATORY-AUTH', token);
		expect(response.status).toEqual(200);
 		expect(response.text).toEqual('{"success":true,"message":"Username update completed!"}');
 	});

	test('login in as manzar after update ', async () => {
		const response = await request(server).post('/observatory/api/login').set("Content-Type", "application/json").send({"username":"manzar","password":"kodikos"});
		expect(response.status).toEqual(404);
 	});

	test('login in as manzar2 after update ', async () => {
		const response = await request(server).post('/observatory/api/login').set("Content-Type", "application/json").send({"username":"manzar2","password":"kodikos"});
		expect(response.status).toEqual(200);
 	});


	test('update username of manzar2 to manzar ', async () => {
		const response = await request(server).put('/observatory/api/users/manzar2/newname').set("Content-Type", "application/json").send({"username":"manzar"}).set('X-OBSERVATORY-AUTH', token);
		expect(response.status).toEqual(200);
 		expect(response.text).toEqual('{"success":true,"message":"Username update completed!"}');
 	});

	test('login in as manzar2 after second update ', async () => {
		const response = await request(server).post('/observatory/api/login').set("Content-Type", "application/json").send({"username":"manzar2","password":"kodikos"});
		expect(response.status).toEqual(404);
 	});

	test('login in as manzar after second update ', async () => {
		const response = await request(server).post('/observatory/api/login').set("Content-Type", "application/json").send({"username":"manzar","password":"kodikos"});
		expect(response.status).toEqual(200);
 	});

	test('update username of manzar2 to manzar ', async () => {
		const response = await request(server).put('/observatory/api/users/manzar2/newname').set("Content-Type", "application/json").set('X-OBSERVATORY-AUTH', token);
		expect(response.status).toEqual(400);
 		expect(response.text).toEqual('{"success":false,"message":"Please complete all the mandatory fields !"}');
 	});

	test('update username XML ', async () => {
		const response = await request(server).put('/observatory/api/users/manzar/newname?format=xml').set("Content-Type", "application/json").send({"username":"manzar2"}).set('X-OBSERVATORY-AUTH', token);
		expect(response.status).toEqual(400);
 		expect(response.text).toEqual('{"success":false,"message":"XML"}');
 	});

	test('update username NO TOKEN ', async () => {
		const response = await request(server).put('/observatory/api/users/manzar/newname').set("Content-Type", "application/json").send({"username":"manzar2"});
		expect(response.status).toEqual(400);
 		expect(response.text).toEqual('{"success":false,"message":"Please provide a valid authentication token !"}');
 	});

	test('update username BAD TOKEN ', async () => {
		const response = await request(server).put('/observatory/api/users/manzar/newname').set("Content-Type", "application/json").send({"username":"manzar2"}).set('X-OBSERVATORY-AUTH', token+"bad_token");
		expect(response.status).toEqual(403);
 		expect(response.text).toEqual('{"success":false,"message":"Authentication failed !"}');
 	});

	test('update username with already in use username ', async () => {
		const response = await request(server).put('/observatory/api/users/manzar/newname').set("Content-Type", "application/json").send({"username":"fnp"}).set('X-OBSERVATORY-AUTH', token);
		expect(response.status).toEqual(200);
 		expect(response.text).toEqual('{"success":false,"message":"Username already in use !"}');
 	});

	test('logout good token given ', async () => {
		const response = await request(server).post('/observatory/api/logout').set("Content-Type", "application/json").set('X-OBSERVATORY-AUTH', token);
		expect(response.status).toEqual(200);
		expect(response.text).toEqual('{"message":"OK"}');
 	 });

	test('update username after logout ', async () => {
		const response = await request(server).put('/observatory/api/users/manzar/newname').set("Content-Type", "application/json").send({"username":"manzar2"}).set('X-OBSERVATORY-AUTH', token);
		expect(response.status).toEqual(403);
 		expect(response.text).toEqual('{"success":false,"message":"Authentication failed !"}');
 	});

	// USER UPDATE PASSWORD

	test('update password ', async () => {
		const response = await request(server).put('/observatory/api/users/manzar/newpass').set("Content-Type", "application/json").send({"psswd":"kodikos","newpsswd":"kodikos2"});
		expect(response.status).toEqual(200);
 		expect(response.text).toEqual('{"success":true,"message":"Password update completed!"}');
 	});

	test('update password ', async () => {
		const response = await request(server).put('/observatory/api/users/manzar/newpass').set("Content-Type", "application/json").send({"psswd":"kodikos","newpsswd":"kodikos2"});
		expect(response.status).toEqual(200);
 		expect(response.text).toEqual('{"success":false,"message":"Old password is incorrect,authentication failed !"}');
 	});

	test('login in as manzar after new psswd ', async () => {
		const response = await request(server).post('/observatory/api/login').set("Content-Type", "application/json").send({"username":"manzar","password":"kodikos2"});
		expect(response.status).toEqual(200);
 	});

	test('update password 2 ', async () => {
		const response = await request(server).put('/observatory/api/users/manzar/newpass').set("Content-Type", "application/json").send({"psswd":"kodikos2","newpsswd":"kodikos"});
		expect(response.status).toEqual(200);
 		expect(response.text).toEqual('{"success":true,"message":"Password update completed!"}');
 	});

	test('update password in non existent user', async () => {
		const response = await request(server).put('/observatory/api/users/notfound/newpass').set("Content-Type", "application/json").send({"psswd":"kodikos2","newpsswd":"kodikos"});
		expect(response.status).toEqual(200);
 		expect(response.text).toEqual('{"success":false,"message":"Invalid username!"}');
 	});

	test('update password no psswd', async () => {
		const response = await request(server).put('/observatory/api/users/notfound/newpass').set("Content-Type", "application/json").send({"newpsswd":"kodikos"});
		expect(response.status).toEqual(400);
 		expect(response.text).toEqual('{"success":false,"message":"Please fill all the mandatory fields ! "}');
 	});

	test('update password no newpsswd', async () => {
		const response = await request(server).put('/observatory/api/users/notfound/newpass').set("Content-Type", "application/json").send({"psswd":"kodikos2"});
		expect(response.status).toEqual(400);
 		expect(response.text).toEqual('{"success":false,"message":"Please fill all the mandatory fields ! "}');
 	});

	// UPDATE users general

	test('login in order to update ', async () => {
		const response = await request(server).post('/observatory/api/login').set("Content-Type", "application/json").send({"username":"manzar","password":"kodikos"});
		expect(response.status).toEqual(200);
		token = response.body.token;
		//console.log(response.body.token);
 	});

	test('update profile image', async () => {
		const response = await request(server).put('/observatory/api/users/manzar/newinfo').set("Content-Type", "application/json").send({"ipath":"somepath"}).set('X-OBSERVATORY-AUTH', token);
		expect(response.status).toEqual(200);
 		expect(response.text).toEqual('{"success":true,"message":"Update completed!"}');
 	});

	test('get my profile after profile image update ', async () => {
		const response = await request(server).get('/observatory/api/users/manzar').set("Content-Type", "application/json").set('X-OBSERVATORY-AUTH', token);
		expect(response.status).toEqual(200);
 		expect(response.body.user.ipath).toEqual("somepath");
 	});

	test('update profile image 2', async () => {
		const response = await request(server).put('/observatory/api/users/manzar/newinfo').set("Content-Type", "application/json").send({"ipath":"/home/fnp"}).set('X-OBSERVATORY-AUTH', token);
		expect(response.status).toEqual(200);
 		expect(response.text).toEqual('{"success":true,"message":"Update completed!"}');
 	});

	test('get my profile after profile image update 2 ', async () => {
		const response = await request(server).get('/observatory/api/users/manzar').set("Content-Type", "application/json").set('X-OBSERVATORY-AUTH', token);
		expect(response.status).toEqual(200);
 		expect(response.body.user.ipath).toEqual("/home/fnp");
 	});

	test('update profile image NO IPATH', async () => {
		const response = await request(server).put('/observatory/api/users/manzar/newinfo').set("Content-Type", "application/json").set('X-OBSERVATORY-AUTH', token);
		expect(response.status).toEqual(400);
 		expect(response.text).toEqual('{"success":false,"message":"Please complete all the mandatory fields !"}');
 	});

	test('update profile image NO TOKEN', async () => {
		const response = await request(server).put('/observatory/api/users/manzar/newinfo').set("Content-Type", "application/json").send({"ipath":"/home/fnp"});
		expect(response.status).toEqual(400);
 		expect(response.text).toEqual('{"success":false,"message":"Please provide a valid authentication token !"}');
 	});

	test('update profile image BAD TOKEN', async () => {
		const response = await request(server).put('/observatory/api/users/manzar/newinfo').set("Content-Type", "application/json").send({"ipath":"/home/fnp"}).set('X-OBSERVATORY-AUTH', token+"bad_token");
		expect(response.status).toEqual(403);
 		expect(response.text).toEqual('{"success":false,"message":"Authentication failed !"}');
 	});

	test('logout good token given ', async () => {
		const response = await request(server).post('/observatory/api/logout').set("Content-Type", "application/json").set('X-OBSERVATORY-AUTH', token);
		expect(response.status).toEqual(200);
		expect(response.text).toEqual('{"message":"OK"}');
 	 });

	test('update profile image after LOGOUT', async () => {
		const response = await request(server).put('/observatory/api/users/manzar/newinfo').set("Content-Type", "application/json").send({"ipath":"/home/fnp"}).set('X-OBSERVATORY-AUTH', token);
		expect(response.status).toEqual(403);
 		expect(response.text).toEqual('{"success":false,"message":"Authentication failed !"}');
 	});

	test('update profile image XML', async () => {
		const response = await request(server).put('/observatory/api/users/manzar/newinfo?format=xml').set("Content-Type", "application/json").send({"ipath":"somepath"}).set('X-OBSERVATORY-AUTH', token);
		expect(response.status).toEqual(400);
 		expect(response.text).toEqual('{"success":false,"message":"XML"}');
 	});

	
});

// UPDATE products tests
describe('UPDATE products test', () => {
});

// PATCH products tests
describe('PATCH products test', () => {
});

