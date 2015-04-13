describe('Stoplight', function () {
    var Stoplight = require('../js/stoplight')
    var stoplight = new Stoplight('192.168.0.15')

    describe('initializes', function () {
	beforeEach(function (done) {
	    stoplight.reset().fin(done)
	})

	it("is not busy", function () {
	    expect(stoplight.isYellow).toBe(false)
	})

	it("is green", function () {
	    expect(stoplight.isGreen).toBe(true)
	    expect(stoplight.isRed).toBe(false)
	})

	describe("shows error", function () {
	    beforeAll(function(done){
		stoplight.red().fin(done)
	    })
	    
	    it("is red", function () {
		expect(stoplight.isRed).toBe(true)
		expect(stoplight.isGreen).toBe(false)
	    })
	})

	describe("shows ok", function () {
	    beforeAll(function(done){
		stoplight.green().fin(done)
	    })
	    
	    it("is green", function () {
		expect(stoplight.isGreen).toBe(true)
		expect(stoplight.isRed).toBe(false)
	    })
	})

	describe("goes busy", function () {
	    beforeAll(function(done){
		stoplight.busy().fin(done)
	    })
	    
	    it("is yellow", function () {
		expect(stoplight.isYellow).toBe(true)
	    })
	})
    })
})
