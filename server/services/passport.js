const passport = require('passport');
const User = require('../models/user');
const config = require('../config');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const LocalStrategy = require('passport-local');

//Yerel strateji oluştur
const localOptions = { usernameField: 'email' };
const localLogin = new LocalStrategy(localOptions, function (email, password, done) {
	//Email ve şifreyi doğrula done'ı user ile çağır
	User.findOne({ email: email }, function (err, user) {
		if (err) { return done(err); }
		if(!user) { return done(null, false); }
		user.comparePassword(password, function (err, isMatch) {
			if (err) { return done(err); }
			if (!isMatch) { return done(null, false); }

			return done(null, isMatch);
		});
	});
});

//JWT Strategy içi ayarları kur
const jwtOptions = {
	jwtFromRequest: ExtractJwt.fromHeader('authorization'),
	secretOrKey: config.secret
};

//JWT stratejisi oluştur
const jwtLogin = new JwtStrategy(jwtOptions, function (payload, done) {
	//payloaddan gelen user id database'de var mı diye bak
	User.findById(payload.userId, function (err, user) {
		if (err) { return done(err, false); }
		//Eğer varsa done'ı çağır
		if (user) {
			done(null, user);
		} 	//yoksa user objesi olmadan done ı çağır
		else {
			done(null, false);
		}
	});



});

//pasaporta hangi stratejiyi uygulayacağını söyle
passport.use(jwtLogin);
passport.use(localLogin);