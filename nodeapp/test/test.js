var request = request('supertesr');
var app = request('../index.js');
describe('GET/will', function(){
    it('responds with hello world', function(done){
        request(app).get('/will').expect('{"response": "Hello World"}')
    });
});