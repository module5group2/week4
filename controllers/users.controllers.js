const createError = require('http-errors');
const User = require("../models/user.model");
const mailer = require("../config/mailer.config");


module.exports.create = (req, res, next) => {
    const data = { name, email, password, bio, avatar } = req.body

    if(req.file){
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
  const data = { active : true };
  console.log('data>>',data);

  User.findByIdAndUpdate(req.params.id, data, { new: true })
    .then(post => {
      if(post){
        res.status(200).json(post)
      }else{
        res.status(404).json({message: `User with id ${req.params.id} not found`})
      }
      
    })
    .catch(next)
}

module.exports.login = (req, res, next) => {
  const data = {  email, password } = req.body

  User.findOne({email, active: true}).then((user)=>{
    if(user){
      user.checkPassword(password)
      .then((match) =>{
        if(match){
          req.session.userId = user.id;
          res.json(user);
        }else{
          next(createError(401,"Incorrect credentials"));
        }
      }).catch(next)
    }else{
      next(createError(404,"User not found"));
    }
  })
}

module.exports.logout = (req, res, next) => {
  delete req.user;
  req.session.destroy();
  next(res.status(204).end());
}

