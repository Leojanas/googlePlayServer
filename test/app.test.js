const supertest = require('supertest');
const app = require('../app');
const {expect} = require('chai');

describe('GET /apps', ()=>{
    it('should return a list of apps when no query is used', ()=>{
        return supertest(app)
            .get('/apps')
            .expect(200)
            .expect('Content-Type', /json/)
            .then(res => {
                expect(res.body).to.be.an('array')
                const app = res.body[0];
                expect(app).to.include.all.keys('App','Category','Rating','Reviews','Size')
            })
    })
    it('should return an error for invalid sort query', ()=>{
        return supertest(app)
        .get('/apps?sort=InvalidSort')
        .expect(400, 'Sort must be one of rating or app.')
    })
    it('should return an error for invalid genre query', ()=>{
        return supertest(app)
        .get('/apps?genres=InvalidGenre')
        .expect(400, 'Genres must be one of [Action, Puzzle, Strategy, Casual, Arcade, Card].')
    })
    it('should return a sorted list for valid sort query', ()=>{
        return supertest(app)
            .get('/apps?sort=rating')
            .expect(200)
            .expect('Content-Type', /json/)
            .then(res => {
                expect(res.body).to.be.an('array')
                for(let i=0;i<(res.body.length -1);i++){
                    expect(res.body[i].Rating).to.not.be.lessThan(res.body[i+1].Rating)
                }
            })
    })
    it('should return a filtered list for valid genres query', ()=>{
        return supertest(app)
            .get('/apps?genres=Action')
            .expect(200)
            .expect('Content-Type', /json/)
            .then(res => {
                expect(res.body).to.be.an('array')
                for(let i=0;i<res.body.length;i++){
                    expect(res.body[i].Genres).to.include('Action')
                }
            })
    })

})