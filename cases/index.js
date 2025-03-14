const express = require('express');
const { getCases, updateCase } = require('./lib/case');
const app = express();
const port = process.env.port || 8080;
// secure the direct call to the application

const passport = require('passport');
const { JWTStrategy } = require('@sap/xssec');
const xsenv = require('@sap/xsenv');




// XSUAA Middleware
passport.use(new JWTStrategy(xsenv.getServices({uaa:{tag:'xsuaa'}}).uaa));

app.use(passport.initialize());
app.use(passport.authenticate('JWT', { session: false }));

app.get('/cases', checkReadScope, getCases);
app.post('/cases/:id', checkWriteScope, updateCase)

// Scope check
 function checkReadScope(req, res, next) {
	if (req.authInfo.checkLocalScope('read')) {
		return next();
	} else {
    	console.log('Missing the expected scope');
    	res.status(403).end('Forbidden');
	}
}
 function checkWriteScope(req, res, next) {
	if (req.authInfo.checkLocalScope('write')) {
		return next();
	} else {
    	console.log('Missing the expected scope');
    	res.status(403).end('Forbidden');
	}
}

app.use('/', express.static('static/'));

app.listen(port, () => {
	console.log('%s listening at %s', app.name, port);
})
