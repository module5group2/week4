const createError = require('http-errors');
const User = require("../models/user.model");
const mailer = require("../config/mailer.config");
const jwt = require("jsonwebtoken")


module.exports.create = (req, res, next) => {
  const data = { name, email, password, bio, avatar } = req.body

  if (req.file) {
    data.avatar = req.file.path;
  }

  User.create({
    ...data
  })
    .then((user) => {
      mailer.sendValidationMail(user);
      res.status(201).send(user);
    })
    .catch(next)

}

module.exports.validate = (req, res, next) => {
  const data = { active: true };
  console.log('Data>>', data);

  User.findByIdAndUpdate(req.params.id, data, { new: true })

    .then(post => {

      post ? res.status(200).json(post) : res.status(404).json({ message: `User with ID: ${req.params.id} Not Found` })

    }).catch(next)
}

module.exports.login = (req, res, next) => {

  const { email, password } = req.body

  User.findOne({ email, active: true }).then((user) => {

    if (user) {
      user.checkPassword(password)
        .then((match) => {

          if (match) {
            // req.session.userId = user.id;  Metodo cookie
            const token = jwt.sign({
              sub: user.id,
              exp: Math.floor(Date.now() / 1000) + 60 * 60,

            }, process.env.JWT_SECRET);

            res.json({
              user: user,
              accessToken: token

            })

          } else {
            next(createError(401, "Incorrect Credentials"));
          }


        }).catch(next)
    } else {
      next(createError(404, "User Not Found"));
    }
  })
}

module.exports.logout = (req, res, next) => {
  delete req.user;
  // req.session.destroy();  Metodo cookie
  next(res.status(204).end());
}

