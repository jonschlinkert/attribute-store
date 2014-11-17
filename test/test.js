/*!
 * attribute-store <https://github.com/assemble/attribute-store>
 *
 * Copyright (c) 2014, Jon Schlinkert, Brian Woodward, contributors.
 * Licensed under the MIT License
 */

var fs = require('fs');
var should = require('should');
var attrStore = require('..');

var noBody = fs.readFileSync('test/fixtures/noBody.md', 'utf8');

describe('attribute-store:', function() {
  describe('when HTML with a body tag is passed', function() {
    it('should create a store for the given string of HTML', function() {
      var store = attrStore('<div>This is content.</div>');
      store.set('metadata', {basename: 'a', ext: '.html'});
      store.get('metadata').should.have.property('basename');
    });

    it('should append a script tag with the given id to the body', function() {
      var store = attrStore(fs.readFileSync('test/fixtures/body.html', 'utf8'));
      store.set('metadata', {basename: 'a', ext: '.html'});
      store.get('metadata').should.have.property('basename');
    });

    it('should add data from front-matter to the script tag:', function() {
      var store = attrStore('---\ntitle: abc\n---\n<div>xyz</div>');
      store.set();
      store.get().should.have.property('title');
    });

    it('should extend the store with data from front-matter', function() {
      var store = attrStore('---\ntitle: abc\n---\n<div>xyz</div>');
      store.set({a: 'b'});
      store.get().should.have.property('a', 'b');
      store.get().should.have.property('title', 'abc');
    });

    it('should set multiple properties', function() {
      var store = attrStore('---\ntitle: abc\n---\n<div>xyz</div>');
      store.set({a: 'b'});
      store.set({c: 'd'});
      store.set({e: 'f'});
      store.get().should.have.properties('a', 'c', 'e', 'title');
    });

    it('should append a script tag to the HTML', function() {
      var store = attrStore(fs.readFileSync('test/fixtures/custom.html', 'utf8'));
      store.set('a', {name: "Jon Schlinkert"});
      store.get('a').should.have.property('name');
      store.get('a').should.eql({name: "Jon Schlinkert"});
    });
  });

  describe('when no front metadata exists:', function() {
    it('should append a script tag to the HTML', function() {
      var store = attrStore(fs.readFileSync('test/fixtures/noMatter.md', 'utf8'));
      store.set({basename: 'a', ext: '.html'});
      store.get('metadata').should.have.property('basename');
    });

    it('should append a script tag with the given id', function() {
      var store = attrStore(noBody);
      store.set('some', {a: 'a', b: 'b'});
      store.get('some').should.have.property('b');
    });

    it('should append a script tag to the HTML', function() {
      var store = attrStore(noBody);
      store.set({a: 'a', b: 'b'});
      store.get().should.have.property('b');
    });

    it('should update a property:', function() {
      var obj = {a: 'aaa', b: 'b'};
      var store = attrStore(noBody);
      store.set('abc', obj);
      obj.a = 'bbb';
      store.set('abc', obj);
      store.get('abc').should.have.property('a', 'bbb');
    });
  });
});
