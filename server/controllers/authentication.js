const jwt = require('jwt-simple');
const User = require('../models/user');
const config = require('../config');

function tokenForUser(user) {
	const timestamp = new Date().getTime();
	return jwt.encode({ userId: user.id, issuedAt: timestamp }, config.secret);
}

exports.signin = function(req, res, next) {
	res.send({ token: tokenForUser(req.user) });
};

exports.signup = function (req, res, next) {
	const email = req.body.email;
	const password = req.body.password;

	if (!email || !password) {
		return res.status(422).send({ error: 'You must provide email or password' })
	}

	//yazılan emaille başka kullanıcı kayıtlı mı bak
	User.findOne({email: email}, function (err, existingUser) {
		if (err) { return next(err); }
		//başka kullanıcı kayıtlıysa hata return et
		if (existingUser) {
			return res.status(422).send({ error: 'Email is in use.' })
		}
		//email db de kayıtlı değilse user kaydını oluştur ve kaydet
		const user = new User({
			email: email,
			password: password
		});

		user.save(function (err) {
			if (err) { return next(err); }
			res.json({ token: tokenForUser(user) });
		});
	});
};